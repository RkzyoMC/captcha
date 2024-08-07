# captcha
由nodejs编写的基础图片人机验证码

[demo](https://x.yghpy.com/demo/captcha/)

> `无需注册账户对接`我们搭建完成的[captcha](https://wiki.yghpy.com/zh/RkzyoAPI/web/captcha)

# 公用人机验证码
- 默认运行在 23000 端口
- 首先从 `x-forwarded-for` 获取客户端ip

---

## 获取验证码
`get` 请求 `/obtain`

返回例子:

```json
{
  "uuid", "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // 验证时需要的uuid
  "data", "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"150\" height=\"50\" viewBox=\"xxx\"/></svg>", // 标准svg代码
}
```

---

## 判断验证码
`get` 请求 `/check`

参数

| 参数             |           描述           |    例子     |  必须   |
|:---------------|:----------------------:|:---------:|:-----:|
| uuid           |         判断验证码          | x-x-x-x-x | true  |
| text           |       从svg识别的验证码       |   12345   | true  |
| ttl            | 这个验证码从生成到判断不能超过的时间(ms) |   10000   | false |
| capitalization |        是否判断大小写         |   true    | false |


返回:

```json
{
	"code": 0 // 验证成功
	"code": 1 // 验证码不存在
	"code": 2 // 验证码错误
}
```

---

> 当一个验证码被判断之后无论是否之前都会立马删除，无法二次判断  
> 验证码最大ttl为60s
{.is-success}

