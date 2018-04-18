(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Config/DDZ_CardValueConfig.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '5ba26ZzLC1NU69ElGWN2C5+', 'DDZ_CardValueConfig', __filename);
// poker/DDZ/Script/Config/DDZ_CardValueConfig.js

"use strict";

/*************
 *  手牌转换
 *  服务器只返回手牌的唯一ID
 *  需要客户端转换成对应的花色和牌值
 *
 *  *******/
var CardtypeArrTrans = cc.Class({});
CardtypeArrTrans.pokertypeArrArr = ["02", "01", "02", "04"];
CardtypeArrTrans.TransPokertypeArr = function (PokerID) {
    return this._transPoker(PokerID);
};
CardtypeArrTrans.pokerMap = [{}, { typeArr: "03", valueArr: "3", Num: 3, ID: 1 }, { typeArr: "03", valueArr: "4", Num: 4, ID: 2 }, { typeArr: "03", valueArr: "5", Num: 5, ID: 3 }, { typeArr: "03", valueArr: "6", Num: 6, ID: 4 }, { typeArr: "03", valueArr: "7", Num: 7, ID: 5 }, { typeArr: "03", valueArr: "8", Num: 8, ID: 6 }, { typeArr: "03", valueArr: "9", Num: 9, ID: 7 }, { typeArr: "03", valueArr: "10", Num: 10, ID: 8 }, { typeArr: "03", valueArr: "J", Num: 11, ID: 9 }, { typeArr: "03", valueArr: "Q", Num: 12, ID: 10 }, { typeArr: "03", valueArr: "K", Num: 13, ID: 11 }, { typeArr: "03", valueArr: "A", Num: 14, ID: 12 }, { typeArr: "03", valueArr: "2", Num: 15, ID: 13 }, { typeArr: "01", valueArr: "3a", Num: 3, ID: 14 }, { typeArr: "01", valueArr: "4a", Num: 4, ID: 15 }, { typeArr: "01", valueArr: "5a", Num: 5, ID: 16 }, { typeArr: "01", valueArr: "6a", Num: 6, ID: 17 }, { typeArr: "01", valueArr: "7a", Num: 7, ID: 18 }, { typeArr: "01", valueArr: "8a", Num: 8, ID: 19 }, { typeArr: "01", valueArr: "9a", Num: 9, ID: 20 }, { typeArr: "01", valueArr: "10a", Num: 10, ID: 21 }, { typeArr: "01", valueArr: "J1", Num: 11, ID: 22 }, { typeArr: "01", valueArr: "Q1", Num: 12, ID: 23 }, { typeArr: "01", valueArr: "K1", Num: 13, ID: 24 }, { typeArr: "01", valueArr: "A1", Num: 14, ID: 25 }, { typeArr: "01", valueArr: "2a", Num: 15, ID: 26 }, { typeArr: "02", valueArr: "3a", Num: 3, ID: 27 }, { typeArr: "02", valueArr: "4a", Num: 4, ID: 28 }, { typeArr: "02", valueArr: "5a", Num: 5, ID: 29 }, { typeArr: "02", valueArr: "6a", Num: 6, ID: 30 }, { typeArr: "02", valueArr: "7a", Num: 7, ID: 31 }, { typeArr: "02", valueArr: "8a", Num: 8, ID: 32 }, { typeArr: "02", valueArr: "9a", Num: 9, ID: 33 }, { typeArr: "02", valueArr: "10a", Num: 10, ID: 34 }, { typeArr: "02", valueArr: "J1", Num: 11, ID: 35 }, { typeArr: "02", valueArr: "Q1", Num: 12, ID: 36 }, { typeArr: "02", valueArr: "K1", Num: 13, ID: 37 }, { typeArr: "02", valueArr: "A1", Num: 14, ID: 38 }, { typeArr: "02", valueArr: "2a", Num: 15, ID: 39 }, { typeArr: "04", valueArr: "3", Num: 3, ID: 40 }, { typeArr: "04", valueArr: "4", Num: 4, ID: 41 }, { typeArr: "04", valueArr: "5", Num: 5, ID: 42 }, { typeArr: "04", valueArr: "6", Num: 6, ID: 43 }, { typeArr: "04", valueArr: "7", Num: 7, ID: 44 }, { typeArr: "04", valueArr: "8", Num: 8, ID: 45 }, { typeArr: "04", valueArr: "9", Num: 9, ID: 46 }, { typeArr: "04", valueArr: "10", Num: 10, ID: 47 }, { typeArr: "04", valueArr: "J", Num: 11, ID: 48 }, { typeArr: "04", valueArr: "Q", Num: 12, ID: 49 }, { typeArr: "04", valueArr: "K", Num: 13, ID: 50 }, { typeArr: "04", valueArr: "A", Num: 14, ID: 51 }, { typeArr: "04", valueArr: "2", Num: 15, ID: 52 }, { typeArr: "00", valueArr: "W", Num: 53, ID: 53 }, { typeArr: "00", valueArr: "W1", Num: 54, ID: 54 }];
CardtypeArrTrans._transPoker = function (PokerID) {
    return this.pokerMap[PokerID];
};
cc.YL.cardtypeArrTrans = CardtypeArrTrans;
module.exports = CardtypeArrTrans;

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
        //# sourceMappingURL=DDZ_CardValueConfig.js.map
        