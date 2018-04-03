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
        toolsPre:cc.Prefab,
        textPre: cc.Prefab,
        emojiPre:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initMessage();
    },
    onDestroy(){
        this.cleanMessage();
    },
    initMessage: function () {
        fun.event.add('DDZRoomChat', 'RoomChat', this.onChatAck.bind(this));
        fun.event.add('DDZRoomChatVoice', 'RoomChatVoice', this.onVoiceAck.bind(this));
    },

    cleanMessage: function () {
        fun.event.remove("DDZRoomChat");
        fun.event.remove("DDZRoomChatVoice");
    },
    onChatAck: function (data) {
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
    onVoiceAck: function (data) {
        // 语音播放
    },
    showMsg: function(data){
        this.selfPos = cc.p(-420,-129);
        this.rightPos = cc.p(530, 186);
        this.leftPos = cc.p(-528, 201);
        if (this.selfID == data.from) {
            var text = cc.instantiate(this.textPre);
            this.node.addChild(text);
            text.getChildByName("text").getComponent(cc.Label).string = data.content.toString();
            text.getChildByName("text").width = data.content.length * 40;
            text.width =  data.content.length * 40;
            text.setPosition(this.selfPos);
            setTimeout(function () {
                text.active = false;
                text.removeFromParent();
            }.bind(this),2000);
        }
        if (data.from == cc.YL.DDZrightPlayerInfo.userId) {
            var text_3 = cc.instantiate(this.textPre);
            this.node.addChild(text_3);
            text_3.getChildByName("text").getComponent(cc.Label).string = data.content.toString();
            text_3.getChildByName("text").width = data.content.length * 40;
            text_3.width =  data.content.length * 40;
            text_3.setPosition(this.rightPos);
            setTimeout(function () {
                text_3.active = false;
                text_3.removeFromParent();
            }.bind(this),2000);
        }
        if (data.from == cc.YL.DDZleftPlayerInfo.userId) {
            var text_2 = cc.instantiate(this.textPre);
            this.node.addChild(text_2);
            text_2.getChildByName("text").getComponent(cc.Label).string = data.content.toString();
            text_2.getChildByName("text").width = data.content.length * 40;
            text_2.width =  data.content.length * 40;
            text_2.setPosition(this.leftPos);
            setTimeout(function () {
                text_2.active = false;
                text_2.removeFromParent();
            }.bind(this),2000);
        }
    },
    showEmoji: function(data){
        this.selfPos = cc.p(-420,-129);
        this.rightPos = cc.p(530, 186);
        this.leftPos = cc.p(-528, 201);
        if (this.selfID == data.from) {
            var emoji = cc.instantiate(this.emojiPre);
            this.node.addChild(emoji);
            var anim = emoji.getComponent(sp.Skeleton);
            anim.animation = data.content;
            emoji.setPosition(this.selfPos);
            setTimeout(function () {
                emoji.active = false;
                emoji.removeFromParent();
            }.bind(this),2000);
        }
        if (data.from == cc.YL.DDZrightPlayerInfo.userId) {
            var emoji_2 = cc.instantiate(this.emojiPre);
            this.node.addChild(emoji_2);
            var anim = emoji_2.getComponent(sp.Skeleton);
            anim.animation = data.content;
            emoji_2.setPosition(this.rightPos);
            setTimeout(function () {
                emoji_2.active = false;
                emoji_2.removeFromParent();
            }.bind(this),2000);
        }
        if (data.from == cc.YL.DDZleftPlayerInfo.userId) {
            var emoji_3 = cc.instantiate(this.emojiPre);
            this.node.addChild(emoji_3);
            var anim = emoji_3.getComponent(sp.Skeleton);
            anim.animation = data.content;
            emoji_3.setPosition(this.leftPos);
            setTimeout(function () {
                emoji_3.active = false;
                emoji_3.removeFromParent();
            }.bind(this),2000);
        }
    },
    showTools: function(data){
        this.selfPos = cc.p(-597,-229);
        this.rightPos = cc.p(593, 137);
        this.leftPos = cc.p(-592, 132);
        var startPos = cc.p(0,0);
        var endPos = cc.p(0,0);
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
        if(this.node.getChildByName("interact")){
            var toolsNode = this.node.getChildByName("interact")
        }else{
            var toolsNode = cc.instantiate(this.toolsPre);
            this.node.addChild(toolsNode);
        }
        toolsNode.getComponent('interact').show(data, startPos, endPos);
    },
});
