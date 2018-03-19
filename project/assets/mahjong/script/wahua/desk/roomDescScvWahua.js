cc.Class({
    extends: cc.Component,

    properties: {
        roomNumLabel: {
            type: cc.Label,
            default: null,
        },

        modelNameLabel: {
            type: cc.Label,
            default: null,
        },

        chagreLabel: {
            type: cc.Label,
            default: null,
        },

        playerSumLabel: {
            type: cc.Label,
            default: null,
        },

        playLabel: {
            type: cc.Label,
            default: null,
        },

        modelLabel: {
            type: cc.Label,
            default: null,
        },

        special: {
            type: cc.Label,
            default: null,
        },
    },

    onLoad () {
        let roomInfo = fun.db.getData('RoomInfo');
        this.roomNumLabel.string = roomInfo.roomRule.RoomId;
        let num = roomInfo.roomRule.roomNum || roomInfo.roomRule.ring;
        this.setModelLabel(num, roomInfo.roomRule.makersType);
        this.setSpecialLabel(roomInfo.roomRule.needLocation);
        this.setPlayLabel(roomInfo.roomRule.patterns);
        this.setPlayerSumLabel(roomInfo.roomRule.playerNum);
        this.setChagerLabel(roomInfo.roomRule.reduceCard);
    },

    setModelLabel (num, makersType = 1) {
        if (makersType === 1) {
            this.modelNameLabel.string = '圈数';
            this.modelLabel.string = num + '圈';
        } else {
            this.modelNameLabel.string = '局数';
            this.modelLabel.string = num + '局';
        }
    },

    setChagerLabel (reduceCard) {
        switch (reduceCard) {
            case 1:
                this.chagreLabel.string = '房主支付';
                break;
            case 2:
                this.chagreLabel.string = '平均支付';
                break;
            case 3:
                this.chagreLabel.string = '冠军支付';
                break;
        }
    },

    setPlayerSumLabel (playerNum = 4) {
        this.playerSumLabel.string = playerNum + "人";
    },

    setPlayLabel (patterns = 1) {
        switch (patterns) {
            case 1:
                this.playLabel.string = '庄家翻倍';
                break;
            case 2:
                this.playLabel.string = '平措';
                break;
        }
    },

    setSpecialLabel (flag) {
        if (flag) {
            this.special.string = '玩家需开启定位才可加入游戏';
        } else {
            this.special.string = '玩家无需开启定位就可加入游戏';
        }
    },
});
