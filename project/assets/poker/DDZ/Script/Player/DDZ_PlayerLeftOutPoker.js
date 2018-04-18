cc.Class({
    extends: cc.Component,

    properties: {
        outCards: [],
        pokerPre: cc.Prefab,
    },

//     UNKNOWN_TYPE = 0; //未知牌型，错误牌型
// DAN_PAI = 1; //单牌
// DUI_ZI = 2; //对子
// SAN_ZHANG = 3; //三不带
// SAN_DAI_YI = 4; //三带单牌
// SAN_DAI_ER = 5; //三带一对
// SHUN_ZI = 6; //顺子
// LIAN_DUI = 7; //连对
// FEI_JI = 8; //飞机不带
// FEI_JI_DAI_DAN = 9; //飞机带单牌
// FEI_JI_DAI_DUI = 10; //飞机带对子
// BOOM = 11; //炸弹
// SI_DAI_ER = 12; //四带二（两张单牌）
// SI_DAI_SI = 13; //四带四（两对）
// SUPER_BOOM = 14; //王炸

    start () {

    },
    initOutPoker: function (outcardlist, type) {
        if(outcardlist) {
            this.outCards = outcardlist;
            this.clearOutPoker();
            this.node.setScale(0.58);
            this.updateOutCard(outcardlist, type);
        }
    },
    clearOutPoker: function () {
        this.node.removeAllChildren();
    },
    _sortPokerArrObj: function (arr) {
        return arr.sort(function (a, b) {
            return a.Num - b.Num
        });

    },
    updateOutCard: function (outcardlist, type) {
        switch (type) {
            case 1: {
                // 单张
                var temp =[];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    temp.push(pokerObj);
                }
                temp = this._sortPokerArrObj(temp);
                this.showPokerNode(temp,0);
                break;
            }
            case 2: {
                //对子
                var temp =[];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    temp.push(pokerObj);
                }
                temp = this._sortPokerArrObj(temp);
                this.showPokerNode(temp,0);
                break;
            }
            case 3: {
                //三不带
                var temp =[];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    temp.push(pokerObj);
                }
                temp = this._sortPokerArrObj(temp);
                this.showPokerNode(temp,0);
                break;
            }
            case 4: {
                // 三带一张
                var temp_1 = [];
                var temp_2 = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    if (pokerObj.Num == cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[0]).Num) {
                        temp_1.push(pokerObj);
                    } else {
                        temp_2.push(pokerObj);
                    }
                }
                temp_1 = this._sortPokerArrObj(temp_1);
                temp_2 = this._sortPokerArrObj(temp_2);
                if (temp_1.length == 3) {
                    outcardlist = temp_1.concat(temp_2);
                } else {
                    outcardlist = temp_2.concat(temp_1);
                }
                this.showPokerNode(outcardlist,0);
                break;
            }
            case 5: {
                // 三带一对
                var temp_1 = [];
                var temp_2 = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    if (pokerObj.Num == cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[0]).Num) {
                        temp_1.push(pokerObj);
                    } else {
                        temp_2.push(pokerObj);
                    }
                }
                temp_1 = this._sortPokerArrObj(temp_1);
                temp_2 = this._sortPokerArrObj(temp_2);
                if (temp_1.length == 3) {
                    outcardlist = temp_1.concat(temp_2);
                } else {
                    outcardlist = temp_2.concat(temp_1);
                }
                this.showPokerNode(outcardlist,0);
                break;
            }
            case 6: {
                var temp = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                   temp.push(pokerObj);
                }
                temp = this._sortPokerArrObj(temp);
                temp.reverse();
                this.showPokerNode(temp,1);
                // 顺子
                break;
            }
            case 7: {
                //连对
                var temp = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    temp.push(pokerObj);
                }
                temp = this._sortPokerArrObj(temp);
                temp.reverse();
                this.showPokerNode(temp,1);
                break;
            }
            case 8: {
                //飞机不带
                var temp = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    temp.push(pokerObj);
                }
                temp = this._sortPokerArrObj(temp);
                this.showPokerNode(temp,2);
                break;
            }
            case 9: {
                // 飞机带单张
                var temp_1 = [];
                var temp_2 = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var times = 0;
                    for (var j = 0; j < outcardlist.length; j++) {
                        if (cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]).Num
                            == cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[j]).Num) {
                            times++;
                        }
                    }
                    if (times == 3) {
                        temp_1.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]));
                    } else {
                        temp_2.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]));
                    }
                }
                temp_1 = this._sortPokerArrObj(temp_1);
                temp_2 = this._sortPokerArrObj(temp_2);
                if (temp_1.length > temp_2.length) {
                    outcardlist = temp_1.concat(temp_2);
                } else {
                    outcardlist = temp_2.concat(temp_1);
                }
                this.showPokerNode(outcardlist,2);
                break;
            }
            case 10: {
                //飞机带对子
                var temp_1 = [];
                var temp_2 = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var times = 0;
                    for (var j = 0; j < outcardlist.length; j++) {
                        if (cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]).Num
                            == cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[j]).Num) {
                            times++;
                        }
                    }
                    if (times == 3) {
                        temp_1.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]));
                    } else {
                        temp_2.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]));
                    }
                }
                temp_1 = this._sortPokerArrObj(temp_1);
                temp_2 = this._sortPokerArrObj(temp_2);
                if (temp_1.length > temp_2.length) {
                    outcardlist = temp_1.concat(temp_2);
                } else {
                    outcardlist = temp_2.concat(temp_1);
                }
                this.showPokerNode(outcardlist,2);
                break;
            }
            case 13: {
                //炸弹
                var temp =[];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    temp.push(pokerObj);
                }
                temp = this._sortPokerArrObj(temp);
                this.showPokerNode(temp,4);
                break;
            }
            case 11: {
                //四带两单张
                var temp_1 = [];
                var temp_2 = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    if (pokerObj.Num == cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[0]).Num) {
                        temp_1.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]));
                    } else {
                        temp_2.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]));
                    }
                }
                temp_1 = this._sortPokerArrObj(temp_1);
                temp_2 = this._sortPokerArrObj(temp_2);
                if (temp_1.length == 4) {
                    outcardlist = temp_1.concat(temp_2);
                } else {
                    outcardlist = temp_2.concat(temp_1);
                }
                this.showPokerNode(outcardlist,0);
                break;
            }
            case 12: {
                //四带两对子
                var temp_1 = [];
                var temp_2 = [];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    if (pokerObj.Num == cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[0]).Num) {
                        temp_1.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]));
                    } else {
                        temp_2.push(cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]));
                    }
                }
                temp_1 = this._sortPokerArrObj(temp_1);
                temp_2 = this._sortPokerArrObj(temp_2);
                if (temp_1.length == 4) {
                    outcardlist = temp_1.concat(temp_2);
                } else {
                    outcardlist = temp_2.concat(temp_1);
                }
                this.showPokerNode(outcardlist,0);
                break;
            }
            case 14: {
                //王炸
                var temp =[];
                for (var i = 0; i < outcardlist.length; i++) {
                    var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                    temp.push(pokerObj);
                }
                temp = this._sortPokerArrObj(temp);
                this.showPokerNode(temp,4);
                break;
            }

        }
    },
    initPoker: function (pokerObj) {
        // var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(ID);
        var newNode = cc.instantiate(this.pokerPre);
        newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        this.node.addChild(newNode);
        return newNode;
    },
    showPokerNode: function (list,animaType) {
        this.node.opacity = 200;
        for (var i = 0; i < list.length; i++) {
            var pokerNode = this.initPoker(list[i]);
            var posX = i * 50;
            pokerNode.setPosition(posX, 0);
            pokerNode.setTag(posX);
            if(i == (list.length -1 )){
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
            }else{
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
            }
            if(cc.YL.loaderID == cc.YL.DDZleftPlayerInfo.userId
            && i == (list.length -1 )){
                pokerNode.getChildByName("OwnerSign").active = true;
            }else{
                pokerNode.getChildByName("OwnerSign").active = false;
            }
            if (animaType != 0) {
                this.node.active = false;
            }
        }
        this.node.stopAllActions();
        this.node.active = true;
        var finishaFunc = cc.callFunc(function () {
            this.showSpecialAnim(animaType);
        }.bind(this));
        this.node.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2,255),cc.scaleTo(0.2,0.9)),cc.scaleTo(0.15,0.58).easing(cc.easeBackOut()),finishaFunc));

    },
    showSpecialAnim: function (animaType) {
        // 顺子 1
        // 连对 1
        // 飞机 2
        // 炸弹 3
        // 王炸 4
        switch (animaType) {
            case 1: {
                var childNodeList = this.node.children;
                this.node.active = true;
                for (var i = 0; i < childNodeList.length; i++) {
                    childNodeList[i].setPositionX(0);
                    childNodeList[i].stopAllActions();
                    childNodeList[i].runAction(cc.moveTo(0.15 + i * 0.02, childNodeList[i].getTag(), 0).easing(cc.easeBackOut()));
                }
                break;
            }
            case 2: {
                var childNodeList = this.node.children;
                this.node.active = true;
                for (var i = 0; i < childNodeList.length; i++) {
                    childNodeList[i].setPositionX(0);
                    childNodeList[i].stopAllActions();
                    childNodeList[i].runAction(cc.moveTo(0.15 + i * 0.02, childNodeList[i].getTag(), 0).easing(cc.easeBackOut()));
                }
                break;
            }
            case 3: {
                this.node.setScale(2);
                this.node.stopAllActions();
                this.node.active = true;
                this.node.runAction(cc.scaleTo(0.3, 0.58).easing(cc.easeBackOut()));
                break;
            }
            case 4: {
                this.node.setScale(2);
                this.node.stopAllActions();
                this.node.active = true;
                this.node.runAction(cc.scaleTo(0.3, 0.58).easing(cc.easeBackOut()));
                break;
            }
            default: {

            }
        }


    },
});
