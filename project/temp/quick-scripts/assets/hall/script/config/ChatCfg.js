(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/config/ChatCfg.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b97d8C3KRpHPZ9ARn3X5iQQ', 'ChatCfg', __filename);
// hall/script/config/ChatCfg.js

'use strict';

var _exporText;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var gameConst = require('GameCfg');

var wenLingText = ['等一下，我上个厕所！', '神经啊，快等到过年了！', '那么慢，像老中医把脉一样！', '看错，6条看成9条，差点打错了！', '怎么老不胡，整个人都烦躁死了！', '上家，放点救济粮吃吃好吗？', '胆子这么大，这牌都敢打！', '养猪专业户啊？这样喂下家？', '没吃又没碰，坐着都要睡着了！', '手气这么差，摸猪屎了吧！', '那么会胡，挣死你！', '财神翻白板，双眼也发白！'];

var huangYanText = ['快点嘛！又少打两把了！', '稍等一下，我想想打哪张牌！', '你们小心点，我听牌了！', '不要走！决战到天亮！', '你这牌也打的太好了！', '等下，我上个厕所！', '好久都没胡过牌了！', '今天的手气太差了,输惨了！'];

var porkText = ['嘿，今天的牌好到爆！', '同志们，走起，走起哦！', '喂，快点亮牌吧，等到花都谢了！', '哎呦，你们太厉害了！', '顺儿郎当，庄刮四方！', '哎呀，今天的手气太差了！', '庄上霉，下重锤！', '唉，又是一个豌豆庄！'];

var exporText = (_exporText = {}, _defineProperty(_exporText, gameConst.gameType.maJiangWenLing, wenLingText), _defineProperty(_exporText, gameConst.gameType.maJiangHuangYan, huangYanText), _defineProperty(_exporText, gameConst.gameType.sanGong, porkText), _defineProperty(_exporText, gameConst.gameType.niuNiu, porkText), _exporText);

var emoji = ['jianxiao', 'fadai', 'han', 'ku', 'kubile', 'kuxiao', 'yun', 'bishi', 'tu', 'wabishi', 'shengqi', 'zan'];

module.exports = {
    exporText: exporText,
    emoji: emoji
};

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
        //# sourceMappingURL=ChatCfg.js.map
        