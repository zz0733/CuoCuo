(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/wahua/config/WahuaCfg.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f9261gNCoJOhoFp4p22g+Ro', 'WahuaCfg', __filename);
// mahjong/script/wahua/config/WahuaCfg.js

"use strict";

var WahuaCfg = {

	DisbandRoom: { id: "DisbandRoom", desc: "解散房间（牌局未开始）", req: 403, rsp: 503, notify: 603 },

	Ready: { id: "Ready", desc: "准备", req: 404, rsp: 504, notify: 604 },

	NextReady: { id: "NextReady", desc: "下一局准备", req: 405, rsp: 505, notify: 605 },

	DisbandRoomVote: { id: "DisbandRoomVote", desc: "申请解散房间", req: 406, rsp: 506, notify: 606 },

	DisbandRoomResult: { id: "DisbandRoomResult", desc: "解散房间结果", req: 407, rsp: 507, notify: 607 },

	Banker: { id: "Banker", desc: "发庄", req: 410, rsp: 510, notify: 610 },

	RockCard: { id: "RockCard", desc: "摇张", req: 411, rsp: 511, notify: 611 },

	UserRefresh: { id: "UserRefresh", desc: "用户刷新", req: 413, rsp: 513, notify: 613 },

	NoneOps: { id: "NoneOps", desc: "不做任何操作", req: 414, rsp: 514, notify: 614 },

	StartGame: { id: "StartGame", desc: "开始游戏", req: 415, rsp: 515, notify: 615 },

	PlayCard: { id: "PlayCard", desc: "打牌", req: 416, rsp: 516, notify: 616 },

	DrawCard: { id: "DrawCard", desc: "摸牌", req: 417, rsp: 517, notify: 617 },

	OpsAccept: { id: "OpsAccept", desc: { "1": "杠牌", "2": "吃牌，换牌，胡牌，补花接受返回" }, req: 418, rsp: 518, notify: 618 },

	RepairCard: { id: "RepairCard", desc: "补花返回的牌", req: 419, rsp: 519, notify: 619 },

	OneAccount: { id: "OneAccount", desc: "结束游戏(单局)", req: 421, rsp: 521, notify: 621 },

	QuitRoom: { id: "QuitRoom", desc: "退出房间（牌局未开始)", req: 423, rsp: 523, notify: 623 },

	AllAccount: { id: "AllAccount", desc: "总结算", req: 424, rsp: 524, notify: 624 },

	EscapeFlower: { id: "EscapeFlower", desc: "桃花或者过", req: 425, rsp: 525, notify: 625 }

};

module.exports = WahuaCfg;

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
        //# sourceMappingURL=WahuaCfg.js.map
        