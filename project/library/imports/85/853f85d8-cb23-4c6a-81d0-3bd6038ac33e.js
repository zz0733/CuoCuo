"use strict";
cc._RF.push(module, '853f8XYyyNMaoHQO9YDisM+', 'DDZ_PlayerRightInfo');
// poker/DDZ/Script/Player/DDZ_PlayerRightInfo.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        playerInfo: null,
        txtAtlas: cc.SpriteAtlas
    },

    onLoad: function onLoad() {
        this.playerInfo = null;
        this.BtnNode = cc.find("DDZ_UIROOT/MainNode/PlayerBtnNode");
    },

    initRightPlayerNode: function initRightPlayerNode(data) {
        this.node.active = true;
        this.playerInfo = data;
        this.clearNodeUI();
        this.initNodeUI(data);
        this.showAndHideReady(data.isReady);
    },
    clearNodeUI: function clearNodeUI() {
        this.node.getChildByName("HeadNode").getComponent(cc.Sprite).spriteFrame = null;
        this.showDiZhuIcon(false);
        this.node.getChildByName("ID").getComponent(cc.Label).string = "";
        this.node.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = "";
        this.node.getChildByName("NickNameBG").getChildByName("Num").getComponent(cc.Label).string = "";
        this.clearRate();
        this.updateOutWord(parseInt(0));
    },
    initNodeUI: function initNodeUI(data) {
        fun.utils.loadUrlRes(data.headUrl, this.node.getChildByName("HeadNode")); // 头像
        this.showDiZhuIcon(false);
        this.node.getChildByName("ID").getComponent(cc.Label).string = data.userId;
        this.node.getChildByName("NickNameBG").getChildByName("Name").getComponent(cc.Label).string = data.nickName;
        this.node.getChildByName("NickNameBG").getChildByName("Num").getComponent(cc.Label).string = data.coin;
        this.node.getChildByName("Rate").active = false;
        if (cc.YL.DDZDeskInfo.status == 4 && data.isJiaoFen != -1) {
            // 叫分阶段
            this.updateOutWord(parseInt(data.isJiaoFen + 3));
        }
        if (data.isJiaBei == 1) {
            this.showRate(true);
        }
        if (data.isJiaBei != 0 && cc.YL.DDZDeskInfo.status == 5) {
            data.isJiaBei == 1 ? this.updateOutWord(2) : this.updateOutWord(13);
        }
        if ((cc.YL.DDZDeskInfo.status == 5 || cc.YL.DDZDeskInfo.status == 6) && cc.YL.loaderID == cc.YL.DDZrightPlayerInfo.userId) {
            this.showDiZhuIcon(true);
        }
        this.hideOffline();
        if (data.isBreak === true) {
            this.showOffline();
        }
    },
    showOffline: function showOffline() {
        this.node.getChildByName("OfflineNode").active = true;
    },
    hideOffline: function hideOffline() {
        this.node.getChildByName("OfflineNode").active = false;
    },
    showAndHideReady: function showAndHideReady(isReady) {
        if (isReady == true && cc.YL.DDZDeskInfo.status <= 2) {
            this.node.getChildByName("Word").active = true;
        } else {
            this.node.getChildByName("Word").active = false;
        }
    },
    showDiZhuIcon: function showDiZhuIcon(isDiZhu) {
        this.isDiZhu = isDiZhu;
        this.node.getChildByName("DiZhuIcon").active = this.isDiZhu;
    },
    onClickPlayerInfo: function onClickPlayerInfo() {
        cc.YL.DDZAudio.playBtnClick();
        cc.find("DDZ_UIROOT/MainNode").getComponent("DDZ_Main").initPlayerInfoNode(this.playerInfo, 2);
    },
    showRate: function showRate(active) {
        this.node.getChildByName("Rate").active = active;
    },
    clearRate: function clearRate() {
        this.node.getChildByName("Rate").active = false;
    },
    updateOutWord: function updateOutWord(strType) {
        // 不出 1 dz_zt0000
        // 加倍 2 dz_zt00
        // 不叫 3 dz_zt0
        // 一分 4 dz_zt1
        // 2分  5 dz_zt2
        // 3分  5 dz_zt3
        // 6分  5 dz_zt4
        // 9分  5 dz_zt5
        var fileNameArr = ["", "dz_zt000", "dz_zt00", "dz_zt0", "dz_zt1", "dz_zt2", "dz_zt3", "", "", "dz_zt4", "", "", "dz_zt5", "dz_zt7"];
        var atlas = this.txtAtlas;
        if (strType == 0 || !strType) {
            this.node.getChildByName("ShowWord").active = false;
        } else {
            this.node.getChildByName("ShowWord").active = true;
            this.node.getChildByName("ShowWord").getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(fileNameArr[strType]);
        }
    },
    showHeadAnimation: function showHeadAnimation(isShow) {
        this.node.getChildByName("HeadAnim").getComponent(sp.Skeleton).animation = "animation";
        this.node.getChildByName("HeadAnim").active = isShow;
    }
});

cc._RF.pop();