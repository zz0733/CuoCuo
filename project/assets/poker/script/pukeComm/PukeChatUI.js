let PukeDefine = require('PukeDefine');
let Audio = require('Audio');
let PhoneVoice = require('JSPhoneVoice');

cc.Class({
    extends: cc.Component,

    properties: {
        ChatBox: cc.Prefab,
        Emoticon: cc.Prefab,
        BtnVoice: cc.Node,
        interact: cc.Prefab
    },

    onLoad: function () {
        if (!cc.sys.isNative) {
            this.BtnVoice.active = false;
        }
        let ChildNode = this.node.parent.parent.getChildByName('childNode');
        this._userInfoN = ChildNode.getChildByName('userinfo');
        /*添加消息队列*/
        this._chatEmojiQueueFunc = {};
        this._chatTextQueueFunc = {};
        this._isPlayChatEmoji = {};
        this._isPlayChatText = {};
        for (let i = 1; i <= 6; ++i) {
            this._chatEmojiQueueFunc[i] = new Array();
            this._chatTextQueueFunc[i] = new Array();
            this._isPlayChatEmoji[i] = true;
            this._isPlayChatText[i] = true;
        }
        fun.event.add('PukeChatUI_RoomChat', 'RoomChat', this.onChatAck.bind(this));
        fun.event.add('PukeChatUI_Voice', 'RoomChatVoice', this.onVoiceAck.bind(this));
    },

    update: function () {
        for (let i=1; i<=6; ++i) {
            if (this._chatEmojiQueueFunc !== undefined
                && this._chatEmojiQueueFunc[i] !== undefined
                && this._chatEmojiQueueFunc[i].length > 0
                && this._isPlayChatEmoji[i]) {
                this._chatEmojiQueueFunc[i][0]();
                this._chatEmojiQueueFunc[i].splice(0, 1);
            }
            if (this._chatTextQueueFunc !== undefined
                && this._chatTextQueueFunc[i] !== undefined
                && this._chatTextQueueFunc[i].length > 0
                && this._isPlayChatText[i]) {
                this._chatTextQueueFunc[i][0]();
                this._chatTextQueueFunc[i].splice(0, 1);
            }
        }
    },

    onDestroy: function () {
        this._chatEmojiQueueFunc = {};
        this._chatTextQueueFunc = {};
        this._isPlayChatEmoji = {};
        this._isPlayChatText = {};
        fun.event.remove('PukeChatUI_RoomChat');
        fun.event.remove('PukeChatUI_Voice');
    },

    onBtnMessageClicked: function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let copyChatBox = cc.instantiate(this.ChatBox);
        copyChatBox.setPosition(0, 0);
        copyChatBox.parent = this._userInfoN;
    },

    onVoiceAck: function(data){
        let self = this;
        let chatFunc = function(seat, seato){
            seat.Speaker.active = true;
            let _sp = seat.Speaker.getChildByName('sp').getComponent(sp.Skeleton);
            _sp.setAnimation(0, "animation", true)
            _sp.timeScale = 1;
            self.scheduleOnce(function(){
                seat.Speaker.active = false;
                _sp.timeScale = 0;
            }, data.length);
        }
        fun.event.dispatch('PukeChatUI', {fromId: data.from, toId: data.to ? data.to : null, func: chatFunc});
    },

    onChatAck: function (data) {
        let self = this;
        let chatFunc = function(seat, seato){
            let seatNumber = seat.SeatNumber;
            if (data.chatType === 'emoji') {
                let func = function(){
                    self._isPlayChatEmoji[seatNumber] = false;
                    let copyEmot = cc.instantiate(self.Emoticon);
                    copyEmot.setPosition(-83, 12);
                    copyEmot.parent = seat;
                    let anim = copyEmot.getComponent(sp.Skeleton);
                    anim.animation = data.content;
                    self.scheduleOnce(function(){
                        copyEmot.destroy();
                        self._isPlayChatEmoji[seatNumber] = true;
                    }, PukeDefine.CHAT_MESSAGE_SHOW_TIME);
                }
                let len = self._chatEmojiQueueFunc[seatNumber].length;
                self._chatEmojiQueueFunc[seatNumber][len] = func;
            } else if (data.chatType === 'interact') {
                let interactN = cc.instantiate(self.interact);
                interactN.parent = self._userInfoN;
                let wposS = self.node.convertToWorldSpaceAR(PukeDefine.POSITION.SEAT[seatNumber]);
                let wposE = self.node.convertToWorldSpaceAR(PukeDefine.POSITION.SEAT[seato.SeatNumber]);
                interactN.getComponent('interact').show(data, wposS, wposE);
            } else if (data.chatType === 'text') {
                let func = function(){
                    self._isPlayChatText[seatNumber] = false;
                    let chatImg = seat.getChildByName("chatImg");
                    chatImg.active = true;
                    let chatContent = chatImg.getChildByName("content");
                    chatContent.getComponent(cc.Label).string = data.content;
                    let length = chatContent.getContentSize().width;
                    chatImg.setContentSize(length + 30, chatImg.getContentSize().height);
                    self.scheduleOnce(function(){
                        chatImg.active = false;
                        self._isPlayChatText[seatNumber] = true;
                    }, PukeDefine.CHAT_MESSAGE_SHOW_TIME);
                }
                let len = self._chatTextQueueFunc[seatNumber].length;
                self._chatTextQueueFunc[seatNumber][len] = func;
            }
        }
        fun.event.dispatch('PukeChatUI', {fromId: data.from, toId: data.to ? data.to : null, func: chatFunc});
    }        
});
