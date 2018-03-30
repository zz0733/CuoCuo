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
        selfPos: cc.p(-304,-128),
        rightPos:cc.p(304,202),
        leftPos:cc.p(-304,202),
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    initNode: function(playerInfo,index){
        this.initByData(playerInfo);
        switch (index){
            case 1:{
                this.node.getChildByName("BG").setPositionX(this.selfPos);
                this.node.getChildByName("BG").getChildByName("Buttom").active = false;
                break;
            }
            case 2:{
                this.node.getChildByName("BG").setPositionX(this.rightPos);
                break;
            }
            case 3:{
                this.node.getChildByName("BG").setPositionX(this.leftPos);
                break;
            }
        }
    },
    initByData: function(data){
        this.node.getChildByName("BG").getChildByName("Top").
        getChildByName("nickName").getComponent(cc.Label).string  = "昵称: "+data.nickName.toString();
        this.node.getChildByName("BG").getChildByName("Top").
        getChildByName("ID").getComponent(cc.Label).string  = "ID: " + data.userId.toString();
        this.node.getChildByName("BG").getChildByName("Mid").
        getChildByName("Distance").getComponent(cc.Label).string  = "IP: " + data.ip.toString();

    },
    onClickGPSDetail: function(){
        cc.YL.log("点击打开GPS详情");
    },
    onClickTools: function(event,custom){
        switch (custom){
            case "1":{
                //玫瑰
                break;
            }
            case "2":{
                //kiss
                break;
            }
            case "3":{
                //鸡蛋
                break;
            }
            case "4":{
                //拖鞋
                break;
            }
        }
    },
    onCloseNode: function(){
        this.node.active = false;
        this.node.destroy();
    },
    // update (dt) {},
});
