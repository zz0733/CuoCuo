"use strict";
cc._RF.push(module, 'ea14f21JpdFN7w+nAoquts+', 'scMjCfg');
// mahjong/script/config/scMjCfg.js

"use strict";

var sc_MessageCfg = {

	Zhuang: { id: "Zhuang", desc: "本局庄", req: 400, rsp: 500, notify: 600 },

	LeaveRoom: { id: "LeaveRoom", desc: "离开房间", req: 401, rsp: 501, notify: 601 },

	DisbandRoomVote: { id: "DisbandRoomVote", desc: "解散房间投票", req: 402, rsp: 502, notify: 602 },

	DisbandRoomResult: { id: "DisbandRoomResult", desc: "解散房间投票结果", req: 403, rsp: 503, notify: 603 },

	PaiJuInfo: { id: "PaiJuInfo", desc: "进入房间时下发的牌局信息", req: 404, rsp: 504, notify: 604 },

	Ready: { id: "Ready", desc: "准备开局", req: 405, rsp: 505, notify: 605 },

	FaPai: { id: "FaPai", desc: "新一局发牌", req: 406, rsp: 506, notify: 606 },

	EhgTriCards: { id: "EhgTriCards", desc: "换三张", req: 407, rsp: 507, notify: 607 },

	DingQue: { id: "DingQue", desc: "定缺", req: 408, rsp: 508, notify: 608 },

	Mo: { id: "Mo", desc: "摸牌", req: 409, rsp: 509, notify: 609 },

	Ops: { id: "Ops", desc: "玩家操作", req: 410, rsp: 510, notify: 610 },

	Da: { id: "Da", desc: "玩家打牌", req: 411, rsp: 511, notify: 611 },

	Hu: { id: "Hu", desc: "玩家胡牌", req: 412, rsp: 512, notify: 612 },

	Gang: { id: "Gang", desc: "杠牌", req: 413, rsp: 513, notify: 613 },

	Peng: { id: "Peng", desc: "碰牌", req: 414, rsp: 514, notify: 614 },

	Pass: { id: "Pass", desc: "过牌", req: 415, rsp: 515, notify: 615 },

	RoundAcc: { id: "RoundAcc", desc: "当局结算", req: 416, rsp: 516, notify: 616 },

	RoomAcc: { id: "RoomAcc", desc: "总结算", req: 417, rsp: 517, notify: 617 },

	PaiTime: { id: "PaiTime", desc: "牌局阶段", req: 418, rsp: 518, notify: 618 }
};

module.exports = sc_MessageCfg;

cc._RF.pop();