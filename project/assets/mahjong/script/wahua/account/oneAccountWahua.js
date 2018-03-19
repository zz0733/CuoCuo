cc.Class({
    extends: cc.Component,

    properties: {
        otherNameColor: {
            default: cc.Color.WHITE,
            displayName: '其他人名字颜色',
        },

        otherNameOutLineColor: {
            default: cc.Color.WHITE,
            displayName: '其他人名字描边颜色',
        },

        ownNameColor: {
            default: cc.Color.WHITE,
            displayName: '自己名字颜色',
        },

        ownNameOutLineColor: {
            default: cc.Color.WHITE,
            displayName: '自己名字描边颜色',
        },
    },

    onLoad () {

    },
});
