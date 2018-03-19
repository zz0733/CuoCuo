"use strict";
cc._RF.push(module, '967f7NeH2BHk5akTrLFDNVD', 'mjGameDefine');
// mahjong/script/game/common/mjGameDefine.js

"use strict";

var GameDefine = {};
GameDefine.DESKPOS_TYPE = cc.Enum({
	SHANG: 0, //上 0123
	ZUO: 1, //左
	XIA: 2, //下
	YOU: 3 //右
});

GameDefine.PAISHOWTYPE = cc.Enum({
	GAI: -1,
	SHOU: -1,
	END: -1,
	PENG: -1,
	PENGBY: -1,
	SHOUGAI: -1 //手上的牌盖住
});

GameDefine.HUASE = {
	TONG: 1, //筒子 1-9 eg: 91九筒 92九万 93九条 94秋
	WANG: 2, //万 1-9
	TIAO: 3, //条子1-9
	TESHU: 4 //特殊 1白板2东3南4西5北6发7春8夏9秋10冬11中12竹13兰14梅15菊 
};

GameDefine.VOTESTATUS = {
	NOVOTE: 0,
	AGREE: 1,
	DISAGREE: 2
};

GameDefine.DIRECTION_TYPE = {
	DONG: 51, //东
	NAN: 52, //南
	XI: 53, //西
	BEI: 54 //北
};
//PuTongHu  = 0
//MingGang2 = 1 //手上有三张一样且未碰出去的牌，杠别人打出来的
//PengPai   = 2
//ChiPai    = 3
//ZiMoHu    = 4
//AnGang    = 5
//MingGang1 = 6 //手上有三张碰出去的牌，杠自己摸的
//吃牌类型
GameDefine.EATPAI_TYPE = {
	PuTongHu: 0,
	MingGang2: 1,
	PengPai: 2,
	ChiPai: 3,
	ZiMoHu: 4,
	AnGang: 5,
	MingGang1: 6,
	QiangGang: 7,
	GuoPai: 8,
	WaHua: 9

	//出牌状态
};GameDefine.CHUPAIRESULT = {
	NOEAT: 2, //下一个玩家摸牌
	EATED: 3 //被某人吃掉了
};

GameDefine.TURN_STATUS = {
	NOTURN: 0, //不轮到你出牌
	TURNTOPLAY: 1, //未打牌
	WAITOPT: 2 //打了牌 等待其他人操作

	//玩家准备状态
};GameDefine.PLAYER_READY = {
	NO_CARD: 1, //无房卡 
	NO_READY: 2, //未准备
	READY: 3, //已经准备
	OFFLINE: 4, //diaoxian
	DAPAIING: 5 //高高兴兴打牌中
};

GameDefine.SPECIALPAIHY = {
	//serverID <--> localID
	41: 114, //中
	42: 64, //發
	43: 14, //白
	47: 104, //冬
	51: 24, //东
	52: 34, //南
	53: 44, //西
	54: 54 //北
};

GameDefine.SPECIALPAIWL = {
	//serverID <--> localID
	41: 24, //东
	42: 34, //南
	43: 44, //西
	44: 54, //北
	45: 114, //中
	46: 64, //發
	47: 14, //白
	51: 144, //梅
	52: 134, //兰
	53: 124, //竹
	54: 154, //菊
	55: 74, //春
	56: 84, //夏
	57: 94, //秋
	58: 104 //冬
};

GameDefine.SP_PAIVOICE = {
	// 	1  : "tong",
	// 	2  : "tiao",
	// 	3  : "wan",
	114: "hongzhong", //中
	64: "facai", //發
	14: "baiban", //白
	24: "dongfeng", //东
	34: "nanfeng", //南
	44: "xifeng", //西
	54: "beifeng" //北
};

