cc.Class({
    extends: cc.Component,

    properties: {
        progressNode: {
            type: cc.Node,
            default: null,
        },

        btnUpdate: {
            type: cc.Node,
            default: null,
        },

        gressNode: {
            type: cc.Node,
            default: null,
        },

        content: {
            type: cc.Label,
            default: null,
        },

        tipsNode: {
            type: cc.Node,
            default: null,
        },

        sizeNode: {
            type: cc.Node,
            default: null,
        },

        checkingUpdate: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad () {
        this.gressLabel = this.gressNode.getComponent(cc.Label);
        this.progressBar = this.progressNode.getComponent(cc.ProgressBar);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onDisable () {
        this.animation.play(this.clips[1].name);
    },

    setVersionContent (data, updateCb) {
        this.content.string = data[0].replace(/\\n/g, "\n");
        this.updateCb = updateCb;
        this.btnUpdate.active = true;
        this.btnUpdate.once('click', this.onBtnUpdateClick, this);
        this.checkingUpdate.active = false;
    },

    setSourceSize (size) {
        this.tipsNode.active = false;
        this.gressNode.active = true;
        this.sizeNode.active = true;
        const sizeStr = size.toFixed(2);
        let cont = this.sizeNode.getChildByName('content');
        cont.getComponent(cc.Label).string = sizeStr;
        this.sizeNode.getChildByName('end').setPositionX(cont.getPositionX() + cont.getContentSize().width + 5);
    },

    onBtnUpdateClick () {
        require('Audio').playEffect('hall', 'button_nomal.mp3');
        if (this.updateCb) {
            this.updateCb();
        }
        this.tipsNode.active = true;
        this.progressNode.active = true;
        this.btnUpdate.active = false;
    },

    updateProgress (percent = 0) {
        this.progressBar.progress = percent;
        let percentStr = (percent * 100).toFixed(2) + "%";
        if (percentStr === "NaN%") {
            percentStr = '0%';
        }
        this.gressLabel.string = percentStr;
    },

});
