// var gameManager   = require("mjGameManager");
// var GameDefine    = require("mjGameDefine");
////var Audio.         = require("Audio");
// var utils         = require("utils");
var log           = cc.log;


cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
    },

    show : function(idx, chatData){
        var data          = chatData.split("|||");
        var endIdx        = data[0];
        var startPlayer   = gameManager.playerList[idx];
        var endPlayer     = gameManager.playerList[endIdx];

        var startWorldPos = startPlayer.getInteractPos();
        var endWorldPos   = endPlayer.getInteractPos();

        var startLocalPos = this.node.convertToNodeSpaceAR(startWorldPos);
        var endLocalPos   = this.node.convertToNodeSpaceAR(endWorldPos);

        var interactData  = this.getInteractData(data[1]);
        this.animaNode        = this.node.getChildByName(interactData.nodeName);
        this.animaNode.active = true;
        this.animaNode.setPosition(startLocalPos)
        this.animaNode.getChildByName("content").active = true;
        this.spAnim           = this.animaNode.getChildByName("content").getComponent(sp.Skeleton)
        //Audio.playSystemSound("hd_feixing.mp3", false);
        // //Audio.playSystemSound("hd_Jidan", false);
        this.spAnim.setAnimation(0, interactData.animaName +"_fei", true);
        
        var self          = this;
        this.interactData = interactData;
        var moveTime      = cc.pDistance(startLocalPos, endLocalPos)/1500;
        var moveAction    = cc.sequence(cc.moveTo(moveTime, endLocalPos), cc.callFunc(function(){
            self.onMoveEnd();
        }))
        this.animaNode.runAction(moveAction);
    },

    getInteractData : function(id){
        var data;
        var interactList = GameDefine.CHATINTERACT;
        for(let k in interactList){
            if(interactList[k].id == id){
                data = interactList[k];
            }
        }
        return data;
    },

    onMoveEnd : function(){
        var self = this;
        var endFunc = function(){
            self.node.removeFromParent();
        }
        this.spAnim.setCompleteListener(endFunc);
        var animaName = this.interactData.animaName;
        //Audio.playSystemSound("hd_"+animaName+".mp3", false);
        // //Audio.playSystemSound("hd_Jidan", false);
        this.spAnim.setAnimation(0, animaName +"_dao", false);
    },




    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