GameDefine.CREATROOMWL = {
	MoShi: {
		name: "模式",
		data: { 1: "平搓", 2: "庄家翻倍", 3: "闲家减半" }
	},
	RenShu: {
		name: "人数",
		data: { 3: "2人", 2: "3人", 1: "4人" }
	},
	BaoPai: {
		name: "包牌",
		data: { "true": "要包牌", 'false': "不包牌" }
	},
	ShengPaiTime: {
		name: "生牌阶段", data: { 1: "先打熟张", 2: "先打财神" }
	},
	JuShu: {
		name: "局数",
		data: { 11: "1圈", 12: "2圈", 14: "4圈",
			21: "4局", 22: "8局", 23: "12局", 24: "16局", 25: "20局", 26: "24局", 27: "28局", 28: "32局" }
	},
	ZhiFu: {
		name: "支付方式",
		data: { 1: "房主支付", 2: "平均支付", 3: "冠军支付" }
	},
	WanFa: {
		name: "玩法",
		data: { 1: "小闹", 2: "大闹", 3: "全闹", 4: "常规无花" }
	},
	explain: {
		ZhiFu1: "牌局结束后,由房主全额支付房费",
		ZhiFu2: "牌局结束后,由玩家平均分摊房费",
		ZhiFu3: "牌局结束后,由得分最高的玩家支付房费"
	}
};

GameDefine.CREATROOMHY = {
	GameNum1: {
		name: "圈数",
		data: { 1: "1圈", 2: "2圈", 4: "4圈" }
	},
	GameNum2: {
		name: "局数",
		data: { 4: "4局", 8: "8局", 16: "16局" }
	},
	PaymentMethod: {
		name: "支付方式",
		data: { 1: "房主支付", 2: "平均支付", 3: "冠军支付" }
	},

	GshOp: {
		name: "玩法",
		data: { 1: "杠上花算4胡", 2: "杠上花无胡数" }
	},
	NoticeType: {
		name: "提示",
		// data : {1:"智能提示: 提示胡牌类型、最大翻数和所胡牌的张数", 2:"专业模式: 只提示是否胡牌"},
		data: { 1: "智能提示", 2: "专业模式" }
	},

	explain: {
		PaymentMethod1: "牌局结束后,由房主全额支付房费",
		PaymentMethod2: "牌局结束后,由玩家平均分摊房费",
		PaymentMethod3: "牌局结束后,由得分最高的玩家支付房费"
	}

	//胡数 localText
	//sort 排序谁大谁优先显示
};GameDefine.HSTEXT = {
	dh: { name: "底胡", sort: 15, hucount: 4 },
	dzb: { name: "门风对", sort: 14, hucount: 2 },
	dzz: { name: "字牌对", sort: 13, hucount: 2 },
	yk: { name: "硬张刻", sort: 12, hucount: 4 },
	rk: { name: "软张刻", sort: 11, hucount: 2 },
	yak: { name: "硬张暗刻", sort: 10, hucount: 8 },
	rak: { name: "软张暗刻", sort: 9, hucount: 4 },
	ymg: { name: "硬张明杠", sort: 8, hucount: 16 },
	rmg: { name: "软张明杠", sort: 7, hucount: 8 },
	yag: { name: "硬张暗杠", sort: 6, hucount: 32 },
	rag: { name: "软张暗杠", sort: 5, hucount: 16 },
	zm: { name: "自摸", sort: 4, hucount: 2 },
	qd: { name: "嵌档", sort: 3, hucount: 2 },
	ddh: { name: "对对胡", sort: 2, hucount: 4 },
	gsh: { name: "杠上花", sort: 1, hucount: 4 }
};

GameDefine.FSTEXT = {
	//翻数，未胡牌/已胡牌翻数
	zfbk: { name: "字牌刻", sort: 1, fcount: 1 },
	zfbg: { name: "字牌杠", sort: 1, fcount: 1 },
	sfk: { name: "门风刻", sort: 1, fcount: 1 },
	sfg: { name: "门风杠", sort: 1, fcount: 1 },
	//翻数，已胡牌翻数
	wcs: { name: "无财神", sort: 1, fcount: 2 },
	cshy: { name: "财神还原", sort: 1, fcount: 1 },
	hys: { name: "混一色", sort: 1, fcount: 1 },
	qys: { name: "清一色", sort: 1, fcount: 2 }

	// ZIMOCOUNT 
	// HUPAICOUNT
	// LAZICOUNT
	// BAOYUANCOUNT
	// TIANHUCOUNT
	// DIHUCOUNT
	// XIANGDUIHUSU
	// ZHANJIINFOCOUNT
};GameDefine.TOTALREPORT = ["自摸次数:", "胡牌次数:", "辣子次数:", "包圆次数:", "天胡次数:", "地胡次数:", "总战绩:"];

