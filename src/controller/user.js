const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const login = (username, password) => {
    //用escape来防止sql注入
    username = escape(username)


    //生成加密密码
    password = genPassword(password)    
    //若是escape放在前面的话，sql语句中的单引号不能去掉
    password = escape(password)
    const sql = `select username, realname from users where username=${username} and password=${password};`
    return exec(sql).then(rows => {
        //console.log(rows)
        //rows[0]是一个对象，rows是个对象数组
        return rows[0] || {}
    })
}

module.exports = {
    login
}