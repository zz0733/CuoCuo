cc.Class({
    extends: cc.Component,

    properties: {
        back: {
            type: cc.Node,
            default: null,
        }
    },

    onLoad () {
        cc.log('--- hw onLoad ---');
        // this.back.getChildByName('btnQuit').on('click', this.onBtnQuitClick, this);
    },

    setData(data) {
        cc.log('--- data: ', data);
    },

    onBtnQuitClick() {
        this.node.destroy();
    },
});
