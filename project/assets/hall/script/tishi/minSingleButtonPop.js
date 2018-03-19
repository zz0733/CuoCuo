let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {
        btnOk: {
            type: cc.Node,
            default: null,
        },

        btnOkLabel: {
            type: cc.Label,
            default: null,
        },

        btnClose: {
            type: cc.Node,
            default: null,
        },

        contentLabel: {
            type: cc.Label,
            default: null,
        },
    },

    init(data) {
        this.okCb = data.okCb;
        this.closeCb = data.closeCb;
        if (data.okBtnStr) {
            this.btnOkLabel.string = data.okBtnStr;
        }
        if (data.contentStr) {
            this.contentLabel.string = data.contentStr;
        }
        if (data.hideBtn) {
            this.btnOk.active = false;
            this.btnClose.active = false;
        }
        if (data.hideCloseBtn) {
            this.btnClose.active = false;
        }
        if (data.hideOkBtn) {
            this.btnOk.active = false;
        }
    },

    onLoad() {
        this.btnOk.once('click', this.onBtnOkClick, this);
        this.btnClose.once('click', this.onBtnCloseClick, this);
    },

    onEnable() {
        this.node.getComponent(cc.Animation).play('popScaleAnim');
    },

    onBtnOkClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let animState = this.node.getComponent(cc.Animation).play('popScaleOut');
        animState.once('finished', function () {
            if (this.okCb) {
                this.okCb();
            }
            this.node.destroy();
        }.bind(this));
    },

    onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        let animState = this.node.getComponent(cc.Animation).play('popScaleOut');
        animState.once('finished', function () {
            if (this.closeCb) {
                this.closeCb();
            }
            this.node.destroy();
        }.bind(this));
    },

});
