//返回的是promise
const { exec } = require('../db/mysql')
//引用xss模块
const xss = require('xss')
//获取博客列表
const getList = (author, keyword) => {
   let sql = `select * from blogs where 1=1 `
   if(author) {
       sql += `and author='${author}' `
   }
   if(keyword) {
       sql += `and title like '%${keyword}%' `
   }
   sql += `order by createtime desc;`
   //console.log(sql)
   //返回promise
   return exec(sql)
}
//获取博客详情
const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}';`
    //执行sql语句的时候查询到的是一个数组，而我想要的是一个对象
    return exec(sql).then(row =>{
        //显然then中的row就是那个查询到的数组，尽管是一个只有一个对象的数组
        return row[0]
    })
}

//新建博客，blogData = {}是为了兼容，没有值是默认给一个空对象
const newBlog = (blogData = {}) => {
    //blogData是一个博客对象，包含 title content 属性
    //console.log('newBlog: ',blogData)

    //预防xss攻击
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    const author = blogData.author
    const createtime= Date.now()
    const sql = `insert into blogs(title,content,author,createtime) 
                 values('${title}','${content}','${author}',${createtime});`
    
    return exec(sql).then(insertData =>{
        //查看insertData组成，就是mysql返回的一堆数据
        //console.log('insertdata is :',insertData)
        return {
            id: insertData.insertId
        }
    })
}

//更新博客
const updateBlog = (id, blogData = {}) => {
    //blogData是一个博客对象，包含 title content 属性
    //id就是要更新博客的id
    //console.log('update blog: ', id, blogData)
    const title = xss(blogData.title)
    const content = xss(blogData.content)
    //const createtime = Date.now()
    const sql = `update blogs set title='${title}',content='${content}' where id=${id};`
    return exec(sql).then(updateData => {
        //console.log(updateData)
        if(updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

//删除博客
const delBlog = (id, author) => {
    //id就是要删除博客的id
    const sql = `delete from blogs where id=${id} and author='${author}';`
    return exec(sql).then(delData => {
        if(delData) {
            return  true
        }
        return false
    })

}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}