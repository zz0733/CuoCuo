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

    start () {

    },
    initPopStr: function(str,type){
        //type == 1 房间解散失败
        // type  ===2 房间解散成功
        this.type = type;
        this.node.getChildByName("back").getChildByName("name").getComponent(cc.Label).string = str;
    },
    onClickConfire: function(event){
        cc.YL.DDZAudio.playBtnClick();
        if(this.type == 1){
            this.node.active = false;
            this.node.destroy();
        }else if(this.type == 2){
            cc.director.loadScene("hall");
            fun.db.setData('RoomInfo', {
                GameType: 0,
            });
            event.target.active = false;
        }else{
            this.node.active = false;
        }
    }
    ,
});
