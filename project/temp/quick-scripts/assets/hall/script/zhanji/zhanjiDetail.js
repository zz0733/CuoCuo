(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/zhanji/zhanjiDetail.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '97287lDhyJC2ZEKh3nq/2cx', 'zhanjiDetail', __filename);
// hall/script/zhanji/zhanjiDetail.js

'use strict';

var typeNode = cc.Class({
    name: 'typeNode',

    properties: {
        gameType: {
            type: gameConst.gameType,
            default: gameConst.gameType.universal
        },
        titleNode: {
            type: cc.Node,
            default: null
        }
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: {
            type: cc.Node,
            default: null
        },

        scrollView: {
            type: cc.ScrollView,
            default: null
        },

        spacing: {
            default: 0
        },

        timeLabe: {
            type: cc.Label,
            default: null
        },

        roomNumLabel: {
            type: cc.Label,
            default: null
        },

        btnClose: {
            type: cc.Node,
            default: null
        },

        titleNodes: {
            type: [typeNode],
            default: []
        }
    },

    onLoad: function onLoad() {
        this.btnClose.on('click', this.onBtnCloseClick, this);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    init: function init(accountData, data) {
        this._content = this.scrollView.content;
        this._gameType = data.gameType;
        this._uid = data.id;
        this.titleNodes.forEach(function (value) {
            if (value.gameType === this._gameType) {
                value.titleNode.active = true;
            }
        }.bind(this));
        this.timeLabe.string = data.timeStr;
        this.roomNumLabel.string = data.roomId;
        this.content = this.scrollView.content;
        this.totalCount = 0;
        this._userInfo = {};
        data.players.forEach(function (player) {
            this._userInfo[player.userId] = { name: player.userName, url: player.headUrl };
        }.bind(this));
        this.addItems(accountData);
    },
    addItems: function addItems() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        data.forEach(function (value) {
            var item = cc.instantiate(this.itemTemplate);
            item.parent = this.content;
            item.active = true;
            item.getComponent('zhanjiDetailItem').init(this._uid, this._gameType, value, this._userInfo);
            item.y = -item.height * (0.5 + this.totalCount) - this.spacing * this.totalCount;
            this.totalCount++;
        }, this);
        var newHeight = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing;
        if (newHeight > this._content.height) {
            this._content.height = newHeight;
        }
    },
    onBtnCloseClick: function onBtnCloseClick() {
        require('Audio').playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
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
        //# sourceMappingURL=zhanjiDetail.js.map
        