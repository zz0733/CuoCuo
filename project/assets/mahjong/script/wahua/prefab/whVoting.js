cc.Class({
    extends: cc.Component,

    properties: {
        back: {
            type: cc.Node,
            default: null,
        }
    },

    onLoad () {
        // this.back.getChildByName('btnQuit').on('click', this.onBtnQuitClick, this);
    },

    onBtnQuitClick() {
        this.node.destroy();
    },
});
