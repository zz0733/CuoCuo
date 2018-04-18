(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/public/chat.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '073ddWOjhdE3ZVXx5WMJe35', 'chat', __filename);
// hall/script/public/chat.js

'use strict';

var Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        this.userId = fun.db.getData('UserInfo').UserId;
        var bg = this.node.getChildByName('back');
        var emojiList = bg.getChildByName('emojiList');
        for (var i = 0; i < emojiList.childrenCount; i++) {
            emojiList.getChildByName("emoji" + i).on('click', this.onEmojiClick.bind(this, i));
        }
        var textScroll = bg.getChildByName('textList');
        var textList = textScroll.getChildByName('view').getChildByName('content');
        var gameType = fun.db.getData('RoomInfo').GameType;
        var exporText = require('ChatCfg').exporText[gameType];
        if (exporText.length > 8) {
            textScroll.getComponent(cc.ScrollView).vertical = true;
        } else {
            textScroll.getComponent(cc.ScrollView).vertical = false;
        }
        for (var _i = 0; _i < exporText.length; _i++) {
            var text = textList.getChildByName("text" + _i);
            text.active = true;
            var content = text.getChildByName('content').getComponent(cc.Label);
            content.string = exporText[_i];
            text.on('click', this.onTextClick.bind(this, _i));
        }
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        this.node.getChildByName('hitzone').on('click', this.onBtnCloseClick, this);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    onEmojiClick: function onEmojiClick(index) {
        this.sendChat({ chatType: 'emoji', index: index, from: this.userId });
    },
    onTextClick: function onTextClick(index) {
        this.sendChat({ chatType: 'text', index: index, from: this.userId });
    },
    sendChat: function sendChat(sData) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        fun.net.pSend('Chat', sData);
        //prevent too fast
        this.onBtnCloseClick(true);
    },
    onBtnCloseClick: function onBtnCloseClick(msg) {
        if (!msg) {
            Audio.playEffect('hall', 'button_close.mp3');
        }
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=chat.js.map
        