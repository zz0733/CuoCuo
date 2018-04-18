"use strict";
cc._RF.push(module, '5e2ferte69HkZf0i31hE/0N', 'MessageCfg');
// hall/script/config/MessageCfg.js

"use strict";

var MessageCfg = {

	Heartbeat: { id: "Heartbeat", desc: "心跳", req: 101, rsp: 201, notify: 301 },

	ServerTime: { id: "ServerTime", desc: "服务器时间", req: 102, rsp: 202, notify: 302 },

	ThirdLogin: { id: "ThirdLogin", desc: "第三方登陆", req: 103, rsp: 203, notify: 303 },

	TokenLogin: { id: "TokenLogin", desc: "token登录", req: 104, rsp: 204, notify: 304 },

	GustLogin: { id: "GustLogin", desc: "游客登录", req: 105, rsp: 205, notify: 305 },

	AccountBind: { id: "AccountBind", desc: "账号绑定(针对游客登录的账号)", req: 106, rsp: 206, notify: 306 },

	KickOff: { id: "KickOff", desc: "被踢下线", req: 107, rsp: 207, notify: 307 },

	Chat: { id: "Chat", desc: "聊天", req: 108, rsp: 208, notify: 308 },

	CreateRoom: { id: "CreateRoom", desc: "创建房间", req: 109, rsp: 209, notify: 309 },

	EnterRoom: { id: "EnterRoom", desc: "进入房间", req: 110, rsp: 210, notify: 310 },

	RoomCard: { id: "RoomCard", desc: "房卡数量", req: 111, rsp: 211, notify: 311 },

	OffLine: { id: "OffLine", desc: "下线", req: 112, rsp: 212, notify: 312 },

	OnLine: { id: "OnLine", desc: "上线", req: 113, rsp: 213, notify: 313 },

	Announce: { id: "Announce", desc: "公告", req: 114, rsp: 214, notify: 314 },

	StandingsList: { id: "StandingsList", desc: "战绩", req: 115, rsp: 215, notify: 315 },

	StandingBrief: { id: "StandingBrief", desc: "单个房间总结算", req: 116, rsp: 216, notify: 316 },

	StandingDetail: { id: "StandingDetail", desc: "单个房间中每局的结算", req: 117, rsp: 217, notify: 317 },

	ReplayRecord: { id: "ReplayRecord", desc: "单局回放", req: 118, rsp: 218, notify: 318 },

	ShareRecord: { id: "ShareRecord", desc: "分享战绩", req: 119, rsp: 219, notify: 319 },

	ReplayRecordByCode: { id: "ReplayRecordByCode", desc: "通过分享码播放录像", req: 120, rsp: 220, notify: 320 },

	MailList: { id: "MailList", desc: "客户端拉取新邮件", req: 121, rsp: 221, notify: 321 },

	NewMailId: { id: "NewMailId", desc: "服务端向客户端推送最新邮件id", req: 122, rsp: 222, notify: 322 },

	NewMail: { id: "NewMail", desc: "服务端向客户端推送最新邮件", req: 123, rsp: 223, notify: 323 },

	DelMail: { id: "DelMail", desc: "删除邮件", req: 124, rsp: 224, notify: 324 },

	WeChatInfo: { id: "WeChatInfo", desc: "微信信息", req: 125, rsp: 225, notify: 325 },

	Certification: { id: "Certification", desc: "实名认证", req: 126, rsp: 226, notify: 326 },

	WxPay: { id: "WxPay", desc: "生成微信支付订单", req: 127, rsp: 227, notify: 327 },

	AliPay: { id: "AliPay", desc: "生成阿里支付订单", req: 128, rsp: 228, notify: 328 },

	ApPay: { id: "ApPay", desc: "苹果支付", req: 129, rsp: 229, notify: 329 },

	WxShare: { id: "WxShare", desc: "微信分享", req: 130, rsp: 230, notify: 330 },

	ServerError: { id: "ServerError", desc: "返回服务器错误", req: 131, rsp: 231, notify: 331 },

	HuoDong: { id: "HuoDong", desc: "活动", req: 132, rsp: 232, notify: 332 },

	GoodCnt: { id: "GoodCnt", desc: "获取物品数量", req: 133, rsp: 233, notify: 333 },

	ExchgGood: { id: "ExchgGood", desc: "兑换物品", req: 134, rsp: 234, notify: 334 },

	TimeCardList: { id: "TimeCardList", desc: "获取限时卡列表", req: 135, rsp: 235, notify: 335 },

	ShareTimeCard: { id: "ShareTimeCard", desc: "分享限时卡", req: 136, rsp: 236, notify: 336 },

	ReceiveTimeCard: { id: "ReceiveTimeCard", desc: "领取限时卡", req: 137, rsp: 237, notify: 337 },

	SharedTimeCardList: { id: "SharedTimeCardList", desc: "分享的限时卡列表", req: 138, rsp: 238, notify: 338 }

};

module.exports = MessageCfg;

cc._RF.pop();