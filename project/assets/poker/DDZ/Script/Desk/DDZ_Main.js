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
        cc.YL.DDZEventManager.init();//网络事件注册初始化
    },
    onDestroy(){
        cc.YL.DDZEventManager.destroy();//网络事件取消注册
    },


   Test: function(){
        //测试按钮
       var TestArr = [3,4,5,16,17,18,28,29,30,31,41,42,43,44,54,53,50,25];
        cc.YL.DDZGameAction.StartFaPai(TestArr);
   },
   Test_1: function () {
       cc.YL.PokerTip.startAnalysis();

   },
    Test_2: function () {
        cc.YL.PokerTip.clickTipsBtn(2,2,[3,3,3,4,4,4,5,6]);

    }
});
