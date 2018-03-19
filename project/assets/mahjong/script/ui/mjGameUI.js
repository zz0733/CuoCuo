var gameManager   = require("mjGameManager");
var GameDefine    = require("mjGameDefine");
var mjDataMgr     = require("mjDataMgr");
var mjNetMgr      = require("mjNetMgr");
var ReconnectMgr  = require("mjReconnectMgr");
var gameReplayMgr = require("mjReplayMgr");
var log           = cc.log;


cc.Class({
    extends: cc.Component,

    properties: {
        playerN           : cc.Node,
        paiAltas          : cc.SpriteAtlas,
        optEffectPrefab   : cc.Prefab,
        readyN            : cc.Node, //准备游戏UI的脚本节点,
        lunpanN           : cc.Node, //中间的东南西北
        overallEffN       : cc.Node, //全局特效
        eatOptN           : cc.Node,
        paiOptsPrefab     : cc.Prefab,
        EndUI             : cc.Node,
        eatPaiDetailPrefab: cc.Prefab,
        eatMoreOptN       : cc.Node,
        popWindowN        : cc.Node,
        readyUI           : cc.Node,
        shengPaiPrefab    : cc.Prefab,
        saiziPrefab       : cc.Prefab,
        dianpaoPrefab     : cc.Prefab,
        hupaiPrefab       : cc.Prefab,
        chatUI            : cc.Node,
        phoneStatusN      : cc.Node,
        chupaiTipsN       : cc.Node,
        gameCountN        : cc.Node,
        totalReportCount  : cc.RichText,
        signleReportCount : cc.RichText, 
        mjVotingPopUiPrefab: cc.Prefab,
        gameNameN          : cc.Node,
        btnRuleN           : cc.Node,
    },

    onLoad : function(){
        this.initNodeList();
        this.initAnimEffect();
        this.initEatListPrefab();
        this.initAudio();
        this.gameInit();
        this.preload();
        this.scheduleTime();
        this.refreTimeCount  = 1;
        this.totalDtTime     = 0;
    },

    gameInit(){
        this.uiDefaultShow();
        this.initGameManager();
        this.initReadyNode();
        fun.event.dispatch('Zhuanquan', {flag:false});

    },



    initAudio(){
        require("Audio").playMusic("mahjong", "BGM-gameUI.mp3", true);
     },

    initNodeList : function(){
        this.reduceNode    = this.lunpanN.getChildByName("residue");
        this.caiShenShineN = this.lunpanN.getChildByName("caishenShine");
        this.directN       = this.lunpanN.getChildByName("curDirection");
        this.direct3DN     = this.lunpanN.getChildByName("curDirection_3d");
        this.ShengpaiKuang = this.overallEffN.getChildByName("shengzhang");
        this.paiHitzone    = this.overallEffN.getChildByName("paiHitzone");
        this.liujuN        = this.overallEffN.getChildByName("liuju");
        this._timeDelay    = this.phoneStatusN.getChildByName('timeDelay').getComponent(cc.Label);
        let isIntranet = fun.gameCfg.loginUrl === gameConst.loginUrl[gameConst.loginUrlType.intranet] ? true : false;
        if (!isIntranet) {
            this.phoneStatusN.getChildByName('timeDelay').active = false
        }
        this.netDelayTime(fun.db.getData('NetDelayTime'));
        
    },

    uiDefaultShow(){
        this.btnRuleN.active      = false;
        this.lunpanN.active       = false;
        this.chupaiTipsN.active   = false;
        this.caiShenShineN.active = false;
        this.paiHitzone.active    = false;
        this.ShengpaiKuang.active = false;
        this.liujuN.active        = false;
    },

    initPhoneStatus(){
        fun.event.add("MJPhoneBattery", "PhoneBattery", this.batteryStatus.bind(this));
        fun.event.add("MJPhoneNet", "PhoneNet", this.netStatus.bind(this));
        fun.event.add("MJReconnect", "ReconnectInGame", this.gameInit.bind(this));
        fun.event.add("MJNetDelayTime", "NetDelayTime", this.netDelayTime.bind(this));
        fun.event.add("mjViewChangeMain", "mjViewChange", this.onViewChange.bind(this));
        require("JSPhoneNetBattery").getNetBatteryStatus();
        this.onViewChange();
    },

    preload(){
        // cc.director.preloadScene("hall")
    },

    start : function(){
        this.checkReplayData();
        if(gameManager.needNetWork()){
            // FromPhone.baiduLocation();
        }
        this.initPhoneStatus();
    },

    update : function(dt){
        this.totalDtTime += dt;
        if(this.totalDtTime > this.refreTimeCount){
            this.totalDtTime -= this.refreTimeCount;
            this.scheduleTime();
        }
        gameManager.update(dt);
    },

    setGameCount : function(gameCount){
        var curNode   = this.gameCountN.getChildByName("curCount");
        // var showCur   = cur;//cur > 9 ? cur : ("0"+cur);
        // var showTotal = total;//total > 9 ? total : ("0"+total);
        // var dis       = showCur+"/"+showTotal +"<color=#B1C3C4>"+"圈 "+"</c>" +totoalJu + "<color=#B1C3C4>" +"局" +"</c>"
        curNode.parent.active = gameCount.length > 0;
		curNode.getComponent(cc.RichText).string= gameCount;
        this.totalReportCount.string = gameCount;
        this.signleReportCount.string = gameCount.replace(/=#\w+>/g, '=#615A54>');
        this.readyUI.getComponent("mjReadyUI").refreRoomData();
    },

    //检测是否回放牌局
    checkReplayData : function(){
        if(gameReplayMgr.isReplayPai()){
            gameReplayMgr.startPlay();
        }
        // this.reduceNode.y = gameReplayMgr.isReplayPai() ? 100 : -100;    
    },

    onDestroy : function(){
        gameManager.onDestroy();
        fun.event.remove("MJPhoneNet")
        fun.event.remove("MJPhoneBattery")
        fun.event.remove("MJReconnect")
        fun.event.remove("MJNetDelayTime")
        fun.event.remove("mjViewChangeMain");
    },

    onViewChange(){
        let is3DView           = cc.sys.localStorage.getItem("mjEyeView") =="3D";
        this.direct3DN.active  = is3DView;
        this.directN.active    = !is3DView;
        this.gameNameN.scaleY  = is3DView ? 0.8 : 1;
        let paiNode = this.lunpanN.getChildByName("pai");
        paiNode.getChildByName("pai_2d").active = !is3DView;
        paiNode.getChildByName("pai_3d").active = is3DView;
        this.reduceNode.defauY = this.reduceNode.defauY || this.reduceNode.y
        this.reduceNode.scaleY = is3DView ? 0.8 : 1;
        this.reduceNode.y      = is3DView ? this.reduceNode.defauY + 20 : this.reduceNode.defauY;

    },

    showChupaiTips : function(){
        this.chupaiTipsN.active = true;
        this.chupaiTipsN.opacity = 0;
        var self = this;
        setTimeout(function(){
            self.chupaiTipsN.runAction(cc.fadeIn(0.3));
        }, 500)
    },
    hideChupaiTips : function(){
        this.chupaiTipsN.active = false;
    },

    setCaiShenPai : function(caishenList){
        var paiID     = caishenList[0]
        var paiSprite = this.getPaiSprite(paiID);
        var setCaiShen = function(paiN){
            var contentN = paiN.getChildByName("content");
            contentN.getComponent(cc.Sprite).spriteFrame = paiSprite;

        }
        let paiNode = this.lunpanN.getChildByName("pai");
        paiNode.active = true;
        setCaiShen(paiNode.getChildByName("pai_2d"));
        setCaiShen(paiNode.getChildByName("pai_3d"));
    },

    showCaiShenAnim : function(){
        var animManager = this.lunpanN.getComponent(cc.Animation);
        animManager.playAdditive("caishenshineIn");
        var spineAnim = this.caiShenShineN.getComponent(sp.Skeleton);
        this.caiShenShineN.active = true;
        var self = this;
        var completeFunc = function(event){
            self.caiShenShineN.active = false;
            self.checkEatUI();
            self.showAnimEffect("AnimKaishi");
            require('Audio').playEffect("mahjong", "start.mp3");
        }
        spineAnim.setCompleteListener(completeFunc);
        var magicName = mjDataMgr.get(mjDataMgr.KEYS.CFG).MagicName;
        spineAnim.setAnimation(0, magicName, false);
        require('Audio').playEffect("mahjong", "caishen.mp3");
    },

    showReduceNode : function(){
        this.reduceNode.active = true;
    },

    hdieReduceNode : function(){
        this.reduceNode.active = false;
    },

    initGameManager : function(){
        mjDataMgr.init( gameReplayMgr.isReplayPai() );
        mjNetMgr.init();
        this.initPaiDirection();
        var deskType   = GameDefine.DESKPOS_TYPE
        var playerList = {};
        playerList[deskType.SHANG] = this.playerN.getChildByName("shang");
        playerList[deskType.XIA]   = this.playerN.getChildByName("xia");
        playerList[deskType.ZUO]   = this.playerN.getChildByName("zuo");
        playerList[deskType.YOU]   = this.playerN.getChildByName("you");
        gameManager.initGame(playerList, this);
        //set game name in bg node
        this.gameNameN.getComponent(cc.Label).string = mjDataMgr.get("CfgData").gameName;
    },




    getPaiSprite : function(paiID){
        var spriteName  = "pj_"+ mjDataMgr.getInstance().getLocalPaiID(paiID);
        var spriteFrame = this.paiAltas.getSpriteFrame(spriteName);
        return spriteFrame;
    },

    //开始打麻将
    gameStart : function(){
        this.lunpanN.active = true;
        this.btnRuleN.active = true;
    },


    //旋转中间的轮盘
    roDirectionNode : function(rota){
        this.directN.getChildByName("content").rotation   = rota;
        this.direct3DN.children.forEach(function(item){
            item.active = false;
            item.children.forEach(function(cItem){
                cItem.active = false;
            })
        })
        this.cur3DDirNode = this.direct3DN.getChildByName("bg_" + rota/ 90);
        this.cur3DDirNode.active = true;
    },

    initPaiDirection  : function(){
        var DirectionType            = GameDefine.DIRECTION_TYPE;
        var nodeList                 = {};
        nodeList[DirectionType.DONG] = "dong";
        nodeList[DirectionType.XI]   = "xi";  
        nodeList[DirectionType.NAN]  = "nan"; 
        nodeList[DirectionType.BEI]  = "bei";
        this.directionNodeList       = nodeList;
    },

    //获取当前方向N
    setCurPaiDirection : function(dir){
        var setDirectVisi= function(dirName = "dong", visi){
            this.directN.getChildByName("content").getChildByName(dirName).active = visi;
            this.cur3DDirNode.getChildByName(dirName).active = visi;
        }.bind(this)
        var dirName              = this.directionNodeList[dir];
        setDirectVisi(this.lastDirName, false);
        setDirectVisi(dirName, true);
        this.lastDirName = dirName;
    },



    hidePaiHitzone : function(){
        this.paiHitzone.active = false;
    },
    showPaiHitzone : function(){
        this.paiHitzone.active = true;
    },
    onUserVoted : function(data){
        if(!this._mjVotingPopUi) {return};
        this._mjVotingPopUi.getComponent('mjVotingPopUI').showVoteChoice(data.UserId, data.code);
    },

    updateVotingData: function(data) {
        if (!this._mjVotingPopUi) {
            this._mjVotingPopUi = cc.instantiate(this.mjVotingPopUiPrefab);
            this._mjVotingPopUi.parent = cc.director.getScene().getChildByName('Canvas');
        }
        this._mjVotingPopUi.getComponent('mjVotingPopUI').updateData(data);
    },

    removeVotingPop: function() {
        if(!this._mjVotingPopUi) {return};
        this._mjVotingPopUi.getComponent('mjVotingPopUI').close();
        this._mjVotingPopUi = undefined;
    },

    setBtnBackVisi : function(visi){
        this.btnBack.active = visi;
    },

    initReadyNode : function(){
        this.readyN.active  = false;
        if(gameReplayMgr.isReplayPai()){
            return
        }
        this.readyUI.getComponent("mjReadyUI").refreRoomData();
        this.showReadyNode();
    },

    showReadyNode : function(){
        this.lunpanN.active = false;
        this.btnRuleN.active = false;
        this.readyN.active  = true;
    },
    hideReadyNode : function(){
        this.readyUI.getComponent("mjReadyUI").onEveryOneReady();
    },

    hideRoomOptBtn : function(){
        this.readyUI.getComponent("mjReadyUI").hideRoomOptBtn();
    },

    startReady : function(){
        this.readyUI.getComponent("mjReadyUI").prepareToPlay();
    },

    //只能提示
    onBtnHintClicked : function(){

    },



    //过牌
    onBtnGuoChilcked : function(){
        this.hideEatPaiN();
        gameManager.guoPaiToServer();
    },

    hideMoreChiUI : function(){
        this.eatMoreOptN.getChildByName("content").removeAllChildren();
        this.eatMoreOptN.active = false;
    },
    //have more eat pai choice
    showMoreChiUI : function(eatPaiData){
        this.eatMoreOptN.active = true;
        for(let i =0; i< eatPaiData.Comb.length; i++){
            var paiGroupN = cc.instantiate(this.eatPaiDetailPrefab);
            this.eatMoreOptN.getChildByName("content").addChild(paiGroupN);
            paiGroupN.setPosition(cc.p(i * -200 - 100, 5))
            paiGroupN.getComponent("mjChiDetailUI").init(this,
                eatPaiData.Comb[i], eatPaiData);
        }
        var bgN = this.eatMoreOptN.getChildByName("bg");
        // var bg_1N = this.eatMoreOptN.getChildByName("bg_1");
        var tipsN = this.eatMoreOptN.getChildByName("bg_0");
        tipsN.setPosition(eatPaiData.Comb.length * -200, 0);
        bgN.width = eatPaiData.Comb.length * 200 + 85; 
        // bg_1N.width = eatPaiData.Comb.length * 200 + 85; 

    },

    //吃牌
    onBtnChiChilcked : function(eatobj, eatPaiData){
        this.hideEatPaiN();
        if(eatPaiData.Comb.length > 1){
            eatPaiData.Comb.sort(function(a, b){
                // var a = gameManager.sortGroupPai(a);
                // var b = gameManager.sortGroupPai(b);
                var aSort = gameManager.getSortId(a[1]);
                var bSort = gameManager.getSortId(b[1]);
                return bSort - aSort;
            })
            this.showMoreChiUI(eatPaiData);
        }else {
            gameManager.chiPaiToServer(eatPaiData, eatPaiData.Comb[0]);
        }
        
    },
    
    //碰杠胡牌
    onBtnEatChilcked : function(eatobj, eatData){
        this.hideEatPaiN();
        gameManager.eatPaiToServer(eatobj, eatData);
    },

    //refresh the rest of pai count
    refreResidue : function(left){
        this.reduceNode.getComponent(cc.Label).string = left;
    },

    showEatPaiN : function(){
        this.eatOptN.active = true;
        this.cleanEatNodeList();
    },

    cleanEatNodeList : function(){
        this.addEatNodeList.forEach(function(item){
            item.removeFromParent();
        })
        this.addEatNodeList = [];
    },

    hideEatPaiN : function(){
        this.eatOptN.active = false;
        this.cleanEatNodeList();
    },


    //初始化吃牌UI
    initEatListPrefab : function(){
        this.EatPaiObj = [];
        this.addEatNodeList = [];
        this.hideEatPaiN();
        var self = this;
        //PuTongHu  = 0 //MingGang2 = 1 //PengPai   = 2
        //ChiPai    = 3 //ZiMoHu    = 4 //AnGang    = 5
        //MingGang1 = 6 //QiangGang = 7 //guo       = 8 
        var creatEatList = function(cb, msName, listIndex){
            var eatObj = {cb : cb, msName : msName, dataIndex : listIndex};
            self.EatPaiObj[listIndex] = eatObj;
        }
        creatEatList(this.onBtnEatChilcked, "PuTongHuPaiMessageNum", 0);
        creatEatList(this.onBtnEatChilcked, "MingGang2PaiMessageNum", 1);
        creatEatList(this.onBtnEatChilcked, "PengPaiMessageNum", 2);
        creatEatList(this.onBtnChiChilcked, "ChiPaiMessageNum", 3);
        creatEatList(this.onBtnEatChilcked, "ZiMoHuPaiMessageNum", 4);
        creatEatList(this.onBtnEatChilcked, "AnGangPaiMessageNum", 5);
        creatEatList(this.onBtnEatChilcked, "MingGang1PaiMessageNum", 6);
        creatEatList(this.onBtnEatChilcked, "QiangGangMessageNum", 7);
        creatEatList(this.onBtnGuoChilcked, "", 8);
    },

    checkEatUI : function(){
        if(this.eatPaiVisi){
            this.eeatPaiVisi = undefined;
            this.eatOptN.active = true;
        }
    },

    // 显示玩家对当前牌局上打的牌的课操作列表
    showCanEatUI : function(eatList){
        this.showEatPaiN();
        // eatList = [8, 0, 1, 2 ,3]
        for(let i = 0; i < eatList.length; i++){
            var eatTag  = eatList[i].Op;
            var eatObj  = this.EatPaiObj[eatTag];
            eatObj.paiID= eatList[i].Atile//gameManager.getEatPaiId(eatObj.dataIndex);
            var eatNode = cc.instantiate(this.paiOptsPrefab); 
            this.eatOptN.addChild(eatNode);
            eatNode.setPosition(cc.p((i+1)*-240  + eatList.length * 50, 120));
            eatNode.getComponent("mjOptsUI").init(this, eatObj, eatList[i]);
            this.addEatNodeList.push(eatNode);
        }
        if(this.caiShenShineN.active){
            this.eatOptN.active = false;
            this.eatPaiVisi = true;
            return;
        }
    },

    cleanEatUI : function(){
        this.hideEatPaiN();
        this.hideMoreChiUI();
    },

    


    //show curent round report data
    showSingleReport : function(reportData){
        this.EndUI.getComponent("mjEndUI").setSingleReportData(reportData, this);
        this.EndUI.getComponent("mjEndUI").showSingleReport();
        this.hideDeskStatusUI();
        this.hideChupaiTips();
    },

    setTotalReport : function(reportData){
        this.EndUI.getComponent("mjEndUI").setTotalReportData(reportData, this);
    },

    showTotalReport : function(){
        this.EndUI.getComponent("mjEndUI").showTotalReport();
        this.hideDeskStatusUI();
    },


    cleanAlert : function(){
        var voteAlert = this.popWindowN.getChildByName("voteFaile");
        if(voteAlert){
            voteAlert.destroy();
        }
    },

    showVoteFaile : function(playername){
        var content   = "玩家 ["+ playername  + "] 拒绝,解散房间失败";
        fun.event.dispatch('MinSingleButtonPop', {contentStr: content});
    },

    
    showShengPaiKuang : function(){
        this.ShengpaiKuang.active = true;
    }, 

    hideDeskStatusUI  : function(){
        this.lunpanN.getChildByName("pai").active = false;
        this.ShengpaiKuang.active                 = false;
    },

    initAnimEffect : function(){
        var animList             = {};
        animList["AnimShengpai"] = this.showShengPaiKuang.bind(this);
        animList["AnimLiuju"]    = gameManager.checkResultAnim.bind(gameManager);
        animList["AnimKaishi"]   = gameManager.onKaishiAnimEnd.bind(gameManager);
        this.AnimEffectList      = animList;
    },

    showAnimEffect : function(animName){
        cc.log("--showAnimEffect---", animName);
        var animNode   = cc.instantiate(this.shengPaiPrefab);
        this.overallEffN.addChild(animNode);
        var animHelper = animNode.getComponent("mjAnimHelper");
        animHelper.showCommonAnim(animName, this.AnimEffectList[animName]);
    },

    showLiujuEffect(){
        cc.log("showLiujuEffect")
        this.liujuN.active = true;
        var spAnim = this.liujuN.getComponent(sp.Skeleton)
        spAnim.setAnimation(0, "AnimLiuju", false);;
        var completeFunc = function(event){
            this.liujuN.active = false;
            gameManager.checkResultAnim();
        }.bind(this)
        spAnim.setCompleteListener(completeFunc);
    },
    

    newRound(roundData={}){
        this.showSaiziAnim(roundData.saizi);
        this.hideReadyNode();
    },

    onSaiZiPlayEnd : function(){
        var child = this.overallEffN.getChildByName("saizi");
        this.overallEffN.removeChild(child);
        this.showReduceNode();
        gameManager.faPaiWithAnim();
    }, 

    showSaiziAnim : function(saiziData){
        var  saiZiNode = cc.instantiate(this.saiziPrefab);
        saiZiNode.name = "saizi";
        saiZiNode.setPosition(cc.p(0, 0));
        this.overallEffN.addChild(saiZiNode);
        saiZiNode.getComponent("mjSaiziUI").play(saiziData, this.onSaiZiPlayEnd, this);
        require('Audio').playEffect("mahjong", "touzi.mp3");
    },
     //-- 电池状态
    batteryStatus: function(msg){
        let isCharge = this.phoneStatusN.getChildByName("charge");
        let progress = this.phoneStatusN.getChildByName("battery");
        isCharge.active = (msg.status === 0 || msg.status === 1) ? false : true;
        progress.getComponent(cc.ProgressBar).progress = msg.level/100; 
    },

    //-- 网络状态
    netStatus: function(msg){
        let wifi = this.phoneStatusN.getChildByName("wifi");
        let signal = this.phoneStatusN.getChildByName("signal");
        if (msg.status === 5){
            wifi.active = true;
            signal.active = false;
        } else {
            wifi.active = false;
            signal.active = true;
        }
    },

    //-- 网络延时 单位:毫秒
    netDelayTime : function(time){
        this._timeDelay.string = time;
        let state = fun.utils.getNetDelayTime(time);
        if(this._state){
            if(this._state === state.rgb)
                return;
            else
                this._state = state.rgb;
        } else {
            this._state = state.rgb;
        }
        let wifi = this.phoneStatusN.getChildByName("wifi");
        let signal = this.phoneStatusN.getChildByName("signal");
        for(let i=1; i<=5; ++i){
            signal.getChildByName('pk_signal_'+i).color = new cc.Color(state.rgb);
            signal.getChildByName('pk_signal_'+i).active = false;
            if (i<5){
                wifi.getChildByName('pk_wifi_'+i).color = new cc.Color(state.rgb);
                wifi.getChildByName('pk_wifi_'+i).active = false;
            }
        }
        wifi.getChildByName('pk_wifi_'+(state.idx+1)).active = true;
        signal.getChildByName('pk_signal_'+(state.idx+2)).active = true;
    },

    scheduleTime : function(){
        var time = this.phoneStatusN.getChildByName("time");
        var date = new Date();
        this.lastMinutes = this.lastMinutes || date.getMinutes();
        var minutesStr = date.getMinutes() < 10 ? "0"+ date.getMinutes() : date.getMinutes();
        var systemTime = date.getHours() + ":" + minutesStr
        if(this.lastMinutes < date.getMinutes() && this.refreTimeCount == 1){
            this.refreTimeCount = 30;
        }
        this.lastMinutes = date.getMinutes();
        time.getComponent(cc.Label).string = systemTime;
    },

});
