var GameDefine = require("mjGameDefine");
cc.Class({
    extends: cc.Component,

    properties: {
        sai1N : cc.Node,
        sai2N : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.log('--- saizi onlocad ---')
        var DefineType                       = GameDefine.DESKPOS_TYPE;
        this.directionList                   = {};
        this.directionList[DefineType.SHANG] = "Shang"; 
        this.directionList[DefineType.XIA]   = "Xia"; 
        this.directionList[DefineType.ZUO]   = "Zuo"; 
        this.directionList[DefineType.YOU]   = "You"; 
        this.spAnim_1 = this.sai1N.getComponent(sp.Skeleton);
        var self = this;
        var completeFunc = function(event){
            self.onAnimFinish(event)
        }
        this.spAnim_1.setCompleteListener(completeFunc);
    },

    onAnimFinish : function(){
        this.endCB.call(this.gameUI);
    },

    playAnim : function(saiNode, id, count){
        //这个算法保证每家算的都一样，并且看起来是随机的
        var mjDataMgr = require("mjDataMgr");
        var roomID  = mjDataMgr.get(mjDataMgr.KEYS.ROOMID);
        var saiNum  =((parseInt(id) * 7)*count + roomID*13) % 6 + 1; 
        cc.log(arguments, "saiNum", saiNum, roomID, "end");
        var saiName = saiNum;
        var spAnim  = saiNode.getComponent(sp.Skeleton);
        spAnim.setAnimation(0, saiName, false);
    }, 

    play : function(saiziData, endCB, gameUI){
        this.endCB    = endCB;
        this.gameUI   = gameUI;  
        this.playAnim(this.sai1N,  saiziData[GameDefine.DIRECTION_TYPE.DONG].PlayerIdx, saiziData.playCount+13);
        this.playAnim(this.sai2N,  saiziData[GameDefine.DIRECTION_TYPE.XI].PlayerIdx, saiziData.playCount+7);

    },

    wahuaPlayAnim(saiNode, count) {
        let spAnim = saiNode.getComponent(sp.Skeleton);
        spAnim.setAnimation(0, count, false);
    },

    wahuaPlay(point, endCB, gameUI) {
        this.endCB = endCB;
        this.gameUI = gameUI;
        this.wahuaPlayAnim(this.sai1N, point.p1);
        this.wahuaPlayAnim(this.sai2N, point.p2);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
