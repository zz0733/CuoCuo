"use strict";
cc._RF.push(module, '6ba20sfv7FLv53mJErElxzl', 'DDZ_Disslove');
// poker/DDZ/Script/Desk/DDZ_Disslove.js

"use strict";

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

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    onClickComfire: function onClickComfire() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_DISSOLVE_REPLY", {
            userId: fun.db.getData('UserInfo').UserId,
            isAgree: true
        });
    },
    onClickCancel: function onClickCancel() {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_DISSOLVE_REPLY", {
            userId: fun.db.getData('UserInfo').UserId,
            isAgree: false
        });
    },
    initUI: function initUI(msg) {
        // /广播玩家是否同意
        this.playerNode = this.node.getChildByName("back").getChildByName("playerList");
        var nickName = msg.applyer + "";
        if (fun.db.getData('UserInfo').UserId == msg.applyer) {
            nickName = cc.YL.DDZselfPlayerInfo.nickName;
            this.node.getChildByName("back").getChildByName("btnDisagree").active = false;
            this.node.getChildByName("back").getChildByName("btnAgree").active = false;
        }
        if (msg.applyer == cc.YL.DDZrightPlayerInfo.userId) {
            nickName = cc.YL.DDZrightPlayerInfo.nickName;
        }
        if (msg.applyer == cc.YL.DDZleftPlayerInfo.userId) {
            nickName = cc.YL.DDZleftPlayerInfo.nickName;
        }
        this.node.getChildByName("back").getChildByName("title").getComponent(cc.RichText).string = "玩家" + nickName + "申请退出游戏，请投票";
        this.playerNode.getChildByName("player_1").getChildByName("name").getComponent(cc.Label).string = cc.YL.DDZrightPlayerInfo.nickName + "";
        this.playerNode.getChildByName("player_2").getChildByName("name").getComponent(cc.Label).string = cc.YL.DDZleftPlayerInfo.nickName + "";
        this.playerNode.getChildByName("player_0").getChildByName("name").getComponent(cc.Label).string = cc.YL.DDZselfPlayerInfo.nickName + "";
        fun.utils.loadUrlRes(cc.YL.DDZrightPlayerInfo.headUrl, this.playerNode.getChildByName("player_1").getChildByName("img")); // 头像
        fun.utils.loadUrlRes(cc.YL.DDZleftPlayerInfo.headUrl, this.playerNode.getChildByName("player_2").getChildByName("img")); // 头像
        fun.utils.loadUrlRes(cc.YL.DDZselfPlayerInfo.headUrl, this.playerNode.getChildByName("player_0").getChildByName("img")); // 头像

        if (fun.db.getData('UserInfo').UserId == msg.responseUser) {
            msg.isAgree == true ? this.playerNode.getChildByName("player_0").getChildByName("ok").active = true :
            // this.playerNode.getChildByName("player_0").getChildByName("no").active = true;
            this.dissFail("解散房间失败，玩家" + cc.YL.DDZselfPlayerInfo.nickName + "拒绝解散房间");
            this.node.getChildByName("back").getChildByName("btnDisagree").active = false;
            this.node.getChildByName("back").getChildByName("btnAgree").active = false;
        }
        if (msg.responseUser == cc.YL.DDZrightPlayerInfo.userId) {

            msg.isAgree == true ? this.playerNode.getChildByName("player_1").getChildByName("ok").active = true :
            // this.playerNode.getChildByName("player_1").getChildByName("no").active = true;
            this.dissFail("解散房间失败，玩家" + cc.YL.DDZrightPlayerInfo.nickName + "拒绝解散房间");
        }
        if (msg.responseUser == cc.YL.DDZleftPlayerInfo.userId) {

            msg.isAgree == true ? this.playerNode.getChildByName("player_2").getChildByName("ok").active = true :
            // this.playerNode.getChildByName("player_2").getChildByName("no").active = true;
            this.dissFail("解散房间失败，玩家" + cc.YL.DDZleftPlayerInfo.nickName + "拒绝解散房间");
        }
        this.setTime(msg.remainSeconds);
    },
    setTime: function setTime(time) {
        this.timeLabNode = this.node.getChildByName("back").getChildByName("timeLabel");
        this.timeLabNode.getComponent(cc.Label).string = time;
        this.time = time;
        this.schedule(this.updateTimeStr, 1);
    },
    onDestroy: function onDestroy() {
        this.unschedule(this.updateTimeStr);
    },
    updateTimeStr: function updateTimeStr() {
        this.time--;
        if (this.time <= 0) {
            this.timeLabNode.getComponent(cc.Label).string = 0 + "";
            this.unschedule(this.updateTimeStr.bind(this));
        } else {
            this.timeLabNode.getComponent(cc.Label).string = this.time.toString();
        }
    },
    dissFail: function dissFail(str) {
        var UIROOT = cc.find("DDZ_UIROOT");
        UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showPopWin(str, 1);
        this.node.active = false;
        this.node.destroy();
    }

});

cc._RF.pop();