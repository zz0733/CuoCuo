cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        let bg = this.node.getChildByName('back');
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        this._leftBox = bg.getChildByName('leftBox');
        this._rightBox = bg.getChildByName('rightBox');
        this._menuNum = 2;
        for (let i=0; i<this._menuNum; ++i) {
            this._leftBox.getChildByName('btnActivity'+(i+1)).on('click', this.onActivityMenuShow.bind(this, i+1));
        }

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips()

        let isApple = fun.gameCfg.releaseType === gameConst.releaseType.apple ? true : false;
        if (isApple) {
            this._leftBox.getChildByName('btnActivity2').active = false;
        }
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onActivityMenuShow (count) {
        for(let i=0; i<this._menuNum; ++i){
            this._leftBox.getChildByName('btnActivity'+(i+1)).active = true;
            this._leftBox.getChildByName('btnDown'+(i+1)).active = false;
            this._rightBox.getChildByName('huodong'+(i+1)).active = false;
        }
        this._leftBox.getChildByName('btnActivity'+count).active = false;
        this._leftBox.getChildByName('btnDown'+count).active = true;
        this._rightBox.getChildByName('huodong'+count).active = true;
    },

    onBtnCloseClick () {
        require('Audio').playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },
});
