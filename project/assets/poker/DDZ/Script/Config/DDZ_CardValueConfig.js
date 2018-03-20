/*************
 *  手牌转换
 *  服务器只返回手牌的唯一ID
 *  需要客户端转换成对应的花色和牌值
 *
 *  *******/
var CardValueTrans = cc.Class({});
CardValueTrans.pokerColorArr = ["梅花", "红心", "方片", "黑梅"];
CardValueTrans.TransPokerValue = function (PokerID) {
    this._transPoker(PokerID);
};
CardValueTrans._transPoker = function (PokerID) {
    var _color = this.pokerColorArr(parseInt((PokerID - 1) / 13));
    var _value = (PokerID - 1) % 13;
    cc.YL.log("扑克牌的花色%s和牌值%s", _color, _value);
};
cc.YL.cardValueTrans = CardValueTrans;
module.exports = CardValueTrans;
