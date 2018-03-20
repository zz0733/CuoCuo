"use strict";
cc._RF.push(module, 'a45a9dKT8hPqLCnK3X1RSyY', 'commonWahua');
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