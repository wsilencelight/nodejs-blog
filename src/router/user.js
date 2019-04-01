const { login } = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const { set, get } = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method  //GET/POST
    const url = req.url
    const path = url.split('?')[0]
     
    //登录
    if (method === 'POST' && path === '/api/user/login') {
        //结构
        //POST是从body获取，GET是从query获取 
        const {username, password} = req.body
        //const { username, password} = req.query 
        const result = login(username, password)
        return result.then(data => {
            if(data.username) {
                //登陆后设置session
                req.session.username = data.username
                req.session.realname = data.realname
                //同步设置到redis中
                set(req.sessionId, req.session)
                //console.log("req.session:",req.session)
                return new SuccessModel(
                    { session: req.session}
                )
            }
            return new ErrorModel('登陆失败')
        })
    }
    // //登录验证测试
    // if(method === 'GET' && path === '/api/user/login-test') {
    //     if(req.session.username) {
    //         return  Promise.resolve(
    //             new SuccessModel(
    //                 {username:req.session}
    //             )
    //         )
    //     }
    //     return Promise.resolve(
    //         new ErrorModel('尚未登录')
    //     )
    // }
}
module.exports = handleUserRouter