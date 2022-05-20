const fs = require("fs")

// 流式读取
let fileReadStream =  fs.createReadStream(filePath,{
    flags:'r',
    encoging:'null',
    mode: 0666,
    // highWaterMark : 4,// 每次读取多少个字节
    start: startIndex,
    end: startIndex+step-1
})
// 异步读取无法返回
fileReadStream.on('data',(buffer)=>{
    console.log('读取数据')
    // console.log("buffer",buffer)
    cur = buffer.readFloatLE()
    deci = cur.toFixed(3)
    console.log("deci",deci)
    return deci
})
fileReadStream.on('end',()=>{
    console.log('数据读取完毕！')
})