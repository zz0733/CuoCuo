// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
/*******
 *  游戏全部解散的prefab挂载脚本
 *  所有处理都在这里
 *  包含数据清空，初始化等
 *  ******/
cc.Class({
    extends: cc.Component,

    properties: {
        item: cc.Prefab,

    },


// //全局结算
// message ddz_play_lottery {
//     optional Header retMsg = 1;
//     repeated ddz_play_userLotteryInfo usersLotteryInfo = 2; //所有玩家的结算信息
//     optional int32 round = 3; //当前第几局ai
//     optional uint32 password = 4; //房间号
// }

    start () {

    },
    initAllGameOverNode: function (data) {
        this.node.getChildByName("BG").getChildByName("Mid").removeAllChildren();
        for (var i = 0; i < data.usersLotteryInfo.length; i++) {
            var itemNode = cc.instantiate(this.item);
            this.node.getChildByName("BG").getChildByName("Mid").addChild(itemNode);
            itemNode.getComponent("DDZ_AllGameOverItem").initItemNode(data.usersLotteryInfo[i]);
        }
        this.node.getChildByName("BG").getChildByName("Top").getChildByName("TimeBG").getChildByName("time").getComponent(cc.Label).string
            = cc.YL.DDZ_Osdate.LocalTimeString().toString();
        this.node.getChildByName("BG").getChildByName("Buttom").getChildByName("RoomInfo").getChildByName("lun").getComponent(cc.Label).string
            = "第" + data.round + "局";
        this.node.getChildByName("BG").getChildByName("Buttom").getChildByName("RoomInfo").getChildByName("PassWord").getComponent(cc.Label).string
            = data.password;
    },
    onShareClick: function(){

    },
    onClickExitClick: function(){
        cc.director.loadScene("hall");
    },
});
// RoomInfo
