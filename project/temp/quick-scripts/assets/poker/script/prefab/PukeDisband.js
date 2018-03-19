(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/script/prefab/PukeDisband.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '78ccfDirgtHcb5qyHPzdW4K', 'PukeDisband', __filename);
// poker/script/prefab/PukeDisband.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        applicantTabel: cc.RichText,
        PlayerList: cc.Node,
        TimeLabel: cc.Label,
        BtnAgree: cc.Node,
        BtnDisagree: cc.Node
    },

    update: function update(dt) {
        if (this.isUpdate) {
            var time = parseInt(this.TimeLabel.string);
            if (time <= 0) {
                this.isUpdate = false;
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

    disbandRoomInit: function disbandRoomInit(data) {
        this.data = data;
        var UserInfo = fun.db.getData('UserInfo');
        this.MineUserId = parseInt(UserInfo.UserId);
        this.isUpdate = true;
        this.setBtnAgreeActive(false);
        this.setPlayerActive();

        if (data.GameType === 'sangong') {
            //三公
            fun.net.pSend('ServerTime', '', function (rsp) {
                if (rsp.Now) {
                    this.NewBeginTime = rsp.Now;
                    this.TimeLabel.string = data.EndTime - this.NewBeginTime;
                    this.initSanGongShow();
                }
            }.bind(this));
        } else if (data.GameType === 'niuniu') {
            //牛牛
            if (data.timeBreak) {
                this.TimeLabel.string = data.timeBreak;
            }
            this.initNiuNiuShow();
        }
    },

    setBtnAgreeActive: function setBtnAgreeActive(active) {
        this.BtnAgree.active = active;
        this.BtnDisagree.active = active;
    },

    setPlayerActive: function setPlayerActive(active) {
        for (var i = 0; i < this.PlayerList.children.length; ++i) {
            this.PlayerList.children[i].active = false;
        }
    },

    allAgreeDisband: function allAgreeDisband() {
        for (var i = 1; i <= 6; ++i) {
            var player = this.PlayerList.getChildByName('player_' + i);
            var ok = player.getChildByName('ok').getChildByName('tag');
            ok.active = true;
        }
    },

    initSanGongShow: function initSanGongShow() {
        var count = 0;
        for (var id in this.data.VoteInfo) {
            count++;
            var info = this.data.VoteInfo[id];
            info.name = info.name === 'gust' ? info.name + id : info.name;
            if (parseInt(id) === this.MineUserId && info.state === 0) {
                this.setBtnAgreeActive(true);
            }
            var player = this.PlayerList.getChildByName('player_' + count);
            player.active = true;
            var icon = player.getChildByName('icon').getChildByName('img');
            fun.utils.loadUrlRes(info.headUrl, icon);
            var name = player.getChildByName('name').getComponent(cc.Label);
            name.string = info.name;
            var ok = player.getChildByName('ok').getChildByName('tag');
            var no = player.getChildByName('no').getChildByName('tag');
            if (info.state === 0) {
                //准备
                ok.active = false;
                no.active = false;
            } else if (info.state === 1) {
                //申请
                ok.active = true;
                no.active = false;
                this.applicantTabel.string = '玩家' + info.name + '申请退出游戏，请投票';
            } else if (info.state === 2) {
                //同意
                ok.active = true;
                no.active = false;
            } else if (info.state === 3) {
                //拒绝
                ok.active = false;
                no.active = true;
            }
        }
    },

    initNiuNiuShow: function initNiuNiuShow() {
        var count = 0;
        for (var id in this.data.applyStatu) {
            count++;
            var info = this.data.applyStatu[id];
            info.name = info.name === 'gust' ? info.name + id : info.name;
            if (parseInt(id) === this.MineUserId && info.state === 3) {
                this.setBtnAgreeActive(true);
            }
            var player = this.PlayerList.getChildByName('player_' + count);
            player.active = true;
            var icon = player.getChildByName('icon').getChildByName('img');
            fun.utils.loadUrlRes(info.headUrl, icon);
            var name = player.getChildByName('name').getComponent(cc.Label);
            name.string = info.name;
            var ok = player.getChildByName('ok').getChildByName('tag');
            var no = player.getChildByName('no').getChildByName('tag');
            if (info.state === 3) {
                //准备
                ok.active = false;
                no.active = false;
            } else if (info.state === 0) {
                //申请
                ok.active = true;
                no.active = false;
                this.applicantTabel.string = '玩家' + info.name + '申请退出游戏，请投票';
            } else if (info.state === 1) {
                //同意
                ok.active = true;
                no.active = false;
            } else if (info.state === 2) {
                //拒绝
                ok.active = false;
                no.active = true;
            }
        }
    },

    onBtnAgreeClicked: function onBtnAgreeClicked() {
        if (this.data.GameType === 'niuniu') {
            fun.net.send("NiuDisbandRoomVote", { applyStatu: 1 });
        } else if (this.data.GameType === 'sangong') {
            fun.net.send("DisbandRoomVote", { OP: 2 });
        }
        this.setBtnAgreeActive(false);
    },

    onBtnDisagreeClicked: function onBtnDisagreeClicked() {
        if (this.data.GameType === 'niuniu') {
            fun.net.send("NiuDisbandRoomVote", { applyStatu: 2 });
        } else if (this.data.GameType === 'sangong') {
            fun.net.send("DisbandRoomVote", { OP: 3 });
        }
        this.setBtnAgreeActive(false);
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
        //# sourceMappingURL=PukeDisband.js.map
        