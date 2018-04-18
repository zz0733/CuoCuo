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
        spring: cc.Prefab,
        Dizhu: cc.Prefab,
        Boom: cc.Prefab,
        rocket: cc.Prefab,
        shunzi: cc.Prefab,
        waring: cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    PlaySpring: function (spr, respr) {
        this.clearNode();
        var springNode = this.node.getChildByName("DDZ_Spring") ?
            this.node.getChildByName("DDZ_Spring") :
            cc.instantiate(this.spring);
        this.node.getChildByName("DDZ_Spring") ?
            this.node.getChildByName("DDZ_Spring").active = true :
            this.node.addChild(springNode);
        if (spr) {
            var name = "Chuntian";
        } else if (respr) {
            var name = "Fanchun";
        }
        var finishFunc = function () {
            this.clearNode();
        }.bind(this);
        springNode.getComponent(sp.Skeleton).animation = name;
        springNode.getComponent(sp.Skeleton).setCompleteListener(finishFunc);
    },
    PlayShunLianFei: function (playerIndex, str) {
        this.clearNode();
        var ShunLianFeiNode = this.node.getChildByName("DDZ_Shunzi") ?
            this.node.getChildByName("DDZ_Shunzi") :
            cc.instantiate(this.shunzi);
        this.node.getChildByName("DDZ_Shunzi") ?
            this.node.getChildByName("DDZ_Shunzi").active = true :
            this.node.addChild(ShunLianFeiNode);
        var playerIndeArr = ["_Zuo", "_You", "_Zuo"];
        var finishFunc = function () {
            this.clearNode();
        }.bind(this);
        ShunLianFeiNode.getComponent(sp.Skeleton).animation = str + playerIndeArr[playerIndex];
        ShunLianFeiNode.getComponent(sp.Skeleton).setCompleteListener(finishFunc);
        if (str == "Feiji") {
            ShunLianFeiNode.setPosition(0, -100);
        } else {
            var posArr = [cc.p(50, -114), cc.p(340, 56), cc.p(-326, 56)];
            ShunLianFeiNode.setPosition(posArr[playerIndex]);
        }
    },
    PlayBoom: function (playerIndex) {
        this.clearNode();
        var boomNode = this.node.getChildByName("DDZ_Boom") ?
            this.node.getChildByName("DDZ_Boom") :
            cc.instantiate(this.Boom);
        this.node.getChildByName("DDZ_Boom") ?
            this.node.getChildByName("DDZ_Boom").active = true :
            this.node.addChild(boomNode);
        var animClipArr = ["Xia", "You", "Zuo", "Bao"];
        boomNode.getComponent(sp.Skeleton).animation = animClipArr[playerIndex];
        var firstFunc = function () {
            this.clearNode();
        }.bind(this);
        boomNode.getComponent(sp.Skeleton).setCompleteListener(firstFunc);

    },
    PlayDizhu: function (playerIndex) {
        this.clearNode();
        var DiZhuNode = this.node.getChildByName("DDZ_Dizhu") ?
            this.node.getChildByName("DDZ_Dizhu") :
            cc.instantiate(this.Dizhu);
        this.node.getChildByName("DDZ_Dizhu") ?
            this.node.getChildByName("DDZ_Dizhu").active = true :
            this.node.addChild(DiZhuNode);
        var animaArr = ["Luo_Zuo","Luo_Zuo","Luo_Zuo"];
        var posArr = [cc.p(-591,-108),cc.p(593,258),cc.p(-582,258)];
        var posArrEnd = [cc.p(-625,-150),cc.p(580,197),cc.p(-603,197)];
        DiZhuNode.getComponent(sp.Skeleton).animation = "Chuxian";
        var thridFunc = function(){
            this.clearNode();
        }.bind(this);
        var secondFunc = function () {
            DiZhuNode.getComponent(sp.Skeleton).animation = animaArr[playerIndex];
            DiZhuNode.setPosition(posArrEnd[playerIndex]);
            DiZhuNode.getComponent(sp.Skeleton).setCompleteListener(thridFunc);
        }.bind(this);
        var firstFunc = function () {
            DiZhuNode.getComponent(sp.Skeleton).animation = "Fei";
            DiZhuNode.stopAllActions();
            DiZhuNode.runAction(cc.moveTo(0.3,posArr[playerIndex]));
            DiZhuNode.getComponent(sp.Skeleton).setCompleteListener(secondFunc);
        };
        DiZhuNode.getComponent(sp.Skeleton).setCompleteListener(firstFunc);
    },
    PlayRocket: function (playerIndex) {
        this.clearNode();
        var rocketNode = this.node.getChildByName("DDZ_Rocket") ?
            this.node.getChildByName("DDZ_Rocket") :
            cc.instantiate(this.rocket);
        this.node.getChildByName("DDZ_Rocket") ?
            this.node.getChildByName("DDZ_Rocket").active = true :
            this.node.addChild(rocketNode);
        var posArr = [cc.p(0, -70), cc.p(411, 103), cc.p(-396, 103)];
        rocketNode.setPosition(posArr[playerIndex]);
        rocketNode.getComponent(sp.Skeleton).animation = "Fei";
        var secondFunc = function () {
            this.clearNode();
        }.bind(this);
        var firstFunc = function () {
            rocketNode.getComponent(sp.Skeleton).animation = "Luo";
            rocketNode.setPosition(0, -100);
            rocketNode.getComponent(sp.Skeleton).setCompleteListener(secondFunc);
        };
        rocketNode.getComponent(sp.Skeleton).setCompleteListener(firstFunc);
    },
    PlayWaring: function (index) {
        this.clearNode();
        var posArr = [cc.p(-445, -136), cc.p(440, 224), cc.p(-440, 224)];
        var waringNode = cc.instantiate(this.waring);
        this.node.addChild(waringNode);
        waringNode.getComponent(sp.Skeleton).animation = "animation";
        waringNode.setPosition(posArr[index]);
    },
    clearNode: function () {
        for (var i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i].name != "DDZ_Waring") {
                this.node.children[i].active = false;
                this.node.children[i].removeFromParent();
            }
        }
    }
});
