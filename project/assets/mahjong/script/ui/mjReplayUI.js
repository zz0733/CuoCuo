// var gameManager   = require("mjGameManager");
// var utils         = require("utils");
var gameReplayMgr = require("mjReplayMgr");
var mjDataMgr     = require("mjDataMgr");
// var log           = utils.log;
////var Audio.         = require("Audio");

cc.Class({
    extends: cc.Component,

    properties: {
        replayNode : cc.Node,  
        btnGameContent : cc.Node,
        GameContentN  : cc.Node,
        btnMenuN      : cc.Node,
        reduceN       : cc.Node,
        roomIdN       : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.hdieReplay();
        // gameReplayMgr   = gameReplayMgr;
        gameReplayMgr.init(this);
        this.btnPlayN   = this.replayNode.getChildByName("btnPlay");
        this.btnStopN   = this.replayNode.getChildByName("btnStop");
        this.btnSpeed1N = this.replayNode.getChildByName("btnSpeed_1");
        this.curSpeed   = this.replayNode.getChildByName("curSpeed");
        this.btnBackN   = this.replayNode.getChildByName("btnBack");

        this.btnPlayN.on("touchend", this.onBtnPlayClicked, this);
        this.btnStopN.on("touchend", this.onBtnStopClicked, this);
        this.btnSpeed1N.on("touchend", this.onBtnSpeedClicked, this);
        this.btnBackN.on("touchend", this.onBtnBackClicked, this);

        this.btnSpeed1N.active = true;
        this.btnPlayN.active   = true;
        this.btnStopN.active   = false;
        this.speedIndex        = 0;
        this.speedList         = [1, 2, 4];
        this.refreSpeedScale();
        this.initGameContent();
    },

    update : function(dt){
        gameReplayMgr.update(dt)
    },

    onDestroy : function(){
        gameReplayMgr.onDestroy()
    },

    initGameContent(){
        var roomShowList = mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).showList;
        roomShowList.forEach(function(itemData, index){
            let cN = this.GameContentN.getChildByName("content" + (index+1));
            cN.active = true;
            cN.getComponent(cc.Label).string = itemData.content;
            // content += " " +itemData.name +":" + itemData.content;
        }.bind(this));
        this.GameContentN.getChildByName("hitzone").active = false;
    },

    showReplay : function(){
        this.replayNode.active = true;
        // this.btnGameContent.active = true;
        this.btnMenuN.active      = false;
        this.roomIdN.active       = true;
        // this.reduceN.setPosition(580, -270);
    },

    hdieReplay : function(){
        this.replayNode.active = false;
        // this.btnGameContent.active = false;
    },

    onBtnGameContentClick(){
        this.GameContentN.active = true;
        let animation            = this.GameContentN.getComponent(cc.Animation);
        let clips                = animation.getClips();
        animation.play(animation.getClips()[0].name);
        this.btnGameContent.active = false;
        this.GameContentN.getChildByName("hitzone").active = true;
    },

    onBtnGameContentBack(){
        this.GameContentN.getChildByName("hitzone").active = false;
        let animation            = this.GameContentN.getComponent(cc.Animation);
        let clips                = animation.getClips();
        animation.play(animation.getClips()[1].name).once('finished', function () {
            this.GameContentN.active = false;
            this.btnGameContent.active = true;
        }, this);;
    },

    onBtnBackClicked : function(){
        gameReplayMgr.endReplay();
    },

    onBtnPlayClicked : function(){
        this.btnPlayN.active   = false;
        this.btnStopN.active   = true;
        this.btn
        gameReplayMgr.resume();
    },

    onBtnStopClicked : function(){
        this.btnPlayN.active   = true;
        this.btnStopN.active   = false;
        gameReplayMgr.stop();
    },

    onBtnSpeedClicked : function(event){
        this.speedIndex += 1;
        this.speedIndex = this.speedIndex % this.speedList.length
        this.refreSpeedScale();
    },

    refreSpeedScale : function(){
        var speed = this.speedList[this.speedIndex];
        gameReplayMgr.setSpeedScale(speed);
        this.curSpeed.getComponent(cc.Label).string =" x" + speed;
    },

});
