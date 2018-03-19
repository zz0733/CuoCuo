const mjDataMgr = require("mjDataMgr");
const mjNetMgr  = require("mjNetMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        btnAgree: {
            type: cc.Node,
            default: null,
        },

        btnDisagree: {
            type: cc.Node,
            default: null,
        },

        playerList: {
            type: cc.Node,
            default: null,
        },

        timeLabel: {
            type: cc.Label,
            default: null,
        },

        titleLabel: {
            type: cc.RichText,
            default: null,
        },
    },

    onLoad () {
        cc.log('--- mjVotingPopUI ---');

        this.timeLabel.string = "";
        this.playerList.children.forEach(function (value) {
            value.active = false;
        });
        this._selfUserId = fun.db.getData('UserInfo').UserId;
        this._playerNodes = {};
        this._playersData = mjDataMgr.getInstance().getAllPlayersData();
        let index = -1;
        for(let idx in this._playersData){
            index += 1;
            let value = this._playersData[idx];
            const id = value.UserId + '';
            this._playerNodes[id] = this.playerList.children[index];
            this._playerNodes[id].active = true;
            let imgNode = this._playerNodes[id].getChildByName('img');
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
        fun.net.pSend('ServerTime', '', function(rsp) {
            if (rsp.Now) {
                this._currTime = rsp.Now;
            }
        }.bind(this));
        this.sumdt = 0;
    },

    updateData (data) {
        this._endTime = data.EndTime;
        for (const k in data.VoteInfo) {
            this.showVoteChoice(k, data.VoteInfo[k]);
        }
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    update (dt) {
        this.sumdt += dt;
        if (this.sumdt < 1) {
            return;
        }
        this._currTime += 1;
        this.sumdt -= 1;
        let showTime = 0;
        if (this._endTime) {
            showTime = this._endTime - this._currTime;
        } else {
            showTime = parseInt(this.timeLabel.string) -1;
        }
        if (showTime < 0) {
            showTime = 0;
        }
        this.timeLabel.string = showTime;
    },

    showVoteChoice(UserId, code = 0) {
        cc.log("---showVoteChoice------UserId:"+UserId + " code:" + code, UserId == (this._selfUserId + ''));
        //code 0:未选择 1:发起人 2:同意 3: 拒绝
        this._playerNodes[UserId].getChildByName('ok').active = (code === 1 || code === 2);
        this._playerNodes[UserId].getChildByName('no').active = (code === 3);
        if (UserId == (this._selfUserId + '') && (code !== 0)) {
            this.btnAgree.active = false;
            this.btnDisagree.active = false;
        }
        if (code === 1 || code === 2) {
            this.titleLabel.string = `玩家${this._playerNodes[UserId].showName}申请退出游戏，请投票`;
        }
    },

    disbandRoomVoted : function(data){
        if (data.RetCode && data.RetCode !== 0) {
            cc.log('DisbandRoomVote------------ retcode = ', data.RetCode);
        }
        // this.btnAgree.active = false;
        // this.btnDisagree.active = false;
    },

    onBtnAgreeClick () {
        mjNetMgr.getIns().disbandRoomVote({OP:2}, this.disbandRoomVoted.bind(this));
    },

    onBtnDisagreeClick () {
        mjNetMgr.getIns().disbandRoomVote({OP:3}, this.disbandRoomVoted.bind(this));
    },

    close () {
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },

});
