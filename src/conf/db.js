//获取环境参数，在package.json文件中
const env = process.env.NODE_ENV

// console.log(env)
//配置
let MYSQL_CONF
let REDIS_CONF

//不同环境不同配置,开发环境
if(env === 'dev') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '',
        port: '3306',
        database: 'myblog'
    }
    //redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'

    }
}
//暂时线上配置与线下相同,上线时需要修改
if(env === 'production') {
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '',
        port: '3306',
        database: 'myblog'
    }

     //redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'

    }

}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}