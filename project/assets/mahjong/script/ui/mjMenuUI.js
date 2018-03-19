var gameManager = require("mjGameManager");
var mjNetMgr    = require("mjNetMgr");
var mjDataMgr   = require("mjDataMgr");
var BgPathName  = "mahjong/background/yxmj_zhuomian"
var open3D      = false;
cc.Class({
    extends: cc.Component,

    properties: {
        menuParentN: cc.Node,
        menuP      : cc.Prefab,    
        settingP   : cc.Prefab, 
        // voteP      : cc.Prefab,
        mjVotingUIP: cc.Prefab,
        gameBg     : cc.Node,
        mjSkinP    : cc.Prefab,
    },

    onLoad () {
        this.defautSkin = 1;
        this.refreGameBg();
        fun.event.add("mjViewMenu", "mjViewChange", this.refreGameBg.bind(this));
    },

    onDestroy(){
        this.voteNode = undefined;
        fun.event.remove("mjViewMenu");
    },

    start () {
    },

    refreGameBg(){
        var curBgIndex = cc.sys.localStorage.getItem("MJBgIndex") || this.defautSkin;
        let is3D = cc.sys.localStorage.getItem("mjEyeView") == "3D";
        curBgIndex = is3D ? "3d" : curBgIndex;
        cc.loader.loadRes(BgPathName+curBgIndex, cc.SpriteFrame,function(err, frame){
            this.gameBg.getComponent(cc.Sprite).spriteFrame = frame;
        }.bind(this));
    },

    onBtnMenuOpened (){
        require("Audio").playEffect("hall", "button_nomal.mp3");
        var menuN     = cc.instantiate(this.menuP);
        menuN.setPosition(cc.p(471, 0))
        this.MenuNode = menuN;
        this.menuParentN.addChild(menuN);
        var btnCloseN = this.MenuNode.getChildByName("btn_f");
        var btnExit   = this.MenuNode.getChildByName("btn_c");
        var btnSkin   = this.MenuNode.getChildByName("btn_b");
        var btnSetting= this.MenuNode.getChildByName("btn_a");
        this.btn2D    = this.MenuNode.getChildByName("btn_2d");
        this.btn3D    = this.MenuNode.getChildByName("btn_3d");
        btnCloseN.on("touchend", this.onBtnClose, this);
        btnExit.on("touchend", this.onBtnExit, this);
        btnSkin.on("touchend", this.onBtnSkin, this);
        this.btnSkin = btnSkin;
        btnSetting.on("touchend", this.onBntSetting, this);
        this.btn2D.on("touchend", function(){
            this.onViewChange("2d");
        }, this)
        this.btn3D.on("touchend", function(){
            this.onViewChange("3d");
        }, this)
        this.refreViewBtn();
        menuN.getChildByName("hitzone").on("touchend", this.onBtnClose, this);
    },


    onViewChange(curView){
        if(require("mjGameManager").inFaPai){return}
        if(this.isChangeing){return}
        this.isChangeing =  true;
        let newView = curView == "2d" ? "2D" : "3D"
        cc.sys.localStorage.setItem("mjEyeView", newView);
        fun.event.dispatch("mjViewChange")
        this.refreViewBtn();
        fun.utils.setBtnEnabled(this.btn2D, false);
        fun.utils.setBtnEnabled(this.btn3D, false);
    },

    refreViewBtn(){
        var is3dView       = cc.sys.localStorage.getItem("mjEyeView")=="3D" && open3D;
        this.btn2D.active  = is3dView && open3D;
        this.btn3D.active  = !is3dView && open3D;
        fun.utils.setBtnEnabled(this.btnSkin, !is3dView);
        // this.btnSkin.color = is3dView ? (new cc.Color(100, 100, 100)) : (new cc.Color(255, 255, 255));
        //防止切换过快
        setTimeout(function(){
            this.isChangeing   =  false;
            fun.utils.setBtnEnabled(this.btn2D, true);
            fun.utils.setBtnEnabled(this.btn3D, true);
        }.bind(this), 2000)
        
    },

    //close menu
    onBtnClose (event){
        require("Audio").playEffect("hall", "button_close.mp3");
        this.MenuNode.removeFromParent();
    },

    //exit room
    onBtnExit(event){
        require("Audio").playEffect("hall", "button_nomal.mp3");
        let mjVotingUi = cc.instantiate(this.mjVotingUIP);
        mjVotingUi.parent = cc.director.getScene().getChildByName('Canvas');
        var roomInfo    = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO);
        if(roomInfo.Round < 1 &&  mjDataMgr.getInstance().isRoomMaster()){
             mjVotingUi.getComponent("mjVotingUI").setTips("确定解散房间?");
        }
       
        this.onBtnClose();
    },

    //change room Skin
    onBtnSkin(event){
        if(cc.sys.localStorage.getItem("mjEyeView") == "3D"){return}
        require("Audio").playEffect("hall", "button_nomal.mp3");
        this.skinN = cc.instantiate(this.mjSkinP);
        this.menuParentN.addChild(this.skinN);
        this.initSkin(this.skinN);
    },

    //open seting UI
    onBntSetting(event){
        require("Audio").playEffect("hall", "button_nomal.mp3");
        this.settingN = cc.instantiate(this.settingP);
        this.menuParentN.addChild(this.settingN);
        this.settingN.getComponent("set").hideWriteOffBtn();
    },

    initSkin(){
        var curBgIndex = cc.sys.localStorage.getItem("MJBgIndex") || this.defautSkin;
        let backN    = this.skinN.getChildByName("back")
        let btnClose = backN.getChildByName("btnQuit");
        btnClose.on("touchend", function(){
            var animation = this.skinN.getComponent(cc.Animation)
            animation.play(animation.getClips()[1].name).once('finished', function () {
                this.skinN.removeFromParent();
            }, this);
        }, this);
        backN.refreshData = function(){
            for(let i=1; i<5; i++){
                let skinChild = backN.getChildByName("skin"+i);
                skinChild.getChildByName("choose").active = (curBgIndex == i);
            }
        }
        for(let i=1; i<5; i++){
              let skinChild = backN.getChildByName("skin"+i);
              skinChild.on("touchend", function(){
                    curBgIndex = i;
                    cc.sys.localStorage.setItem("MJBgIndex", i)
                    this.refreGameBg();
                    backN.refreshData();
              }, this)
        }
        backN.refreshData();
    },

});
