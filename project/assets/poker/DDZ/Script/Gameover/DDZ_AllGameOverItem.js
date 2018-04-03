// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        atlas: cc.SpriteAtlas,

    },

    //     message ddz_play_userLotteryInfo {
//     optional int64 userId = 1; //玩家ID
//     optional string headUrl = 2; //头像
//     optional string nickName = 3; //昵称
//     optional int32 boomCount = 4; //炸弹数量
//     optional int32 airCount = 5; //飞机数量
//     optional int32 lianDuiCount = 6; //连对数量
//     optional int32 springCount = 7; //春天数量
//     optional int32 score = 8; //积分
//     optional bool isChampion = 9; //是否是冠军
//     optional int32 expendCardsCount = 10; //房卡消耗
//     optional int32 remainCardsCount = 11; //剩余房卡数
// }
//

    start () {

    },
    initItemNode: function (data) {
        this.bindNode();
        this.initUI(data);
    },
    bindNode: function () {
        this.headNode = this.node.getChildByName("HeadNode");
        this.totalInfoNode = this.node.getChildByName("TotalInfo");
        this.totalCoinNode = this.node.getChildByName("TotalCoin");
        this.fangKaNode = this.node.getChildByName("FangKa");
        this.IDNode = this.headNode.getChildByName("IDBG").getChildByName("ID");
        this.headSprNode = this.headNode.getChildByName("HeadSpr");
        this.nickNameNode = this.headNode.getChildByName("nickName");
        this.winIconNode = this.headNode.getChildByName("WinIcon");
        this.zadan = this.totalInfoNode.getChildByName("title1").getChildByName("Num");
        this.feiji = this.totalInfoNode.getChildByName("title2").getChildByName("Num");
        this.liandui = this.totalInfoNode.getChildByName("title3").getChildByName("Num");
        this.spring = this.totalInfoNode.getChildByName("title4").getChildByName("Num");
        this.totalCoin = this.totalCoinNode.getChildByName("Title").getChildByName("Num");
        this.useFangKa = this.fangKaNode.getChildByName("cardSpr").getChildByName("Num");
        this.leaveFangKa = this.fangKaNode.getChildByName("cardSpr_1").getChildByName("Num");

    },
    initUI: function (data) {
        fun.utils.loadUrlRes(data.headUrl, this.headSprNode);// 头像
        if(data.isChampion == true){
            this.winIconNode.active = true;
            this.node.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("dz_dajiesuan_di2");
        }else{
            this.winIconNode.active = false;
            this.node.getComponent(cc.Sprite).spriteFrame = this.atlas.getSpriteFrame("dz_dajiesuan_di1");
        }
        this.IDNode.getComponent(cc.Label).string  = data.userId;
        this.nickNameNode.getComponent(cc.Label).string = data.nickName;
        this.zadan.getComponent(cc.Label).string = data.boomCount;
        this.feiji.getComponent(cc.Label).string = data.airCount;
        this.liandui.getComponent(cc.Label).string = data.lianDuiCount;
        this.spring.getComponent(cc.Label).string = data.springCount;
        this.totalCoin.getComponent(cc.Label).string = data.score;
        this.useFangKa.getComponent(cc.Label).string = data.expendCardsCount;
        this.leaveFangKa.getComponent(cc.Label).string = data.remainCardsCount;

    },
    // update (dt) {},
});
