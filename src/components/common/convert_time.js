
function toDate(dateTimeString){
    let dateTime = new Date(dateTimeString);
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let day = dateTime.getDate();
    month = `0${month}`.slice(-2);
    day = `0${day}`.slice(-2);
    return `${year}-${month}-${day}`
}

function toTime(dateTimeString){
    let dateTime = new Date(dateTimeString);
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();
    let second = dateTime.getSeconds();
    hour = `0${hour}`.slice(-2);
    minute = `0${minute}`.slice(-2);
    second = `0${second}`.slice(-2);
    return `${hour}:${minute}`
}

function toDateTime(dateTimeString){
    let dateTime = new Date(dateTimeString);
    let year = dateTime.getUTCFullYear();
    let month = dateTime.getUTCMonth() + 1;
    let day = dateTime.getUTCDate();
    let hour = dateTime.getUTCHours();
    let minute = dateTime.getUTCMinutes();
    let second = dateTime.getUTCSeconds();
    month = `0${month}`.slice(-2);
    day = `0${day}`.slice(-2);
    hour = `0${hour}`.slice(-2);
    minute = `0${minute}`.slice(-2);
    second = `0${second}`.slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

export {
    toDate,
    toTime,
    toDateTime
}