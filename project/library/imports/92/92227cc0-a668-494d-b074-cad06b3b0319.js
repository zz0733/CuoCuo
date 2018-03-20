"use strict";
cc._RF.push(module, '92227zApmhJTbB0ytBrOwMZ', 'DDZ_CardTypeConfig');
// poker/DDZ/Script/Config/DDZ_CardTypeConfig.js

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
/*************
 *  牌类型枚举
 *  分为
 *  王炸 炸弹 单张 对子 三张 三带一 三带二 顺子 连对 飞机 四带二
 *  王炸最大，可以打任意其他的牌。 　　
 *  炸弹比王炸小，比其他牌大。
 *  都是炸弹时按牌的分值比大小。 　　
 *  除王炸和炸弹外，其他牌必须要牌型相同且总张数相同才能比大小。 　　
 *  单牌按分值比大小，依次是：大王 > 小王 >2>A>K>Q>J>10>9>8>7>6>5>4>3 ，不分花色。 　　
 *  对牌、三张牌都按分值比大小。 　　顺牌按最大的一张牌的分值来比大小。 　
 *  飞机带翅膀和四带二按其中的三顺和四张部分来比，带的牌不影响大小。
 *
 *  *******/
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

    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();