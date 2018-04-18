"use strict";
cc._RF.push(module, 'ba935R9d3hNTpYNGKUDNjE1', 'DDZ_PlayerSelfCloseUpPoker');
// poker/DDZ/Script/Player/DDZ_PlayerSelfCloseUpPoker.js

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


    onClickClosUpPoker: function onClickClosUpPoker() {
        cc.YL.playerOutPokerArr = [];
        var pokerNode = cc.find("DDZ_UIROOT/MainNode/SelfPlayerPoker/HandPoker");
        if (pokerNode.children.length != 0) {
            var children = pokerNode.children;
            for (var i = 0; i < children.length; i++) {
                children[i].setPositionY(0);
            }
        }
    }
});

cc._RF.pop();