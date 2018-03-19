(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/script/pukeCfg/NiuNiuCfg.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1047372EMZLcr3yKSV2Usqx', 'NiuNiuCfg', __filename);
// poker/script/pukeCfg/NiuNiuCfg.js

"use strict";

var NiuNiuCfg = {

    NiuDisbandRoom: { id: "NiuDisbandRoom", desc: "解散房间", req: 403, rsp: 503, notify: 603 },

    NiuReady: { id: "NiuReady", desc: "准备", req: 404, rsp: 504, notify: 604 },

    NiuDisbandRoomVote: { id: "NiuDisbandRoomVote", desc: "申请解散房间", req: 406, rsp: 506, notify: 606 },

    NiuDisbandRoomResult: { id: "NiuDisbandRoomResult", desc: "解散房间结果", req: 407, rsp: 507, notify: 607 },

    NiuQZhuang: { id: "NiuQZhuang", desc: "抢庄", req: 410, rsp: 510, notify: 610 },

    NiuYaFen: { id: "NiuYaFen", desc: "压分", req: 411, rsp: 511, notify: 611 },

    NiuShowCards: { id: "NiuShowCards", desc: "自动算牛(亮牌)", req: 412, rsp: 512, notify: 612 },

    NiuErrCode: { id: "NiuErrCode", desc: "不做任何操作", req: 414, rsp: 514, notify: 614 },

    NiuStartGame: { id: "NiuStartGame", desc: "开始游戏", req: 415, rsp: 515, notify: 615 },

    NiuSingalAccount: { id: "NiuSingalAccount", desc: "单局结算", req: 416, rsp: 516, notify: 616 },

    NiuLeaveRoom: { id: "NiuLeaveRoom", desc: "离开游戏", req: 418, rsp: 518, notify: 618 },

    NiuTotalAccount: { id: "NiuTotalAccount", desc: "总结算", req: 419, rsp: 519, notify: 619 }

};

module.exports = NiuNiuCfg;

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
        //# sourceMappingURL=NiuNiuCfg.js.map
        