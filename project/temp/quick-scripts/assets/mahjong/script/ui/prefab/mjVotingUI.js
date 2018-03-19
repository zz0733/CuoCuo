(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/prefab/mjVotingUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '04d293c1IZKvYPebNlNoqa8', 'mjVotingUI', __filename);
// mahjong/script/ui/prefab/mjVotingUI.js

"use strict";

var mjDataMgr = require("mjDataMgr");
var mjNetMgr = require("mjNetMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        btnAgree: {
            type: cc.Node,
            default: null
        },

        btnAgreeLabel: {
            type: cc.Node,
            default: null
        },

        btnDisagree: {
            type: cc.Node,
            default: null
        },

        nameLabel: {
            type: cc.Label,
            default: null
        }
    },

    onLoad: function onLoad() {
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
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    setTips: function setTips(contet) {
        this.nameLabel.string = contet;
    },
    hasGameBegan: function hasGameBegan() {
        // 获取牌局状态，已开始返回true，否则返回false
        cc.log('---------------- round = ', mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).Round);
        return !(mjDataMgr.get(mjDataMgr.KEYS.ROOMINFO).Round === 0);
    },
    onBtnAgreeClick: function onBtnAgreeClick() {
        if (!this._beganFlag) {
            var exitCb = function (data) {
                if (data.Leave) {
                    require("mjGameManager").exiteRoom();
                }
            }.bind(this);
            if (mjDataMgr.getInstance().isRoomMaster()) {
                var content = { roomID: mjDataMgr.get(mjDataMgr.KEYS.ROOMID) };
                mjNetMgr.cSend("dissolvedRoom", content, exitCb);
            } else {
                mjNetMgr.cSend("exitOutRoom", {}, exitCb);
            }
        } else {
            mjNetMgr.cSend("VoteOutRoom", { OP: 1 }, function (data) {
                if (data.RetCode && data.RetCode !== 0) {}
            }.bind(this));
        }
        this.onBtnDisagreeClick();
    },
    onBtnDisagreeClick: function onBtnDisagreeClick() {
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
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
        //# sourceMappingURL=mjVotingUI.js.map
        