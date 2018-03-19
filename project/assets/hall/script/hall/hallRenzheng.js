let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        let bg = this.node.getChildByName('back');
        this.nameLayer = bg.getChildByName('name');
        this.nameLayer.active = false;
        this.nameLayer.getChildByName('btnPhone').on('click', this.onBtnPhoneClick, this);

        this.phoneLayer = bg.getChildByName('phone');
        this.phoneLayer.active = true;
        this.phoneLayer.getChildByName('btnName').on('click', this.onBtnNameClick, this);
        this.btnObtain = this.phoneLayer.getChildByName('btnObtain');
        this.btnObtain.on('click', this.onBtnObtainClick, this);
        this.phoneBox = this.phoneLayer.getChildByName('inputBoxPhone').getComponent(cc.EditBox);
        this.codeBox = this.phoneLayer.getChildByName('inputBoxCode').getComponent(cc.EditBox);
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    onDestroy () {
        this.unscheduleAllCallbacks();
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onBtnNameClick () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.nameLayer.active = true;
        this.phoneLayer.active = false;
    },

    onBtnPhoneClick () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.nameLayer.active = false;
        this.phoneLayer.active = true;
    },

    onBtnObtainClick () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        if (this.phoneBox.length !== 11) {
            return;
        }
        this.btnObtain.interactable = false;
        this.scheduleOnce(this._BtnObtainCb.bind(this), 60 * 1000);
    },

    _BtnObtainCb () {
        this.btnObtain.interactable = true;
    },

    onBtnCloseClick () {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },
});
