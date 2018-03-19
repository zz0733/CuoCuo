const mjDataMgr = require("mjDataMgr");
const mjNetMgr  = require("mjNetMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        btnAgree: {
            type: cc.Node,
            default: null,
        },

        btnAgreeLabel: {
            type: cc.Node,
            default: null,
        },

        btnDisagree: {
            type: cc.Node,
            default: null,
        },

        nameLabel: {
            type: cc.Label,
            default: null,
        },
    },

    onLoad () {
        this._beganFlag = this.hasGameBegan();
        if (!this._beganFlag) {
            this.nameLabel.string = '确定退出房间？';
            this.btnAgreeLabel.string = '确定';
        }

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();

        this.btnAgree.on('click', this.onBtnAgreeClick, this);
        this.btnDisagree.on('click', this.onBtnDisagreeClick, this);
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    setTips(contet){
          this.nameLabel.string = contet;
    }, 

    hasGameBegan () {
        // 获取牌局状态，已开始返回true，否则返回false
        cc.log('---------------- round = ', mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).Round)
        return !(mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).Round === 0)
    },

    onBtnAgreeClick () {
        if (!this._beganFlag ) {
            var exitCb = function(data){
                if (data.Leave) {
                    require("mjGameManager").exiteRoom();
                }
            }.bind(this);
            if(mjDataMgr.getInstance().isRoomMaster()){
                var content    = {roomID: mjDataMgr.get(mjDataMgr.KEYS.ROOMID)}
                mjNetMgr.cSend("dissolvedRoom", content, exitCb);
            }else {
                mjNetMgr.cSend("exitOutRoom", {},  exitCb)
            }
            
        }else {
            mjNetMgr.cSend("VoteOutRoom", {OP:1}, function(data){
                if(data.RetCode && data.RetCode !== 0){
                }
            }.bind(this));
        }
        this.onBtnDisagreeClick();
    },

    onBtnDisagreeClick () {
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },

});
