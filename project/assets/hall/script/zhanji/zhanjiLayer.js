let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {

        noZhanji: {
            type: cc.Node,
            default: null,
        },

        toggleGroupNode: {
            type: cc.Node,
            default: null,
        },

        btnClose: {
            type: cc.Node,
            default: null,
        },

        btnView: {
            type: cc.Node,
            default: null,
        },

        viewPlaybackPre: {
            type: cc.Prefab,
            default: null,
        },

        pukeZhanjiPre: {
            type: cc.Prefab,
            default: null,
        },

        majiangZhanjiPre: {
            type: cc.Prefab,
            default: null,
        },
    },


    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
        this.btnView.on('click', this.onBtnViewClick, this);
        this.btnClose.on('click', this.onBtnCloseClick, this);
        //todo
        // let intranet = fun.gameCfg.loginUrl === gameConst.loginUrl[gameConst.loginUrlType.intranet] ? true : false;
        let ddz = this.toggleGroupNode.getChildByName('DDZ');
        // if (intranet) {
        //     ddz.active = true;
        // } else {
            ddz.active = false;
        // }
    },

    init (gameType, data) {
        cc.YL.info("战绩gametype",gameType,data);
        this.toggleGroupNode.children.forEach(function(toggleNode) {
            toggleNode.getComponentInChildren('zhanjiScv').init();
            if (gameType === gameConst.gameType[toggleNode.name]) {
                toggleNode.getComponent(cc.Toggle).check();
                toggleNode.getComponentInChildren('zhanjiScv').initWithData(data);
            } else {
                toggleNode.getComponentInChildren('zhanjiScv').enableCheck(true);
            }
        });
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onBtnToggleClicked(){
        Audio.playEffect('hall', 'button_nomal.mp3');
    },

    onBtnViewClick () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let viewPlaybackPre = cc.instantiate(this.viewPlaybackPre);
        viewPlaybackPre.parent = this.node;
    },

    onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.toggleGroupNode.children.forEach(function(toggleNode) {
            toggleNode.getComponentInChildren('zhanjiScv').enableCheck(false);
        });
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },
});
