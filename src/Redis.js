class Redis {
    constructor() {
        this.store = new Map();
    }

    // 存储数据，支持指定 TTL（毫秒）
    storeData(key, value, ttl) {
        if (typeof key !== 'string' || ttl <= 0) {
            throw new Error('Invalid key or TTL');
        }

        const data = new Data(value);
        const timeoutId = setTimeout(() => {
            this.store.delete(key); // 删除过期数据
        }, ttl);

        this.store.set(key, { data, timeoutId, ttl });
    }

    deleteData(key) {
        if (typeof key !== 'string') {
            throw new Error('Invalid key');
        }
        this.store.delete(key)
    }

    // 获取数据
    getData(key) {
        const entry = this.store.get(key);
        if (!entry) {
            //console.warn(`No data found for key: ${key}`);
            return undefined;
        }
        return entry.data.E;
    }

    // 获取数据，在指定时间内
    getDataInTime(key, maxAge) {
        const entry = this.store.get(key);
        if (!entry) {
            //console.warn(`No data found for key: ${key}`);
            return undefined;
        }

        const { data } = entry;
        const age = Date.now() - data.time;

        if (age <= maxAge) {
            return data.E;
        } else {
            //console.warn(`Data for key: ${key} has expired`);
            return undefined;
        }
    }
}

class Data {
    constructor(E) {
        if (E === undefined) {
            throw new Error('Value cannot be undefined');
        }
        this.E = E;
        this.time = Date.now();
    }
}

module.exports = Redis;
