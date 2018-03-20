/***
 *
 *
 * 日志打印 仅用于test
 *
 * 优先级为important > err > warn >info > log2 > log
 *
 * 使用时直接在代码中使用   cc.YH.log("str");
 *
 *
 */
var TestLog = cc.Class({

});


TestLog.getDateString = function () {
    var d = new Date();
    var str =  d.getHours()+"";
    var timeStr = "";
    timeStr += (str.length==1 ? ("0"+str) : str) + ":";

    str = d.getMinutes()+"";
    timeStr += (str.length==1 ? ("0"+str) : str) + ":";

    str = d.getSeconds()+"";
    timeStr += (str.length==1 ? ("0"+str) : str) + ".";

    str = d.getMilliseconds()+"";
    if( str.length==1 ) str = "00"+str;
    if( str.length==2 ) str = "0"+str;
    timeStr += str;
    var spter = "-";
    timeStr = "[" +d.getFullYear() +spter+ (d.getMonth() + 1) +spter+ d.getDate()+"  " + timeStr + "]";

    return timeStr;
};


TestLog.log = function(){
    if(!cc.YL._isTestServer){
       return;
    }
    var backLog = cc.log || console.log ||  log;
        backLog.call(this,"%s"+cc.js.formatStr.apply(cc,arguments),TestLog.getDateString(),this.stack(2));
};



TestLog.info = function () {
    if(!cc.YL._isTestServer){
        return;
    }
    var backLog = cc.log || console.log ||  log;
        backLog.call(this,"%c%s:"+cc.js.formatStr.apply(cc,arguments),"color:#00CD00;",TestLog.getDateString(),this.stack(2));
};

TestLog.log2 = function () {
    if(!cc.YL._isTestServer){
        return;
    }
    var backLog = cc.log || console.log ||  log;
        backLog.call(this,"%c%s:"+cc.js.formatStr.apply(cc,arguments),"color:#A600F5;",TestLog.getDateString(),this.stack(2));
};


TestLog.warn = function(){
    if(!cc.YL._isTestServer){
        return;
    }
    var backLog = cc.log || console.log ||  log;
        backLog.call(this,"%c%s:"+cc.js.formatStr.apply(cc,arguments),"color:#ee7700;",TestLog.getDateString(),this.stack(2));
};

TestLog.err = function(){
    if(!cc.YL._isTestServer){
        return;
    }
    var backLog = cc.log || console.log ||  log;
        backLog.call(this,"%c%s:"+cc.js.formatStr.apply(cc,arguments),"color:red",TestLog.getDateString(),this.stack(2));
};
//#5100FD
TestLog.network = function () {
    if(!cc.YL._isTestServer){
        return;
    }
    var backLog = cc.log || console.log ||  log;
        backLog.call(this, "%c%s:" + cc.js.formatStr.apply(cc, arguments), "color:#5100FD", TestLog.getDateString(),this.stack(2));
};
TestLog.stack = function (index) {
    var e = new Error();
    var lines = e.stack.split("\n");
    lines.shift();
    var result = [];
    for(var i = 0; i < lines.length;i++){
        lines[i] = lines[i].substring(7);
        var lineBreak = lines[i].split(" ");
        if (lineBreak.length<2) {
            result.push(lineBreak[0]);
        } else {
            result.push({[lineBreak[0]] : lineBreak[1]});
        }
    }
    var list = [];
    if(index <= result.length-1){
        for(var a in result[index]){
            list.push(a);
        }
    }
    if( list.length > 0 ) {
        var splitList = list[0].split(".");
        if( splitList.length >= 2) {
            return ("["+splitList[0] + ".js    " +"    function:"+splitList[1] + "]");
        }
    }
    return "";
};



cc.YL = TestLog;
module.exports = TestLog;
