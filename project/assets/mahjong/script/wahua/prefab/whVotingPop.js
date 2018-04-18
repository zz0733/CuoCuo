const DisbandState = cc.Enum({
    applicant: 0,
    agree: 1,
    disagree: 2,
    wait: 3,
});

cc.Class({
    extends: cc.Component,

    properties: {
        back: {
            type: cc.Node,
            default: null,
        },

        playerList: {
            type: cc.Node,
            default: null,
        },

        applicantTabel: {
            type: cc.RichText,
            default: null,
        },

        TimeLabel: {
            type: cc.Label,
            default: null,
        },

        btnDisagree: {
            type: cc.Node,
            default: null,
        },

        btnAgree: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad () {
        let children = this.playerList.children;
        for (let i=0; i<children.length; ++i) {
            children[i].active = false;
        }
        this.MineUserId = fun.db.getData('UserInfo').UserId.toString();
        this.setBtnAgreeActive(false);
        this.back.getChildByName('btnAgree').on('click', this.onBtnAgreeClick, this);
        this.back.getChildByName('btnDisagree').on('click', this.onBtnDisagreeClick, this);
    },

    update(dt) {
        if (this._isUpdate) {
            let time = parseInt(this.TimeLabel.string);
            if (time <= 0) {
                this._isUpdate = false;
                this.node.active = false;
            } else {
                this.dtTime = (this.dtTime || 0) + dt;
                if (this.dtTime >= 1) {
                    this.dtTime -= 1;
                    let newTime = time - 1;
                    this.TimeLabel.string = newTime <= 0 ? 0 : newTime;
                }
            }
        }
    },

    setData(data) {
        let count = -1;
        if (data.timeBreak) {
            this.TimeLabel.string = data.timeBreak;
        }
        this._isUpdate = true;
        let applyStatu = data.applyStatu;
        for (let id in applyStatu) {
            count++;
            let p = this.playerList.getChildByName('player_'+count);
            p.active = true;
            fun.utils.loadUrlRes(applyStatu[id].headUrl, p.getChildByName('img'));
            p.getChildByName('name').getComponent(cc.Label).string = applyStatu[id].name;
            let ok = p.getChildByName('ok');
            let no = p.getChildByName('no');
            if (id === this.MineUserId && applyStatu[id].state === DisbandState.wait) {
                this.setBtnAgreeActive(true);
            }
            switch(applyStatu[id].state){
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

    setBtnAgreeActive : function (active) {
        this.btnAgree.active    = active;
        this.btnDisagree.active = active;
    },

    onBtnAgreeClick() {
        fun.net.send("DisbandRoomVote", { applyStatu : 1 });
        this.setBtnAgreeActive(false);
    },

    onBtnDisagreeClick() {
        fun.net.send("DisbandRoomVote", { applyStatu : 2 });
        this.setBtnAgreeActive(false);
    },

});
