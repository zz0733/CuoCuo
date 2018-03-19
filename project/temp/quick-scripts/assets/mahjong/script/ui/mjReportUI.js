(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/mjReportUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '46a1d6GHalMjpoqRvqx8fmU', 'mjReportUI', __filename);
// mahjong/script/ui/mjReportUI.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        reportLisP: cc.Prefab,
        popWindow: cc.Node
    },
    onLoad: function onLoad() {
        this.reportList = [];
        //在房间内断线重连的时候需要清空数据，所以增加了resetReportData方法
        fun.event.add("addReportData", "addReportData", this.addReport.bind(this));
        fun.event.add("resetReportData", "resetReportData", this.resetReport.bind(this));
    },
    onDestroy: function onDestroy() {
        fun.event.remove("addReportData");
        fun.event.remove("resetReportData");
    },
    addReport: function addReport(reportList) {
        this.reportList.push(reportList);
    },
    resetReport: function resetReport() {
        var reportList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        this.reportList = reportList;
    },
    show: function show() {
        var mjDataMgr = require("mjDataMgr");
        if (fun.db.getData('RoomInfo').GameType != gameConst.gameType.maJiangHuangYan) {
            return;
        };
        require("Audio").playEffect("hall", "button_nomal.mp3");
        var reportPopN = cc.instantiate(this.reportLisP);
        reportPopN.getComponent("mjReportListUI").show(this.reportList);
        this.popWindow.addChild(reportPopN);
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
        //# sourceMappingURL=mjReportUI.js.map
        