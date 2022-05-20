const ftp = require('ftp');//连接FTP
const client = new ftp();
client.on('ready',()=>{
    console.log('ftp client is ready');
});
client.connect({
    host : '8.131.236.41',
    port : 21,
    user : 'fengnan',
    password : 'forecast',
    keepalive : 1000
});
//列出目标目录
function list(dirpath){
    return new Promise((resolve,reject)=>{
        client.list((err,files)=>{
            resolve({err : err,files : files});
        })
    });
}
async function test (){
    //list 列表功能
    let {err,files} = await list();
    if(err){
        console.log(err);
        return
    }
    console.log(`获得文件列表:`+files.length);
    console.log(files);
}
test();
