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
/***
 * 如果是单张》10》》》找手牌数组就可以
 * 如果是对子》9》》》找对子，三张，四张，王炸数组就可以
 * 如果是三张》》8》》找三张，四张，王炸数组就可以
 * 如果是四张》》》11》找炸弹，王炸数组就可以
 * 如果是顺子》》5》》找顺子数组
 * 如果是连对》》4》》找连对数组
 * 如果是三带一》7》》三张，单张数组
 * 如果是三带二》6》》三张，对子数组
 * 如果是四带二》1》》四张，对子数组
 * 如果是飞机带单张》3》》三张，四张，单张，对子数组
 * 如果是飞机带对子》1》》三张，四张，对子数组
 * ****/
var pokerTip = cc.Class({});
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

pokerTip.startAnalysis = function () {

    var tempArr = cc.YL.DDZHandPokerList;
    this.handPokerList = [];
    this.singlePoint = null;
    this.doublePoint = null;
    this.threePoint = null;
    this.shunZiPoint = null;
    this.doubleShunZiPoint = null;
    for (var i = 0; i < tempArr.length; i++) {
        this.handPokerList.push(tempArr[i].Num);
    }
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
    if (this.rocketArr.length != 2) {
        this.rocketArr = [];
    }
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

pokerTip.clickTipsBtn = function (type, num, list) {
    cc.YL.info("点击了提示按钮数据为", type, num, list);
    this.lastPokerType = type; // 牌的类型
    this.lastPokerNum = num;//牌的张数
    this.lastPokerList = cc.YL.DDZTools.SortPoker(list); // 牌的数组

    switch (this.lastPokerType) {
        case 1: {

            break;
        }
        case 2: {
            break;
        }
        case 3: {
            break;
        }
        case 4: {
            //连对
            break;
        }
        case 5: {
            //顺子
            var tipShunziCardArr = [];
            for (var i = 0; i < this.shunZiArr.length; i++) {
                if (this.shunZiArr[i].min > this.lastPokerList[0] && this.shunZiArr[i].len == this.lastPokerNum) {
                    tipShunziCardArr.push(this.shunZiArr[i]);
                }
            }
            if (this.rocketArr) {
                tipShunziCardArr.push({
                    min: this.rocketArr[0],
                    max: this.rocketArr[1],
                    len: 2,
                });
            }
            this.shunZiAction(tipShunziCardArr);
            break;
        }
        case 6: {
            break;
        }
        case 7: {
            break;
        }
        case 8: {
            var tipThreeCardArr = [];
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.lastPokerList[0]) {
                    tipThreeCardArr.push(this.threeArr[i]);
                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipThreeCardArr.push(this.fourArr[i]);
                }
            }
            if (this.rocketArr) {
                tipThreeCardArr.push(this.rocketArr[0]);
                tipThreeCardArr.push(this.rocketArr[1]);
            }
            this.threeAction(tipThreeCardArr);
            break;
        }
        case 9: {
            var tipDoubleCardArr = [];
            for (var i = 0; i < this.doubleArr.length; i++) {
                if (this.doubleArr[i] > this.lastPokerList[0]) {
                    tipDoubleCardArr.push(this.doubleArr[i]);
                }
            }
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.lastPokerList[0]) {
                    tipDoubleCardArr.push(this.threeArr[i]);
                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipDoubleCardArr.push(this.fourArr[i]);
                }
            }
            if (this.rocketArr) {
                tipDoubleCardArr.push(this.rocketArr[0]);
                tipDoubleCardArr.push(this.rocketArr[1]);
            }
            this.doubleAction(tipDoubleCardArr);
            break;
        }
        case 10: {
            // 单张
            var tipSingleCardArr = [];
            for (var i = 0; i < this.handPokerList.length; i++) {
                if (this.handPokerList[i] > this.lastPokerList[0]) {
                    tipSingleCardArr.push(this.handPokerList[i]);
                }
            }
            this.singleAction(tipSingleCardArr);
            break;
        }
        case 11: {
            var tipFourCardArr = [];
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipFourCardArr.push(this.fourArr[i]);
                }
            }
            if (this.rocketArr) {
                tipFourCardArr.push(this.rocketArr[0]);
                tipFourCardArr.push(this.rocketArr[1]);
            }
            this.fourAction(tipFourCardArr);
            break;
        }
        case 12: {
            break;
        }
        default: {
            cc.YL.err("没有找到对应的牌类型");
        }

    }
};
pokerTip.initPokerNode = function () {
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    cc.YL.playerOutPokerArr = [];
    for (var i = 0; i < pokerRoot.children.length; i++) {
        pokerRoot.children[i].y = 0;
    }
};
pokerTip.singleAction = function (list) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.singlePoint == null) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        pokerRoot.children[j].y = 20;
                        cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                        this.singlePoint = list[i];
                        isDone = true;
                    }
                } else if (list[i] > this.singlePoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        pokerRoot.children[j].y = 20;
                        cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                        this.singlePoint = list[i];
                        this.singlePoint == list[list.length - 1] ? this.singlePoint = null : this.singlePoint;
                        isDone = true;
                    }
                }

            }
        }

    }
};
pokerTip.doubleAction = function (list) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.doublePoint == null) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        pokerRoot.children[j].y = 20;
                        pokerRoot.children[j + 1].y = 20;
                        cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                        cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                        this.doublePoint = list[i];
                        isDone = true;
                    }
                } else if (list[i] > this.doublePoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        pokerRoot.children[j].y = 20;
                        pokerRoot.children[j + 1].y = 20;
                        cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                        cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                        this.doublePoint = list[i];
                        this.doublePoint == list[list.length - 1] ? this.doublePoint = null : this.doublePoint;
                        if (this.doublePoint == 53 || this.doublePoint == 54) {
                            this.doublePoint = null;
                        }
                        isDone = true;
                    }
                }

            }
        }

    }
};
pokerTip.threeAction = function (list) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.threePoint == null) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            pokerRoot.children[j].y = 20;
                            pokerRoot.children[j + 1].y = 20;
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                            this.threePoint = list[i];
                        } else {
                            pokerRoot.children[j].y = 20;
                            pokerRoot.children[j + 1].y = 20;
                            pokerRoot.children[j + 2].y = 20;
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 2].getComponent("DDZ_Poker").pokerID);
                            this.threePoint = list[i];
                        }
                        isDone = true;
                    }
                } else if (list[i] > this.threePoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            pokerRoot.children[j].y = 20;
                            pokerRoot.children[j + 1].y = 20;
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                            this.threePoint = list[i];
                        } else {
                            pokerRoot.children[j].y = 20;
                            pokerRoot.children[j + 1].y = 20;
                            pokerRoot.children[j + 2].y = 20;
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 2].getComponent("DDZ_Poker").pokerID);
                            this.threePoint = list[i];
                        }
                        this.threePoint == list[list.length - 1] ? this.threePoint = null : this.threePoint;
                        if (this.threePoint == 53 || this.threePoint == 54) {
                            this.threePoint = null;
                        }
                        isDone = true;
                    }
                }

            }
        }

    }
};
pokerTip.fourAction = function (list) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.fourPoint == null) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            pokerRoot.children[j].y = 20;
                            pokerRoot.children[j + 1].y = 20;
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                            this.fourPoint = list[i];
                        } else {
                            pokerRoot.children[j].y = 20;
                            pokerRoot.children[j + 1].y = 20;
                            pokerRoot.children[j + 2].y = 20;
                            pokerRoot.children[j + 3].y = 20;
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 2].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 3].getComponent("DDZ_Poker").pokerID);
                            this.fourPoint = list[i];
                        }
                        isDone = true;
                    }
                } else if (list[i] > this.fourPoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            pokerRoot.children[j].y = 20;
                            pokerRoot.children[j + 1].y = 20;
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                            this.fourPoint = list[i];
                        } else {
                            pokerRoot.children[j].y = 20;
                            pokerRoot.children[j + 1].y = 20;
                            pokerRoot.children[j + 2].y = 20;
                            pokerRoot.children[j + 3].y = 20;
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 2].getComponent("DDZ_Poker").pokerID);
                            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 3].getComponent("DDZ_Poker").pokerID);
                            this.fourPoint = list[i];
                        }
                        this.fourPoint == list[list.length - 1] ? this.fourPoint = null : this.fourPoint;
                        if (this.fourPoint == 53 || this.fourPoint == 54) {
                            this.fourPoint = null;
                        }
                        isDone = true;
                    }
                }

            }
        }

    }
};
pokerTip.shunZiAction = function (list) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    for (var i = 0; i < list.length; i++) {
        for (var j = 0; j < pokerRoot.children.length; j++) {
            if(list[i].min = pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum){

            }
        }

    }
};
cc.YL.PokerTip = pokerTip;
module.exports = pokerTip;
