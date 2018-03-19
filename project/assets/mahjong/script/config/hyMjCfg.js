const hy_MessageCfg = {

	MoPaiMessageNum: {id: "MoPaiMessageNum", desc: "服务端->客户端　摸牌消息", req: 402, rsp: 0, notify: 402,},

	MoPaiNoticeNum: {id: "MoPaiNoticeNum", desc: "服务端->客户端　摸牌通知，即告知其他玩家某个玩家摸了一张牌", req: 403, rsp: 0, notify: 403,},

	ChuPaiReminderNum: {id: "ChuPaiReminderNum", desc: "服务端->客户端　出牌提示，告知客户端需要出牌", req: 404, rsp: 0, notify: 404,},

	ChuPaiMessageNum: {id: "ChuPaiMessageNum", desc: "客户端->服务端　出牌消息", req: 405, rsp: 0, notify: 405,},

	ChuPaiMessageAckNum: {id: "ChuPaiMessageAckNum", desc: "服务端->客户端　服务器接收到错误的出牌消息时回复", req: 406, rsp: 0, notify: 406,},

	ChuPaiNoticeNum: {id: "ChuPaiNoticeNum", desc: "服务端->客户端　出牌通知，即告知其他玩家某个玩家出了一张牌", req: 407, rsp: 0, notify: 407,},

	MoPaiZuHeReminderNum: {id: "MoPaiZuHeReminderNum", desc: "服务端->客户端　摸牌组合操作提示，服务端告知客户端能够进行哪些摸牌组合操作", req: 408, rsp: 0, notify: 408,},

	MoPaiZuHeNoticeNum: {id: "MoPaiZuHeNoticeNum", desc: "服务端->客户端　摸牌组合操作通知，服务端告知其他客户端某个客户端进行了哪些摸牌组合操作", req: 409, rsp: 0, notify: 409,},

	ChuPaiZuHeReminderNum: {id: "ChuPaiZuHeReminderNum", desc: "服务端->客户端  出牌组合操作提示，服务端告知客户端能够进行哪些出牌组合操作", req: 410, rsp: 0, notify: 410,},

	ChuPaiZuHeNoticeNum: {id: "ChuPaiZuHeNoticeNum", desc: "服务端->客户端  出牌组合操作通知，服务端告知其他客户端某个客户端进行了哪些出牌组合操作", req: 411, rsp: 0, notify: 411,},

	ChiPaiMessageNum: {id: "ChiPaiMessageNum", desc: "客户端->服务端　吃牌消息", req: 412, rsp: 0, notify: 412,},

	PengPaiMessageNum: {id: "PengPaiMessageNum", desc: "客户端->服务端　碰牌消息", req: 413, rsp: 0, notify: 413,},

	MingGang1PaiMessageNum: {id: "MingGang1PaiMessageNum", desc: "客户端->服务端　明杠1消息", req: 414, rsp: 0, notify: 414,},

	MingGang2PaiMessageNum: {id: "MingGang2PaiMessageNum", desc: "客户端->服务端　明杠2消息", req: 415, rsp: 0, notify: 415,},

	AnGangPaiMessageNum: {id: "AnGangPaiMessageNum", desc: "客户端->服务端　暗杠消息", req: 416, rsp: 0, notify: 416,},

	PuTongHuPaiMessageNum: {id: "PuTongHuPaiMessageNum", desc: "客户端->服务端　普通胡消息", req: 417, rsp: 0, notify: 417,},

	ZiMoHuPaiMessageNum: {id: "ZiMoHuPaiMessageNum", desc: "客户端->服务端　自摸胡消息", req: 418, rsp: 0, notify: 418,},

	GuoMoPaiMessageNum: {id: "GuoMoPaiMessageNum", desc: "客户端->服务端　过消息（对于摸牌组合操作的响应）", req: 419, rsp: 0, notify: 419,},

	GuoChuPaiMessageNum: {id: "GuoChuPaiMessageNum", desc: "客户端->服务端　过消息（对于出牌组合操作的响应）", req: 420, rsp: 0, notify: 420,},

	RestoreListenReminderNum: {id: "RestoreListenReminderNum", desc: "服务端->客户端  在客户端点击了某种出牌组合操作（吃碰杠胡）之后，可能接收到两种响应（如吃牌成功ChiPaiAckMessageNum，如吃牌失败RestoreListenReminderNum）．这里吃牌失败是因为别的玩家具有更高优先级的操作", req: 421, rsp: 0, notify: 421,},

	ChiPaiAckMessageNum: {id: "ChiPaiAckMessageNum", desc: "服务端→客户端 表示吃牌成功", req: 422, rsp: 0, notify: 422,},

	PengPaiAckMessageNum: {id: "PengPaiAckMessageNum", desc: "服务端→客户端 表示碰牌成功", req: 423, rsp: 0, notify: 423,},

	MingGang2PaiAckMessageNum: {id: "MingGang2PaiAckMessageNum", desc: "服务端→客户端 表示明杠牌成功", req: 424, rsp: 0, notify: 424,},

	PuTongHuPaiAckMessageNum: {id: "PuTongHuPaiAckMessageNum", desc: "服务端→客户端 表示普通胡牌成功", req: 425, rsp: 0, notify: 425,},

	MingGang1PaiAckMessageNum: {id: "MingGang1PaiAckMessageNum", desc: "服务端→客户端 表示明杠成功", req: 426, rsp: 0, notify: 426,},

	AnGangPaiAckMessageNum: {id: "AnGangPaiAckMessageNum", desc: "服务端→客户端 表示暗杠成功", req: 427, rsp: 0, notify: 427,},

	ZiMoHuPaiAckMessageNum: {id: "ZiMoHuPaiAckMessageNum", desc: "服务端→客户端 表示自摸胡牌成功", req: 428, rsp: 0, notify: 428,},

	QiangGangReminderNum: {id: "QiangGangReminderNum", desc: "服务端->客户端　抢杠胡提示", req: 429, rsp: 0, notify: 429,},

	QiangGangMessageNum: {id: "QiangGangMessageNum", desc: "客户端->服务端　抢杠胡消息", req: 430, rsp: 0, notify: 430,},

	QiangGangNoticeNum: {id: "QiangGangNoticeNum", desc: "服务端->客户端　抢杠胡通知", req: 431, rsp: 0, notify: 431,},

	GuoQiangGangMessageNum: {id: "GuoQiangGangMessageNum", desc: "客户端->服务端　过抢杠胡", req: 432, rsp: 0, notify: 432,},

	QiangGangHuPaiAckMessageNum: {id: "QiangGangHuPaiAckMessageNum", desc: "服务端→客户端 表示抢杠胡牌成功", req: 433, rsp: 0, notify: 433,},

	PrepareMessageNum: {id: "PrepareMessageNum", desc: "客户端->服务端　准备消息", req: 434, rsp: 0, notify: 434,},

	PrepareAckMessageNum: {id: "PrepareAckMessageNum", desc: "服务端->客户端　准备消息回复", req: 435, rsp: 0, notify: 435,},

	PrepareNoticeNum: {id: "PrepareNoticeNum", desc: "服务端->客户端　准备通知", req: 436, rsp: 0, notify: 436,},

	VotingStartMessageNum: {id: "VotingStartMessageNum", desc: "客户端->服务端　发起投票", req: 437, rsp: 0, notify: 437,},

	VotingReminderNum: {id: "VotingReminderNum", desc: "服务端->客户端　提示其他玩家有人发起投票", req: 438, rsp: 0, notify: 438,},

	VotingMessageNum: {id: "VotingMessageNum", desc: "客户端->服务端　投票消息", req: 439, rsp: 0, notify: 439,},

	VotingRstNoticeNum: {id: "VotingRstNoticeNum", desc: "服务端->客户端　投票结果通知", req: 440, rsp: 0, notify: 440,},

	VotingPlayerRstNoticeNum: {id: "VotingPlayerRstNoticeNum", desc: "服务端->客户端　某个玩家投票结果通知", req: 441, rsp: 0, notify: 441,},

	VotingInformationNum: {id: "VotingInformationNum", desc: "服务端->客户端　所有玩家投票结果通知，用于断线重连", req: 442, rsp: 0, notify: 442,},

	DissolveRoomMessageNum: {id: "DissolveRoomMessageNum", desc: "客户端->服务端　解散房间消息", req: 443, rsp: 0, notify: 443,},

	DissolveRoomAckMessageNum: {id: "DissolveRoomAckMessageNum", desc: "服务端->客户端　解散房间回复", req: 444, rsp: 0, notify: 444,},

	DissolveRoomNoticeNum: {id: "DissolveRoomNoticeNum", desc: "服务端->客户端　解散房间通知", req: 445, rsp: 0, notify: 445,},

	ExitRoomMessageNum: {id: "ExitRoomMessageNum", desc: "客户端->服务端　退出房间消息", req: 446, rsp: 0, notify: 446,},

	ExitRoomAckMessageNum: {id: "ExitRoomAckMessageNum", desc: "服务端->客户端　退出房间回复", req: 447, rsp: 0, notify: 447,},

	ExitRoomNoticeNum: {id: "ExitRoomNoticeNum", desc: "服务端->客户端　退出房间通知", req: 448, rsp: 0, notify: 448,},

	UpdateRoomCardNum: {id: "UpdateRoomCardNum", desc: "服务端->客户端  房卡数量更新通知", req: 449, rsp: 0, notify: 449,},

	FaPaiMessageNum: {id: "FaPaiMessageNum", desc: "服务端->客户端  牌局开始时的发牌消息", req: 450, rsp: 0, notify: 450,},

	FaPaiAckMessageNum: {id: "FaPaiAckMessageNum", desc: "服务端->客户端  发牌消息回复", req: 451, rsp: 0, notify: 451,},

	CaiShengPaiNoticeNum: {id: "CaiShengPaiNoticeNum", desc: "服务端->客户端  牌局开始时定财神通知", req: 452, rsp: 0, notify: 452,},

	BenMenFengReminderNum: {id: "BenMenFengReminderNum", desc: "服务端->客户端  牌局开始时本门风通知", req: 453, rsp: 0, notify: 453,},

	ShengPaiStageNoticeNum: {id: "ShengPaiStageNoticeNum", desc: "服务端->客户端  生牌阶段通知", req: 454, rsp: 0, notify: 454,},

	ZhanJiNoticeNum: {id: "ZhanJiNoticeNum", desc: "服务端->客户端 一局结束时发送战绩", req: 455, rsp: 0, notify: 455,},

	TotalZhanJiNoticeNum: {id: "TotalZhanJiNoticeNum", desc: "服务端->客户端 一盘结束时发送战绩", req: 456, rsp: 0, notify: 456,},

	RingAddNum: {id: "RingAddNum", desc: "服务端->客户端 增加圈数", req: 457, rsp: 0, notify: 457,},

	OffLineMessageNum: {id: "OffLineMessageNum", desc: "客户端->服务端　下线消息", req: 458, rsp: 0, notify: 458,},

	OffLineAckMessageNum: {id: "OffLineAckMessageNum", desc: "服务端->客户端　下线消息回复", req: 459, rsp: 0, notify: 459,},

	OffLineNoticeNum: {id: "OffLineNoticeNum", desc: "服务端->客户端　下线消息通知", req: 460, rsp: 0, notify: 460,},

	ReconnectNoticeNum: {id: "ReconnectNoticeNum", desc: "服务端->客户端　通知其他玩家某个玩家重连成功", req: 461, rsp: 0, notify: 461,},

	SyncTileInfoNum: {id: "SyncTileInfoNum", desc: "服务端->客户端　在客户端重连成功之后，告知客户端当前牌面信息", req: 462, rsp: 0, notify: 462,},

	ReconnectNoticeFinishCountNum: {id: "ReconnectNoticeFinishCountNum", desc: "服务端->客户端　告知重连玩家当前进行了多少盘", req: 463, rsp: 0, notify: 463,},

};

module.exports = hy_MessageCfg;
