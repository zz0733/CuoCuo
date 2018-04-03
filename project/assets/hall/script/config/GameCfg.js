const version = 'version:2.0.6.7030';
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
/*苹果审核
 更新时间：2018年3月9日
 更新版本：2.0.6.6953
 更新内容：
 1.优化游戏体验
 :::4.0.1

 Bundle Identifier: com.youle2011.hymajiang
 Version: 2.0.9
 Build: 2.0.9
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

const logLevel = cc.Enum({
    none: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
});

const logTags = {
    net: logLevel.info,
    funEvent: logLevel.info,
    funDB: logLevel.info,
    funUtils: logLevel.info,
    login: logLevel.info,
    hotUpdate: logLevel.info,
    hall: logLevel.verbose,
    mj: logLevel.verbose,
};

const forceUpdateUrl = cc.Enum({
    android: 'http://download.game2me.net/',
    ios: 'https://itunes.apple.com/cn/app/id1261810679?mt=8',
});

const loginUrl = [
    'ws://192.168.1.77:9999/ws',
    // 'ws://118.31.23.181:9901/ws',    //内网 ws://192.168.1.77:9999/ws
    'ws://am.fmgames.cn:29990/ws',  //外网 'ws://70.103.170.210:29990/ws'
    'ws://118.31.23.181:9901/ws',   //测试
    'ws://118.31.23.181:9901/ws',   //苹果审核上架  以前 ws://121.42.39.15:9901/ws
];

const loginUrlType = cc.Enum({
    intranet: 0,
    extranet: 1,
    test: 2,
    apple: 3,
});

const loginType = cc.Enum({
    weChat: 0,
    guest: 1,
    ID: 2,
});

// 游戏热更新名字，用于判断该游戏在本次启动后时候已经热更新过
const gameName = cc.Enum({
    hall: 0,
    mahjong: 1,
    poker: 2,
    digFlower: 3,
});

const voiceLanguage = cc.Enum({
    mandarin: 0,
    huangYan: 1,
});

const gameType = cc.Enum({
    universal: 0,
    maJiangWenLing: 1,
    sanGong: 2,
    maJiangHuangYan: 3,
    niuNiu: 4,
    digFlower: 5,
    DDZ: 6,
});

const gameTypeSceneNameMap = {
    [gameType.maJiangHuangYan]: "majiang",
    [gameType.maJiangWenLing]: "majiang",
    [gameType.sanGong]: "puke",
    [gameType.niuNiu]: "puke",
    [gameType.digFlower]: "wahua",
    [gameType.DDZ]: "DouDiZhu",
};

const gameTypeZhNameMap = {
    [gameType.maJiangHuangYan]: "黄岩麻将",
    [gameType.maJiangWenLing]: "温岭麻将",
    [gameType.sanGong]: "三公",
    [gameType.niuNiu]: "牛牛",
    [gameType.digFlower]: "温岭挖花",
    [gameType.DDZ]: "斗地主",
};

const wltest = {
    logUrl: "ws://192.168.1.89:6868/websocket",
    loginType: loginType.guest,
    logLevel: logLevel.verbose,
    enableAutoLogin: false,
    logSaveDay: 3,
    enableUpdate: false,
    voiceLanguage: voiceLanguage.mandarin,
    soundValume: 0.8,
    musicValume: 0.8,
};

const compileType = cc.Enum({
    custom: 0,
    wltest: 1,
});

const compileContent = [
    {},
    wltest,
];

const releaseName = [
    'normal',
    'apple',
    'release',
];

const releaseType = cc.Enum({
    normal: 0,
    apple: 1,
    release: 2,
});

const itemCsv = cc.Enum({
    huangYan: 1,
    wenLing: 2,
    voucher: 3
});

const pRetCode = {
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
    15: "已在另一个房间中",
};

module.exports = {
    version: version,
    logLevel: logLevel,
    forceUpdateUrl: forceUpdateUrl,
    logTags: logTags,
    loginUrl: loginUrl,
    loginUrlType: loginUrlType,
    loginType: loginType,
    gameName: gameName,
    voiceLanguage: voiceLanguage,
    gameType: gameType,
    gameTypeSceneNameMap,
    gameTypeZhNameMap,
    compileType: compileType,
    compileContent: compileContent,
    releaseName: releaseName,
    releaseType: releaseType,
    pRetCode: pRetCode,
    itemCsv: itemCsv,
};