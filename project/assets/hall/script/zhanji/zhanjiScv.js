let eventName = '';

cc.Class({
    extends: cc.Component,

    properties: {
        _hasInit: {
            default: false,
        },

        _lastStart: {
            default: false,
        },

        _enableCheck: {
            default: false,
        },

        gameType: {
            type: gameConst.gameType,
            default: gameConst.gameType.universal,
        },

        spacing: {
            default: 0,
        },

        scrollView: {
            type: cc.ScrollView,
            default: null,
        },

        itemTemplate: {
            default: null,
            type: cc.Node,
        },

        zhanjiDetailPre: {
            type: cc.Prefab,
            default: null,
        },
    },

    enableCheck (flag) {
        this._enableCheck = flag;
    },

    onLoad () {
        this._content = this.scrollView.content;
        this._totalCount = 0;
    },

    onDestroy () {
        fun.event.remove(eventName);
    },

    init() {
        eventName = 'zhanjiScv' +fun.event.getSum();
        fun.event.add(eventName, 'ReplayInfo', this.onReplayInfoIn.bind(this));
    },

    onReplayInfoIn() {
        this._enableCheck = false;
    },

    onEnable () {
        if (this._hasInit || !this._enableCheck) {
            return;
        }
         cc.log("--onEnable-", this.node.parent.parent.name, this._enableCheck);
        fun.net.pSend('StandingBrief', {GameType: this.gameType, Start: 0}, function(data) {
            this.initWithData(data);
        }.bind(this));
    },

    initWithData (data) {
        this._hasInit = true;
        this.addItems(data.accounts);
    },

    addItems(data = []) {
        let lastStart = false;
        data.forEach(function(value) {
            let item = cc.instantiate(this.itemTemplate);
            item.parent = this._content;
            value.gameType = this.gameType;
            item.getComponent('zhanjiItem').init(value);
            item.y = -item.height * (0.5 + this._totalCount) - this.spacing * this._totalCount;
            item.x = 0;
            this._totalCount++;
            if (!lastStart || (lastStart > value.createdAt)) {
                lastStart = value.createdAt;
            }
        }.bind(this));
        if (lastStart && lastStart !== this._lastStart) {
            this._lastStart = lastStart;
            this.node.once('scroll-to-bottom', this.onBottomCb, this);
        }
        const newHeight = this._totalCount * (this.itemTemplate.height + this.spacing) + this.spacing;
        if (newHeight > this._content.height) {
            this._content.height = newHeight;
        }
    },

    onBottomCb() {
        cc.log("--onBottomCb-");
        fun.net.pSend('StandingBrief', {GameType: this.gameType, Start: this._lastStart}, function(data) {
            this.initWithData(data);
        }.bind(this));
    }
});
