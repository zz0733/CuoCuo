const SeatEnum = cc.Enum({
    xia: 0,
    you: 1,
    shang: 2,
    zuo: 3,
});
const JiaWeiArr = ['tianjia', 'dijia', 'yinpai', 'changsan'];
const WhDefine = require('whDefine');
const WhUtils = require('whUtils');

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

        xiaPaiPrefab: {
            type: cc.Prefab,
            default: null,
        },

        shangPaiPrefab: {
            type: cc.Prefab,
            default: null,
        },

        zuoPaiPrefab: {
            type: cc.Prefab,
            default: null,
        },

        youPaiPrefab: {
            type: cc.Prefab,
            default: null,
        },

        xiaPengPrefab: {
            type: cc.Prefab,
            default: null,
        },

        shangPengPrefab: {
            type: cc.Prefab,
            default: null,
        },

        hengPengPrefab: {
            type: cc.Prefab,
            default: null,
        },

        paiMianAltas: {
            type: cc.SpriteAtlas,
            default: null,
        },
    },

    onLoad () {
        this.setWait();
        let paiNode = this.node.getChildByName('paiNode');
        this.shouPaiNode = paiNode.getChildByName('shouPai');
        this.pengGangNode = paiNode.getChildByName('pengGang');
        this.dachuPaiNode = paiNode.getChildByName('dachuPai');
        this._cardPool = new cc.NodePool();
        this._paiArray = new Array();
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
        this.data = data;
        fun.utils.loadUrlRes(data.imageUrl, this.node.getChildByName('icon'));
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
        this._uipos = uipos;
        this.initPool();
        fun.event.dispatch('wahuaInitCompleted', uipos);
    },

    onDestroy() {
        this._cardPool = [];
        this._paiArray = [];
    },

    initPool() {
        if (this._initFlag) return;
        this._initFlag = true;
        let paiPerfabName = 'xiaPaiPrefab';
        switch(this._uipos){
            case SeatEnum.xia:
                paiPerfabName = 'xiaPaiPrefab';
                break;
            case SeatEnum.you:
                paiPerfabName = 'youPaiPrefab';
                break;
            case SeatEnum.shang:
                paiPerfabName = 'shangPaiPrefab';
                break;
            case SeatEnum.zuo:
                paiPerfabName = 'zuoPaiPrefab';
                break;
            default:
                break;
        }
        for (let i=0; i<WhDefine.InitCardsNumber; ++i) {
            let pai = cc.instantiate(this[paiPerfabName]);
            this._cardPool.put(pai);
        }
    },

    setXiaPai(cards) {
        for(let i=0; i<cards.length+1; ++i){
            this._paiArray[i] = this._cardPool.get();
            this._paiArray[i].setPosition(cc.p(i*60 + 20, -30));
            this._paiArray[i].parent = this.shouPaiNode;
            let pai = WhUtils.getCardById(cards[i]);
            let card = this._paiArray[i].getChildByName('content').getComponent(cc.Sprite);
            card.spriteFrame = this.paiMianAltas.getSpriteFrame(pai);
        }
    },
    setYouPai(cards) {

    },
    setShangPai(cards) {

    },
    setZuoPai(cards) {

    },

    setCardShow(cards) {
        switch(this._uipos){
            case SeatEnum.xia:
                this.setXiaPai(cards);
                break;
            case SeatEnum.you:
                this.setYouPai(cards);
                break;
            case SeatEnum.shang:
                this.setShangPai(cards);
                break;
            case SeatEnum.zuo:
                this.setZuoPai(cards);
                break;
            default:
                break;
        }
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
