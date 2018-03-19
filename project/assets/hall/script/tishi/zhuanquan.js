cc.Class({
    extends: cc.Component,

    properties: {
        textNode: {
            type: cc.Node,
            default: null,
        }
    },

    onLoad() {
        
    },

    setString(str = '') {
        this.textNode.getComponent(cc.Label).string = str;
    },
});
