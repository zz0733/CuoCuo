cc.Class({
    extends: cc.Component,

    properties: {

        ownNameColor: {
            default: cc.Color.WHITE,
            displayName: '自己名字颜色',
        },

        otherNameColor: {
            default: cc.Color.WHITE,
            displayName: '别人名字颜色',
        },

        addScoreColor: {
            default: cc.Color.WHITE,
            displayName: '加分颜色',
        },

        subScoreColor: {
            default: cc.Color.WHITE,
            displayName: '减分颜色',
        },

        maxUser: {
            default: 4,
            displayName: '最多玩家数',
        },

        infoBtn: {
            type: cc.Node,
            default: null,
        },

        juShuLabel: {
            type: cc.Label,
            default: null,
        },

        timeLabel: {
            type: cc.Label,
            default: null,
        },

        roomNumLabel: {
            type: cc.Label,
            default: null,
        },

        detailPre: {
            type: cc.Prefab,
            default: null,
        },
    },

    onLoad() {
        this.infoBtn.on('click', this.onInfoBtnClick, this);
    },

    _padZero(num) {
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    },

    init(data) {
        this._selfId = fun.db.getData('UserInfo').UserId;        
        this._gameType = data.gameType;
        let time = new Date(data.createdAt * 1000);//value.deletedAt
        const month = this._padZero(time.getMonth() + 1);
        const day = this._padZero(time.getDate());
        const hours = this._padZero(time.getHours());
        const minutes = this._padZero(time.getMinutes());
        data.timeStr = `${time.getFullYear()}.${month}.${day} ${hours}:${minutes}`;
        this.timeLabel.string = data.timeStr;
        this.roomNumLabel.string = data.roomId;
        this._uid = data.id;
        this._data = data;

        for (let i = 0; i < this.maxUser; i++) {
            let head = this.node.getChildByName('head' + (i + 1));
            let nameNode = head.getChildByName('name');
            if (data.players[i]) {
                nameNode.getComponent(cc.Label).string = data.players[i].userName;
                fun.utils.loadUrlRes(data.players[i].headUrl, head.getChildByName('icon'));
                if (this._selfId === data.players[i].userId) {
                    nameNode.color = this.ownNameColor;
                } else {
                    head.cascadeOpacity = false;
                    head.opacity = 0;
                    nameNode.color = this.otherNameColor;
                }
                const score = data.players[i].score || 0;
                let scoreNode = head.getChildByName('fenshu');
                scoreNode.getComponent(cc.Label).string = score;
                if (score >= 0) {
                    scoreNode.color = this.addScoreColor;
                } else {
                    scoreNode.color = this.subScoreColor;
                }
            } else {
                head.active = false;
            }
        }        
    },

    onInfoBtnClick() {
        require('Audio').playEffect('hall', 'button_nomal.mp3');
        fun.net.pSend('StandingDetail', {GameType: this._gameType, Id: this._uid}, function(data) {
            let detailNode = cc.instantiate(this.detailPre);
            detailNode.parent = cc.director.getScene().getChildByName('Canvas');
            detailNode.getComponent('zhanjiDetail').init(data.accounts, this._data);
        }.bind(this));
    },
});
