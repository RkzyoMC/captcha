class Verification {
    constructor(uuid, data, text, ip) {
        this.uuid = uuid;
        this.data = data;
        this.text = text;
        this.ip = ip;
    }

    toJson() {
        const jsonString = '{"uuid": "", "data": "", "text": "", "ip": ""}';
        const jsObj = JSON.parse(jsonString);
        jsObj.uuid = this.uuid;
        jsObj.data = this.data;
        jsObj.text = this.text;
        jsObj.ip = this.ip;
        return jsObj;
    }

    toJsonString() {
        return JSON.stringify(this.toJson());
    }

    toObtain() {
        const jsonString = '{"uuid": "", "data": ""}';
        const jsObj = JSON.parse(jsonString);
        jsObj.uuid = this.uuid;
        jsObj.data = this.data;
        return jsObj;
    }

    toLog() {
        const jsonString = '{"uuid": "", "text": "", "ip": ""}';
        const jsObj = JSON.parse(jsonString);
        jsObj.uuid = this.uuid;
        jsObj.text = this.text;
        jsObj.ip = this.ip;
        return jsObj;
    }
}

module.exports = Verification;