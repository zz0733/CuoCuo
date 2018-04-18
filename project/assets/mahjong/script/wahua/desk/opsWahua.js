const WhUtils = require('whUtils');

cc.Class({
    extends: cc.Component,

    properties: {
        chiNode: {
            type: cc.Node,
            default: null,
        },
        huanNode: {
            type: cc.Node,
            default: null,
        },
        gangNode: {
            type: cc.Node,
            default: null,
        },
        huNode: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad () {
        fun.event.add('wahuaOpsEventListener', 'wahuaOpsEvent', this.show.bind(this));

        this.chiNode.getChildByName('btnChi').on('click', this.onBtnChiClick.bind(this, 1));
        this.chiNode.getChildByName('btnGuo').on('click', this.onBtnChiClick.bind(this, 0));
        this.huanNode.getChildByName('btnHuan').on('click', this.onBtnHuanClick, this);
        this.gangNode.getChildByName('btnGang').on('click', this.onBntGangClick, this);
        this.huNode.getChildByName('btnHu').on('click', this.onBtnHuClick, this);
    },

    onDestroy() {
        fun.event.remove('wahuaOpsEventListener');
    },

    getSpriteFrameByCard(id) {
        return this.node.parent.getComponent('gameMgrWahua').paiMianAltas.getSpriteFrame(WhUtils.getCardById(id));;
    },

    show(data) {
        this._data = data;
        let name;
        if (data.isEat) {
            name = 'chiNode';
        } else if (data.isReplaceWhite) {
            name = 'huanNode';
        } else if (data.isGang) {
            name = 'gangNode';
        } else if (data.isHu) {
            name = 'huNode';
        }
        for (let i = 0; i < data.playChess.length; ++i) {
            this[name].getChildByName('card' + (i + 1)).getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(data.playChess[i]);
        }
        this[name].active = true;
    },

    onBtnChiClick(num) {
        this.chiNode.active = false;
        fun.net.send('OpsAccept', { isEat: num, showChess: this._data.playChess });
    },

    onBtnHuanClick() {
        this.huanNode.active = false;
        fun.net.send('OpsAccept', { isReplaceWhite: 1, showChess: this._data.playChess });
    },

    onBntGangClick() {
        this.gangNode.active = false;
        fun.net.send('OpsAccept', { isGang: 1, showChess: this._data.playChess });
    },

    onBtnHuClick() {
        this.huNode.active = false;
        fun.net.send('OpsAccept', { isHu: 1, showChess: this._data.playChess });
    },

});