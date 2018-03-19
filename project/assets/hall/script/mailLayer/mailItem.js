cc.Class({
    extends: cc.Component,

    properties: {
        itemID: {
            default: 0,
            visible: false,
        },

        timeLabel: {
            default: null,
            type: cc.Label,
        },

        contentLabel: {
            default: null,
            type: cc.Label,
        },

        cardNumLabel: {
            default: null,
            type: cc.Label,
        },

        cardImg: {
            default: null,
            type: cc.Sprite,
        },

        voucherImg: {
            default: null,
            type: cc.Sprite,
        },

        // hySp: {
        //     type: cc.SpriteFrame,
        //     default: null,
        // },

        // wlSp: {
        //     type: cc.SpriteFrame,
        //     default: null,
        // },
    },

    updateItem: function (data) {
        this.lId = data.lId;
        this.mId = data.mId;
        this.timeLabel.string = data.timeStr;
        this.contentLabel.string = data.cont;
        if (data.mType === 1) { //无附件
            this.cardImg.node.active = false;
            this.voucherImg.node.active = false;
        } else {
            if (data.att.opt === 3) {
                this.cardImg.node.active = false;
                this.voucherImg.node.active = true;
            } else {
                this.cardImg.node.active = true;
                this.voucherImg.node.active = false;
            }
        }
        if (data.att.data === 0) {
            this.cardNumLabel.node.active = false;
        } else {
            this.cardNumLabel.node.active = true;
            this.cardNumLabel.string = data.att.data;
        }
    },
});
