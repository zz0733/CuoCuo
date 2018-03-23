/***************************
 * 整个斗地主游戏的入口
 * 同时也包括一些简单的初始化工作
 * *******/

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

    onLoad () {

    },



   Test: function(){
        //测试按钮
       var TestArr = [1,14,27,40,53,54,52,39,13,26,3,5,6,7,8,9];
        cc.YL.GameAction.StartFaPai(TestArr);
   },
   Test_1: function () {
       cc.YL.PokerTip.startAnalysis();

   },
    Test_2: function () {
        cc.YL.PokerTip.clickTipsBtn(11,3,[3,3,3,3]);

    }
});