GameDefine.CHATCOMMONTEXT = [{ id: 201, content: "快点嘛！又少打两把了！" }, { id: 202, content: "稍等一下，我想想打哪张牌！" }, { id: 203, content: "你们小心点，我听牌了！" }, { id: 204, content: "不要走！决战到天亮！" }, { id: 205, content: "你这牌打得也太好了！" }, { id: 206, content: "等下，我上个厕所！" }, { id: 207, content: "好久都没胡过牌了！" }, { id: 208, content: "今天的手气太差了，输惨了！" }];

GameDefine.CHATCOMMONEMOJI = [{ id: 101, content: "bishi" }, { id: 102, content: "fadai" }, { id: 103, content: "han" }, { id: 104, content: "jianxiao" }, { id: 105, content: "ku" }, { id: 106, content: "kubile" }, { id: 107, content: "kuxiao" }, { id: 108, content: "shengqi" }, { id: 109, content: "tu" }, { id: 110, content: "wabishi" }, { id: 111, content: "yun" }, { id: 112, content: "zan" }];

GameDefine.CHATINTERACT = [{ id: 1, nodeName: "liwu2", animaName: "Hua" }, { id: 2, nodeName: "liwu1", animaName: "Jidan" }, { id: 3, nodeName: "liwu1", animaName: "Tuoxie" }, { id: 4, nodeName: "liwu2", animaName: "Wen" }];

GameDefine.CHATTYPE = {
	EMOJI: 1, //EMOJI
	TEXT: 2, //common text
	VOICE: 3, //VOICE
	COORD: 4, //坐标
	INTERACT: 5 //互动表情
};

GameDefine.LOGINTYPE = {
	WX: 1, //wechat Login
	YK: 2, //stranger Login
	ID: 3 //ID Login
};

GameDefine.GAMEVOICELANCN = {
	"mandarin": "普通话",
	"hyDialect": "黄岩方言"
};

GameDefine.CAISHENCOLOR = new cc.Color(155, 255, 131);
GameDefine.WHITECOLOR = new cc.Color(255, 255, 255);

GameDefine.REPLAYOPT = {
	MP: 1, //摸牌
	GMP: 2, //杠后摸牌 
	CP: 3, //出牌
	CHI: 4, //吃牌
	PENG: 5, //碰牌
	MGT: 6, //明杠2
	PTH: 7, //普通胡
	MGO: 8, //明杠1
	AG: 9, //暗杠2
	ZM: 10, //自摸
	QGH: 11, //抢杠胡
	GCHZ: 12, //过出牌组合
	GMPZ: 13, //过摸排组合
	GQQH: 14 //过抢杠胡  
};

GameDefine.WLRETCODE = {
	1: "服务器忙",
	2: "非法游戏类型",
	3: "登录失败",
	4: "使用第三方登录",
	5: "非法第三方平台",
	6: "重复登录",
	7: "非法认证名",
	8: "非法认证号",
	9: "认证失败",
	10: "服务未开启",
	11: "服务停止",
	12: "非法房间号",
	13: "房间未找到",
	14: "已在房间中",
	15: "已在另一个房",
	16: "未开启ＧＰＳ",
	17: "此房间人数已满",
	18: "房间选项非法",
	19: "温岭麻将房卡不足,请充值",
	20: "重试",
	21: "房间正在解散",
	22: "未在该房间中",
	23: "发起投票失败",
	24: "投票失败",
	25: "已在房间中",
	26: "非法操作",
	27: "打出牌不能为财神",
	28: "未开启定位",
	29: "非法吃牌组合",
	30: "打出牌不能为特殊牌"
};

GameDefine.HYRETCODE = {
	1: "服务器忙",
	2: "非法游戏类型",
	3: "登录失败",
	4: "使用第三方登录",
	5: "非法第三方平台",
	6: "重复登录",
	7: "非法认证名",
	8: "非法认证号",
	9: "认证失败",
	10: "服务未开启",
	11: "服务停止",
	12: "无效房间id",
	13: "房间找不到",
	14: "已在房间中",
	15: "已在别的房间中",
	16: "未开启ＧＰＳ",
	17: "此房间人数已满",
	18: "房间选项有误",
	19: "黄岩麻将房卡不足,请充值",
	20: "未开启定位"
};

module.exports = GameDefine;

cc._RF.pop();