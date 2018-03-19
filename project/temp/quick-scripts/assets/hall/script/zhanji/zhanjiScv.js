(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/zhanji/zhanjiScv.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'de17fR1MoVHUIp1T0nhVnX/', 'zhanjiScv', __filename);
// hall/script/zhanji/zhanjiScv.js

'use strict';

var eventName = '';

cc.Class({
    extends: cc.Component,

    properties: {
        _hasInit: {
            default: false
        },

        _lastStart: {
            default: false
        },

        _enableCheck: {
            default: false
        },

        gameType: {
            type: gameConst.gameType,
            default: gameConst.gameType.universal
        },

        spacing: {
            default: 0
        },

        scrollView: {
            type: cc.ScrollView,
            default: null
        },

        itemTemplate: {
            default: null,
            type: cc.Node
        },

        zhanjiDetailPre: {
            type: cc.Prefab,
            default: null
        }
    },

    enableCheck: function enableCheck(flag) {
        this._enableCheck = flag;
    },
    onLoad: function onLoad() {
        this._content = this.scrollView.content;
        this._totalCount = 0;
    },
    onDestroy: function onDestroy() {
        fun.event.remove(eventName);
    },
    init: function init() {
        eventName = 'zhanjiScv' + fun.event.getSum();
        fun.event.add(eventName, 'ReplayInfo', this.onReplayInfoIn.bind(this));
    },
    onReplayInfoIn: function onReplayInfoIn() {
        this._enableCheck = false;
    },
    onEnable: function onEnable() {
        if (this._hasInit || !this._enableCheck) {
            return;
        }
        cc.log("--onEnable-", this.node.parent.parent.name, this._enableCheck);
        fun.net.pSend('StandingBrief', { GameType: this.gameType, Start: 0 }, function (data) {
            this.initWithData(data);
        }.bind(this));
    },
    initWithData: function initWithData(data) {
        this._hasInit = true;
        this.addItems(data.accounts);
    },
    addItems: function addItems() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        var lastStart = false;
        data.forEach(function (value) {
            var item = cc.instantiate(this.itemTemplate);
            item.parent = this._content;
            value.gameType = this.gameType;
            item.getComponent('zhanjiItem').init(value);
            item.y = -item.height * (0.5 + this._totalCount) - this.spacing * this._totalCount;
            item.x = 0;
            this._totalCount++;
            if (!lastStart || lastStart > value.createdAt) {
                lastStart = value.createdAt;
            }
        }.bind(this));
        if (lastStart && lastStart !== this._lastStart) {
            this._lastStart = lastStart;
            this.node.once('scroll-to-bottom', this.onBottomCb, this);
        }
        var newHeight = this._totalCount * (this.itemTemplate.height + this.spacing) + this.spacing;
        if (newHeight > this._content.height) {
            this._content.height = newHeight;
        }
    },
    onBottomCb: function onBottomCb() {
        cc.log("--onBottomCb-");
        fun.net.pSend('StandingBrief', { GameType: this.gameType, Start: this._lastStart }, function (data) {
            this.initWithData(data);
        }.bind(this));
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
        //# sourceMappingURL=zhanjiScv.js.map
        