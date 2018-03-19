cc.Class({
    extends: cc.Component,

    properties: {
        BigWinner     : cc.Node,
        HeadImg       : cc.Node,
        Name          : cc.Label,
        Id            : cc.Label,
        YingScore     : cc.Node,
        Ying          : cc.Label,
        ShuScore      : cc.Node,
        Shu           : cc.Label,
        Own           : cc.Node,
        OwnName       : cc.Label,
        OwnId         : cc.Label,
        OwnCostCard   : cc.Label,
        OwnLeaveCard  : cc.Label,
        costRoomCard  : cc.Label,
        leaveRoomCard : cc.Label,
    },

    initAccountBox : function (data) {
        let UserInfo = fun.db.getData('UserInfo');
        if (data.winner != undefined && data.winner) {
            this.BigWinner.active = true;
        } else {
            this.BigWinner.active = false;
        }
        if (UserInfo.UserId === parseInt(data.id)) {
            this.Own.active = true;
            this.OwnName.string = data.name;
            this.OwnId.string = data.id;
            this.OwnCostCard.string = data.lost;
            this.OwnLeaveCard.string = data.left;
        } else {
            this.Own.active = false;
        }
        
        fun.utils.loadUrlRes(data.head, this.HeadImg);
        this.Name.string          = data.name;
        this.Id.string            = data.id;
        if (data.score > 0) {
            this.YingScore.active = true;
            this.ShuScore.active  = false;
            this.Ying.string      = '+' + data.score;
        } else {
            this.YingScore.active = false;
            this.ShuScore.active  = true;
            this.Shu.string       = data.score;
        }
        this.costRoomCard.string  = data.lost;
        this.leaveRoomCard.string = data.left;
    },
});
