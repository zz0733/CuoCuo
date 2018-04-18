let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.userId = fun.db.getData('UserInfo').UserId;
        let bg = this.node.getChildByName('back');
        let emojiList = bg.getChildByName('emojiList');
        for (let i = 0; i < emojiList.childrenCount; i++) {
            emojiList.getChildByName("emoji" + i).on('click', this.onEmojiClick.bind(this, i));
        }
        let textScroll = bg.getChildByName('textList');
        let textList = textScroll.getChildByName('view').getChildByName('content');
        let gameType = fun.db.getData('RoomInfo').GameType;
        let exporText = require('ChatCfg').exporText[gameType];
        if (exporText.length > 8) {
            textScroll.getComponent(cc.ScrollView).vertical = true;
        } else {
            textScroll.getComponent(cc.ScrollView).vertical = false;
        }
        for (let i = 0; i < exporText.length; i++) {
            let text = textList.getChildByName("text" + i);
            text.active = true;
            let content = text.getChildByName('content').getComponent(cc.Label);
            content.string = exporText[i];
            text.on('click', this.onTextClick.bind(this, i));
        }
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        this.node.getChildByName('hitzone').on('click', this.onBtnCloseClick, this);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onEmojiClick (index) {
        this.sendChat({chatType: 'emoji', index: index, from: this.userId});
    },

    onTextClick (index) {
        this.sendChat({chatType: 'text', index: index, from: this.userId})
    },

    sendChat(sData){
        Audio.playEffect('hall', 'button_nomal.mp3');
        fun.net.pSend('Chat', sData);
         //prevent too fast
        this.onBtnCloseClick(true);
    },

    onBtnCloseClick (msg) {
        if(!msg){
            Audio.playEffect('hall', 'button_close.mp3');
        }
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});
