// var utils      = require("utils");
var GameDefine = require("mjGameDefine");
var gameManager= require("mjGameManager");
////var Audio.      = require("Audio");
var mjDataMgr = require("mjDataMgr");
var log        = cc.log;
// var FromPhone  = require("FromPhone");
var mjPai      = require("mjPai");



cc.Class({
    extends: cc.Component,

    properties: {
        endRoundN   : cc.Node,
        singleRoundN: cc.Node,
        totalRoundN : cc.Node,
        paiPrefab   : cc.Prefab,
        btnContiuneN: cc.Node,
        timeL       : cc.Label,
        sRoomNumL   : cc.Label,
        tRoomNumL   : cc.Label,
        singleShareN: cc.Node,
        totalShareN : cc.Node,
        gameNameL   : cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.initDirectData();
        this.initSingleReport();
        this.initTotalReporte();
        this.endRoundN.active    = false;
        this.singleRoundN.active = false;
        this.totalRoundN.active  = false;
        var roomID            = mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
        this.sRoomNumL.string = roomID;
        this.tRoomNumL.string = roomID;
        this.gameNameL.string =  mjDataMgr.get("CfgData").gameName;
        this.curPaiScale      = 0.8;
        this.singleShareN.active = !(fun.gameCfg.releaseType === gameConst.releaseType.apple);
        this.totalShareN.active = !(fun.gameCfg.releaseType === gameConst.releaseType.apple);
        this.animation = this.endRoundN.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    initDirectData : function(){
        var DirectType     = GameDefine.DIRECTION_TYPE;
        var directNodeName = {};
        directNodeName[0] = {nodeName :"dong", localText : "东风"};
        directNodeName[1] = {nodeName :"nan", localText : "南风"};
        directNodeName[2] = {nodeName :"xi", localText : "西风"};
        directNodeName[3] = {nodeName :"bei", localText : "北风"};
        this.directNodeName             = directNodeName;
    },

    initTotalReporte : function(){
        var self = this;
        this.totalRoundN.refreshData = function(data){
            var timeL      = self.totalRoundN.getChildByName("time").getChildByName("content").getComponent(cc.Label);
            timeL.string   = fun.utils.getCurTime();
            for(let i=0;i<4;i++){
                 self.totalRoundN.getChildByName("player_"+i).active = false;
            }
            let nodeIndex = -1;
            for(let k in  data.players){
                nodeIndex += 1;
                var itemData      = data.players[k];
                var playerNode    = self.totalRoundN.getChildByName("player_"+nodeIndex);
                playerNode.active = true;
                var winerN        = playerNode.getChildByName("winner");
                var normalN       = playerNode.getChildByName("normal")
                // 2018/3/5 美术修改，个人觉得比以前丑，可能还要修改，先保留之前的吧
                // itemData.playerData.isSelfPlayed = true;
                var isSelfPlayed = itemData.playerData.isSelfPlayed;
                self.setPlayerInfo(winerN, itemData.playerData);
                self.setPlayerInfo(normalN, itemData.playerData);
                winerN.active = itemData.isBigWiner;
                normalN.active = !itemData.isBigWiner;

                var detailN = playerNode.getChildByName("detail")
                detailN.children.forEach(function(item, index){
                    item.active = (index < itemData.detail.length);
                })
                for(let k = 0; k<itemData.detail.length; k++){
                    let itemNode    = detailN.getChildByName("item_"+k);
                    var nameL       = itemNode.getChildByName("name").getComponent(cc.Label);
                    var contentN    = itemNode.getChildByName("content");
                    var contentL    = contentN.getComponent(cc.Label);
                    nameL.string    = itemData.detail[k].name;
                    contentL.string = itemData.detail[k].value;
                    contentN.color  = isSelfPlayed ? new cc.Color(233, 39, 19) : new cc.Color(147, 50, 40);
                }
                var scoreN          = playerNode.getChildByName("totalScore");
                var scoreAddNode    = scoreN.getChildByName("score_add");
                var scoreRedNode    = scoreN.getChildByName("score_red");
                scoreAddNode.active = itemData.hasWin;
                scoreRedNode.active = !itemData.hasWin;
                scoreAddNode.getComponent(cc.Label).string = itemData.winCount;
                scoreRedNode.getComponent(cc.Label).string = itemData.winCount;
                
                var cardN     = playerNode.getChildByName("card");
                var leftL     = cardN.getChildByName("left").getComponent(cc.Label);
                var speedL    = cardN.getChildByName("speed").getComponent(cc.Label);
                leftL.string  = itemData.Left;
                speedL.string = itemData.Spend;
                // if(winerN.isBigWiner){
                //     var animanager = winerN.getComponent(cc.Animation);
                //     animanager.playAdditive("bigwiner");
                // }
            }
            self.resultVoice = data.meIsWiner ? "win.mp3" : "fail.mp3";
            self.checkEndMusic();
        }
    },

    initBtnContiune : function(){
        var gameReplayMgr = require("mjReplayMgr");
        var disName = "继 续";
        if(!this.isCanContinue()){
            disName = "总结算"
        }
        if(gameReplayMgr.isReplayPai()){
            disName = "退 出"
        }
        var content = this.btnContiuneN.getChildByName("content");
        content.getComponent(cc.Label).string = disName;
    },

    initSingleReport : function(){
        var self = this;
        this.singleRoundN.refreshData = function(data){
            self.timeL.string = fun.utils.getCurTime();
            self.setSingleWin(self.singleRoundN, data);
            for(let k = 0; k < 4; k++){
                let playerNode    = self.singleRoundN.getChildByName("player_"+k);
                let itemData      = data[k];
                playerNode.active = (itemData);
                if(itemData){
                    let paiListN    = playerNode.getChildByName("paiList");
                    let fanPaiListN = playerNode.getChildByName("fanList");
                    let dirNode     = playerNode.getChildByName("direct");
                    self.setPlayerInfo(playerNode, itemData.playerData, true)
                    self.setDirectData(dirNode, itemData.player);
                    self.setFanAndHuCount(playerNode, itemData);
                    self.setHuCountData(playerNode, itemData);
                    self.setPaiData(paiListN, itemData);
                    self.setPaiFengScore(playerNode, itemData); 
                    self.setReportTag(playerNode, itemData);
                    self.setFanPaiList(fanPaiListN, itemData);
                    playerNode.getChildByName("byTips").active = itemData.isby;
                }
               
            }            
        }
        this.singleRoundN.cleanData = function(){
             for(let i= 0; i < 4; i++){
                let playerNode = self.singleRoundN.getChildByName("player_"+i);
                let paiListN   = playerNode.getChildByName("paiList");
                paiListN.removeAllChildren();
             }
        }
    },

    setSingleWin (singleRoundN, data){
        var titleN    = singleRoundN.getChildByName("title");
        var winN      = titleN.getChildByName("win")
        var faileN    = titleN.getChildByName("fail")
        faileN.active = !data.meIsWiner;
        winN.active   = data.meIsWiner; //2018/3/5 美术决定不显示赢家ui
    },

    //player base info, icon/name/direction
    setPlayerInfo : function(playerNode, playerData, hasMore){
        let iconN = playerNode.getChildByName("icon");
        fun.utils.loadUrlRes(playerData.Icon, iconN);
        let nameN = playerNode.getChildByName("name");
       
        nameN.getComponent(cc.Label).string = playerData.showName;
        if(hasMore){
            let name1N = playerNode.getChildByName("name1");
            name1N.getComponent(cc.Label).string   = playerData.showName;
            nameN.active                           = !playerData.isSelfPlayed
            name1N.active                          = playerData.isSelfPlayed
            iconN.getChildByName("border").active  = !playerData.isSelfPlayed
            iconN.getChildByName("border1").active = playerData.isSelfPlayed
        }
        let idN = playerNode.getChildByName("id");
        if(idN){
            idN.getComponent(cc.Label).string = "ID:" + playerData.UserId;
        }
        playerNode.getChildByName("bg1").active = playerData.isSelfPlayed;//true;
        playerNode.getChildByName("bg2").active = !playerData.isSelfPlayed;//false;
    },

    //hupai  dianpao  baoyuan lazi
    setReportTag : function(playerNode, data){
        var resultTagN = playerNode.getChildByName("resultTag");
        resultTagN.getChildByName("hu").active   = data.ishu;
        resultTagN.getChildByName("lazi").active = data.islz;
        resultTagN.getChildByName("zm").active   = data.iszm;
        resultTagN.getChildByName("by").active   = data.isby;
        resultTagN.getChildByName("dp").active   = (!data.isby && data.isdp)

        playerNode.getChildByName("bgFaile").active = true;//!(data.ishu || data.iszm);
        playerNode.getChildByName("bg_win").active = false;//(data.ishu || data.iszm);
    },

    //fanshu  and hushu
    setFanAndHuCount(playerNode, itemData){
        var fanNode                              = playerNode.getChildByName("fanCount");
        var huNode                               = playerNode.getChildByName("huCount");
        fanNode.getComponent(cc.RichText).string = itemData.fanData;
        huNode.getComponent(cc.RichText).string  = itemData.huData;
    },

    //xiangdui hushu  and  juedui hushu
    setHuCountData : function (playerNode, data) {
        data = data || {};
        let jdHuNode                              = playerNode.getChildByName("totalCount");
        jdHuNode.active                           = !data.islz
        jdHuNode.getComponent(cc.Label).string    = data.jdhs;
        let xdHuNodeAdd                           = playerNode.getChildByName("score_add"); //add 
        let xdHuNodeRed                           = playerNode.getChildByName("score_red");//reduce
        var disXdhs                               = data.xdhs > 0 ? "+" + data.xdhs : data.xdhs;
        xdHuNodeAdd.active                        = data.xdhs > 0;
        xdHuNodeRed.active                        = !(data.xdhs > 0);
        xdHuNodeAdd.getComponent(cc.Label).string = disXdhs
        xdHuNodeRed.getComponent(cc.Label).string = disXdhs
    },

    //set current player direction data
    setDirectData : function(dirNode, player){
        dirNode.children.forEach(function(item){
            item.active = false;
        })
        var nodeName = this.directNodeName[player.dirIndex].nodeName;
        dirNode.getChildByName(nodeName).active = true;
    },

    setFanPaiList : function(fanPaiListN, itemData){
        fanPaiListN.active = (itemData.FanList != undefined);
        if(!itemData.FanList){ return };
        var paiLen       = 0;
        var pengGangHeng = 60 *mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale *  this.curPaiScale ;
        fanPaiListN.removeAllChildren();
        itemData.FanList.forEach(function(pai){
            let paiNode  = cc.instantiate(this.paiPrefab);
            paiNode.getComponent("mjPaiUI").refresh(pai);
            paiNode.setPosition(cc.p(paiLen, 0));
            paiNode.scale = paiNode.scale *  this.curPaiScale;
            fanPaiListN.addChild(paiNode)
            paiLen     += pengGangHeng;
        }.bind(this))
    },

    //set current player pai data
    setPaiData : function(paiListNode, data) {
        var player        = data.player;
        var pengGangPai   = player.paiDataObj.pengGangPai;
        var gameReplayMgr = require("mjReplayMgr");
        var shouPai       = data.shouPai; 
        //every player's pai display as like xia player  
        var xiaType    = GameDefine.DESKPOS_TYPE.XIA;

        var gangPaiList = pengGangPai.gang;
        var pengPaiList = pengGangPai.peng;
        var gangLen     = 0;
        var pengLen     = 0;
        var shouLen     = 0;
        var pengGangHeng  = 60 *mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale*  this.curPaiScale;
        var pengGangZhi   = 80 *mjDataMgr.get(mjDataMgr.KEYS.CFG).paiScale*  this.curPaiScale;
        //gang
        for(let gIndex =0; gIndex<gangPaiList.length; gIndex ++){
            let gang  = gangPaiList[gIndex];
            let curLen = 0;
            let roindex = 0;
            for(let i =0; i < 4; i++){
                let pai       = gang[i];
                var paiNode   = cc.instantiate(this.paiPrefab);
                paiNode.getComponent("mjPaiUI").refresh(pai);
                paiNode.scale = paiNode.scale *  this.curPaiScale;
                if(i<3){
                    paiNode.setPosition(cc.p(gangLen+curLen, 0));
                    roindex = ((pai.showType == GameDefine.PAISHOWTYPE.PENGBY)) ? i : roindex;
                    var addLen  = ((pai.showType == GameDefine.PAISHOWTYPE.PENGBY)) ? pengGangZhi : pengGangHeng; 
                    curLen     += addLen;
                }
                paiListNode.addChild(paiNode)                
                if(i==3){
                    var forPos = curLen - pengGangHeng * 2;
                    forPos = (roindex != 0) ? forPos - pengGangZhi + pengGangHeng  : forPos; 
                    paiNode.setPosition(cc.p(gangLen+forPos, 6));
                }
            }
            gangLen += curLen + 2; 
        }

        gangLen = gangLen > 0 ? gangLen + 6 : gangLen;
        //peng  chi
        for(let gIndex =0; gIndex<pengPaiList.length; gIndex ++){
           let peng  = pengPaiList[gIndex];
           let curLen = 0;
            for(let i =0; i < peng.length; i++){
                let pai     = peng[i];
                var paiNode = cc.instantiate(this.paiPrefab);
                paiNode.getComponent("mjPaiUI").refresh(pai);
                paiNode.setPosition(cc.p(gangLen + pengLen + curLen , 0));
                paiListNode.addChild(paiNode)
                paiNode.scale = paiNode.scale *  this.curPaiScale;
                var addLen  = (pai.showType == GameDefine.PAISHOWTYPE.PENGBY) ? pengGangZhi : pengGangHeng; 
                curLen         += addLen;
            } 
            pengLen += curLen + 4; 
        }
        pengLen = pengLen > 0 ? pengLen + 10 : pengLen;
        //shou shang pai 
        for(let i =0; i<shouPai.length; i++){
            var pai      = shouPai[i];
            let paiNode  = cc.instantiate(this.paiPrefab);
            paiNode.getComponent("mjPaiUI").refresh(pai);
            paiNode.setPosition(cc.p(gangLen + pengLen + shouLen, 0));
            paiListNode.addChild(paiNode)
             paiNode.scale = paiNode.scale *  this.curPaiScale;
            shouLen     += pengGangHeng;
        }   
        //hupai
        // if(data.ishu){
        if(data.ishu || data.iszm){
            let paiNode = cc.instantiate(this.paiPrefab);
            var pai =  mjPai.new(data.hp); //{id : data.hp, rotate : 0};
            pai.setShowType(GameDefine.PAISHOWTYPE.PENG);
            paiNode.getComponent("mjPaiUI").refresh(pai);
            paiNode.scale = this.curPaiScale;
            paiNode.setPosition(cc.p(gangLen + pengLen + shouLen + 20, 0));
            paiNode.getComponent("mjPaiUI").setPengBgColor(new cc.Color(255, 206, 206))
            paiListNode.addChild(paiNode)
        }
    },

    //和其他风玩家的分数
    setPaiFengScore : function(playerNode, infoData){
        let pIndex      = infoData.player.dirIndex;
        //2018/3/5 美术决定只显示一种颜色
        var addColor    = new cc.Color(180, 160, 122)//new cc.Color(211, 200, 28);
        var reduceColor = new cc.Color(180, 160, 122)//new cc.Color(25, 167, 219);
        let nodeIndex = 0;
        for(i=0; i<4;i++){
            if(i == pIndex){
                continue;
            }
            let fengNode = playerNode.getChildByName("feng_"+nodeIndex);
            let nameNode = fengNode.getChildByName("name");
            let scoreNode= fengNode.getChildByName("content");
            nodeIndex    += 1;
            var score    = infoData.Scores[ i ] || 0;
            nameNode.getComponent(cc.Label).string  = this.directNodeName[i].localText;
            scoreNode.getComponent(cc.Label).string = score;
            scoreNode.color = (score > 0) ? addColor : reduceColor
        }
    },

    showSingleReport(){
        this.show();
        this.singleRoundN.active = true;
        require("Audio").playEffect("mahjong", "result.mp3")
    },

    show(){
        this.endRoundN.active    = true;
        this.animation.play(this.clips[0].name);
    },

    close(){
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.endRoundN.active    = false;
            this.singleRoundN.active = false;
            this.totalRoundN.active  = false;
        }, this);
    },


    hideSingleReport(){
        this.singleRoundN.active = false;
        this.singleRoundN.cleanData();
    },

    showTotalReport : function(){
        this.show();
        this.hideSingleReport();
        this.totalRoundN.active = true;
        this.checkEndMusic();
    },

    checkEndMusic(){
        if(!this.totalRoundN.active || !this.resultVoice){return}
        require("Audio").playEffect('mahjong', this.resultVoice);
        require("Audio").stopMusic();
    },

    

    //cur round report data
    setSingleReportData : function(reportData, gameUI){
        this.gameUI = gameUI;
        this.singleRoundN.refreshData(reportData);
        this.initBtnContiune();
    },

    setTotalReportData : function(reportData, gameUI){
        this.gameUI          = gameUI;
        this.totalReportData = reportData; 
        this.totalRoundN.refreshData(this.totalReportData);
    },

    onBtnClose : function(){
        this.endRoundN.active    = false;
        this.singleRoundN.active = false;
        this.totalRoundN.active  = false;
        this.resultVoice         = undefined;
    },

    onBtnExitClicked : function () {
        require("Audio").playEffect("hall", "button_nomal.mp3");
        gameManager.cleanPlayerPaiData();
        gameManager.exiteRoom();
    },

    //share single report to other
    onBtnSingleShare : function () {
        require("Audio").playEffect("hall", "button_nomal.mp3");
        require("JSPhoneWeChat").WxShareFriendScreen();
    },

    //share total report to other
    onBtnTotalShare : function () {
        require("Audio").playEffect("hall", "button_nomal.mp3");
        require("JSPhoneWeChat").WxShareFriendScreen();

    },

    onBtnContiuneClicked : function(){
        var gameReplayMgr   = require("mjReplayMgr");
        if(gameReplayMgr.isReplayPai()){
            this.onBtnExitClicked();
            return
        }
        require("Audio").playEffect("hall", "button_nomal.mp3");
        this.hideSingleReport();
        if(this.isCanContinue()){
            this.gotoReadyUI();
        }else {
            this.showTotalReport();
        }
    },

    gotoReadyUI : function(){
        gameManager.cleanPlayerPaiData();
        this.gameUI.lunpanN.active = false;
        this.gameUI.hideRoomOptBtn();
        this.gameUI.startReady();
        this.close()
    },

    //是否还能继续打牌
    isCanContinue : function(){
        return (this.totalReportData === undefined);
    },
});
