let GameCfg = require('GameCfg');
let Audio = require('Audio');
const PanelType = cc.Enum({
    enterRoom: 0,
    viewPlayback: 1,
});


cc.Class({
    extends: cc.Component,

    properties: {
        panelType: {
            type: PanelType,
            default: PanelType.enterRoom,
        },
    },

    onLoad () {
        let bg = this.node.getChildByName('back');
        this.targetNum = [];
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        bg.getChildByName('btnClean').on('click', this.onBtnCleanClick, this);
        bg.getChildByName('btnReenter').on('click', this.onBtnReenterClick, this);
        let enterNumber = bg.getChildByName('enterNumber');
        this.maxNum = enterNumber.childrenCount;
        this.numberEnter = [];
        for (let i = 0; i < this.maxNum; i++) {
            this.numberEnter[i] = enterNumber.getChildByName("num_" + (i+1)).getChildByName('content');
            this.numberEnter[i].active = false;
        }
        let numBtns = bg.getChildByName('numBtns');
        for (let i = 0; i < 10; i++) {
            numBtns.getChildByName("btnNum" + i).on('click', this.onNumBtnClick.bind(this, i));
        }

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', this.onAnimationFinished, this);
    },

    onAnimationFinished () {
        if (this.panelType === PanelType.viewPlayback) {
            this.node.destroy();
        } else {
            this.targetNum = [];
            this.numberEnter.forEach(function (v) {
                v.active = false;
            });
            this.node.active = false;
        }
    },

    onBtnCleanClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        if (this.targetNum.length <= 0) {
            return;
        }
        this.targetNum.pop();
        this.numberEnter[this.targetNum.length].active = false;
    },

    onBtnReenterClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.targetNum = [];
        this.numberEnter.forEach(function (v) {
            v.active = false;
        });
    },

    getRoomIdByArray(arr) {
        let roomid = '';
        arr.forEach(function(num){
            roomid += num;
        });
        return parseInt(roomid);
    },

    onNumBtnClick(num) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        if (this.targetNum.length >= this.maxNum) {
            return;
        }
        this.numberEnter[this.targetNum.length].getComponent(cc.Label).string = num;
        this.numberEnter[this.targetNum.length].active = true;
        this.targetNum.push(num);
        if (this.targetNum.length < this.maxNum) {
            return;
        }
        const rId = this.getRoomIdByArray(this.targetNum);
        if (this.panelType === PanelType.viewPlayback) {
            fun.event.dispatch('Zhuanquan', {flag: true, text: '回放加载中，请稍后...'});
            fun.net.pSend('ReplayRecordByCode', {Code: rId}, function(data) {
                if (data.RetCode && data.RetCode !== 0) {
                    fun.event.dispatch('Zhuanquan', {flag: false});
                    return;
                }
                fun.db.setData('ReplayInfo', data);
            });
        } else if (this.panelType === PanelType.enterRoom) {
            fun.db.setData('EnterRoomId', rId);
        }
    },
});
