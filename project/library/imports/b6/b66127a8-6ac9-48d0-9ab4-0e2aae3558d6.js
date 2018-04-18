"use strict";
cc._RF.push(module, 'b6612eoaslI0Jq0DiquNVjW', 'whDefine');
// mahjong/script/wahua/common/whDefine.js

'use strict';

var whDefine = {};

whDefine.AllCardsNumber = 136; //牌的总数量
whDefine.InitCardsNumber = 20; //起手牌的数量
whDefine.SendCardNumber = 30; //玩家出牌的数量
whDefine.PlayCardHeight = -80; //玩家出牌多高才算确认出牌
whDefine.DoubleClickTime = 0.2; //牌的双击时间

whDefine.ErrorCode = {
	'10000': '成功Successful',
	'10001': '房卡不够',
	'10002': '用户为空',
	'10003': '房间ID为空',
	'10004': '房间信息异常',
	'10005': '连接GW失败',
	'10006': '用户在其他房间',
	'10007': '房间人数已满',
	'10008': '用户已经准备了',
	'10009': '房间roomPhase 错误',
	'10010': '庄家不为空',
	'10011': '已经摇过张',
	'10012': '手牌为空',
	'10013': '已经出过牌了',
	'10014': '牌没了',
	'10015': '信息为空',
	'10016': '房间禁止加入',
	'10017': '房间号错误',
	'10018': '庄参数错误',
	'10019': '已经操作过了',
	'10020': '分小了',
	'10021': '分错误',
	'10022': '操作失败',
	'10023': '人数超出',
	'10024': '定位出错',
	'10025': '出错SysError'
};

module.exports = whDefine;

cc._RF.pop();