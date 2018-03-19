const maxVoiceTime = 30;

cc.Class({
    extends: cc.Component,

    properties: {
        pressText: {
            default: '松开手指，取消发送',
        },

        moveText: {
            default: '手指上划, 取消发送',
        },

        progressSprite: {
            type: cc.Sprite,
            default: null,
        },

        cancelLabel: {
            type: cc.Label,
            default: null,
        },
    },

    setVoiceTime (time) {
        if (time > maxVoiceTime) {
            return false;
        }
        let subTime = Math.floor(maxVoiceTime - time);
        if (subTime < 0) {
            subTime = 0;
        }
        this.progressSprite.fillRange = -(time / maxVoiceTime);
        return true;
    },

    showPress () {
        this.cancelLabel.string = this.pressText;
    },

    showMove () {
        this.cancelLabel.string = this.moveText;
    },

});
