(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Player/DDZ_PlayerSelfOutPoker.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a38e9Uw5M1FlI6e5QtbWW1P', 'DDZ_PlayerSelfOutPoker', __filename);
// poker/DDZ/Script/Player/DDZ_PlayerSelfOutPoker.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        outCards: [],
        pokerPre: cc.Prefab
    },

    start: function start() {},

    initOutPoker: function initOutPoker(outcardlist, type) {
        if (outcardlist) {
            this.outCards = outcardlist;
            this.clearOutPoker();
            this.node.setScale(0.58);
            this.updateOutCard(outcardlist, type);
        }
    },
    clearOutPoker: function clearOutPoker() {
        this.node.removeAllChildren();
    },
    _sortPokerArrObj: function _sortPokerArrObj(arr) {
        return arr.sort(function (a, b) {
            return a.Num - b.Num;
        });
    },
    updateOutCard: function updateOutCard(outcardlist, type) {
        switch (type) {
            case 1:
                {
                    // 单张
                    var temp = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                        temp.push(pokerObj);
                    }
                    temp = this._sortPokerArrObj(temp);
                    this.showPokerNode(temp, 0);
                    break;
                }
            case 2:
                {
                    //对子
                    var temp = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                        temp.push(pokerObj);
                    }
                    temp = this._sortPokerArrObj(temp);
                    this.showPokerNode(temp, 0);
                    break;
                }
            case 3:
                {
                    //三不带
                    var temp = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                        temp.push(pokerObj);
                    }
                    temp = this._sortPokerArrObj(temp);
                    this.showPokerNode(temp, 0);
                    break;
                }
            case 4:
                {
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
                    this.showPokerNode(outcardlist, 0);
                    break;
                }
            case 5:
                {
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
                    this.showPokerNode(outcardlist, 0);
                    break;
                }
            case 6:
                {
                    var temp = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                        temp.push(pokerObj);
                    }
                    temp = this._sortPokerArrObj(temp);
                    temp.reverse();
                    this.showPokerNode(temp, 1);
                    // 顺子
                    break;
                }
            case 7:
                {
                    //连对
                    var temp = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                        temp.push(pokerObj);
                    }
                    temp = this._sortPokerArrObj(temp);
                    temp.reverse();
                    this.showPokerNode(temp, 1);
                    break;
                }
            case 8:
                {
                    //飞机不带
                    var temp = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                        temp.push(pokerObj);
                    }
                    temp = this._sortPokerArrObj(temp);
                    this.showPokerNode(temp, 2);
                    break;
                }
            case 9:
                {
                    // 飞机带单张
                    var temp_1 = [];
                    var temp_2 = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var times = 0;
                        for (var j = 0; j < outcardlist.length; j++) {
                            if (cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]).Num == cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[j]).Num) {
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
                    this.showPokerNode(outcardlist, 2);
                    break;
                }
            case 10:
                {
                    //飞机带对子
                    var temp_1 = [];
                    var temp_2 = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var times = 0;
                        for (var j = 0; j < outcardlist.length; j++) {
                            if (cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]).Num == cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[j]).Num) {
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
                    this.showPokerNode(outcardlist, 2);
                    break;
                }
            case 13:
                {
                    //炸弹
                    var temp = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                        temp.push(pokerObj);
                    }
                    temp = this._sortPokerArrObj(temp);
                    this.showPokerNode(temp, 4);
                    break;
                }
            case 11:
                {
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
                    this.showPokerNode(outcardlist, 0);
                    break;
                }
            case 12:
                {
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
                    this.showPokerNode(outcardlist, 0);
                    break;
                }
            case 14:
                {
                    //王炸
                    var temp = [];
                    for (var i = 0; i < outcardlist.length; i++) {
                        var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(outcardlist[i]);
                        temp.push(pokerObj);
                    }
                    temp = this._sortPokerArrObj(temp);
                    this.showPokerNode(temp, 4);
                    break;
                }

        }
    },
    initPoker: function initPoker(pokerObj) {
        var newNode = cc.instantiate(this.pokerPre);
        newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        this.node.addChild(newNode);
        return newNode;
    },
    showPokerNode: function showPokerNode(list, animaType) {
        this.node.opacity = 200;
        var startPosX = (list.length - 1) * -25;
        for (var i = 0; i < list.length; i++) {
            var pokerNode = this.initPoker(list[i]);
            var posX = startPosX + i * 50;
            pokerNode.setPosition(posX, 0);
            pokerNode.setTag(posX);
            if (animaType != 0) {
                this.node.active = false;
            }
            if (i == list.length - 1) {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
            } else {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
            }
            if (cc.YL.loaderID == cc.YL.DDZselfPlayerInfo.userId && i == list.length - 1) {
                pokerNode.getChildByName("OwnerSign").active = true;
            } else {
                pokerNode.getChildByName("OwnerSign").active = false;
            }
        }
        this.node.stopAllActions();
        this.node.active = true;
        var finishaFunc = cc.callFunc(function () {
            this.showSpecialAnim(animaType);
        }.bind(this));
        this.node.runAction(cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 0.9)), cc.scaleTo(0.15, 0.58).easing(cc.easeBackOut()), finishaFunc));
    },
    showSpecialAnim: function showSpecialAnim(animaType) {
        // 顺子 1
        // 连对 1
        // 飞机 2
        // 炸弹 3
        // 王炸 4
        switch (animaType) {
            case 1:
                {
                    var childNodeList = this.node.children;
                    var startPosX = (childNodeList.length - 1) * -25;
                    this.node.active = true;
                    for (var i = 0; i < childNodeList.length; i++) {
                        childNodeList[i].setPositionX(startPosX);
                        childNodeList[i].stopAllActions();
                        childNodeList[i].runAction(cc.moveTo(0.15 + i * 0.02, childNodeList[i].getTag(), 0).easing(cc.easeBackOut()));
                    }
                    break;
                }
            case 2:
                {
                    var childNodeList = this.node.children;
                    var startPosX = (childNodeList.length - 1) * -25;
                    this.node.active = true;
                    for (var i = 0; i < childNodeList.length; i++) {
                        childNodeList[i].setPositionX(startPosX);
                        childNodeList[i].stopAllActions();
                        childNodeList[i].runAction(cc.moveTo(0.15 + i * 0.02, childNodeList[i].getTag(), 0).easing(cc.easeBackOut()));
                    }
                    break;
                }
            case 3:
                {
                    this.node.setScale(2);
                    this.node.stopAllActions();
                    this.node.active = true;
                    this.node.runAction(cc.scaleTo(0.3, 0.58).easing(cc.easeBackOut()));
                    break;
                }
            case 4:
                {
                    this.node.setScale(2);
                    this.node.stopAllActions();
                    this.node.active = true;
                    this.node.runAction(cc.scaleTo(0.3, 0.58).easing(cc.easeBackOut()));
                    break;
                }
            default:
                {}
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=DDZ_PlayerSelfOutPoker.js.map
        