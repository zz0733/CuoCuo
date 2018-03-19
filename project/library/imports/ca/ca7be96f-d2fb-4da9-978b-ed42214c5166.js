"use strict";
cc._RF.push(module, 'ca7belv0vtNqZeL7UIhTFFm', 'PukeAccount');
// poker/script/prefab/PukeAccount.js

"use strict";

var PukeDefine = require("PukeDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        RoomId: cc.Label,
        JuShu: cc.Label,
        DiFen: cc.Label,
        WanFa: cc.Label,
        AccountBox: cc.Prefab,
        BtnShare: cc.Node
    },

    initTotalAccount: function initTotalAccount(data) {
        if (fun.gameCfg.releaseType === gameConst.releaseType.apple) {
            this.BtnShare.active = false;
        }
        this.RoomId.string = data.RoomId;
        this.JuShu.string = data.JuShu;
        this.DiFen.string = data.DiFen;
        this.WanFa.string = data.ZhuangWei;

        for (var i in data.sortAccounts) {
            var value = data.sortAccounts[i];
            if (value.score === data.highestScore && data.highestScore != 0) {
                value.winner = true;
            }
            var copyAccountBox = cc.instantiate(this.AccountBox);
            var pos = PukeDefine.POSITION.ACCOUT_BOX[parseInt(i) + 1];
            copyAccountBox.setPosition(pos.x, pos.y);
            this.node.addChild(copyAccountBox);
            copyAccountBox.getComponent("PukeAccountBox").initAccountBox(value);
        }
    },

    btnWechatShare: function btnWechatShare() {
        require('JSPhoneWeChat').WxShareFriendScreen();
    },

    btnReturnDaTing: function btnReturnDaTing() {
        cc.director.loadScene("hall");
    }
});

cc._RF.pop();