(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/wahua/desk/roomDescScvWahua.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c205cu37tZExayKmM2kygvj', 'roomDescScvWahua', __filename);
// mahjong/script/wahua/desk/roomDescScvWahua.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        roomNumLabel: {
            type: cc.Label,
            default: null
        },

        modelNameLabel: {
            type: cc.Label,
            default: null
        },

        chagreLabel: {
            type: cc.Label,
            default: null
        },

        playerSumLabel: {
            type: cc.Label,
            default: null
        },

        playLabel: {
            type: cc.Label,
            default: null
        },

        modelLabel: {
            type: cc.Label,
            default: null
        },

        special: {
            type: cc.Label,
            default: null
        }
    },

    onLoad: function onLoad() {
        var roomInfo = fun.db.getData('RoomInfo');
        this.roomNumLabel.string = roomInfo.roomRule.RoomId;
        var num = roomInfo.roomRule.roomNum || roomInfo.roomRule.ring;
        this.setModelLabel(num, roomInfo.roomRule.makersType);
        this.setSpecialLabel(roomInfo.roomRule.needLocation);
        this.setPlayLabel(roomInfo.roomRule.patterns);
        this.setPlayerSumLabel(roomInfo.roomRule.playerNum);
        this.setChagerLabel(roomInfo.roomRule.reduceCard);
    },
    setModelLabel: function setModelLabel(num) {
        var makersType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        if (makersType === 1) {
            this.modelNameLabel.string = '圈数';
            this.modelLabel.string = num + '圈';
        } else {
            this.modelNameLabel.string = '局数';
            this.modelLabel.string = num + '局';
        }
    },
    setChagerLabel: function setChagerLabel(reduceCard) {
        switch (reduceCard) {
            case 1:
                this.chagreLabel.string = '房主支付';
                break;
            case 2:
                this.chagreLabel.string = '平均支付';
                break;
            case 3:
                this.chagreLabel.string = '冠军支付';
                break;
        }
    },
    setPlayerSumLabel: function setPlayerSumLabel() {
        var playerNum = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;

        this.playerSumLabel.string = playerNum + "人";
    },
    setPlayLabel: function setPlayLabel() {
        var patterns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

        switch (patterns) {
            case 1:
                this.playLabel.string = '庄家翻倍';
                break;
            case 2:
                this.playLabel.string = '平措';
                break;
        }
    },
    setSpecialLabel: function setSpecialLabel(flag) {
        if (flag) {
            this.special.string = '玩家需开启定位才可加入游戏';
        } else {
            this.special.string = '玩家无需开启定位就可加入游戏';
        }
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
        //# sourceMappingURL=roomDescScvWahua.js.map
        