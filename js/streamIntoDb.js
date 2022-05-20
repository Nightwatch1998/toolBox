const fs = require('fs')
const {Sequelize , DataTypes, QueryTypes} = require('sequelize')

//使用原生的数据库连接方式 服务器是ais_fengnan
const sequelize = new Sequelize('water_power','root','123456',{
    host:'localhost',
    port:'3306',
    dialect:'mysql',
    pool:{
        max:100,
        min:0,
        idle:10000,
        acquire:60000
    }
})

// 插入一条数据,函数内构造sql
const insertOneQuery = async (options)=>{
    let keys = Object.keys(options)
    let values = Object.values(options)
    // 拼接字符串
    let keyStr = ''
    let valueStr = ''
    keys.forEach(key => {
        keyStr += `${key}`+','
    });
    values.forEach(value => {
        valueStr += `${value}`+','
    })
    keyStr = keyStr.substring(0,keyStr.length-1)
    valueStr = valueStr.substring(0,valueStr.length-1)
    await sequelize.query(
        `insert into 2022_05_17 (${keyStr}) values (${valueStr})`,
        {
            type:QueryTypes.INSERT
        }
    )
}

// 插入一条SQL
const insertOneSql = async (sql)=>{
    await sequelize.query(
        sql,
        {
            type:QueryTypes.INSERT
        }
    )
}

const updateOneQuery = async (key,value,whereOpt)=>{
    await sequelize.query(
        `update 2022_05_17 set ${key}=${value} where PointID=${whereOpt['PointID']} and TimeStamp=${ whereOpt['TimeStamp']}`,
        {
            type:QueryTypes.UPDATE
        }
    )
}
// 可读流配置
let rOption = {
    flags:'r',
    encoging:'null',
    mode: 0666,
    highWaterMark : 4,// 每次读取多少个字节
    // start: 0,
    // end: 99
}
// 可写流配置
let wOption = {
    flags:'a',
    encoging:'null',
    mode: 0666,
}

let fileReadStream =  fs.createReadStream('F:/water_power/20220516.dat',rOption)
// let fileWriteStream = fs.createWriteStream('./fixed3.txt',wOption)


let pos = 0

// 格网点数
let pointsize = 126754

// 一个历元数据量 30min
let points30m = pointsize*3+1

// 当前点位
let curPoint = 1
// 当前时间
let curTime = 0


let insertOpt = {
    'PointID':0,
    'TimeStamp':0,
    'TideLevel':''
}

let whereOpt = {
    'PointID':0,
    'TimeStamp':0
}

// PointID,TideLevel,Velo,Dire,TimeStamp
// PointID为1-126754 旧的插入方式行不通  update太慢了
const oldInsert = ()=>{
    fileReadStream.on('data',(buffer)=>{
        pos %= points30m
        let cur  = buffer.readFloatLE();
        if(pos === 0){
            // 当前时刻
            curTime = buffer.readInt32LE()
            insertOpt['TimeStamp'] = curTime
        }else if(pos>0 && pos <= pointsize){
            insertOpt['PointID'] = pos
            insertOpt['TideLevel'] = cur.toFixed(3)
            insertOneQuery(insertOpt)
        }else if(pos>pointsize && pos<=pointsize*2){
            whereOpt['PointID'] = pos-pointsize
            whereOpt['TimeStamp'] = curTime
            updateOneQuery('Velo',cur.toFixed(3),whereOpt)
        }else if(pos>pointsize*2 && pos<=pointsize*3){
            whereOpt['PointID'] = pos-pointsize*2
            whereOpt['TimeStamp'] = curTime
            updateOneQuery('Dire',cur.toFixed(3),whereOpt)
        }
        pos ++
        
        // console.log(buffer)
        // console.log(pos)
        // fileWriteStream.write(cur.toFixed(3))
        // fileWriteStream.write(',')
    })
}

// 一次插入一个历元的数据
const insertAll = (tideLevel,velo,dire,curTime)=>{
    let sql = ''
    for(let i=0;i<tideLevel.length;i++){
        sql = `insert into 2022_05_17 (PointID,TideLevel,Velo,Dire,TimeStamp) 
            values (${i+1},${tideLevel[i]},${velo[i]},${dire[i]},${curTime})`
        insertOneSql(sql)
    }
}

let tideLevel = []
let velo = []
let dire = []

fileReadStream.on('data',(buffer)=>{
    pos %= points30m
    let cur  = buffer.readFloatLE();
    if(pos === 0){
        // 一个时刻数据接收完毕,插入数据，并重置数组
        insertAll(tideLevel,velo,dire,curTime) 
        console.log(tideLevel.length,velo.length,dire.length)
        tideLevel = []
        velo = []
        dire = []
        // 当前时刻
        curTime = buffer.readInt32LE()
    }else if(pos>0 && pos <= pointsize){
        tideLevel.push(cur.toFixed(3))
    }else if(pos>pointsize && pos<=pointsize*2){
        velo.push(cur.toFixed(3))
    }else if(pos>pointsize*2 && pos<=pointsize*3){
        dire.push(cur.toFixed(3))
    }
    pos ++
})
// fileReadStream.on('end',()=>{
//     console.log('数据读取完毕')
//     // fileWriteStream.end()
//     // console.log(bufferLength)
// })