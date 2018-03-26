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
    this.threeAndOnePoint = null;
    this.threeAndTwoPoint = null;
    this.fourAndTwoPoint = null;
    this.flyPoint = null;
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
    this.fly();

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
            if (tempArr[i] + j == tempArr[i + j] && i + j <= tempArr.length - 1
                && tempArr[i] <= 10) {
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
            if (newArr[i] + j == newArr[i + j] && i + j <= newArr.length - 1
                && newArr[i] <= 12) {
                this.doubleShunZiArr.push({
                    min: newArr[i],
                    max: newArr[i + j],
                    len: j + 1,
                });
            }
        }
    }
};
pokerTip.fly = function () {
    this.flyArr = []; //
    var tempArr = this.handPokerList;
    for (var i = 0; i < tempArr.length; i++) {
        var times = 0;
        for (var j = 0; j < tempArr.length; j++) {
            if (tempArr[i] == tempArr[j]) {
                times++;
            }
        }
        if (times >= 3) {
            this.flyArr.push(tempArr[i]);
        }
    }
    this.flyArr = this.zipArr(this.flyArr);
    // 现在的可作为连对使用的元素选出了
    var newArr = this.flyArr;
    this.flyArr = [];
    for (var i = 0; i < newArr.length; i++) {
        for (var j = 1; j < 7; j++) {
            if (newArr[i] + j == newArr[i + j] && i + j <= newArr.length - 1
                && newArr[i] <= 13) {
                this.flyArr.push({
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
            var tipFourAndTowCardArr = [];
            var doubleCard = null;
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipFourAndTowCardArr.push(this.fourArr[i]);
                }
            }
            if (this.rocketArr) {
                tipFourAndTowCardArr.push(this.rocketArr[0]);
                tipFourAndTowCardArr.push(this.rocketArr[1]);
            }
            tipFourAndTowCardArr = cc.YL.DDZTools.SortPoker(tipFourAndTowCardArr);
            if (this.doubleArr.length != 0) {
                doubleCard = this.doubleArr[0];
                var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
                var isDone = false;
                for (var j = 0; j < pokerRoot.children.length; j++) {
                    if (doubleCard == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && isDone == false) {
                        this.fourAndTwoAction(tipFourAndTowCardArr, pokerRoot.children[j], pokerRoot.children[j + 1]);
                        isDone = true;
                    }
                }

            }

            break;
        }
        case 2: {
            //飞机对子
            var tipFlyWithDoubleCardArr = [];
            for (var i = 0; i < this.flyArr.length; i++) {
                if (this.flyArr[i].min > this.lastPokerList[0] && this.flyArr[i].len == this.lastPokerNum) {
                    tipFlyWithDoubleCardArr.push(this.flyArr[i]);
                }
            }
            if (this.rocketArr.length == 2) {
                tipFlyWithDoubleCardArr.push({
                    min: this.rocketArr[0],
                    max: this.rocketArr[1],
                    len: 2,
                });
            }

            this.flyWithAction(tipFlyWithDoubleCardArr);
            break;
        }
        case 3: {
            //飞机单张
            var tipFlyWithOneCardArr = [];
            for (var i = 0; i < this.flyArr.length; i++) {
                if (this.flyArr[i].min > this.lastPokerList[0] && this.flyArr[i].len == this.lastPokerNum) {
                    tipFlyWithOneCardArr.push(this.flyArr[i]);
                }
            }
            if (this.rocketArr.length == 2) {
                tipFlyWithOneCardArr.push({
                    min: this.rocketArr[0],
                    max: this.rocketArr[1],
                    len: 2,
                });
            }
            this.flyWithAction(tipFlyWithOneCardArr);
            break;
        }
        case 4: {
            //连对
            var tipDoubleShunziCardArr = [];
            for (var i = 0; i < this.doubleShunZiArr.length; i++) {
                if (this.doubleShunZiArr[i].min > this.lastPokerList[0] && this.doubleShunZiArr[i].len == this.lastPokerNum) {
                    tipDoubleShunziCardArr.push(this.doubleShunZiArr[i]);
                }
            }
            if (this.rocketArr.length == 2) {
                tipDoubleShunziCardArr.push({
                    min: this.rocketArr[0],
                    max: this.rocketArr[1],
                    len: 2,
                });
            }
            this.doubleShunZiAction(tipDoubleShunziCardArr);
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
            if (this.rocketArr.length == 2) {
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
            // 三带二
            var tipThreeAndTwoCardArr = [];
            var doubleCard = null;
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.lastPokerList[0]) {
                    tipThreeAndTwoCardArr.push(this.threeArr[i]);
                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipThreeAndTwoCardArr.push(this.fourArr[i]);
                }
            }
            if (this.rocketArr) {
                tipThreeAndTwoCardArr.push(this.rocketArr[0]);
                tipThreeAndTwoCardArr.push(this.rocketArr[1]);
            }
            tipThreeAndTwoCardArr = cc.YL.DDZTools.SortPoker(tipThreeAndTwoCardArr);
            if (this.doubleArr.length != 0) {
                doubleCard = this.doubleArr[0];
                var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
                var isDone = false;
                for (var j = 0; j < pokerRoot.children.length; j++) {
                    if (doubleCard == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && isDone == false) {
                        this.threeAndTwoAction(tipThreeAndTwoCardArr, pokerRoot.children[j], pokerRoot.children[j + 1]);
                        isDone = true;
                    }
                }

            }
            break;
        }
        case 7: {
            //三带一
            var tipThreeAndOneCardArr = [];
            var singleCard = null;
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.lastPokerList[0]) {
                    tipThreeAndOneCardArr.push(this.threeArr[i]);
                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipThreeAndOneCardArr.push(this.fourArr[i]);
                }
            }
            if (this.rocketArr) {
                tipThreeAndOneCardArr.push(this.rocketArr[0]);
                tipThreeAndOneCardArr.push(this.rocketArr[1]);
            }
            tipThreeAndOneCardArr = cc.YL.DDZTools.SortPoker(tipThreeAndOneCardArr);
            if (this.singleArr.length != 0) {
                singleCard = this.singleArr[0];
                var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
                var isDone = false;
                for (var j = 0; j < pokerRoot.children.length; j++) {
                    if (singleCard == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && isDone == false) {
                        this.threeAndOneAction(tipThreeAndOneCardArr, pokerRoot.children[j]);
                        isDone = true;
                    }
                }

            }

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
            tipThreeCardArr = cc.YL.DDZTools.SortPoker(tipThreeCardArr);
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
            tipDoubleCardArr = cc.YL.DDZTools.SortPoker(tipDoubleCardArr);
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
            //王炸。没大的过得

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
                        this.pokerUpAction(j, 0);
                        this.singlePoint = list[i];
                        isDone = true;
                    }
                } else if (list[i] > this.singlePoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        this.pokerUpAction(j, 0);
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
                        this.pokerUpAction(j, 1);
                        this.doublePoint = list[i];
                        isDone = true;
                    }
                } else if (list[i] > this.doublePoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        this.pokerUpAction(j, 1);
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
                            this.pokerUpAction(j, 1);
                            this.threePoint = list[i];
                        } else {
                            this.pokerUpAction(j, 2);
                            this.threePoint = list[i];
                        }
                        isDone = true;

                    }
                } else if (list[i] > this.threePoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            this.pokerUpAction(j, 1);
                            this.threePoint = list[i];
                        } else {
                            this.pokerUpAction(j, 2);
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
                            this.pokerUpAction(j, 1);
                            this.fourPoint = list[i];
                        } else {
                            this.pokerUpAction(j, 3);
                            this.fourPoint = list[i];
                        }
                        isDone = true;
                    }
                } else if (list[i] > this.fourPoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            this.pokerUpAction(j, 1);
                            this.fourPoint = list[i];
                        } else {
                            this.pokerUpAction(j, 3);
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
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.shunZiPoint == null) {
                    if (list[i].min == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum) {
                        // 找到最小的
                        this.shunZiPoint = list[i].min;
                        if (this.shunZiPoint == 53 || this.shunZiPoint == 54) {
                            this.pokerUpAction(j, 1);
                        } else {
                            var times = 0;
                            for (var k = j; k < pokerRoot.children.length; k++) {
                                if (pokerRoot.children[k].y == 0
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum == list[i].min + times
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum <= list[i].max
                                    && times + 1 <= list[i].len) {
                                    this.pokerUpAction(k, 0);
                                    times++;
                                }
                            }
                            isDone = true;
                        }
                        this.shunZiPoint == list[list.length - 1].min ? this.shunZiPoint = null : this.shunZiPoint;
                        if (this.shunZiPoint == 53 || this.shunZiPoint == 54) {
                            this.shunZiPoint = null;
                        }
                    }
                } else if (list[i].min > this.shunZiPoint) {
                    if (list[i].min == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum) {
                        this.shunZiPoint = list[i].min;
                        if (this.shunZiPoint == 53 || this.shunZiPoint == 54) {
                            this.pokerUpAction(j, 1);
                        } else {
                            var times = 0;
                            for (var k = j; k < pokerRoot.children.length; k++) {
                                if (pokerRoot.children[k].y == 0
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum == list[i].min + times
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum <= list[i].max
                                    && times + 1 <= list[i].len) {
                                    this.pokerUpAction(k, 0);
                                    times++;
                                }
                            }
                            isDone = true;
                        }
                        this.shunZiPoint == list[list.length - 1].min ? this.shunZiPoint = null : this.shunZiPoint;
                        if (this.shunZiPoint == 53 || this.shunZiPoint == 54) {
                            this.shunZiPoint = null;
                        }
                    }
                }
            }
        }
    }
};
pokerTip.doubleShunZiAction = function (list) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.doubleShunZiPoint == null) {
                    if (list[i].min == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum) {
                        // 找到最小的
                        this.doubleShunZiPoint = list[i].min;
                        if (this.doubleShunZiPoint == 53 || this.doubleShunZiPoint == 54) {
                            this.pokerUpAction(j, 1);
                            isDone = true;
                        } else {
                            var times = 0;
                            for (var k = j; k < pokerRoot.children.length; k++) {
                                if (pokerRoot.children[k].y == 0
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum == list[i].min + times
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum <= list[i].max
                                    && times + 1 <= list[i].len) {
                                    this.pokerUpAction(k, 1);
                                    times++;
                                }
                            }
                            isDone = true;
                        }
                        this.doubleShunZiPoint == list[list.length - 1].min ? this.doubleShunZiPoint = null : this.doubleShunZiPoint;
                        if (this.doubleShunZiPoint == 53 || this.doubleShunZiPoint == 54) {
                            this.doubleShunZiPoint = null;
                        }
                    }
                } else if (list[i].min > this.doubleShunZiPoint) {
                    if (list[i].min == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum) {
                        this.doubleShunZiPoint = list[i].min;
                        if (this.doubleShunZiPoint == 53 || this.doubleShunZiPoint == 54) {
                            this.pokerUpAction(j, 1);
                            isDone = true;
                        } else {
                            var times = 0;
                            for (var k = j; k < pokerRoot.children.length; k++) {
                                if (pokerRoot.children[k].y == 0
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum == list[i].min + times
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum <= list[i].max
                                    && times + 1 <= list[i].len) {
                                    this.pokerUpAction(k, 1);
                                    times++;
                                }
                            }
                            isDone = true;
                        }
                        this.doubleShunZiPoint == list[list.length - 1].min ? this.doubleShunZiPoint = null : this.doubleShunZiPoint;
                        if (this.doubleShunZiPoint == 53 || this.doubleShunZiPoint == 54) {
                            this.doubleShunZiPoint = null;
                        }
                    }
                }
            }
        }
    }
};
pokerTip.threeAndOneAction = function (list, sigleCard) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.threeAndOnePoint == null) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            this.pokerUpAction(j, 1);
                            this.threeAndOnePoint = list[i];
                        } else {
                            this.pokerUpAction(j, 2);
                            sigleCard.y = 20;
                            cc.YL.playerOutPokerArr.push(sigleCard.getComponent("DDZ_Poker").pokerID);
                            this.threeAndOnePoint = list[i];
                        }
                        isDone = true;

                    }
                } else if (list[i] > this.threeAndOnePoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            this.pokerUpAction(j, 1);
                            this.threeAndOnePoint = list[i];
                        } else {
                            this.pokerUpAction(j, 2);
                            sigleCard.y = 20;
                            cc.YL.playerOutPokerArr.push(sigleCard.getComponent("DDZ_Poker").pokerID);
                            this.threeAndOnePoint = list[i];
                        }
                        this.threeAndOnePoint == list[list.length - 1] ? this.threeAndOnePoint = null : this.threeAndOnePoint;
                        if (this.threeAndOnePoint == 53 || this.threeAndOnePoint == 54) {
                            this.threeAndOnePoint = null;
                        }
                        isDone = true;
                    }
                }

            }
        }
    }

};
pokerTip.threeAndTwoAction = function (list, double, double_1) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.threeAndTwoPoint == null) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            this.pokerUpAction(j, 1);
                            this.threeAndTwoPoint = list[i];
                        } else {
                            this.pokerUpAction(j, 2);
                            double.y = 20;
                            cc.YL.playerOutPokerArr.push(double.getComponent("DDZ_Poker").pokerID);
                            double_1.y = 20;
                            cc.YL.playerOutPokerArr.push(double_1.getComponent("DDZ_Poker").pokerID);
                            this.threeAndTwoPoint = list[i];
                        }
                        isDone = true;

                    }
                } else if (list[i] > this.threeAndTwoPoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            this.pokerUpAction(j, 1);
                            this.threeAndTwoPoint = list[i];
                        } else {
                            this.pokerUpAction(j, 2);
                            double.y = 20;
                            cc.YL.playerOutPokerArr.push(double.getComponent("DDZ_Poker").pokerID);
                            double_1.y = 20;
                            cc.YL.playerOutPokerArr.push(double_1.getComponent("DDZ_Poker").pokerID);
                            this.threeAndTwoPoint = list[i];
                        }
                        this.threeAndTwoPoint == list[list.length - 1] ? this.threeAndTwoPoint = null : this.threeAndTwoPoint;
                        if (this.threeAndTwoPoint == 53 || this.threeAndTwoPoint == 54) {
                            this.threeAndTwoPoint = null;
                        }
                        isDone = true;
                    }
                }

            }
        }
    }
    for (var j = 0; j < pokerRoot.children.length; j++) {
        if (double == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
            && pokerRoot.children[j].y == 0) {
            pokerRoot.children[j].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
            pokerRoot.children[j + 1].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[j + 1].getComponent("DDZ_Poker").pokerID);
            break;
        }
    }
};
pokerTip.fourAndTwoAction = function (list, double, double_1) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.fourAndTwoPoint == null) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            this.pokerUpAction(j, 1);
                            this.fourAndTwoPoint = list[i];
                        } else {
                            this.pokerUpAction(j, 3);
                            double.y = 20;
                            cc.YL.playerOutPokerArr.push(double.getComponent("DDZ_Poker").pokerID);
                            double_1.y = 20;
                            cc.YL.playerOutPokerArr.push(double_1.getComponent("DDZ_Poker").pokerID);
                            this.fourAndTwoPoint = list[i];
                        }
                        isDone = true;
                    }
                } else if (list[i] > this.fourAndTwoPoint) {
                    if (list[i] == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
                        && pokerRoot.children[j].y == 0) {
                        if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == 53) {
                            this.pokerUpAction(j, 1);
                            this.fourAndTwoPoint = list[i];
                        } else {
                            this.pokerUpAction(j, 3);
                            double.y = 20;
                            cc.YL.playerOutPokerArr.push(double.getComponent("DDZ_Poker").pokerID);
                            double_1.y = 20;
                            cc.YL.playerOutPokerArr.push(double_1.getComponent("DDZ_Poker").pokerID);
                            this.fourAndTwoPoint = list[i];
                        }
                        this.fourAndTwoPoint == list[list.length - 1] ? this.fourAndTwoPoint = null : this.fourAndTwoPoint;
                        if (this.fourAndTwoPoint == 53 || this.fourAndTwoPoint == 54) {
                            this.fourAndTwoPoint = null;
                        }
                        isDone = true;
                    }
                }

            }
        }
    }

};
pokerTip.flyWithAction = function (list) {
    this.initPokerNode();
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var isDone = false;
    for (var i = 0; i < list.length; i++) {
        if (isDone == false) {
            for (var j = 0; j < pokerRoot.children.length; j++) {
                if (this.flyPoint == null) {
                    if (list[i].min == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum) {
                        // 找到最小的
                        this.flyPoint = list[i].min;
                        if (this.flyPoint == 53 || this.flyPoint == 54) {
                            this.pokerUpAction(j, 1);
                            isDone = true;
                        } else {
                            var times = 0;
                            for (var k = j; k < pokerRoot.children.length; k++) {
                                if (pokerRoot.children[k].y == 0
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum == list[i].min + times
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum <= list[i].max
                                    && times + 1 <= list[i].len) {
                                    this.pokerUpAction(k, 2);
                                    times++;
                                }
                            }
                            isDone = true;
                            this.findOtherCard();
                        }
                        this.flyPoint == list[list.length - 1].min ? this.flyPoint = null : this.flyPoint;
                        if (this.flyPoint == 53 || this.flyPoint == 54) {
                            this.flyPoint = null;
                        }
                    }
                } else if (list[i].min > this.flyPoint) {
                    if (list[i].min == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum) {
                        this.flyPoint = list[i].min;
                        if (this.flyPoint == 53 || this.flyPoint == 54) {
                            this.pokerUpAction(j, 1);
                            isDone = true;
                        } else {
                            var times = 0;
                            for (var k = j; k < pokerRoot.children.length; k++) {
                                if (pokerRoot.children[k].y == 0
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum == list[i].min + times
                                    && pokerRoot.children[k].getComponent("DDZ_Poker").pokerNum <= list[i].max
                                    && times + 1 <= list[i].len) {
                                    this.pokerUpAction(k, 2);
                                    times++;
                                }
                            }
                            isDone = true;
                            this.findOtherCard();
                        }
                        this.flyPoint == list[list.length - 1].min ? this.flyPoint = null : this.flyPoint;
                        if (this.flyPoint == 53 || this.flyPoint == 54) {
                            this.flyPoint = null;
                        }
                    }
                }
            }
        }
    }
};
pokerTip.pokerUpAction = function (pokerIndex, num) {
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    switch (num) {
        case 0: {
            pokerRoot.children[pokerIndex].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex].getComponent("DDZ_Poker").pokerID);
            break;
        }
        case 1: {
            pokerRoot.children[pokerIndex].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex].getComponent("DDZ_Poker").pokerID);
            pokerRoot.children[pokerIndex + 1].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex + 1].getComponent("DDZ_Poker").pokerID);
            break;
        }
        case 2: {
            pokerRoot.children[pokerIndex].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex].getComponent("DDZ_Poker").pokerID);
            pokerRoot.children[pokerIndex + 1].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex + 1].getComponent("DDZ_Poker").pokerID);
            pokerRoot.children[pokerIndex + 2].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex + 2].getComponent("DDZ_Poker").pokerID);
            break;
        }
        case 3: {
            pokerRoot.children[pokerIndex].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex].getComponent("DDZ_Poker").pokerID);
            pokerRoot.children[pokerIndex + 1].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex + 1].getComponent("DDZ_Poker").pokerID);
            pokerRoot.children[pokerIndex + 2].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex + 2].getComponent("DDZ_Poker").pokerID);
            pokerRoot.children[pokerIndex + 3].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[pokerIndex + 3].getComponent("DDZ_Poker").pokerID);
            break;
        }

    }

};
pokerTip.findOtherCard = function () {
    var type = this.lastPokerType;
    var pokerNum = type == 2 ? this.lastPokerNum * 2 : this.lastPokerNum;
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    // type:2为对子
    var newArr = [];
    for (var i = 0; i < this.singleArr.length; i++) {
        newArr.push(this.singleArr[i]);
    }
    for (var i = 0; i < this.doubleArr.length; i++) {
        newArr.push(this.doubleArr[i]);
    }
    newArr = this.zipArr(newArr);
    newArr = cc.YL.DDZTools.SortPoker(newArr);
    var times = 0;
    for (var i = 0; i < newArr.length; i++) {
        for (var j = 0; j < pokerRoot.children.length; j++) {
            if (pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum == newArr[i]
                && pokerRoot.children[j].y == 0
                && times < pokerNum) {
                pokerRoot.children[j].y = 20;
                cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
                times++;
            }
        }
    }

};
cc.YL.PokerTip = pokerTip;
module.exports = pokerTip;
