cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        let bg = this.node.getChildByName('back');
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onBtnCloseClick () {
        require('Audio').playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },
});
