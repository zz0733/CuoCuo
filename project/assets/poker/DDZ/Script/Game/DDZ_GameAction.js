/*************
 * 游戏内操作的所有处理
 * 只是玩家自己的按钮事件
 * 这些操作之后的渲染工作都在Player目录下对应玩家js
 * 包含有叫分
 * 加倍
 * 出牌
 * 过牌等
 * *********/
var GameAction = cc.Class({});

GameAction.StartFaPai = function (data){
    var pokerArr = cc.YL.DDZTools.SortPoker(data);
    var selfHandPokerNode = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
    selfHandPokerNode.getComponent("DDZ_PlayerSelfPoker").initHandPoker(pokerArr);
};

module.exports = GameAction;
cc.YL.GameAction = GameAction;