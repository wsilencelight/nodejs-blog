// npm run dev
const http = require('http')

const PORT = 8000

const serverHandle = require('../app')

const server = http.createServer(serverHandle)
//不设置监听程序会直接结束
server.listen(PORT)