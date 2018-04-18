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

        PokerPrefab: cc.Prefab,
        oneGameOverNode: cc.Prefab,


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //JSON.parse(fun.base64.decode(data));
        fun.event.dispatch('Zhuanquan', false);
        this.replayList = [];
        if (cc.YL.DDZReplayData) {
            for (var i = 0; i < cc.YL.DDZReplayData.length; i++) {
                var item = JSON.parse(fun.base64.decode(cc.YL.DDZReplayData[i].Data));
                this.replayList.push(item);
            }
        }
        if(this.replayList.length == 2){
            this.initUIByFirstData(this.replayList[0]);
            this.showOneGameOver(this.replayList[1]);
            this.listPoint = 1;
        }else{
            this.initUIByFirstData(this.replayList[0]);
            // this.initUIBySecondData(this.replayList[1]);
            this.listPoint = 0;
        }

    },
    onDestroy(){
        cc.YL.DDZReplayData = null;
        cc.YL.DDZselfPlayerInfo = null;
        cc.YL.DDZleftPlayerInfo = null;
        cc.YL.DDZrightPlayerInfo = null;
        this.unschedule(this._playList);
    },
    _sortPlayerInfo: function (arr) {
        return arr.sort(function (a, b) {
            return a.index - b.index
        });
    },
    initRuleInfo: function (data) {
        var payTypeArr = ["", "平均支付", "冠军支付", "房主支付"];
        var ruleList = [payTypeArr[data.payMode], "封顶:" + data.boomLimit];
        data.canSanDaiDui ?
            ruleList.push("可三带一对") :
            null;
        data.canSiDaiDui ?
            ruleList.push("可四带两对") :
            null;
        data.canDouble ?
            ruleList.push("可加倍") :
            null;
        for (var i = 0; i < ruleList.length; i++) {
            var num = parseInt(i + 1);
            var ruleInfoNode = cc.find("DDZ_Replay/ReplayNode/RuleInfo/BG");
            ruleInfoNode.getChildByName("R" + num).getComponent(cc.Label).string = ruleList[i].toString();
        }


    },
    initUIByFirstData: function (data) {
        // 根据第一条数据来修改UI
        this.initDeskInfo(data.deskInfo);
        if(data.deskInfo.roomInfo){
            this.initRuleInfo(data.deskInfo.roomInfo);
        }
        var playerInfoList = data.playersInfo;
        playerInfoList = this._sortPlayerInfo(playerInfoList);
        for (var i = 0; i < playerInfoList.length; i++) {
            if (fun.db.getData('UserInfo').UserId == playerInfoList[i].userId) {
                this.initSelfInfo(playerInfoList[i]);
                if (i == 0) {
                    this.initRightInfo(playerInfoList[1]);
                    this.initLeftInfo(playerInfoList[2]);
                } else if (i == 1) {
                    this.initRightInfo(playerInfoList[2]);
                    this.initLeftInfo(playerInfoList[0]);
                } else if (i == 2) {
                    this.initRightInfo(playerInfoList[0]);
                    this.initLeftInfo(playerInfoList[1]);
                }
            }
        }
    },
    initDeskInfo: function (deskInfo) {

        this.node.getChildByName("BtnNode").getChildByName("RoomInfo").getChildByName("RoomNum").getComponent(cc.Label).string
            = "房号: " + deskInfo.password +"  "+ deskInfo.currentRound + "/"
            + deskInfo.totalRound + "局";
        this.initDIPai(deskInfo.diPais, deskInfo.diFen);

    },
    initDIPai: function (dipais, difen) {
        //底牌，低分
        this.node.getChildByName("BtnNode").getChildByName("GameInfo").getChildByName("Difen").getChildByName("Num").getComponent(cc.Label).string = difen;
        var diPaiNode = this.node.getChildByName("BtnNode").getChildByName("DiPaiNode");
        dipais = cc.YL.DDZTools.SortPoker(dipais);
        for (var i = 0; i < dipais.length; i++) {
            var pokerNode = cc.instantiate(this.PokerPrefab);
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(dipais[i]);
            diPaiNode.addChild(pokerNode);
            var posArr = [cc.p(-41, 0), cc.p(0, 0), cc.p(41, 0)];
            pokerNode.setPosition(posArr[i]);
            pokerNode.setScale(0.25);
            pokerNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        }

    },
    initSelfInfo: function (msg) {
        var selfNode = this.node.getChildByName("SelfPlayerInfo");
        this.selfID = msg.userId;
        this.initPlayerNode(selfNode, msg);
        this.initSelfHandPoker(msg.handPokers, msg.isDiZhu);
        this.selfIsDiZhu = msg.isDiZhu;
        cc.YL.DDZselfPlayerInfo = {
            headUrl:msg.headUrl,
            nickName: msg.nickName,
            userId : msg.userId,
        };
    },
    initLeftInfo: function (msg) {
        //  左边玩家信息
        var leftNode = this.node.getChildByName("LeftPlayerInfo");
        this.leftID = msg.userId;
        this.initPlayerNode(leftNode, msg);
        this.initLeftHandPoker(msg.handPokers, msg.isDiZhu);
        this.leftIsDiZhu = msg.isDiZhu;
        cc.YL.DDZleftPlayerInfo = {
            headUrl:msg.headUrl,
            nickName: msg.nickName,
            userId : msg.userId,
        };
    },
    initRightInfo: function (msg) {
        //右边玩家信息
        var rightNode = this.node.getChildByName("RightPlayerInfo");
        this.rightID = msg.userId;
        this.initPlayerNode(rightNode, msg);
        this.initRightHandPoker(msg.handPokers, msg.isDiZhu);
        this.rightIsDiZhu = msg.isDiZhu;
        cc.YL.DDZrightPlayerInfo = {
            headUrl:msg.headUrl,
            nickName: msg.nickName,
            userId : msg.userId,
        };

    },
    initPlayerNode: function (node, msg) {
        node.getChildByName("ID").getComponent(cc.Label).string = msg.userId;
        node.getChildByName("Name").getComponent(cc.Label).string = msg.nickName;
        node.getChildByName("Num").getComponent(cc.Label).string = msg.score;
        fun.utils.loadUrlRes(msg.headUrl, node.getChildByName("HeadNode"));// 头像
        if (msg.isJiaBei == true) {
            node.getChildByName("Rate").active = true;
        }
        if (msg.isDiZhu == true) {
            node.getChildByName("DiZhuIcon").active = true;
        }
    },

    /**************************静态数据****************************/





    /**************************动态数据****************************/
    initUIBySecondData: function (data) {

        for (var i = 0; i < data.playersInfo.length; i++) {
            if (data.playersInfo[i].userId == this.selfID) {
                this.node.getChildByName("BtnNode").getChildByName("GameInfo").getChildByName("Beishu").getChildByName("Num").getComponent(cc.Label).string = data.playersInfo[i].rate;
                this.initSelfOutPoker(data.playersInfo[i].outPais, data.playersInfo[i].handPokersCount,data.playersInfo[i].isPass);
            } else if (data.playersInfo[i].userId == this.rightID) {
                this.initRightOutPoker(data.playersInfo[i].outPais, data.playersInfo[i].handPokersCount,data.playersInfo[i].isPass);
            } else if (data.playersInfo[i].userId == this.leftID) {
                this.initLeftOutPoker(data.playersInfo[i].outPais, data.playersInfo[i].handPokersCount,data.playersInfo[i].isPass);
            }
        }

    },
    initSelfHandPoker: function (list, isDiZhu) {
        //玩家手牌
        this.node.getChildByName("SelfPlayerPoker").getChildByName("HandPoker").removeAllChildren();
        this.selfhandPokerIDs = list;
        this.selfPlayerHandPoker = [];
        this.selfhandPokerIDs = cc.YL.DDZTools.SortPoker(this.selfhandPokerIDs);
        for (var i = 0; i < this.selfhandPokerIDs.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(this.selfhandPokerIDs[i]);
            this.selfPlayerHandPoker.push(pokerObj);
        }
        this.selfPlayerHandPoker = this._sortPokerArrObj(this.selfPlayerHandPoker);
        this.selfPlayerHandPoker.reverse();
        for (var i = 0; i < this.selfPlayerHandPoker.length; i++) {
            var pokerNode = cc.instantiate(this.PokerPrefab);
            pokerNode.getComponent("DDZ_Poker").initPoker(this.selfPlayerHandPoker[i]);
            pokerNode.setScale(1);
            pokerNode.setPositionY(0);
            pokerNode.setTag(i);

            if (i == (this.selfPlayerHandPoker.length - 1 )) {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
            } else {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
            }
            if (isDiZhu == true
                && i == (this.selfPlayerHandPoker.length - 1 )) {
                pokerNode.getChildByName("OwnerSign").active = true;
            } else {
                pokerNode.getChildByName("OwnerSign").active = false;
            }
            this.node.getChildByName("SelfPlayerPoker").getChildByName("HandPoker").addChild(pokerNode);
        }
    },
    initLeftHandPoker: function (list, isDiZhu) {
        this.node.getChildByName("LeftPlayerPoker").getChildByName("HandPoker").removeAllChildren();
        this.lefthandPokerIDs = list;
        this.leftPlayerHandPoker = [];
        this.lefthandPokerIDs = cc.YL.DDZTools.SortPoker(this.lefthandPokerIDs);
        for (var i = 0; i < this.lefthandPokerIDs.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(this.lefthandPokerIDs[i]);
            this.leftPlayerHandPoker.push(pokerObj);
        }
        this.leftPlayerHandPoker = this._sortPokerArrObj(this.leftPlayerHandPoker);
        this.leftPlayerHandPoker.reverse();
        this.node.getChildByName("LeftPlayerPoker").getChildByName("Num").getComponent(cc.Label).string = this.leftPlayerHandPoker.length;
        for (var i = 0; i < this.leftPlayerHandPoker.length; i++) {
            var pokerNode = cc.instantiate(this.PokerPrefab);
            pokerNode.getComponent("DDZ_Poker").initPoker(this.leftPlayerHandPoker[i]);
            pokerNode.setScale(1);
            pokerNode.setPositionY(0);
            pokerNode.setTag(i);
            pokerNode.setPositionX(100 + i * 50);
            this.node.getChildByName("LeftPlayerPoker").getChildByName("HandPoker").width = 200 + i * 50;
            if (i == (this.leftPlayerHandPoker.length - 1 )) {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
            } else {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
            }
            if (isDiZhu == true
                && i == (this.leftPlayerHandPoker.length - 1 )) {
                pokerNode.getChildByName("OwnerSign").active = true;
            } else {
                pokerNode.getChildByName("OwnerSign").active = false;
            }
            this.node.getChildByName("LeftPlayerPoker").getChildByName("HandPoker").addChild(pokerNode);
        }
        //左边玩家手牌
    },
    initRightHandPoker: function (list, isDiZhu) {
        this.node.getChildByName("RightPlayerPoker").getChildByName("HandPoker").removeAllChildren();
        this.righthandPokerIDs = list;
        this.rightPlayerHandPoker = [];
        this.righthandPokerIDs = cc.YL.DDZTools.SortPoker(this.righthandPokerIDs);
        for (var i = 0; i < this.righthandPokerIDs.length; i++) {
            var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(this.righthandPokerIDs[i]);
            this.rightPlayerHandPoker.push(pokerObj);
        }
        this.rightPlayerHandPoker = this._sortPokerArrObj(this.rightPlayerHandPoker);
        // this.rightPlayerHandPoker.reverse();
        this.node.getChildByName("RightPlayerPoker").getChildByName("Num").getComponent(cc.Label).string = this.rightPlayerHandPoker.length;
        for (var i = 0; i < this.rightPlayerHandPoker.length; i++) {
            var pokerNode = cc.instantiate(this.PokerPrefab);
            pokerNode.getComponent("DDZ_Poker").initPoker(this.rightPlayerHandPoker[i]);
            pokerNode.setScale(1);
            pokerNode.setPositionY(0);
            pokerNode.setTag(i);
            pokerNode.setPositionX(-100 - i * 50);
            pokerNode.zIndex = this.rightPlayerHandPoker.length - i;
            this.node.getChildByName("RightPlayerPoker").getChildByName("HandPoker").width = 200 + i * 50;
            if (i == 0) {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
            } else {
                pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
            }
            if (isDiZhu == true
                && i == 0) {
                pokerNode.getChildByName("OwnerSign").active = true;
            } else {
                pokerNode.getChildByName("OwnerSign").active = false;
            }
            this.node.getChildByName("RightPlayerPoker").getChildByName("HandPoker").addChild(pokerNode);
        }
        //右边玩家手牌
    },
    initSelfOutPoker: function (list, num,isPass) {
        if(list){
            //玩家出的牌
            var fatherNode =  this.node.getChildByName("SelfPlayerPoker").getChildByName("OutPoker");
            fatherNode.removeAllChildren();
            this.node.getChildByName("SelfPlayerPoker").getChildByName("word").active = false;
            for (var j = 0; j < list.length; j++) {
                for (var i = 0; i < this.selfhandPokerIDs.length; i++) {
                    if (list[j] == this.selfhandPokerIDs[i]) {
                        this.selfhandPokerIDs.splice(i, 1);
                        break;
                    }
                }
            }
            this.initSelfHandPoker(this.selfhandPokerIDs, this.selfIsDiZhu);
            var temp = [];
            for (var i = 0; i < list.length; i++) {
                var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(list[i]);
                temp.push(pokerObj);
            }
            temp = this._sortPokerArrObj(temp);
            temp = temp.reverse();
            var startPosX = (temp.length - 1) * (-25);
            for (var i = 0; i < temp.length; i++) {
                var pokerNode = this.initPoker(temp[i]);
                fatherNode.addChild(pokerNode);
                var posX = startPosX + i * 50;
                pokerNode.setPosition(posX, 0);
                pokerNode.setTag(posX);
                if (i == (temp.length - 1 )) {
                    pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
                } else {
                    pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
                }
                if (this.selfIsDiZhu == true
                    && i == (temp.length - 1 )) {
                    pokerNode.getChildByName("OwnerSign").active = true;
                } else {
                    pokerNode.getChildByName("OwnerSign").active = false;
                }
            }
        }else if (isPass == true){
            var fatherNode =  this.node.getChildByName("SelfPlayerPoker").getChildByName("OutPoker");
            fatherNode.removeAllChildren();
            this.node.getChildByName("SelfPlayerPoker").getChildByName("word").active = false;
            setTimeout(function(){
                this.node.getChildByName("SelfPlayerPoker").getChildByName("word").active = true;
            }.bind(this),100);

        }

    },
    initLeftOutPoker: function (list, num,isPass) {
        //左边玩家出的牌
        this.node.getChildByName("LeftPlayerPoker").getChildByName("Num").getComponent(cc.Label).string = num;

        if(list) {
            var fatherNode = this.node.getChildByName("LeftPlayerPoker").getChildByName("OutPoker");
            fatherNode.removeAllChildren();
            this.node.getChildByName("LeftPlayerPoker").getChildByName("word").active = false;
            for (var j = 0; j < list.length; j++) {
                for (var i = 0; i < this.lefthandPokerIDs.length; i++) {
                    if (list[j] == this.lefthandPokerIDs[i]) {
                        this.lefthandPokerIDs.splice(i, 1);
                        break;
                    }
                }
            }
            this.initLeftHandPoker(this.lefthandPokerIDs, this.leftIsDiZhu);
            var temp = [];
            for (var i = 0; i < list.length; i++) {
                var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(list[i]);
                temp.push(pokerObj);
            }
            temp = this._sortPokerArrObj(temp);
            temp = temp.reverse();
            for (var i = 0; i < temp.length; i++) {
                var pokerNode = this.initPoker(temp[i]);
                fatherNode.addChild(pokerNode);
                var posX = i * 50;
                pokerNode.setPosition(posX, 0);
                pokerNode.setTag(posX);
                if (i == (temp.length - 1 )) {
                    pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
                } else {
                    pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
                }
                if (this.leftIsDiZhu == true
                    && i == (temp.length - 1 )) {
                    pokerNode.getChildByName("OwnerSign").active = true;
                } else {
                    pokerNode.getChildByName("OwnerSign").active = false;
                }

            }
        }else if (isPass == true){
            var fatherNode = this.node.getChildByName("LeftPlayerPoker").getChildByName("OutPoker");
            fatherNode.removeAllChildren();
            this.node.getChildByName("LeftPlayerPoker").getChildByName("word").active = false;
            setTimeout(function(){
                this.node.getChildByName("LeftPlayerPoker").getChildByName("word").active = true;
            }.bind(this),100);
        }
    },
    initRightOutPoker: function (list, num,isPass) {
        //右边玩家出的牌
        this.node.getChildByName("RightPlayerPoker").getChildByName("Num").getComponent(cc.Label).string = num;

        if(list) {
            var fatherNode =  this.node.getChildByName("RightPlayerPoker").getChildByName("OutPoker");
            fatherNode.removeAllChildren();
            this.node.getChildByName("RightPlayerPoker").getChildByName("word").active = false;
            for (var j = 0; j < list.length; j++) {
                for (var i = 0; i < this.righthandPokerIDs.length; i++) {
                    if (list[j] == this.righthandPokerIDs[i]) {
                        this.righthandPokerIDs.splice(i, 1);
                        break;
                    }
                }
            }
            this.initRightHandPoker(this.righthandPokerIDs, this.rightIsDiZhu);
            var temp = [];
            for (var i = 0; i < list.length; i++) {
                var pokerObj = cc.YL.cardtypeArrTrans.TransPokertypeArr(list[i]);
                temp.push(pokerObj);
            }
            temp = this._sortPokerArrObj(temp);
            // temp = temp.reverse();
            for (var i = 0; i < temp.length; i++) {
                var pokerNode = this.initPoker(temp[i]);
                fatherNode.addChild(pokerNode);
                var posX = -(i * 50);
                pokerNode.setPosition(posX, 0);
                pokerNode.zIndex = temp.length - i;
                pokerNode.setTag(posX);
                if (i == 0) {
                    pokerNode.getChildByName("Front").getChildByName("typeBig").active = true;
                } else {
                    pokerNode.getChildByName("Front").getChildByName("typeBig").active = false;
                }
                if (this.rightIsDiZhu == true
                    && i == 0) {
                    pokerNode.getChildByName("OwnerSign").active = true;
                } else {
                    pokerNode.getChildByName("OwnerSign").active = false;
                }

            }
        }else if (isPass == true){
            var fatherNode =  this.node.getChildByName("RightPlayerPoker").getChildByName("OutPoker");
            fatherNode.removeAllChildren();
            this.node.getChildByName("RightPlayerPoker").getChildByName("word").active = false;
            setTimeout(function(){
                this.node.getChildByName("RightPlayerPoker").getChildByName("word").active = true;
            }.bind(this),100);
        }
    },
    initPoker: function (pokerObj) {
        var newNode = cc.instantiate(this.PokerPrefab);
        newNode.getComponent("DDZ_Poker").initPoker(pokerObj);
        return newNode;
    },
    _sortPokerArrObj: function (arr) {
        return arr.sort(function (a, b) {
            return a.Num - b.Num
        });

    },
    _playList: function(){
        if(this.listPoint == this.replayList.length - 2){
            // end
            this.unschedule(this._playList);
            this.showOneGameOver(this.replayList[this.replayList.length - 1]);
        }else{
            this.initUIBySecondData(this.replayList[this.listPoint+1]);
        }
        this.listPoint++;
    },
    sechudlePlay: function(){
        this.schedule(this._playList, this.playTime);
    },
    showOneGameOver: function (data) {
        var oneGameOverNode = this.node.getChildByName("DDZ_OneGameOver") ?
            this.node.getChildByName("DDZ_OneGameOver") :
            cc.instantiate(this.oneGameOverNode);
        this.node.getChildByName("DDZ_OneGameOver") ?
            this.node.getChildByName("DDZ_OneGameOver").active = true :
            this.node.addChild(oneGameOverNode, 100);
        oneGameOverNode.getComponent("DDZ_OneGameOver").initNodeForSimple(data,true);
    },
    /**************************按钮事件****************************/
    onClickLeave: function(event){
        this.unschedule(this._playList);
        event.target.active = false;
        cc.director.loadScene("hall");
    },
    onStopClick: function(){
        this.unschedule(this._playList);
        this.node.getChildByName("BtnNode").getChildByName("Stop").active = false;
        this.node.getChildByName("BtnNode").getChildByName("Play").active = true;
    },
    onPlayClick: function(){
        if(this.replayList.length > 2){
            this.playTime = 1;
            this.sechudlePlay();
            this.node.getChildByName("BtnNode").getChildByName("Stop").active = true;
            this.node.getChildByName("BtnNode").getChildByName("Play").active = false;
        }
    },
    onDoublePlayClick: function(){
        var rateLab = cc.find("DDZ_Replay/ReplayNode/BtnNode/Rate");
        if( this.playTime == 1){
            this.playTime = 0.5;
            rateLab.getComponent(cc.Label).string = "X2";
        }else if( this.playTime == 0.5){
            this.playTime = 0.25;
            rateLab.getComponent(cc.Label).string = "X4";
        }else if( this.playTime == 0.25){
            this.playTime = 1;
            rateLab.getComponent(cc.Label).string = "X1";
        }
        this.unschedule(this._playList);
        this.schedule(this._playList, this.playTime);

    },
    onClickRule: function (event) {
        cc.YL.log("规则按钮");
        var ruleInfoNode = cc.find("DDZ_Replay/ReplayNode/RuleInfo/BG");
        ruleInfoNode.parent.stopAllActions();
        ruleInfoNode.parent.setPosition(-1334, 0);
        ruleInfoNode.parent.runAction(cc.moveTo(0.1, cc.p(0, 0)));
        event.target.active = false;


    },
    onClickCloseRule: function () {
        var ruleInfoNode = cc.find("DDZ_Replay/ReplayNode/RuleInfo/BG");
        cc.find("DDZ_Replay/ReplayNode/BtnNode/Rule").active = true;
        ruleInfoNode.parent.stopAllActions();
        ruleInfoNode.parent.setPosition(0, 0);
        ruleInfoNode.parent.runAction(cc.moveTo(0.1, cc.p(-1334, 0)));
    },

});
