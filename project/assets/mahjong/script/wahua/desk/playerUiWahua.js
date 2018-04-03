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

        buhuaLabel: {
            type: cc.Label,
            default: null,
        },

        paiPrefab: {
            type: cc.Prefab,
            default: null,
        },

        tangPrefab: {
            type: cc.Prefab,
            default: null,
        },

        optCardPrefab: {
            type: cc.Prefab,
            default: null,
        },

        huPaiPrefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    onLoad () {
        this.setWait();
        let paiNode = this.node.getChildByName('paiNode');
        this.shouPaiNode = paiNode.getChildByName('shouPai');
        this.pengGangNode = paiNode.getChildByName('pengGang');
        this.dachuPaiNode = paiNode.getChildByName('dachuPai');
        this.enableSendN = paiNode.getChildByName('enableSend');
        this._paiArray = new Array();
        this._chiGangArray = new Array();
    },

    setWait() {
        this.iconSp.SpriteFrame = this.orignalIcon;
        this.nameLabel.string = '';
        this.scoreLabel.string = '';
        this.scoreBg.active = false;
        this.readyNode.active = false;
        this.offlineNode.active = false;
        this.waitNode.active = true;
        this.buhuaLabel.string = '';
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
        fun.event.dispatch('wahuaInitCompleted', uipos);
    },

    onDestroy() {
        this._paiArray = [];
        this._cards = [];
        this._chiGangArray = [];
    },

    clearDesk() {
        this._paiArray = [];
        this._cards = [];
        this._chiGangArray = [];
        this.shouPaiNode.removeAllChildren();
        this.pengGangNode.removeAllChildren();
        this.dachuPaiNode.removeAllChildren();
    },

    /**
     * 玩家摸排
     * @param {INT} cardNumber 牌id
     */
    moPai(cardNumber) {
        cc.log('--- ' + this._uipos + ' moPai: ', cardNumber);
        switch (this._uipos) {
            case SeatEnum.xia:
                {
                    this.setEnableSend(true);
                    let paiN = cc.instantiate(this.paiPrefab);
                    paiN.parent = this.shouPaiNode;
                    paiN.getComponent('whPaiTouch').setCardNumber(cardNumber);
                    paiN.setPosition(cc.p(1160, -180));
                    this._paiArray[this._paiArray.length] = paiN;;
                    let pai = WhUtils.getCardById(cardNumber);
                    let card = paiN.getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(pai);
                    let enable = WhUtils.checkCardEnable(cardNumber, this._cards);
                    if (enable) {
                        cc.log('--- enable, type: ', enable, typeof(enable));
                        WhUtils.setPaiEnable(paiN, false, false);
                        if (typeof (enable !== 'boolean')) {
                            for (let i = 0; i < this._cards.cardArr.length; ++i) {
                                if (this._cards.cardArr[i] === enable) {
                                    WhUtils.setPaiEnable(this._paiArray[i], false, false);
                                }
                            }
                        }
                        if (typeof (enable) === 'object') {
                            if (typeof(enable.song) === 'boolean') {
                                WhUtils.setPaiEnable(paiN, true, true);
                                paiN.getChildByName('song').active = true;
                            } else {
                                for (let i = 0; i < this._cards.cardArr.length; ++i) {
                                    if (this._cards.cardArr[i] === enable.song) {
                                        WhUtils.setPaiEnable(this._paiArray[i], true, true);
                                        this._paiArray[i].getChildByName('song').active = true;
                                    }
                                }
                            }
                        }
                    }
                }
                break;
            case SeatEnum.you:
                this.setCardShow(this._paiLeftNumber + 1);
                break;
            case SeatEnum.shang:
                this.setCardShow(this._paiLeftNumber + 1);
                break;
            case SeatEnum.zuo:
                this.setCardShow(this._paiLeftNumber + 1);
                break;
            default:
                break;
        }
    },

    /**
     * 玩家出牌
     * @param {Array} cardInfo 牌的集合
     */
    chuPai(cardInfo, flag = false) {
        if (!cardInfo) return;
        let sendCard = cc.instantiate(this.tangPrefab);
        let id = cardInfo.cardNumber ? cardInfo.cardNumber : cardInfo;
        sendCard.getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(WhUtils.getCardById(id));
        sendCard.parent = this.dachuPaiNode;
        // sendCard.cardNumber = id;
        let chupaiNum = this.dachuPaiNode.children.length;
        switch (this._uipos) {
            case SeatEnum.xia:
                {   
                    let posx = 34 * (chupaiNum % 10 === 0 ? 10 : chupaiNum % 10), posy;
                    if (chupaiNum <= 10) posy = 30;
                    else if (chupaiNum > 10 && chupaiNum <= 20) posy = -15;
                    else posy = -60;
                    sendCard.setPosition(cc.p(posx + 400, posy));
                    if (flag) {
                        fun.net.send('PlayCard', { showChess: id }, function(rsp) {
                            if (rsp.returnStatu && rsp.returnStatu !== 1) {
                                cc.log('--- 出牌错误 ---');
                            }
                        });
                        this.setEnableSend(false);
                        for (let i = 0; i < this._cards.cardArr.length; ++i) {
                            if (this._cards.cardArr[i] === id) {
                                this._cards.cardArr.splice(i, 1);
                            }
                        }
                        fun.event.dispatch('whNeedReSortCards', this._cards.cardArr);
                    }
                }
                break;
            case SeatEnum.you:
                {
                    let posx, posy = -20 * (chupaiNum % 10 === 0 ? 10 : chupaiNum % 10);
                    if (chupaiNum <= 10) posx = 60;
                    else if (chupaiNum > 10 && chupaiNum <= 20) posx = 30;
                    else posx = 0;
                    sendCard.setPosition(cc.p(posx, posy));
                    if (flag) this.setCardShow(this._paiLeftNumber - 1);
                }
                break;
            case SeatEnum.shang:
                {
                    let posx = -34 * (chupaiNum % 10 === 0 ? 10 : chupaiNum % 10), posy, order = 3;
                    if (chupaiNum <= 10) {
                        posy = -120;
                        order = 3;
                    } else if (chupaiNum > 10 && chupaiNum <= 20) {
                        posy = -75;
                        order = 2;
                    } else {
                        posy = -30;
                        order = 1;
                    }
                    sendCard.setLocalZOrder(order);
                    sendCard.setPosition(cc.p(posx - 205, posy));
                    if (flag) this.setCardShow(this._paiLeftNumber - 1);
                }
                break;
            case SeatEnum.zuo:
                {
                    let posx, posy = 20 * (chupaiNum % 10 === 0 ? 10 : chupaiNum % 10);
                    if (chupaiNum <= 10) posx = 0;
                    else if (chupaiNum > 10 && chupaiNum <= 20) posx = 30; 
                    else posx = 60;
                    sendCard.setPosition(cc.p(posx, posy));
                    if (flag) this.setCardShow(this._paiLeftNumber - 1);
                }
                break;
            default:
                break;
        }
    },

    /**
     * 牌的显示
     * @param {*} cards     下: 排序后的牌/ 其他: 牌的数量
     */
    setCardShow(cards, flag = false) {
        cc.log('--- setCardShow  cards: ', cards);
        this.shouPaiNode.removeAllChildren();
        this._paiArray = [];
        this._paiLeftNumber = this._uipos === SeatEnum.xia ? cards.cardArr.length : cards;
        switch(this._uipos){
            case SeatEnum.xia:
                {
                    this._cards = cards;
                    this._enableNumber = cards.enableNumber;
                    for (let i = 0; i < cards.cardArr.length; ++i) {
                        let posx, pai = WhUtils.getCardById(cards.cardArr[i]);
                        if (cards.cardArr.length % 2 === 1) {
                            posx = (i - cards.cardArr.length) * 60 + 1200;
                        } else {
                            posx = (i - 1 - cards.cardArr.length) * 60 + 1200;
                            this.setEnableSend(false);
                        }
                        this._paiArray[i] = cc.instantiate(this.paiPrefab);
                        this._paiArray[i].setPosition(cc.p(posx, -180));
                        this._paiArray[i].parent = this.shouPaiNode;
                        this._paiArray[i].getChildByName('song').active = false;
                        this._paiArray[i].getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(pai);
                        this._paiArray[i].getComponent('whPaiTouch').setCardNumber(cards.cardArr[i]);
                        WhUtils.setPaiEnable(this._paiArray[i], true, true);
                        if (cards.songCardArr.length !== 0) {
                            WhUtils.setPaiEnable(this._paiArray[i], false, false);
                            for (let s = 0; s < cards.songCardArr.length; s++) {
                                if (cards.cardArr[i] === cards.songCardArr[s]) {
                                    this._paiArray[i].getChildByName('song').active = true;
                                    WhUtils.setPaiEnable(this._paiArray[i], true, true);
                                    break;
                                }
                            }
                        } else {
                            if (this._enableNumber > i) {
                                WhUtils.setPaiEnable(this._paiArray[i], false, false);
                            }
                        }
                    }
                }
                break;
            case SeatEnum.you:
                for (let i = 0; i < cards; ++i) {
                    this._paiArray[i] = cc.instantiate(this.paiPrefab);
                    let posy = (i - cards) * 30;
                    this._paiArray[i].setPosition(cc.p(0, posy));
                    this._paiArray[i].parent = this.shouPaiNode;
                }
                break;
            case SeatEnum.shang:
                for (let i = 0; i < cards; ++i) {
                    this._paiArray[i] = cc.instantiate(this.paiPrefab);
                    let posx;
                    if (cards % 2 === 1) {
                        posx = (i - 1) * 34 - 750;
                    } else {
                        posx = i * 34.5 - 750;
                    }
                    this._paiArray[i].setPosition(cc.p(posx, 50));
                    this._paiArray[i].parent = this.shouPaiNode;
                }
                if (cards % 2 === 1 && !flag) {
                    this._paiArray[0].setPositionX(this._paiArray[0].getPositionX() - 10);
                }
                break;
            case SeatEnum.zuo:
                for (let i = 0; i < cards; ++i) {
                    this._paiArray[i] = cc.instantiate(this.paiPrefab);
                    let posx = (-cards - i) * 34 + 100;
                    this._paiArray[i].setPosition(cc.p(posx, -10));
                    this._paiArray[i].parent = this.shouPaiNode;
                }
                break;
            default:
                break;
        }
    },

    /**
     * 吃杠
     * @param {Array} cardArr 
     */
    setChiGang(cardArr, flag = false) {
        let type = cardArr.length === 3 ? 'gang' : 'chi';
        if (this._uipos === SeatEnum.xia && flag) {
            this.setEnableSend(true);
            for (let i = 0; i < this._cards.cardArr.length; ++i) {
                for (let j = 0; j < cardArr.length; ++j) {
                    if (this._cards.cardArr[i] === cardArr[j]) {
                        this._cards.cardArr.splice(i, 1);
                    }
                }
            }
            if (type === 'gang') this._paiArray[this._paiArray.length - 1].removeFromParent();
            fun.event.dispatch('whNeedReSortCards', this._cards.cardArr);
        } else {
            if (flag) this.setCardShow(this._paiLeftNumber - cardArr.length + 1, true);
        }
        
        let pos, dir, opsNum = this.pengGangNode.children.length;
        switch (this._uipos) {
            case SeatEnum.xia:
                dir = 'xia';
                pos = cc.p(120 * opsNum - 40, -180);
                break;
            case SeatEnum.you:
                dir = 'you';
                pos = cc.p(500, 40 * opsNum + 100);
                break;
            case SeatEnum.shang:
                dir = 'shang';
                pos = cc.p(-120 - 70 * opsNum, 50);
                break;
            case SeatEnum.zuo:
                dir = 'zuo';
                pos = cc.p(60, 500 - 40 * opsNum);
                break;
            default:
                break;
        }
        let opt = cc.instantiate(this.optCardPrefab);
        opt.setPosition(pos);
        opt.parent = this.pengGangNode;
        this._chiGangArray[this._chiGangArray.length] = cardArr;
        for (let i = 0; i < cardArr.length; ++i) {
            let typeN = opt.getChildByName(dir).getChildByName(type);
            typeN.active = true;
            let nd = typeN.getChildByName('card' + (i + 1));
            nd.getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(WhUtils.getCardById(cardArr[i]));
        }
    },

    /**
     * 替换白皮
     * @param {Array} cardArr 
     */
    setHuan(cardArr) {
        for (let i = 0; i < this._chiGangArray.length; ++i) {
            for (let j; j < cardArr.length; ++j) {
                if (this._chiGangArray[i] === cardArr[j]) {
                    cc.log('--- 替换白皮: i, j, sameCard: ', i, j, cardArr[j]);
                    // this.pengGangNode.children[this.pengGangNode.children.length - 1];
                    break;
                }
            }
        }
    },

    /**
     * 胡
     * @param {Object} data 
     */
    setHu(cardArr) {
        cc.log('--- 胡牌 cardArr: ', cardArr);
        this.shouPaiNode.removeAllChildren();
        let pos, chiGangPos;
        if (this.pengGangNode.children.length !== 0) {
            this.pengGangNode.children[this.pengGangNode.children.length - 1].getPosition();
        }
        switch (this._uipos) {
            case SeatEnum.xia:
                chiGangPos = chiGangPos ? chiGangPos : -40;
                pos = cc.p(chiGangPos + i * 60 + 20, 180)
                break;
            case SeatEnum.you:
                chiGangPos = chiGangPos ? chiGangPos : -40;
                pos = cc.p(chiGangPos - i * 34, -360)
                break;
            case SeatEnum.shang:
                chiGangPos = chiGangPos ? chiGangPos : -120;
                pos = cc.p(chiGangPos - i * 34, -360)
                break;
            case SeatEnum.zuo:
                chiGangPos = chiGangPos ? chiGangPos : -40;
                pos = cc.p(chiGangPos - i * 34, -360)
                break;
            default:
                break;
        }
        cc.log('--- pos, chiGangPos: ', pos, chiGangPos);
        for (let i = 0; i < cardArr; ++i) {
            let c = cc.instantiate(this.huPaiPrefab);
            c.setPosition(pos);
            let pai = WhUtils.getCardById(cardArr[i]);
            c.getChildByName('content').getComponent(cc.Sprite).spriteFrame = this.getSpriteFrameByCard(pai);
            c.parent = this.shouPaiNode;
        }
        
    },

    /**
     * 牌全部放下
     */
    xiaPaiAllDown() {
        for (let i = 0; i < this._paiArray.length; ++i) {
            if (this._paiArray[i].getPositionY() !== -180) {
                this._paiArray[i].setPositionY(-180);
            }
        }
    },

    setEnableSend(flag) {
        this.enableSendN.active = !flag;
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

    setBuhuaText(text) {
        this.buhuaLabel.string = '补花: ' + text;
    },

    setXianVisible(flag) {
        this.node.getChildByName('xian').active = flag;
    },

    getSpriteFrameByCard(card) {
        return this.node.parent.getComponent('gameMgrWahua').paiMianAltas.getSpriteFrame(card);;
    },

});