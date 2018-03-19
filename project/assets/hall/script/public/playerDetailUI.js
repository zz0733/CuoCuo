let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {
        emojiListN : cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    initNode(){
        this.isCdTime    = false;
        this.basicInfoN  = this.node.getChildByName("back").getChildByName("content")
        this.node.getChildByName("hitzone").on("touchend", this.close, this);
        this.animation   = this.node.getComponent(cc.Animation);
        this.clips       = this.animation.getClips();
        this.btnLocation = this.basicInfoN.getChildByName("btnPosDetail");
        this.node.getChildByName("hitzone").on("touchend", this.close, this);
        this.btnLocation.on("touchend", this.showLocationDetail, this);
        this.emojiListN.children.forEach(function (child) {
            child.on("touchend", function(event){
                //Hongbao Xueqiu Bianpao Yan Hua Wen Jidan Tuoxie Shoulei
                //the node name be corresponding to animation name, please don't change the node name
                this.interactData.content = child.name;
                this.sendInteract();
            }, this)
        }.bind(this))
    },

    show(playerData, onMapCB){
        this.initNode();
        this.initBasicInfo(playerData);
        this.onMapCB = onMapCB;
    },

    close(){
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },


    initBasicInfo(playerData){
        var nameL    = this.basicInfoN.getChildByName("name").getComponent(cc.Label);
        var idL      = this.basicInfoN.getChildByName("id").getComponent(cc.Label);
        // var iconN    = this.basicInfoN.getChildByName("icon");
        var addrL    = this.basicInfoN.getChildByName("addr").getComponent(cc.Label);
        nameL.string = playerData.name;
        idL.string   = playerData.id;
        addrL.string = playerData.addr;
        // fun.utils.loadUrlRes(playerData.url, iconN);
        this.btnLocation.active = !playerData.isNoLocation;
        this.emojiListN.active  = !playerData.isSelf;
        this.interactData       = {from : playerData.selfUid, to : playerData.curUid, chatType: "interact"};
    },

    sendInteract(){
        //prevent too fast
        if(this.isCdTime){return}
        this.isCdTime = true
        setTimeout(function(){
            this.isCdTime = false;
        }.bind(this), 500)
        fun.net.pSend("Chat", this.interactData);
    },

    showLocationDetail(){
        if(!this.onMapCB){return}
        this.onMapCB();
    },

    update (dt) {},
});
