(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/DDZ/Script/Desk/DDZ_Chat.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '30c3dEWXkRC24HTUOvZ3EyG', 'DDZ_Chat', __filename);
// poker/DDZ/Script/Desk/DDZ_Chat.js

'use strict';

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        toolsPre: cc.Prefab,
        textPre: cc.Prefab,
        emojiPre: cc.Prefab,
        voicePre: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.initMessage();
    },
    onDestroy: function onDestroy() {
        this.cleanMessage();
    },

    initMessage: function initMessage() {
        fun.event.add('DDZRoomChat', 'RoomChat', this.onChatAck.bind(this));
        fun.event.add('DDZRoomChatVoice', 'RoomChatVoice', this.onVoiceAck.bind(this));
    },

    cleanMessage: function cleanMessage() {
        fun.event.remove("DDZRoomChat");
        fun.event.remove("DDZRoomChatVoice");
    },
    onChatAck: function onChatAck(data) {
        this.selfID = fun.db.getData('UserInfo').UserId;
        if (data.chatType === 'emoji') {
            //表情
            this.showEmoji(data);
        } else if (data.chatType === 'interact') {
            // 道具
            this.showTools(data);
        } else if (data.chatType === 'text') {
            // 文字
            this.showMsg(data);
        }
    },
    onVoiceAck: function onVoiceAck(data) {
        // 语音播放
        this.selfID = fun.db.getData('UserInfo').UserId;
        cc.YL.info("ddz收到语音消息", data.length, data.from, this.selfID);
        this.selfPos = cc.p(-513, -141);
        this.rightPos = cc.p(518, 212);
        this.leftPos = cc.p(-506, 219);
        var voice = cc.instantiate(this.voicePre);
        this.node.addChild(voice);
        voice.getChildByName("Voice").getComponent(sp.Skeleton).animation = "animation";
        if (this.selfID == data.from) {
            voice.setPosition(this.selfPos);
        }
        if (data.from == cc.YL.DDZrightPlayerInfo.userId) {
            voice.setPosition(this.rightPos);
            voice.setScale(-1, 1);
        }
        if (data.from == cc.YL.DDZleftPlayerInfo.userId) {
            voice.setPosition(this.leftPos);
        }
        cc.YL.info("开始播放语音", voice.x, voice.y, voice.parent.name);
        setTimeout(function () {
            voice.active = false;
            voice.removeFromParent();
        }.bind(this), data.length * 1000);
    },
    showMsg: function showMsg(data) {
        this.selfPos = cc.p(-557, -141);
        this.rightPos = cc.p(562, 212);
        this.leftPos = cc.p(-555, 211);
        if (this.selfID == data.from) {
            var text = cc.instantiate(this.textPre);
            this.node.addChild(text);
            text.getChildByName("text").getComponent(cc.Label).string = data.content.toString();
            text.getChildByName("text").width = data.content.length * 26;
            text.width = data.content.length * 26 + 26;
            text.setPosition(this.selfPos);
            setTimeout(function () {
                text.active = false;
                text.removeFromParent();
            }.bind(this), 2000);
        }
        if (data.from == cc.YL.DDZrightPlayerInfo.userId) {
            var text_3 = cc.instantiate(this.textPre);
            this.node.addChild(text_3);
            text_3.getChildByName("text").getComponent(cc.Label).string = data.content.toString();
            text_3.getChildByName("text").width = data.content.length * 26;
            text_3.width = data.content.length * 26 + 26;
            text_3.setPosition(this.rightPos);
            text_3.setScale(-1, 1);
            text_3.getChildByName("text").setScale(-1, 1);
            var posX = text_3.getChildByName("text").getPositionX();
            text_3.getChildByName("text").setPositionX(posX + data.content.length * 26);
            setTimeout(function () {
                text_3.active = false;
                text_3.removeFromParent();
            }.bind(this), 2000);
        }
        if (data.from == cc.YL.DDZleftPlayerInfo.userId) {
            var text_2 = cc.instantiate(this.textPre);
            this.node.addChild(text_2);
            text_2.getChildByName("text").getComponent(cc.Label).string = data.content.toString();
            text_2.getChildByName("text").width = data.content.length * 26;
            text_2.width = data.content.length * 26 + 26;
            text_2.setPosition(this.leftPos);
            setTimeout(function () {
                text_2.active = false;
                text_2.removeFromParent();
            }.bind(this), 2000);
        }
        cc.YL.DDZAudio.playMsgMusic(data.from, parseInt(data.index + 1));
    },
    showEmoji: function showEmoji(data) {
        this.selfPos = cc.p(-602, -202);
        this.rightPos = cc.p(588, 149);
        this.leftPos = cc.p(-588, 149);
        if (this.selfID == data.from) {
            var emoji = cc.instantiate(this.emojiPre);
            this.node.addChild(emoji);
            var anim = emoji.getComponent(sp.Skeleton);
            anim.animation = data.content;
            emoji.setPosition(this.selfPos);
            emoji.setScale(1.3);
            setTimeout(function () {
                emoji.active = false;
                emoji.removeFromParent();
            }.bind(this), 2000);
        }
        if (data.from == cc.YL.DDZrightPlayerInfo.userId) {
            var emoji_2 = cc.instantiate(this.emojiPre);
            this.node.addChild(emoji_2);
            var anim = emoji_2.getComponent(sp.Skeleton);
            anim.animation = data.content;
            emoji_2.setPosition(this.rightPos);
            emoji_2.setScale(1.3);
            setTimeout(function () {
                emoji_2.active = false;
                emoji_2.removeFromParent();
            }.bind(this), 2000);
        }
        if (data.from == cc.YL.DDZleftPlayerInfo.userId) {
            var emoji_3 = cc.instantiate(this.emojiPre);
            this.node.addChild(emoji_3);
            var anim = emoji_3.getComponent(sp.Skeleton);
            anim.animation = data.content;
            emoji_3.setPosition(this.leftPos);
            emoji_3.setScale(1.3);
            setTimeout(function () {
                emoji_3.active = false;
                emoji_3.removeFromParent();
            }.bind(this), 2000);
        }
    },
    showTools: function showTools(data) {
        this.selfPos = cc.p(-597, -229);
        this.rightPos = cc.p(593, 137);
        this.leftPos = cc.p(-592, 132);
        var startPos = cc.p(0, 0);
        var endPos = cc.p(0, 0);
        if (this.selfID == data.from) {
            startPos = this.selfPos;
        }
        if (data.from == cc.YL.DDZrightPlayerInfo.userId) {
            startPos = this.rightPos;
        }
        if (data.from == cc.YL.DDZleftPlayerInfo.userId) {
            startPos = this.leftPos;
        }
        if (this.selfID == data.to) {
            endPos = this.selfPos;
        }
        if (data.to == cc.YL.DDZrightPlayerInfo.userId) {
            endPos = this.rightPos;
        }
        if (data.to == cc.YL.DDZleftPlayerInfo.userId) {
            endPos = this.leftPos;
        }
        var toolsNode = cc.instantiate(this.toolsPre);
        this.node.addChild(toolsNode);
        toolsNode.getComponent('interact').show(data, startPos, endPos, true);
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
        //# sourceMappingURL=DDZ_Chat.js.map
        