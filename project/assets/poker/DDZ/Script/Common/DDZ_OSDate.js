

var OSDate = cc.Class({

});


OSDate.LocalTimeString = function () {
//	根据本地时间格式，把 Date 对象转换为字符串。
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var second = date.getSeconds();
    var min = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if(hour >= 0 && hour <= 9){
        hour = "0" + hour;
    }
    if(min >= 0 && min <= 9){
        min = "0" + min;
    }
    if(second >= 0 && second <= 9){
        second = "0" + second;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate 
        + " " + hour + seperator2 + min
        + seperator2 + second;
    return currentdate;
};
cc.YL.DDZ_Osdate = OSDate;
module.exports = OSDate;
