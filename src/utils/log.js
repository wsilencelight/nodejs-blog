const fs = require('fs')
const path = require('path')

//写日志
function writeLog(writeStream, log) {
    writeStream.write(log + '\n')
}

// 生成write Stream
function creatWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '../', '../', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a'
    })
    return writeStream
}

//写访问日志
const accessWriteStream = creatWriteStream('access.log')
function access(log) {
    writeLog(accessWriteStream, log)
}

//写错误日志
const errorWriteStream = creatWriteStream('error.log')
function error(log) {
    writeLog(errorWriteStream, log)
}

//写自定义事件日志
const eventWriteStream = creatWriteStream('event.log')
function event(log) {
    writeLog(eventWriteStream, log)
}
module.exports = {
    access,
    error,
    event
}