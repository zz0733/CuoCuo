(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/config/GameCfg.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7d53dpPcHtJkbKqCPGpAYSA', 'GameCfg', __filename);
// hall/script/config/GameCfg.js

'use strict';

var _gameTypeSceneNameMap, _gameTypeZhNameMap;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

<<<<<<< HEAD
var version = 'version:2.1.0.7308';
=======
var version = 'version:2.1.0.7315';
>>>>>>> f8a5a6134d18df4ab898a5e431e5f0b36bc013ac
/*苹果审核
 更新时间：2018年3月6日
 更新版本：2.0.6.6927
 更新内容：
 1.优化游戏体验
 :::4.0.1

 Bundle Identifier: com.youle2011.hymajiang
 Version: 2.0.8
 Build: 2.0.8
 */
/*渔船用户
 更新时间：2018年3月26日
 更新版本：2.0.6.7030
 更新内容：
 1.优化游戏体验
 :::3.0.10

 Bundle Identifier: com.scyoule.cuocuo
 Version: 2.0.10
 Build: 2.0.10
 */

/*热更新(强制更新)
更新时间：2018年04月17日
<<<<<<< HEAD
更新版本：2.1.0.7305
=======
更新版本：2.1.0.7313
>>>>>>> f8a5a6134d18df4ab898a5e431e5f0b36bc013ac
更新内容：
1.游戏界面大翻新
2.新增限时卡，可以在指定时间内自己使用或赠送他人
3.修复部分已知BUG
4.优化游戏体验
:::4.0.2
 */

var logLevel = cc.Enum({
    none: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6
});

var logTags = {
    net: logLevel.info,
    funEvent: logLevel.info,
    funDB: logLevel.info,
    funUtils: logLevel.info,
    login: logLevel.info,
    hotUpdate: logLevel.info,
    hall: logLevel.verbose,
    mj: logLevel.verbose
};

var forceUpdateUrl = cc.Enum({
    android: 'http://download.game2me.net/',
    ios: 'https://itunes.apple.com/cn/app/id1261810679?mt=8'
});

var commonUrl = cc.Enum({
    timeLimitCard: 'http://download.game2me.net/sharePage/index.html'
});

var loginUrl = ['ws://192.168.1.77:9999/ws', //内网 'ws://192.168.1.77:9999/ws'
<<<<<<< HEAD
=======
// 'ws://192.168.1.77:9999/ws',       //内网 'ws://192.168.1.77:9999/ws'
// 'ws://192.168.1.77:9999/ws',       //内网 'ws://192.168.1.77:9999/ws'
// 'ws://192.168.1.77:9999/ws',       //内网 'ws://192.168.1.77:9999/ws'
// 'ws://192.168.1.77:9999/ws',       //内网 'ws://192.168.1.77:9999/ws'
>>>>>>> f8a5a6134d18df4ab898a5e431e5f0b36bc013ac
'ws://am.fmgames.cn:29990/ws', //外网 'ws://70.103.170.210:29990/ws'
'ws://yuchuan.fmgames.cn:9901/ws', //渔船 'ws://208.185.128.236:9901/ws'
'ws://sh.fmgames.cn:9901/ws', //苹果审核
'ws://208.185.128.235:9901/ws'];

var loginUrlType = cc.Enum({
    intranet: 0,
    extranet: 1,
    fisher: 2,
    apple: 3,
    test: 4
});

var loginType = cc.Enum({
    weChat: 0,
    guest: 1,
    ID: 2
});

// 游戏热更新名字，用于判断该游戏在本次启动后时候已经热更新过
var gameName = cc.Enum({
    hall: 0,
    mahjong: 1,
    poker: 2,
    digFlower: 3
});

var voiceLanguage = cc.Enum({
    mandarin: 0,
    huangYan: 1
});

var gameType = cc.Enum({
    universal: 0,
    maJiangWenLing: 1,
    sanGong: 2,
    maJiangHuangYan: 3,
    niuNiu: 4,
    digFlower: 5,
    DDZ: 6,
    scMahjong: 7
});

var gameTypeSceneNameMap = (_gameTypeSceneNameMap = {}, _defineProperty(_gameTypeSceneNameMap, gameType.maJiangHuangYan, "majiang"), _defineProperty(_gameTypeSceneNameMap, gameType.maJiangWenLing, "majiang"), _defineProperty(_gameTypeSceneNameMap, gameType.sanGong, "puke"), _defineProperty(_gameTypeSceneNameMap, gameType.niuNiu, "puke"), _defineProperty(_gameTypeSceneNameMap, gameType.digFlower, "wahua"), _defineProperty(_gameTypeSceneNameMap, gameType.DDZ, "DouDiZhu"), _defineProperty(_gameTypeSceneNameMap, gameType.scMahjong, "majiang"), _gameTypeSceneNameMap);

var gameTypeZhNameMap = (_gameTypeZhNameMap = {}, _defineProperty(_gameTypeZhNameMap, gameType.maJiangHuangYan, "黄岩麻将"), _defineProperty(_gameTypeZhNameMap, gameType.maJiangWenLing, "温岭麻将"), _defineProperty(_gameTypeZhNameMap, gameType.sanGong, "三公"), _defineProperty(_gameTypeZhNameMap, gameType.niuNiu, "牛牛"), _defineProperty(_gameTypeZhNameMap, gameType.digFlower, "温岭挖花"), _defineProperty(_gameTypeZhNameMap, gameType.DDZ, "斗地主"), _defineProperty(_gameTypeZhNameMap, gameType.scMahjong, "四川麻将"), _gameTypeZhNameMap);

var wltest = {
    logUrl: "ws://192.168.1.89:6868/websocket",
    loginType: loginType.guest,
    logLevel: logLevel.verbose,
    enableAutoLogin: false,
    logSaveDay: 3,
    enableUpdate: false,
    voiceLanguage: voiceLanguage.mandarin,
    soundValume: 0.8,
    musicValume: 0.8
};

var compileType = cc.Enum({
    custom: 0,
    wltest: 1
});

var compileContent = [{}, wltest];

var releaseName = ['normal', 'apple', 'release', 'fisher'];

var releaseType = cc.Enum({
    normal: 0,
    apple: 1,
    release: 2,
    fisher: 3
});

var itemCsv = cc.Enum({
    huangYan: 1,
    wenLing: 2,
    voucher: 3
});

var pRetCode = {
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
    15: "已在另一个房间中"
};

module.exports = {
    version: version,
    logLevel: logLevel,
    forceUpdateUrl: forceUpdateUrl,
    commonUrl: commonUrl,
    logTags: logTags,
    loginUrl: loginUrl,
    loginUrlType: loginUrlType,
    loginType: loginType,
    gameName: gameName,
    voiceLanguage: voiceLanguage,
    gameType: gameType,
    gameTypeSceneNameMap: gameTypeSceneNameMap,
    gameTypeZhNameMap: gameTypeZhNameMap,
    compileType: compileType,
    compileContent: compileContent,
    releaseName: releaseName,
    releaseType: releaseType,
    pRetCode: pRetCode,
    itemCsv: itemCsv
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
        //# sourceMappingURL=GameCfg.js.map
        