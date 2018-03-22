/*************
 *  手牌转换
 *  服务器只返回手牌的唯一ID
 *  需要客户端转换成对应的花色和牌值
 *
 *  *******/
var CardValueTrans = cc.Class({});
CardValueTrans.pokerColorArr = ["梅花", "红心", "方片", "黑梅"];
CardValueTrans.TransPokerValue = function (PokerID) {
    return this._transPoker(PokerID);
};
CardValueTrans._transPoker = function (PokerID) {
    var _color = this.pokerColorArr[parseInt((PokerID - 1) / 13)];
    var _value = (PokerID - 1) % 13;
    return {
        value : _value,
        color : _color,
    };
};
cc.YL.cardValueTrans = CardValueTrans;
module.exports = CardValueTrans;
