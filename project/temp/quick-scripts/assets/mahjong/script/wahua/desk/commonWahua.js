(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/wahua/desk/commonWahua.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a45a9dKT8hPqLCnK3X1RSyY', 'commonWahua', __filename);
// mahjong/script/wahua/desk/commonWahua.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        saiziPerfab: {
            type: cc.Prefab,
            default: null
        },

        disbandRoomPerfab: {
            type: cc.Prefab,
            default: null
        }
    },

    onLoad: function onLoad() {
        fun.event.add('commonWahuaSaiziEnd', 'wahuaSaiziEnd', this.initSaizi.bind(this));
        fun.event.add('commonWahuaDisbandRoom', 'wahuaDisbandRoom', this.initDisbandRoom.bind(this));
    },
    onDestroy: function onDestroy() {
        fun.event.remove('commonWahuaSaiziEnd');
        fun.event.remove('commonWahuaDisbandRoom');
    },
    initSaizi: function initSaizi(data) {
        var saizi = cc.instantiate(this.saiziPerfab);
        saizi.parent = this.node;
        saizi.getComponent('mjSaiziUI').wahuaPlay(data.point, function () {
            data.callback();
            saizi.destroy();
        }, this);
    },
    initDisbandRoom: function initDisbandRoom() {
        cc.log('--- initDisbandRoom ---');
        if (!this.disbandRoom) {
            this.disbandRoom = cc.instantiate(this.disbandRoomPerfab);
            this.disbandRoom.parent = this.node;
            this.disbandRoom.getComponent('mjVotingPopUI').enabled = false;
            // this.disbandRoom.addComponent('wahuaVotingPopUI');
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
        //# sourceMappingURL=commonWahua.js.map
        