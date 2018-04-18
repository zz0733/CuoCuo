var DDZPokerTip = cc.Class({});
DDZPokerTip.startAnalysis = function () {
    var tempArr = cc.YL.DDZHandPokerList;
    this.handPokerList = [];
    this.handPokerListRever = [];
    this.pokerActionPoint = null;
    for (var i = 0; i < tempArr.length; i++) {
        this.handPokerList.push(tempArr[i].Num);
    }
    for (var i = tempArr.length -1 ; i > 0 ; i--) {
        this.handPokerListRever.push(tempArr[i].Num);
    }
    this.analysis();
};
DDZPokerTip.analysis = function () {
    this.single();
    this.double();
    this.three();
    this.four();
    this.rocket();
    this.shunzi();
    this.doubleshunzi();
    this.fly();
};
DDZPokerTip.single = function () {
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
    this.singleArr = this.singleArr.reverse();
};
DDZPokerTip.double = function () {
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
    this.doubleArr = this.doubleArr.reverse();
};
DDZPokerTip.three = function () {
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
    this.threeArr = this.threeArr.reverse();
};
DDZPokerTip.four = function () {
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
    this.fourArr = this.fourArr.reverse();
};
DDZPokerTip.rocket = function () {
    this.rocketArr = []; //  王炸的数组
    var tempArr = this.handPokerList;
    for (var i = 0; i < tempArr.length; i++) {
        if (tempArr[i] == 53 || tempArr[i] == 54) {
            this.rocketArr.push(tempArr[i]);
        }
    }
    this.rocketArr = this.zipArr(this.rocketArr);
    this.rocketArr = cc.YL.DDZTools.SortPoker(this.rocketArr);
    if (this.rocketArr.length != 2) {
        this.rocketArr = [];
    }
};
DDZPokerTip.shunzi = function () {
    this.shunZiArr = []; // 顺子的数
    var tempArr = this.zipArr(this.handPokerList);
    tempArr = tempArr.reverse();
    for (var i = 0; i < tempArr.length; i++) {
        for (var j = 4; j < 12; j++) {
            if (tempArr[i] + j == tempArr[i + j] && i + j <= tempArr.length - 1
                && tempArr[i] <= 10 && tempArr[i + j] < 15) {
                this.shunZiArr.push({
                    min: tempArr[i],
                    max: tempArr[i + j],
                    len: j + 1,
                });
            }
        }
    }
};
DDZPokerTip.doubleshunzi = function () {
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
    newArr = newArr.reverse();
    for (var i = 0; i < newArr.length; i++) {
        for (var j = 2; j < 10; j++) {
            if (newArr[i] + j == newArr[i + j] && i + j <= newArr.length - 1
                && newArr[i] <= 12 && tempArr[i + j] < 15) {
                this.doubleShunZiArr.push({
                    min: newArr[i],
                    max: newArr[i + j],
                    len: j + 1,
                });
            }
        }
    }
};
DDZPokerTip.fly = function () {
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
    newArr = newArr.reverse();
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
DDZPokerTip.zipArr = function (arr) {
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
DDZPokerTip.findOutCardList = function (list, times) {
    var time_3 = [];
    var time_4 = [];
    for (var i = 0; i < list.length; i++) {
        var time = 0;
        for (var j = 0; j < list.length; j++) {
            if (list[i] == list[j]) {
                time++;
            }
        }
        if (time == 3) {
            time_3.push(list[i]);
        }
        if (time == 4) {
            time_4.push(list[i]);
        }
    }
    time_3 = cc.YL.DDZTools.SortPoker(time_3);
    time_4 = cc.YL.DDZTools.SortPoker(time_4);
    switch (times) {
        case 3: {
            return time_3[0];
            break;
        }
        case 4: {
            return time_4[0];
            break;
        }
    }
};

/**************通过上家玩家的出牌，提示牌****************/
DDZPokerTip.PokerAction = function (list) {
    this.initPokerNode();
    var isDone = false;
    for(var i = 0 ; i < list.length;i++){
        if(isDone == false){
            if(this.pokerActionPoint == null){
                for(var j = 0; j < list[0].Pokers.length; j++){
                    this.upPoker(list[0].Pokers[j]);
                    isDone = true;
                }
                this.pokerActionPoint = 1;
            }else if(this.pokerActionPoint < list.length){
                for(var j = 0; j < list[this.pokerActionPoint].Pokers.length; j++){
                    this.upPoker(list[this.pokerActionPoint].Pokers[j]);
                    isDone = true;
                }
                this.pokerActionPoint++;
                if(this.pokerActionPoint > list.length -1){
                    this.pokerActionPoint = null;
                }
            }else{
                this.pokerActionPoint = null;
            }
        }

    }
};
DDZPokerTip.upPoker = function(pokerNum){
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    var times = 0;
    for (var j = 0; j < pokerRoot.children.length; j++) {
        if(pokerNum == pokerRoot.children[j].getComponent("DDZ_Poker").pokerNum
            && pokerRoot.children[j].y == 0 && times == 0){
            pokerRoot.children[j].y = 20;
            cc.YL.playerOutPokerArr.push(pokerRoot.children[j].getComponent("DDZ_Poker").pokerID);
            times++;
        }
    }
};
DDZPokerTip.clickTipsBtn = function (type, num, list) {

    this.lastPokerType = type; // 牌的类型
    this.lastPokerNum = num;//牌的张数
    this.lastPokerList = cc.YL.DDZTools.SortPoker(list); // 牌的数组
    var tempArr = [];
    for (var i = 0; i < this.lastPokerList.length; i++) {
        tempArr.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(this.lastPokerList[i]).Num);
    }
    this.lastPokerList = cc.YL.DDZTools.SortPoker(tempArr); // 牌的数组
    this.selfActiveNode = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker");
    this.selfHandPokerNode = this.selfActiveNode.getChildByName("HandPoker");
    this.selfHandPokerNodeComp = this.selfHandPokerNode.getComponent("DDZ_PlayerSelfPoker");
    this.selfHandPokerNodeComp.setTouchEvent(true);
    switch (this.lastPokerType) {
        case 13: {
            // 炸弹
            var tipFourCardArr = [];
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipFourCardArr.push({
                        Pokers: [this.fourArr[i], this.fourArr[i], this.fourArr[i], this.fourArr[i]],
                    });
                }
            }
            tipFourCardArr = this.findRocket(tipFourCardArr);
            this.PokerAction(tipFourCardArr);
            break;
        }
        case 12: {
            // 四带两对子
            var tipFourAndTowCardArr = [];
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.findOutCardList(this.lastPokerList, 4)) {
                    var doubleArr = this.findOtherPoker(4, this.fourArr[i]);
                    var tempArr = doubleArr.push(this.fourArr[i], this.fourArr[i], this.fourArr[i], this.fourArr[i]);
                    if (tempArr == 8) {
                        tipFourAndTowCardArr.push({
                            Pokers: doubleArr,
                        });
                    }
                }
            }
            tipFourAndTowCardArr = this.findBoom(tipFourAndTowCardArr);
            tipFourAndTowCardArr = this.findRocket(tipFourAndTowCardArr);
            this.PokerAction(tipFourAndTowCardArr);
            break;
        }
        case 11: {
            // 四带两单张
            var tipFourAndTowCardArr = [];
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.findOutCardList(this.lastPokerList, 4)) {
                    var singleArr = this.findOtherPoker(2, this.fourArr[i]);
                    var tempArr = singleArr.push(this.fourArr[i], this.fourArr[i], this.fourArr[i], this.fourArr[i]);
                    if (tempArr == 6) {
                        tipFourAndTowCardArr.push({
                            Pokers: singleArr,
                        });
                    }
                }
            }
            tipFourAndTowCardArr = this.findBoom(tipFourAndTowCardArr);
            tipFourAndTowCardArr = this.findRocket(tipFourAndTowCardArr);
            this.PokerAction(tipFourAndTowCardArr);
            break;
        }
        case 10: {
            //飞机对子
            var tipFlyWithDoubleCardArr = [];
            for (var i = 0; i < this.flyArr.length; i++) {
                if (this.flyArr[i].min > this.findOutCardList(this.lastPokerList, 3) &&
                    (this.flyArr[i].len * 3 + this.flyArr[i].len * 2 ) == this.lastPokerNum) {
                    var tempArr = [];
                    for (var k = 0; k < this.flyArr[i].len; k++) {
                        tempArr.push(this.flyArr[i].min + k);
                        tempArr.push(this.flyArr[i].min + k);
                        tempArr.push(this.flyArr[i].min + k);
                    }
                    if (tempArr.length == this.flyArr[i].len * 3) {
                        // 还差三个对子
                        var doubleArr = this.findOtherPoker(6, this.flyArr[i].min, this.flyArr[i].max, this.flyArr[i].len);
                        var newTemp = tempArr.concat(doubleArr);
                        if (newTemp.length == this.flyArr[i].len * 3 + this.flyArr[i].len * 2) {
                            tipFlyWithDoubleCardArr.push({
                                Pokers: newTemp,
                            });
                        }
                    }
                }
            }
            tipFlyWithDoubleCardArr = this.findBoom(tipFlyWithDoubleCardArr);
            tipFlyWithDoubleCardArr = this.findRocket(tipFlyWithDoubleCardArr);
            this.PokerAction(tipFlyWithDoubleCardArr);

            break;
        }
        case 9: {
            //飞机单张
            var tipFlyWithOneCardArr = [];
            for (var i = 0; i < this.flyArr.length; i++) {
                if (this.flyArr[i].min > this.findOutCardList(this.lastPokerList, 3)
                    && (this.flyArr[i].len * 3 + this.flyArr[i].len ) == this.lastPokerNum) {
                    var tempArr = [];
                    for (var k = 0; k < this.flyArr[i].len; k++) {
                        tempArr.push(this.flyArr[i].min + k);
                        tempArr.push(this.flyArr[i].min + k);
                        tempArr.push(this.flyArr[i].min + k);
                    }
                    if (tempArr.length == this.flyArr[i].len * 3) {
                        // 还差三个单张
                        var singleArr = this.findOtherPoker(5, this.flyArr[i].min, this.flyArr[i].max, this.flyArr[i].len);
                        var newTemp = tempArr.concat(singleArr);
                        if (newTemp.length == this.flyArr[i].len * 3 + this.flyArr[i].len) {
                            tipFlyWithOneCardArr.push({
                                Pokers: newTemp,
                            });
                        }
                    }
                }
            }
            tipFlyWithOneCardArr = this.findBoom(tipFlyWithOneCardArr);
            tipFlyWithOneCardArr = this.findRocket(tipFlyWithOneCardArr);
            this.PokerAction(tipFlyWithOneCardArr);
            break;
        }
        case 8: {
            var tipFlyCardArr = [];
            for (var i = 0; i < this.flyArr.length; i++) {
                if (this.flyArr[i].min > this.findOutCardList(this.lastPokerList, 3)
                    && this.flyArr[i].len == (this.lastPokerNum / 3)) {
                    var tempArr = [];
                    for (var k = 0; k < this.flyArr[i].len; k++) {
                        tempArr.push(this.flyArr[i].min + k);
                        tempArr.push(this.flyArr[i].min + k);
                        tempArr.push(this.flyArr[i].min + k);
                    }
                    tipFlyCardArr.push({
                        Pokers: tempArr,
                    });
                }
            }
            tipFlyCardArr = this.findBoom(tipFlyCardArr);
            tipFlyCardArr = this.findRocket(tipFlyCardArr);
            this.PokerAction(tipFlyCardArr);

            break;
        }
        case 7: {
            //连对
            var tipDoubleShunziCardArr = [];
            for (var i = 0; i < this.doubleShunZiArr.length; i++) {
                if (this.doubleShunZiArr[i].min > this.lastPokerList[0] && this.doubleShunZiArr[i].len == (this.lastPokerNum / 2)) {
                    var tempArr = [];
                    for (var k = 0; k < this.doubleShunZiArr[i].len; k++) {
                        tempArr.push(this.doubleShunZiArr[i].min + k);
                        tempArr.push(this.doubleShunZiArr[i].min + k);
                    }
                    tipDoubleShunziCardArr.push({
                        Pokers: tempArr,
                    });
                }
            }
            tipDoubleShunziCardArr = this.findBoom(tipDoubleShunziCardArr);
            tipDoubleShunziCardArr = this.findRocket(tipDoubleShunziCardArr);
            this.PokerAction(tipDoubleShunziCardArr);
            break;
        }
        case 6: {
            //顺子
            var tipShunziCardArr = [];
            for (var i = 0; i < this.shunZiArr.length; i++) {
                if (this.shunZiArr[i].min > this.lastPokerList[0] && this.shunZiArr[i].len == this.lastPokerNum) {
                    var tempArr = [];
                    for (var k = 0; k < this.shunZiArr[i].len; k++) {
                        tempArr.push(this.shunZiArr[i].min + k);
                        // tempArr.push(this.shunZiArr[i].min + k);
                    }
                    tipShunziCardArr.push({
                        Pokers: tempArr,
                    });
                }
            }
            tipShunziCardArr = this.findBoom(tipShunziCardArr);
            tipShunziCardArr = this.findRocket(tipShunziCardArr);
            this.PokerAction(tipShunziCardArr);
            break;
        }
        case 5: {
            // 三带二
            var tipThreeAndTwoCardArr = [];
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.findOutCardList(this.lastPokerList, 3)) {
                    var DoubleNumArr = this.findOtherPoker(3, this.threeArr[i]);
                    var OneObj = DoubleNumArr.push(this.threeArr[i], this.threeArr[i], this.threeArr[i]);
                    if (OneObj == 5) {
                        tipThreeAndTwoCardArr.push({
                            Pokers: DoubleNumArr,
                        });
                    }

                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.findOutCardList(this.lastPokerList, 3)) {
                    var DoubleNumArr = this.findOtherPoker(3, this.fourArr[i]);
                    var OneObj = DoubleNumArr.push(this.fourArr[i], this.fourArr[i], this.fourArr[i]);
                    if (OneObj == 5) {
                        tipThreeAndTwoCardArr.push({
                            Pokers: DoubleNumArr,
                        });
                    }

                }
            }
            tipThreeAndTwoCardArr = this.findBoom(tipThreeAndTwoCardArr);
            tipThreeAndTwoCardArr = this.findRocket(tipThreeAndTwoCardArr);
            this.PokerAction(tipThreeAndTwoCardArr);
            break;
        }
        case 4: {
            //三带一
            var tipThreeAndOneCardArr = [];
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.findOutCardList(this.lastPokerList, 3)) {
                    var singleNumArr = this.findOtherPoker(1, this.threeArr[i]);
                    var OneObj = singleNumArr.push(this.threeArr[i], this.threeArr[i], this.threeArr[i]);
                    if (OneObj == 4) {
                        tipThreeAndOneCardArr.push({
                            Pokers: singleNumArr,
                        });
                    }

                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.findOutCardList(this.lastPokerList, 3)) {
                    var singleNumArr = this.findOtherPoker(1, this.fourArr[i]);
                    var OneObj = singleNumArr.push(this.fourArr[i], this.fourArr[i], this.fourArr[i]);
                    if (OneObj == 4) {
                        tipThreeAndOneCardArr.push({
                            Pokers: singleNumArr,
                        });
                    }
                }
            }
            tipThreeAndOneCardArr = this.findBoom(tipThreeAndOneCardArr);
            tipThreeAndOneCardArr = this.findRocket(tipThreeAndOneCardArr);
            this.PokerAction(tipThreeAndOneCardArr);
            break;
        }
        case 3: {
            var tipThreeCardArr = [];
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.lastPokerList[0]) {
                    tipThreeCardArr.push({
                        Pokers: [this.threeArr[i], this.threeArr[i], this.threeArr[i]],
                    });
                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipThreeCardArr.push({
                        Pokers: [this.fourArr[i], this.fourArr[i], this.fourArr[i]],
                    });
                }
            }
            tipThreeCardArr = this.findBoom(tipThreeCardArr);
            tipThreeCardArr = this.findRocket(tipThreeCardArr);
            this.PokerAction(tipThreeCardArr);
            break;
        }
        case 2: {
            // 对子
            var tipDoubleCardArr = [];
            for (var i = 0; i < this.doubleArr.length; i++) {
                if (this.doubleArr[i] > this.lastPokerList[0]) {
                    tipDoubleCardArr.push({
                        Pokers: [this.doubleArr[i], this.doubleArr[i]],
                    });
                }
            }
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.lastPokerList[0]) {
                    tipDoubleCardArr.push({
                        Pokers: [this.threeArr[i], this.threeArr[i]],
                    });
                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    tipDoubleCardArr.push({
                        Pokers: [this.fourArr[i], this.fourArr[i]],
                    });
                }
            }
            tipDoubleCardArr = this.findBoom(tipDoubleCardArr);
            tipDoubleCardArr = this.findRocket(tipDoubleCardArr);
            this.PokerAction(tipDoubleCardArr);
            break;
        }
        case 1: {
            // 单张
            var tipSingleCardArr = [];
            for (var i = 0; i < this.singleArr.length; i++) {
                if (this.singleArr[i] > this.lastPokerList[0]) {
                    tipSingleCardArr.push({
                        Pokers: [this.singleArr[i]],
                    });
                }
            }
            var double = [];
            var three = [];
            var four = [];
            for (var i = 0; i < this.doubleArr.length; i++) {
                if (this.doubleArr[i] > this.lastPokerList[0]) {
                    double.push({
                        Pokers: [this.doubleArr[i]],
                    });
                }
            }
            for (var i = 0; i < this.threeArr.length; i++) {
                if (this.threeArr[i] > this.lastPokerList[0]) {
                    three.push({
                        Pokers: [this.threeArr[i]],
                    });
                }
            }
            for (var i = 0; i < this.fourArr.length; i++) {
                if (this.fourArr[i] > this.lastPokerList[0]) {
                    four.push({
                        Pokers: [this.fourArr[i]],
                    });
                }
            }
            var tempArr = tipSingleCardArr.concat(double);
            var tempArr_1 = tempArr.concat(three);
            var tempArr_2 = tempArr_1.concat(four);
            tipSingleCardArr = tempArr_2;
            tipSingleCardArr = this.findBoom(tipSingleCardArr);
            tipSingleCardArr = this.findRocket(tipSingleCardArr);
            this.PokerAction(tipSingleCardArr);
            break;
        }
        default: {
            cc.YL.err("没有找到对应的牌类型");
        }
    }
};
DDZPokerTip.initPokerNode = function () {
    var pokerRoot = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    cc.YL.playerOutPokerArr = [];
    for (var i = 0; i < pokerRoot.children.length; i++) {
        pokerRoot.children[i].y = 0;
    }
};
DDZPokerTip.findBoom = function (list) {
    for (var i = 0; i < this.fourArr.length; i++) {
        list.push({
            Pokers: [this.fourArr[i], this.fourArr[i], this.fourArr[i], this.fourArr[i]],
        });
    }
    return list;
};
DDZPokerTip.findRocket = function (list) {
    if (this.rocketArr.length == 2) {
        list.push({
            Pokers: [this.rocketArr[0], this.rocketArr[1]],
        });
    }
    return list;
};
DDZPokerTip.findOtherPoker = function (type, notNum_1, notNum_2, len) {
    var list = [];
    switch (type) {
        case 1: {
            //返回一个单张
            var times = 0;
            var arr = this.handPokerListRever;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != notNum_1 && times == 0) {
                    list.push(arr[i]);
                    times++;
                }
            }
            break;
        }
        case 2: {
            //返回两个单张
            var times = 0;
            var arr = this.handPokerListRever;
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != notNum_1 && times < 2) {
                    list.push(arr[i]);
                    times++;
                }
            }
            break;
        }
        case 3: {
            //返回一个对子
            var times = 0;
            var arr = this.ConCatArr();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != notNum_1 && times == 0) {
                    list.push(arr[i]);
                    list.push(arr[i]);
                    times++;
                }
            }
            break;
        }
        case 4: {
            //返回两个对子
            var times = 0;
            var arr = this.ConCatArr();
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != notNum_1 && times < 2) {
                    list.push(arr[i]);
                    list.push(arr[i]);
                    times++;
                }
            }
            break;
        }
        case 5: {
            // 返回飞机专用单张
            var times = 0;
            var arr = this.handPokerListRever;
            for (var i = 0; i < arr.length; i++) {
                if ((arr[i] < notNum_1 || arr[i] > notNum_2) && times < len ) {
                    list.push(arr[i]);
                    times++;
                }
            }
            break;
        }
        case 6: {
            // 返回飞机专用对子
            var times = 0
            var arr = this.ConCatArr();
            for (var i = 0; i < arr.length; i++) {
                if ((arr[i] < notNum_1 || arr[i] > notNum_2) && times < len ) {
                    list.push(arr[i]);
                    list.push(arr[i]);
                    times++;
                }
            }
            break;
        }
    }
    return list;
};
DDZPokerTip.ConCatArr = function () {
    var double = this.doubleArr;
    var three = this.threeArr;
    var four = this.fourArr;
    double = cc.YL.DDZTools.SortPoker(double);
    three = cc.YL.DDZTools.SortPoker(three);
    four = cc.YL.DDZTools.SortPoker(four);
    var tempArr = double.concat(three);
    var tempArr_1 = tempArr.concat(four);
    tempArr_1 = this.zipArr(tempArr_1);
    return tempArr_1;
};
cc.YL.DDZPokerTip = DDZPokerTip;
module.exports = DDZPokerTip;
