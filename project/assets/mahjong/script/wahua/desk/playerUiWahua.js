const JiaWeiArr = ['tianjia', 'dijia', 'yinpai', 'changsan'];

cc.Class({
    extends: cc.Component,

    properties: {
        orignalIcon: {
            type: cc.SpriteFrame,
            default: null,
        },

        iconSp: {
            type: cc.Sprite,
            default: null,
        },

        nameLabel: {
            type: cc.Label,
            default: null,
        },

        scoreLabel: {
            type: cc.Label,
            default: null,
        },

        scoreBg: {
            type: cc.Node,
            default: null,
        },

        readyNode: {
            type: cc.Node,
            default: null,
        },

        noCardNode: {
            type: cc.Node,
            default: null,
        },

        quanNode: {
            type: cc.Node,
            default: null,
        },

        directNode: {
            type: cc.Node,
            default: null,
        },

        emojiNode: {
            type: cc.Node,
            default: null,
        },

        textNode: {
            type: cc.Node,
            default: null,
        },

        voiceNode: {
            type: cc.Node,
            default: null,
        },

        offlineNode: {
            type: cc.Node,
            default: null,
        },

        waitNode: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad () {
        this.setWait();
    },

    setWait() {
        this.iconSp.SpriteFrame = this.orignalIcon;
        this.nameLabel.string = '';
        this.scoreLabel.string = '';
        this.scoreBg.active = false;
        this.readyNode.active = false;
        this.offlineNode.active = false;
        this.waitNode.active = true;
    },

    setData(data, uipos) {
        //imageUrl || UserHeadUrl
        //ip
        //userId || UserId

        this.data = data;
        this.nameLabel.string = data.userName + ' ' + data.userId;
        this.scoreLabel.string = data.score || 0 // totalScore;
        this.node.getChildByName('name').active = true;
        this.node.getChildByName('score').active = true;
        this.scoreBg.active = true;
        this.waitNode.active = false;
        if (data.onLine && data.onLine !== 1) {  //1在线， 2不在线
            this.offlineNode.active = true;
        }
        if(data.currentState === 1){
            this.showReady(true);
        }
        fun.event.dispatch('wahuaInitCompleted', uipos);
    },

    setScore(score = 0) {
        this.scoreLabel.string = score;
    },

    showReady(flag) {
        this.readyNode.active = flag;
    },

    showNoCard(flag) {
        this.noCardNode.active = flag;
    },

    showQuan(flag) {
        this.quanNode.active = flag;
    },

    setDirect(direct) {
        this.setDirectEnable();
        this.directNode.active = true;
        for (let i=0; i<JiaWeiArr.length; ++i) {
            this.directNode.getChildByName(JiaWeiArr[i]).active = false;
        }
        this.directNode.getChildByName(JiaWeiArr[direct]).active = true;
    },

    setDirectEnable() {
        this.directNode.active = false;
    },

    setEmoji(emoji) {

    },

    setText(text) {

    },

    setVoice(voice) {

    },

    showOffLine(flag) {
        this.offlineNode.active = flag;
    },

});
