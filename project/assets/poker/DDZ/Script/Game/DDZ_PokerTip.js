/**********
 * 客户端本地的提示处理
 * **********/
/*************
 *  牌类型枚举
 *  分为
 *  王炸 炸弹 单张 对子 三张 三带一 三带二 顺子 连对 飞机 四带二
 *  王炸最大，可以打任意其他的牌。 　　
 *  炸弹比王炸小，比其他牌大。
 *  都是炸弹时按牌的分值比大小。 　　
 *  除王炸和炸弹外，其他牌必须要牌型相同且总张数相同才能比大小。 　　
 *  单牌按分值比大小，依次是：大王 > 小王 >2>A>K>Q>J>10>9>8>7>6>5>4>3 ，不分花色。 　　
 *  对牌、三张牌都按分值比大小。 　　顺牌按最大的一张牌的分值来比大小。 　
 *  飞机带翅膀和四带二按其中的三顺和四张部分来比，带的牌不影响大小。
 *
 *  *******/

var pokerTip = cc.Class({});


pokerTip.startAnalysis = function () {

    this.handPokerList = cc.YL.DDZHandPokerList;
    this.analysis();
};
pokerTip.analysis = function () {
    this.single();
    this.double();
    this.three();
    this.four();
    this.rocket();
    this.shunzi();
    this.doubleshunzi();
};
pokerTip.single = function () {
    var tempArr = this.handPokerList;
    this.singleArr = []; //  单张数组
    for (var i = 0; i < tempArr.length; i++) {
        var times = 0;
        for (var j = 0; j < tempArr.length; j++) {
            if (tempArr[i] == tempArr[j]) {
                times++;
            }
        }
        if (times == 1) {
            this.singleArr.push(tempArr[i]);
        }
    }
    this.singleArr = this.zipArr(this.singleArr);
};
pokerTip.double = function () {
    this.doubleArr = []; //  对子数组
    var tempArr = this.handPokerList;
    for (var i = 0; i < tempArr.length; i++) {
        var times = 0;
        for (var j = 0; j < tempArr.length; j++) {
            if (tempArr[i] == tempArr[j]) {
                times++;
            }
        }
        if (times == 2) {
            this.doubleArr.push(tempArr[i]);
        }
    }
    this.doubleArr = this.zipArr(this.doubleArr);
};
pokerTip.three = function () {
    this.threeArr = []; // 三张数组
    var tempArr = this.handPokerList;
    for (var i = 0; i < tempArr.length; i++) {
        var times = 0;
        for (var j = 0; j < tempArr.length; j++) {
            if (tempArr[i] == tempArr[j]) {
                times++;
            }
        }
        if (times == 3) {
            this.threeArr.push(tempArr[i]);
        }
    }
    this.threeArr = this.zipArr(this.threeArr);
};
pokerTip.four = function () {
    this.fourArr = []; //  四张数组
    var tempArr = this.handPokerList;
    for (var i = 0; i < tempArr.length; i++) {
        var times = 0;
        for (var j = 0; j < tempArr.length; j++) {
            if (tempArr[i] == tempArr[j]) {
                times++;
            }
        }
        if (times == 4) {
            this.fourArr.push(tempArr[i]);
        }
    }
    this.fourArr = this.zipArr(this.fourArr);
};
pokerTip.rocket = function () {
    this.rocketArr = []; //  王炸的数组
    var tempArr = this.handPokerList;
    for (var i = 0; i < tempArr.length; i++) {
        if (tempArr[i] == 53 || tempArr[i] == 54) {
            this.rocketArr.push(tempArr[i]);
        }
    }
    this.rocketArr = this.zipArr(this.rocketArr);
};
pokerTip.shunzi = function () {
    this.shunZiArr = []; // 顺子的数
    var tempArr = this.zipArr(this.handPokerList);
    for (var i = 0; i < tempArr.length; i++) {
        for (var j = 4; j < 12; j++) {
            if (tempArr[i] + j == tempArr[i + j] && i + j <= tempArr.length - 1) {
                this.shunZiArr.push({
                    min: tempArr[i],
                    max: tempArr[i + j],
                    len: j + 1,
                });
            }
        }
    }
};
pokerTip.doubleshunzi = function () {
    this.doubleShunZiArr = []; // 连对的数组
    var tempArr = this.handPokerList;
    for (var i = 0; i < tempArr.length; i++) {
        var times = 0;
        for (var j = 0; j < tempArr.length; j++) {
            if (tempArr[i] == tempArr[j]) {
                times++;
            }
        }
        if (times >= 2) {
            this.doubleShunZiArr.push(tempArr[i]);
        }
    }
    this.doubleShunZiArr = this.zipArr(this.doubleShunZiArr);
    // 现在的可作为连对使用的元素选出了
    var newArr = this.doubleShunZiArr;
    this.doubleShunZiArr = [];
    for (var i = 0; i < newArr.length; i++) {
        for (var j = 2; j < 10; j++) {
            if (newArr[i] + j == newArr[i + j] && i + j <= newArr.length - 1) {
                this.doubleShunZiArr.push({
                    min: newArr[i],
                    max: newArr[i + j],
                    len: j + 1,
                });
            }
        }
    }
};
pokerTip.zipArr = function (arr) {
    var tempArr = [];
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
                j = ++i;
            }
        }
        tempArr.push(arr[i]);
    }
    return tempArr;
};
/**************玩家手牌解析完成****************/


/**************通过上家玩家的出牌，提示牌****************/
pokerTip.typeEnum = {
    "王炸": 12,
    "炸弹": 11,
    "单张": 10,
    "对子": 9,
    "三张": 8,
    "三带一": 7,
    "三带二": 6,
    "顺子": 5,
    "连对": 4,
    "飞机带单张": 3,
    "飞机带对子": 2,
    "四带二": 1,
};
pokerTip.clickTipsBtn = function (type, num, list) {
    this.lastPokerType = type; // 牌的类型
    this.lastPokerNum = num;//牌的张数
    this.lastPokerList = cc.YL.DDZTools.SortPoker(list); // 牌的数组
    /***
     * 如果是单张》10》》》找手牌数组就可以
     * 如果是对子》9》》》找对子，三张，四张，王炸数组就可以
     * 如果是三张》》8》》找三张，四张，王炸数组就可以
     * 如果是四张》》》》找炸弹，王炸数组就可以
     * 如果是顺子》》5》》找顺子数组
     * 如果是连对》》4》》找连对数组
     * 如果是三带一》7》》三张，单张数组
     * 如果是三带二》6》》三张，对子数组
     * 如果是四带二》1》》四张，对子数组
     * 如果是飞机带单张》3》》三张，四张，单张，对子数组
     * 如果是飞机带对子》1》》三张，四张，对子数组
     * ****/
    switch (this.lastPokerType){
        case 1:{

            break;
        }
        case 2:{
            break;
        }
        case 3:{
            break;
        }
        case 4:{
            break;
        }
        case 5:{
            break;
        }
        case 6:{
            break;
        }
        case 7:{
            break;
        }
        case 8:{
            break;
        }
        case 9:{
            break;
        }
        case 10:{

            break;
        }
        case 11:{
            break;
        }
        case 12:{
            break;
        }
        default:{
            cc.YL.err("没有找到对应的牌类型");
        }

    }

};
cc.YL.PokerTip = pokerTip;
module.exports = pokerTip;
