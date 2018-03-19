(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/ui/prefab/mjOptsUI.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8d9c9JwrVZEwp4a0aqCsR1h', 'mjOptsUI', __filename);
// mahjong/script/ui/prefab/mjOptsUI.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {
        //PuTongHu  = 0
        //MingGang2 = 1
        //PengPai   = 2
        //ChiPai    = 3
        //ZiMoHu    = 4
        //AnGang    = 5
        //MingGang1 = 6
        //qianggang = 7;
        //guo       = 8;
        var tagList = [];
        tagList[0] = "btnHu"; //
        tagList[1] = "btnGang"; //
        tagList[2] = "btnPeng"; //
        tagList[3] = "btnChi"; //
        tagList[4] = "btnHu"; //
        tagList[5] = "btnGang"; //
        tagList[6] = "btnGang"; //
        tagList[7] = "btnHu"; //
        tagList[8] = "btnGuo"; //
        this.ShowTagNodeList = tagList;
    },

    onDestroy: function onDestroy() {
        cc.log(" this opts prefab ui  destroy ");
    },

    getIsShowPai: function getIsShowPai(showTag) {
        var isShow = !(showTag === 0 || showTag === 4 || showTag === 7 || showTag === 8);
        return isShow;
    },

    init: function init(gameUI, eatObj, eatData) {
        var showTag = eatObj.dataIndex;
        this.gameUI = gameUI;
        this.eatObj = eatObj;
        var childName = this.ShowTagNodeList[showTag];
        var showNode = this.node.getChildByName(childName);
        this.eatData = eatData;
        var GameDefine = require("mjGameDefine");
        showNode.active = true;
        if (this.getIsShowPai(showTag)) {
            var mjNode = showNode.getChildByName("mj");
            var xiaType = GameDefine.DESKPOS_TYPE.XIA;
            var paiSprite = this.gameUI.getPaiSprite(eatObj.paiID);
            mjNode.getComponent(cc.Sprite).spriteFrame = paiSprite;
        }
    },

    onMeChilcked: function onMeChilcked() {
        this.eatObj.cb.call(this.gameUI, this.eatObj, this.eatData);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

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
        //# sourceMappingURL=mjOptsUI.js.map
        