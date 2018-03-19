let PukeDefine = require("PukeDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        RoomId       : cc.Label,
        JuShu        : cc.Label,
        DiFen        : cc.Label,
        WanFa        : cc.Label,
        AccountBox   : cc.Prefab,
        BtnShare     : cc.Node,
    },

    initTotalAccount : function (data) {
        if(fun.gameCfg.releaseType === gameConst.releaseType.apple){
            this.BtnShare.active = false;
        }
        this.RoomId.string = data.RoomId;
        this.JuShu.string  = data.JuShu;
        this.DiFen.string  = data.DiFen;
        this.WanFa.string  = data.ZhuangWei;

        for (let i in data.sortAccounts) {
            let value = data.sortAccounts[i];
            if (value.score === data.highestScore && data.highestScore != 0){
                value.winner = true;
            }
            let copyAccountBox = cc.instantiate(this.AccountBox);
            let pos = PukeDefine.POSITION.ACCOUT_BOX[parseInt(i)+1];
            copyAccountBox.setPosition(pos.x, pos.y);
            this.node.addChild(copyAccountBox);
            copyAccountBox.getComponent("PukeAccountBox").initAccountBox(value);
        }
    },

    btnWechatShare : function () {
        require('JSPhoneWeChat').WxShareFriendScreen();
    },

    btnReturnDaTing : function () {
        cc.director.loadScene("hall");
    }
});
