"use strict";
cc._RF.push(module, 'f2a4eaPwl9IipZ02KExPTvE', 'whVotingPop');
// mahjong/script/wahua/prefab/whVotingPop.js

'use strict';

var DisbandState = cc.Enum({
    applicant: 0,
    agree: 1,
    disagree: 2,
    wait: 3
});

cc.Class({
    extends: cc.Component,

    properties: {
        back: {
            type: cc.Node,
            default: null
        },

        playerList: {
            type: cc.Node,
            default: null
        },

        applicantTabel: {
            type: cc.RichText,
            default: null
        },

        TimeLabel: {
            type: cc.Label,
            default: null
        },

        btnDisagree: {
            type: cc.Node,
            default: null
        },

        btnAgree: {
            type: cc.Node,
            default: null
        }
    },

    onLoad: function onLoad() {
        var children = this.playerList.children;
        for (var i = 0; i < children.length; ++i) {
            children[i].active = false;
        }
        this.MineUserId = fun.db.getData('UserInfo').UserId.toString();
        this.setBtnAgreeActive(false);
        this.back.getChildByName('btnAgree').on('click', this.onBtnAgreeClick, this);
        this.back.getChildByName('btnDisagree').on('click', this.onBtnDisagreeClick, this);
    },
    update: function update(dt) {
        if (this._isUpdate) {
            var time = parseInt(this.TimeLabel.string);
            if (time <= 0) {
                this._isUpdate = false;
                this.node.active = false;
            } else {
                this.dtTime = (this.dtTime || 0) + dt;
                if (this.dtTime >= 1) {
                    this.dtTime -= 1;
                    var newTime = time - 1;
                    this.TimeLabel.string = newTime <= 0 ? 0 : newTime;
                }
            }
        }
    },
    setData: function setData(data) {
        var count = -1;
        if (data.timeBreak) {
            this.TimeLabel.string = data.timeBreak;
        }
        this._isUpdate = true;
        var applyStatu = data.applyStatu;
        for (var id in applyStatu) {
            count++;
            var p = this.playerList.getChildByName('player_' + count);
            p.active = true;
            fun.utils.loadUrlRes(applyStatu[id].headUrl, p.getChildByName('img'));
            p.getChildByName('name').getComponent(cc.Label).string = applyStatu[id].name;
            var ok = p.getChildByName('ok');
            var no = p.getChildByName('no');
            if (id === this.MineUserId && applyStatu[id].state === DisbandState.wait) {
                this.setBtnAgreeActive(true);
            }
            switch (applyStatu[id].state) {
                case DisbandState.applicant:
                    ok.active = true;
                    no.active = false;
                    this.applicantTabel.string = '玩家' + applyStatu[id].name + '申请退出游戏，请投票';
                    break;
                case DisbandState.agree:
                    ok.active = true;
                    no.active = false;
                    break;
                case DisbandState.disagree:
                    ok.active = false;
                    no.active = true;
                    break;
                case DisbandState.wait:
                    ok.active = false;
                    no.active = false;
                    break;
                default:
                    break;
            }
        }
    },


    setBtnAgreeActive: function setBtnAgreeActive(active) {
        this.btnAgree.active = active;
        this.btnDisagree.active = active;
    },

    onBtnAgreeClick: function onBtnAgreeClick() {
        fun.net.send("DisbandRoomVote", { applyStatu: 1 });
        this.setBtnAgreeActive(false);
    },
    onBtnDisagreeClick: function onBtnDisagreeClick() {
        fun.net.send("DisbandRoomVote", { applyStatu: 2 });
        this.setBtnAgreeActive(false);
    }
});

cc._RF.pop();