(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/public/playerMap.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cb219sjjTFLSoM9q6k1SfDN', 'playerMap', __filename);
// hall/script/public/playerMap.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
        this.backN = this.node.getChildByName("back");
    },
    start: function start() {},
    close: function close() {
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },


    getDistance: function getDistance(meIdx, targetIdx) {
        var mData = this.players[meIdx];
        var targetData = this.players[targetIdx];
        var distance = -1;
        var creatDistanceData = function creatDistanceData() {
            var dColor = cc.Color.RED;
            var showDistance = Math.floor(distance) + "米";
            if (distance < 0) {
                showDistance = "距离未知";
                dColor = cc.Color.YELLOW;
            }
            if (distance > 1000) {
                showDistance = (distance / 1000).toFixed(2) + "千米";
                dColor = cc.Color.GREEN;
            }
            return { color: dColor, distance: showDistance };
        };
        //任何一方没有数据
        if (!(mData && targetData && mData.Address && targetData.Address) || !cc.sys.isNative) {
            return creatDistanceData();
        }
        var points = { p1: mData.Address, p2: targetData.Address };
        distance = require('JSPhoneBaiDu').getDistanceByPoints(points);
        return creatDistanceData();
    },

    setDistance: function setDistance(lineN, meIdx, targetIdx) {
        var distanceData = this.getDistance(meIdx, targetIdx);
        var bgN = lineN.getChildByName("bg");
        var contentN = lineN.getChildByName("distance").getChildByName("content");
        bgN.color = distanceData.color;
        contentN.color = distanceData.color;
        contentN.getComponent(cc.Label).string = distanceData.distance;
    },

    show: function show(players) {
        this.players = players;
        for (var i = 0; i < 4; i++) {
            var playerN = this.backN.getChildByName("player_" + i);
            var playerData = players[i];
            var iconN = playerN.getChildByName("icon");
            var mainN = iconN.getChildByName("main");
            var waitN = iconN.getChildByName("wait");
            mainN.active = playerData != undefined;
            waitN.active = playerData == undefined;
            if (playerData) {
                var contentN = mainN.getChildByName("content");
                fun.utils.loadUrlRes(playerData.Icon, contentN);
            }
            for (var idx = 0; idx < 4; idx++) {
                if (idx == i) {
                    continue;
                }
                var lineN = playerN.getChildByName("line_" + idx);
                if (lineN) {
                    this.setDistance(lineN, i, idx);
                }
            }
        }
    }
}

// update (dt) {},
);

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
        //# sourceMappingURL=playerMap.js.map
        