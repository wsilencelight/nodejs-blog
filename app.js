const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { set, get } = require('./src/db/redis')
const querystring = require('querystring')
const { access, error, event } = require('./src/utils/log')
//SESSION数据
// const SESSION_DATA = {}

//处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if(req.method !== 'POST') {
            resolve({})
            return
        }
        if(req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data',chunk =>{
            postData += chunk.toString()
        })

        req.on('end', () => {
            if(!postData) {
                resolve({})
                return
            }
            resolve(
                //将数据转成js对象
                JSON.parse(postData)
            )
        })

    })
    return promise
}
//设置cookie有效时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (60 * 60 * 1000))
    //console.log("d.toGMTString() is :",d.toGMTString())
    return d.toGMTString()

}

const serverHandle = (req, res) =>{
    //记录access.log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)
    //设置返回格式
    res.setHeader('Content-type', 'application/json')  
    //解析query,放在处理blog后会出错,因为handleBlogRouter用到了req.query
    req.query = querystring.parse(req.url.split('?')[1])
    
    //解析 cookie
    req.cookie= {}
    const cookieStr = req.headers.cookie || '' //k1=v1型
    cookieStr.split(';').forEach(item => {
        if(!item) {
            return
        }
        const arr = item.split('=')
        //trim去掉首尾字符串
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    });
    //console.log('cookie is :', req.cookie)

    //解析session
    // let needSetCookie = false
    // let userId = req.cookie.userId
    // if(userId) {
    //     if(!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    //redis下解析session
    let needSetCookie = false
    let userId = req.cookie.userId
    //if语句处理userId不存在的情况，相当于新登录或者已经过了expires
    if(!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        //初始化redis中的session
        set(userId, {})
    }

    //redis下获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if(sessionData == null) {
            //初始化redis中的session
            set(userId, {})
            //设置session
            req.session = {}
        } else {
            req.session = sessionData
        }
        console.log('req.session:',req.session)
        return getPostData(req)
    })
    .then(postData =>{    //处理postData放在req.body里
        req.body = postData
        //处理blog路由
        //blogResult是一个promise对象
        const blogResult = handleBlogRouter(req, res)
        //让blogData获取resolve值
        if (blogResult) {
             blogResult.then(blogData => {    
                if(needSetCookie) {
                    res.setHeader('Set-cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
       
        //加promise处理User路由
        const userResult = handleUserRouter(req, res)
        //加判断是为了检查是否命中，以便检测出404
        if(userResult) {
            userResult.then(userData => {
                if(needSetCookie) {
                    res.setHeader('Set-cookie', `userId=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                //console.log(userData)
                res.end(
                    JSON.stringify(userData)
                )
             
            })
            return
        }
        
        //未命中路由返回404
        res.writeHead(404, {'Content-type': 'text/plain'})
        res.write('404 Not Found\n')
        res.end()
    })


}
module.exports = serverHandle
    // const resData = {
    //     name: 'why',
    //     site: 'imooc',
    //     env: process.env.NODE_ENV
    // }

    // res.end(
    //     JSON.stringify(resData)
    // )

      // 未加入promise写法
        // const blogData = handleBlogRouter(req, res)
        // if(blogData) {
        //     res.end(
        //         JSON.stringify(blogData)
        //     )
        //     return
        // }
        
        //处理user路由未加promise
        // const userData = handleUserRouter(req, res)
        // if (userData) {
        //     res.end(
        //         //errno的值
        //         JSON.stringify(userData)
        //     )
        //     return
        // }

