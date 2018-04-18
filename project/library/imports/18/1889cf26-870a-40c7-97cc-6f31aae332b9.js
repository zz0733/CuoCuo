"use strict";
cc._RF.push(module, '1889c8mhwpAx5fMbzGq4zK5', 'mjVotingPopUI');
// mahjong/script/ui/prefab/mjVotingPopUI.js

"use strict";

var mjDataMgr = require("mjDataMgr");
var mjNetMgr = require("mjNetMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        btnAgree: {
            type: cc.Node,
            default: null
        },

        btnDisagree: {
            type: cc.Node,
            default: null
        },

        playerList: {
            type: cc.Node,
            default: null
        },

        timeLabel: {
            type: cc.Label,
            default: null
        },

        titleLabel: {
            type: cc.RichText,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.timeLabel.string = "";
        this.playerList.children.forEach(function (value) {
            value.active = false;
        });
        this._selfUserId = fun.db.getData('UserInfo').UserId;
        this._playerNodes = {};
        this._playersData = mjDataMgr.getInstance().getAllPlayersData();
        var index = -1;
        for (var idx in this._playersData) {
            index += 1;
            var value = this._playersData[idx];
            var id = value.UserId + '';
            this._playerNodes[id] = this.playerList.children[index];
            this._playerNodes[id].active = true;
            var imgNode = this._playerNodes[id].getChildByName('img');
            fun.utils.loadUrlRes(value.Icon, imgNode, id);
            this.showVoteChoice(id, 0);
            this._playerNodes[id].getChildByName('name').getComponent(cc.Label).string = value.showName;
            this._playerNodes[id].showName = value.showName;
        }

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();

        this.btnAgree.on('click', this.onBtnAgreeClick, this);
        this.btnDisagree.on('click', this.onBtnDisagreeClick, this);

        this._currTime = Math.floor(Date.now() / 1000);
        fun.net.pSend('ServerTime', '', function (rsp) {
            if (rsp.Now) {
                this._currTime = rsp.Now;
            }
        }.bind(this));
        this.sumdt = 0;
    },
    updateData: function updateData(data) {
        this._endTime = data.EndTime;
        for (var k in data.VoteInfo) {
            this.showVoteChoice(k, data.VoteInfo[k]);
        }
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    update: function update(dt) {
        this.sumdt += dt;
        if (this.sumdt < 1) {
            return;
        }
        this._currTime += 1;
        this.sumdt -= 1;
        var showTime = 0;
        if (this._endTime) {
            showTime = this._endTime - this._currTime;
        } else {
            showTime = parseInt(this.timeLabel.string) - 1;
        }
        if (showTime < 0) {
            showTime = 0;
        }
        this.timeLabel.string = showTime;
    },
    showVoteChoice: function showVoteChoice(UserId) {
        var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        cc.log("---showVoteChoice------UserId:" + UserId + " code:" + code, UserId == this._selfUserId + '');
        //code 0:未选择 1:发起人 2:同意 3: 拒绝
        this._playerNodes[UserId].getChildByName('ok').active = code === 1 || code === 2;
        this._playerNodes[UserId].getChildByName('no').active = code === 3;
        if (UserId == this._selfUserId + '' && code !== 0) {
            this.btnAgree.active = false;
            this.btnDisagree.active = false;
        }
        if (code === 1 || code === 2) {
            this.titleLabel.string = "\u73A9\u5BB6" + this._playerNodes[UserId].showName + "\u7533\u8BF7\u9000\u51FA\u6E38\u620F\uFF0C\u8BF7\u6295\u7968";
        }
    },


    disbandRoomVoted: function disbandRoomVoted(data) {
        if (data.RetCode && data.RetCode !== 0) {
            cc.log('DisbandRoomVote------------ retcode = ', data.RetCode);
        }
        // this.btnAgree.active = false;
        // this.btnDisagree.active = false;
    },

    onBtnAgreeClick: function onBtnAgreeClick() {
        mjNetMgr.getIns().disbandRoomVote({ OP: 2 }, this.disbandRoomVoted.bind(this));
    },
    onBtnDisagreeClick: function onBtnDisagreeClick() {
        mjNetMgr.getIns().disbandRoomVote({ OP: 3 }, this.disbandRoomVoted.bind(this));
    },
    close: function close() {
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();