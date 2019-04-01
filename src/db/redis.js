const redis = require('redis')
const { REDIS_CONF } = require('../conf/db')

//创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisClient.on('error', err => {
    console.error(err)
})

//set redis
const set = (key, val) => {
    if(typeof val === 'object') {
        //最好是要把object转换成字符串的形式
        val = JSON.stringify(val)
    }
    redisClient.set(key, val, redis.print)


}

//get redis
const get = (key) => {
    const promise = new Promise((resolve, reject) => {
        redisClient.get(key, (err, val) => {
            if (err) {
                console.log(err)
                return
            }
            if (val == null) {
                resolve(null)
                return
            }
            try {
                resolve(
                    //set的时候stringify.转成了字符串，get的时候想办法逆向推回js对象
                    JSON.parse(val)
                )
            } catch (ex){
                resolve(val)
            }
        })
    })

    return promise
}

module.exports = {
    set,
    get
}