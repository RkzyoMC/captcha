const express = require('express');
const svgCaptcha = require('svg-captcha');
const crypto = require('crypto');
const mdb = new (require("./MemoryDatabase"));
const Verification = require("./Verification");

const app = express();
const maxTTL = 60000; // 默认的验证码过期时间为60秒
const port = 23000; // 运行端口

// 允许跨域访问设置
app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Accept, Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    res.header("Content-Type", "application/json;charset=utf-8");

    if (req.method.toLowerCase() === 'options') {
        res.sendStatus(200); // 让options请求快速结束
    } else {
        next();
    }
});

// 生成验证码
function generateCaptcha() {
    return svgCaptcha.create({
        size: 6, // 验证码长度
        ignoreChars: '0o1i', // 排除易混淆字符
        color: true, // 彩色验证码
        noise: 1, // 干扰线
        background: '#666' // 背景颜色
    });
}

// 获取客户端 IP 地址
function getClientIP(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress;
}

// 获取验证码并存储
app.get('/obtain', (req, res) => {
    const img = generateCaptcha();
    const ip = getClientIP(req);
    const uuid = crypto.randomUUID();
    const verification = new Verification(uuid, img.data, img.text, ip);

    console.log(verification.toLog()); // 记录日志
    res.send(verification.toObtain()); // 返回给客户端

    mdb.set(uuid, verification.toJsonString(), maxTTL); // 存储验证码
});

// 验证验证码
app.get('/check', (req, res) => {
    const uuid = req.query.uuid;
    let text = req.query.text;
    const capitalization = req.query.capitalization; // 是否区分大小写，默认不区分
    const ttl = req.query.ttl || maxTTL; // 验证码过期时间，默认使用最大 TTL

    if (!uuid || !text) {
        return res.status(400).send('uuid and text are required');
    }

    const ip = getClientIP(req);
    let storeData = mdb.getInTime(uuid, ttl);

    if (!storeData) {
        return res.send('{"code": 1}'); // 验证码不存在或已过期
    }

    const json = JSON.parse(storeData.toString());

    if (!capitalization) {
        json.text = json.text.toLowerCase();
        text = text.toLowerCase();
    }

    if (json.uuid === uuid && json.text === text && json.ip === ip) {
        res.send('{"code": 0}');
    } else {
        res.send('{"code": 2}'); // 验证码错误
    }

    mdb.delete(uuid); // 验证完毕后删除验证码
});

// 启动服务器
app.use(express.static('public'));
const server = app.listen(port, () => {
    console.log(`Server is running at ${server.address().port}`);
    console.log(`Max TTL for captcha: ${maxTTL} ms`);
});

console.log('End of script');
