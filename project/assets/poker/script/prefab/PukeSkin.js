let PukeUtils     = require("PukeUtils");
let PukeData      = require("PukeData");
let PukeDefine    = require("PukeDefine");

cc.Class({
    extends: cc.Component,

    properties: {
        Skin1          : cc.Sprite,
        Skin2          : cc.Sprite,
        SkinChoose1    : cc.Node,
        SkinChoose2    : cc.Node,
        SkinNumber     : 2,
    },

    onLoad: function () {
        this.initSkin();
        this.initSkinChoose();
        let curSkin = PukeData.getSkin();
        this["SkinChoose"+curSkin].active = true;
    },

    initSkin : function () {
        let self = this;
        for (let i = 0; i < this.SkinNumber; i++) {
            let spriteName = PukeDefine.BACKGROUND[i];
            PukeUtils.LoadRes(spriteName, "SpriteName", function(frame){
                self["Skin"+(i+1)].spriteFrame = frame;
            });
        }
    },

    initSkinChoose : function () {
        for (let i = 1; i <= this.SkinNumber; i++) {
            this["SkinChoose"+i].active = false;
        }
    },

    onBtnSkinClicked : function (sender, num) {
        this.initSkinChoose();
        this["SkinChoose"+num].active = true;
        PukeData.setSkin(num);
        fun.event.dispatch('PukeSkin', num);
    },

    onBtnQuitClicked : function () {
        require('Audio').playEffect('hall', 'button_close.mp3');
        this.node.active = false;
    }
});
