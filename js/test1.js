const getTodayFileName = ()=>{
    let curTime = new Date()
    let year = curTime.getFullYear()
    let month = curTime.getMonth()
    month +=1
    month = month >= 10 ? ''+month:'0'+month
    let day = curTime.getDate()
    day = day >= 10 ? ''+day : '0'+day
    return `${year}${month}${day}.dat`
}

const getCurIndex = ()=>{
    let index = 0
    const curTime = new Date()
    const hour = curTime.getHours()
    const minute = curTime.getMinutes()
    index = hour*2 + Math.floor(minute/30) 
    // console.log(hour,minute,index)
    return {
        "curIndex":index,
        "curMinute":minute > 30 ? minute - 30 : minute
    }
}

// let {curIndex,curMinute} = getCurIndex()
// console.log(curIndex,curMinute)