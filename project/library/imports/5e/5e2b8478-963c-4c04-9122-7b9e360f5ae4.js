"use strict";
cc._RF.push(module, '5e2b8R4ljxMBJEie542D1rk', 'wlMjCfg');
// mahjong/script/config/wlMjCfg.js

"use strict";

var wl_MessageCfg = {

	Zhuang: { id: "Zhuang", desc: "本局庄", req: 400, rsp: 500, notify: 600 },

	SZDianShu: { id: "SZDianShu", desc: "摇出色子的点数", req: 401, rsp: 501, notify: 601 },

	LeaveRoom: { id: "LeaveRoom", desc: "离开房间", req: 402, rsp: 502, notify: 602 },

	DisbandRoomVote: { id: "DisbandRoomVote", desc: "解散房间投票", req: 403, rsp: 503, notify: 603 },

	DisbandRoomResult: { id: "DisbandRoomResult", desc: "解散房间投票结果", req: 404, rsp: 504, notify: 604 },

	ReadyNext: { id: "ReadyNext", desc: "准备好了可以下一局", req: 405, rsp: 505, notify: 605 },

	PaiJuInfo: { id: "PaiJuInfo", desc: "进入房间时下发的牌局信息", req: 406, rsp: 506, notify: 606 },

	FaPai: { id: "FaPai", desc: "新一局发牌", req: 407, rsp: 507, notify: 607 },

	MoPai: { id: "MoPai", desc: "摸牌", req: 408, rsp: 508, notify: 608 },

	CaiShen: { id: "CaiShen", desc: "财神牌", req: 409, rsp: 509, notify: 609 },

	ShowPai: { id: "ShowPai", desc: "将特殊牌翻到桌面上", req: 410, rsp: 510, notify: 610 },

	BuPai: { id: "BuPai", desc: "补牌到手中", req: 411, rsp: 511, notify: 611 },

	Ops: { id: "Ops", desc: "玩家操作", req: 412, rsp: 512, notify: 612 },

	DaPai: { id: "DaPai", desc: "玩家打牌", req: 413, rsp: 513, notify: 613 },

	Hu: { id: "Hu", desc: "玩家胡牌", req: 414, rsp: 514, notify: 614 },

	Gang: { id: "Gang", desc: "杠牌", req: 415, rsp: 515, notify: 615 },

	Peng: { id: "Peng", desc: "碰牌", req: 416, rsp: 516, notify: 616 },

	Chi: { id: "Chi", desc: "吃牌", req: 417, rsp: 517, notify: 617 },

	Pass: { id: "Pass", desc: "过牌", req: 418, rsp: 518, notify: 618 },

	RoundAcc: { id: "RoundAcc", desc: "当局结算", req: 419, rsp: 519, notify: 619 },

	RoomAcc: { id: "RoomAcc", desc: "总结算", req: 420, rsp: 520, notify: 620 },

	PaiTime: { id: "PaiTime", desc: "牌局阶段", req: 421, rsp: 521, notify: 621 }

};

module.exports = wl_MessageCfg;

cc._RF.pop();