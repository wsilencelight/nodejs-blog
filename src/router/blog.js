const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

//统一的登陆验证函数
const loginCheck = (req) => {
    if(!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登陆')
        )
    }
}


const handleBlogRouter = (req, res) => {
    const method = req.method //GET/POST
    const url = req.url
    const path = url.split('?')[0]
    //id统一声明
    const id = req.query.id
    
    //获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        // //SuccessModel是个类所以要new一个新的对象 
        // return new SuccessModel(listData)
        if(req.query.isadmin) {
            //管理员界面
            const loginCheckResult = loginCheck(req)
            if(loginCheckResult) {
                //未登录
                return loginCheckResult
            }
            //强制查询自己博客
            author = req.session.username
        }
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })
    }

    //获取博客详情
    if (method === 'GET' && path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(detail =>{
            return new SuccessModel(detail)
        })
    }

    //新建博客
    if (method === 'POST' && path === '/api/blog/new') {
        const loginResult = loginCheck(req)
        if (loginResult) {
            return loginResult
        }
        //登陆成功则肯定有用户名
        req.body.author = req.session.username

        const result = newBlog(req.body)
        return result.then(data => {
             return new SuccessModel(data)
        })
       
    }

    //更新博客
    if (method === 'POST' && path === '/api/blog/update') {
        const loginResult = loginCheck(req)
        if (loginResult) {
            return loginResult
        }
        const result = updateBlog(id, req.body)
        return result.then(val =>{
            if(val) {
                return new SuccessModel()
            }
            else {
                return new ErrorModel('更新博客失败')
            }
        })
       
    }

    //删除博客
    if (method === 'POST' && path === '/api/blog/del') {
        const loginResult = loginCheck(req)
        if (loginResult) {
            return loginResult
        }
        //登陆成功则肯定有用户名
        req.body.author = req.session.username

        const result = delBlog(id,req.body.author)
        return result.then(val => {
            if(val) {
                return new SuccessModel()
            }
            else {
                return new ErrorModel('删除博客失败')
            }
        })
       
    }
}

module.exports = handleBlogRouter