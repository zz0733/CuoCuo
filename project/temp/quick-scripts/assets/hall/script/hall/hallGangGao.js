(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/hall/hallGangGao.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c39f9zjUItBarW49ShTxPek', 'hallGangGao', __filename);
// hall/script/hall/hallGangGao.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            type: cc.Node,
            default: null
        },

        content: {
            type: cc.Node,
            default: null
        },

        contentLabel: {
            type: cc.Label,
            default: null
        },

        normalColor: {
            default: cc.Color.WHITE
        },

        superColor: {
            default: cc.Color.WHITE
        }
    },

    onLoad: function onLoad() {
        this.minx = this.mask.x - this.mask.width / 2 - 50;
        this.startx = this.content.x;
        this.sumdt = 0;
        this.currTime = Date.now();

        this.announceInfo = fun.db.getData('AnnounceInfo');
        if (this.announceInfo.length === 0) {
            this.announceInfo = [{ content: '搓搓麻将新版正式公测，所有游戏免费畅玩！', range: 10, type: 11 }, { content: '文明游戏，严禁赌博！', range: 10, type: 11 }];
        }
        this.announceInfo.forEach(function (value, key) {
            if (value.type === 11) {
                this.announceInfo[key].nextShowTime = this.currTime + value.range * 1000;
            } else {
                this.announceInfo[key].nextShowTime = this.currTime;
            }
        }, this);
        this.sortAnnounceInfo();

        this.onAnnounceInfoEvent(this.announceInfo);
        fun.event.add('HallGangGao', 'AnnounceInfo', this.onAnnounceInfoEvent.bind(this));
    },
    initGongGao: function initGongGao(content, color) {
        this.content.x = this.startx;
        this.contentLabel.string = content;
        this.content.color = color;
    },
    update: function update(dt) {
        this.sumdt += dt;
        if (this.sumdt >= 1) {
            this.currTime += 1000;
            this.sumdt -= 1;
        }

        if (this._isSuperSchedule) {
            this.superDt = (this.superDt ? this.superDt : 0) + dt;
            if (this.superDt >= this._superValue.range) {
                this.superDt -= this._superValue.range;
                this.initGongGao(this._superValue.content, this.superColor);
                this._isSuperSchedule = false;
                this._isNormalPlaying = false;
                this._isNormalSchedule = false;
                this._isSuperPlaying = true;
            }
        }
        if (this._isSuperPlaying) {
            this.content.x -= 2;
            if (this.content.x + this.content.width <= this.minx) {
                this._isNormalPlaying = true;
                this.initGongGao(this.announceInfo[this.currPlayIdx].content, this.normalColor);
                this._isSuperPlaying = false;
                this._isSuperSchedule = true;
            }
        }

        if (this._isNormalSchedule) {
            this.normalDt = (this.normalDt ? this.normalDt : 0) + dt;
            if (this.normalDt >= this.announceInfo[this.currPlayIdx].range) {
                this.normalDt -= this.announceInfo[this.currPlayIdx].range;
                this.initGongGao(this.announceInfo[this.currPlayIdx].content, this.normalColor);
                this._isNormalSchedule = false;
                this._isNormalPlaying = true;
            }
        }
        if (this._isNormalPlaying) {
            this.content.x -= 2;
            if (this.content.x + this.content.width <= this.minx) {
                this.currPlayIdx = this.currPlayIdx < this.announceInfo.length - 1 ? this.currPlayIdx + 1 : 0;
                this._isNormalSchedule = true;
                this._isNormalPlaying = false;
            }
        }
    },
    onDestroy: function onDestroy() {
        fun.event.remove('HallGangGao');
    },
    sortAnnounceInfo: function sortAnnounceInfo() {
        this.announceInfo.sort(function (a, b) {
            return a.nextShowTime - b.nextShowTime;
        });
    },
    onAnnounceInfoEvent: function onAnnounceInfoEvent(data) {
        this._isNormalPlaying = false;
        this._isNormalSchedule = false;
        this._isSuperPlaying = false;
        this._isSuperSchedule = false;
        var superValue = undefined;
        data.forEach(function (value, key) {
            if (value.type === 11) {
                data[key].nextShowTime = this.currTime + value.range * 1000;
            } else {
                superValue = value;
            }
        }, this);
        this.announceInfo = data;
        this.sortAnnounceInfo();
        this.currPlayIdx = 0;
        if (!superValue) {
            this.initGongGao(this.announceInfo[this.currPlayIdx].content, this.normalColor);
            this._isNormalPlaying = true;
        } else {
            this.currPlayIdx = 1;
            this._superValue = superValue;
            this.initGongGao(superValue.content, this.superColor);
            this._isSuperPlaying = true;
        }
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
        //# sourceMappingURL=hallGangGao.js.map
        