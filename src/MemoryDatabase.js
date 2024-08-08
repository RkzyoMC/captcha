class MemoryDatabase {
    constructor() {
        this.store = new Map();
    }

    /**
     * 存储数据，支持指定 TTL
     * @param key
     * @param value
     * @param ttl （毫秒）
     */
    set(key, value, ttl) {
        if (typeof key !== 'string') {
            throw new Error('Invalid key');
        }
        const data = new Data(value, ttl);
        this.store.set(key, data);
    }

    /**
     * 获取数据
     * @param key
     * @returns 没有数据 返回undefined
     */
    get(key) {
        const entry = this.store.get(key)
        let ttl = entry.ttl
        let time = entry.time
        let now = new Date().getTime()
        if (now - ttl < time) return entry.data
        this.store.delete(key)
        return undefined;
    }

    /**
     * 获取数据
     * @param key
     * @param t
     * @returns {undefined|string}
     */
    getInTime(key, t) {
        const entry = this.store.get(key)
        let ttl = entry.ttl
        let time = entry.time
        let now = new Date().getTime()
        if (now - ttl < time) {
            if (now - ttl < t) return entry.data
        } else this.store.delete(key)
        return undefined;
    }

    /**
     * 删除数据
     * @param key
     */
    delete(key) {
        this.store.delete(key)
    }
}

class Data {
    constructor(data,ttl) {
        this.data = data;
        this.time = new Date().getTime();
        this.ttl = ttl;
    }
}

module.exports = MemoryDatabase;