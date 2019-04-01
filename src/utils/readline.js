const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log')

//创建readstream
const readStream = fs.createReadStream(fileName)

//创建readline对象
const rl = readline.createInterface({
    input: readStream
})

let ChromNum = 0
let sum = 0

//逐行读取
rl.on('line', (lineData) => {
    if(!lineData) {
        return
    }
    //记录总函数
    sum++;
    const arr = lineData.split(' -- ')
    if(arr[2] && arr[2].indexOf('Chrom') > 0) {
        ChromNum++;
    }
})

//结束
rl.on('close', () => {
    console.log('Chrom占比为：' + ChromNum / sum)
})