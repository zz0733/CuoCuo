(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Desk/DDZ_LeaveAndDiss.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a029689eSZHtrS5+4sy+c/Q', 'DDZ_LeaveAndDiss', __filename);
// poker/DDZ/Script/Desk/DDZ_LeaveAndDiss.js

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

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start: function start() {},


    onClickCancel: function onClickCancel() {
        cc.YL.DDZAudio.playBtnClose();
        this.node.active = false;
        this.node.destroy();
    },
    initUIByStatus: function initUIByStatus() {
        if (cc.YL.DDZCurrentRound == 0) {
            if (cc.YL.DDZDeskInfo.owner == fun.db.getData('UserInfo').UserId) {
                this.node.getChildByName("back").getChildByName("name").getComponent(cc.Label).string = "是否选择退出房间？因您是房主，离开后房间将会解散";
            } else {
                this.node.getChildByName("back").getChildByName("name").getComponent(cc.Label).string = "是否选择退出房间？";
            }
        } else {
            this.node.getChildByName("back").getChildByName("name").getComponent(cc.Label).string = "需要牌桌上的玩家全票通过后才能退出房间";
        }
    },
    onClickComfire: function onClickComfire() {
        cc.YL.DDZAudio.playBtnClick();
        if (cc.YL.DDZCurrentRound == 0) {
            fun.net.send("PID_LEAVEDESK_REQ", {
                userId: fun.db.getData('UserInfo').UserId
            });
        } else {
            fun.net.send("PID_DISSOLVE_REQ", {
                userId: fun.db.getData('UserInfo').UserId
            });
        }
        this.node.active = false;
        this.node.destroy();
    }
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
        //# sourceMappingURL=DDZ_LeaveAndDiss.js.map
        