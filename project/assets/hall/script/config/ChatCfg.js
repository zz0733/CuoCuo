const gameConst = require('GameCfg');

const wenLingText = [
    '等一下，我上个厕所！',
    '神经啊，快等到过年了！',
    '那么慢，像老中医把脉一样！',
    '看错，6条看成9条，差点打错了！',
    '怎么老不胡，整个人都烦躁死了！',
    '上家，放点救济粮吃吃好吗？',
    '胆子这么大，这牌都敢打！',
    '养猪专业户啊？这样喂下家？',
    '没吃又没碰，坐着都要睡着了！',
    '手气这么差，摸猪屎了吧！',
    '那么会胡，挣死你！',
    '财神翻白板，双眼也发白！',
];

const huangYanText = [
    '快点嘛！又少打两把了！',
    '稍等一下，我想想打哪张牌！',
    '你们小心点，我听牌了！',
    '不要走！决战到天亮！',
    '你这牌也打的太好了！',
    '等下，我上个厕所！',
    '好久都没胡过牌了！',
    '今天的手气太差了,输惨了！',
];

const porkText = [
    '嘿，今天的牌好到爆！',
    '同志们，走起，走起哦！',
    '喂，快点亮牌吧，等到花都谢了！',
    '哎呦，你们太厉害了！',
    '顺儿郎当，庄刮四方！',
    '哎呀，今天的手气太差了！',
    '庄上霉，下重锤！',
    '唉，又是一个豌豆庄！',
];

const exporText = {
    [gameConst.gameType.maJiangWenLing]: wenLingText,
    [gameConst.gameType.maJiangHuangYan]: huangYanText,
    [gameConst.gameType.sanGong]: porkText,
    [gameConst.gameType.niuNiu]: porkText,
};

const emoji = [
    'jianxiao',
    'fadai',
    'han',
    'ku',
    'kubile',
    'kuxiao',
    'yun',
    'bishi',
    'tu',
    'wabishi',
    'shengqi',
    'zan',
];

module.exports = {
    exporText: exporText,
    emoji: emoji,
};