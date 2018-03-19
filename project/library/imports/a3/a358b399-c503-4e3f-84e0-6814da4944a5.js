"use strict";
cc._RF.push(module, 'a358bOZxQNOP4TgaBTaSUSl', 'SanGongCfg');
// poker/script/pukeCfg/SanGongCfg.js

"use strict";

var SanGongCfg = {

    LeaveRoom: { id: "LeaveRoom", desc: "离开房间", req: 400, rsp: 500, notify: 600 },

    DisbandRoomVote: { id: "DisbandRoomVote", desc: "解散牌局投票", req: 401, rsp: 501, notify: 601 },

    DisbandRoomResult: { id: "DisbandRoomResult", desc: "解散房间投票结果", req: 402, rsp: 502, notify: 602 },

    ReadyNext: { id: "ReadyNext", desc: "准备好了可以下一局", req: 403, rsp: 503, notify: 603 },

    StartGame: { id: "StartGame", desc: "三公开始请求", req: 404, rsp: 504, notify: 604 },

    YaZhu: { id: "YaZhu", desc: "三公开始压注", req: 405, rsp: 505, notify: 605 },

    SomeOneYaZhu: { id: "SomeOneYaZhu", desc: "三公有人压注", req: 406, rsp: 506, notify: 606 },

    ShowCard: { id: "ShowCard", desc: "三公翻出第3张牌", req: 407, rsp: 507, notify: 607 },

    Qzhuang: { id: "Qzhuang", desc: "三公抢庄", req: 408, rsp: 508, notify: 608 },

    Zhuang: { id: "Zhuang", desc: "庄", req: 409, rsp: 509, notify: 609 },

    AccountOne: { id: "AccountOne", desc: "单局结算", req: 410, rsp: 510, notify: 610 },

    AccountAll: { id: "AccountAll", desc: "结算多局", req: 411, rsp: 511, notify: 611 }

};

module.exports = SanGongCfg;

cc._RF.pop();