"use strict";
cc._RF.push(module, '86755Zo2o9ItamHCYQqEBKk', 'roomGongGao');
// hall/script/public/roomGongGao.js

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
        }
    },

    onLoad: function onLoad() {
        this.init();
    },
    init: function init() {
        this.minx = this.mask.x - this.mask.width / 2 - 50;
        this.startx = this.content.x;
        this.isPlaying = false;
        this.sumdt = 0;
        this.inited = true;
        this.currTime = Date.now();
        this.orignalPy = this.node.y;

        this.announceInfo = [];
        var data = fun.db.getData('AnnounceInfo') || [];
        data.forEach(function (value) {
            if (value.type !== 11) {
                value.nextShowTime = this.currTime;
                this.announceInfo.push(value);
            }
        }, this);
        fun.event.add('RoomGongGaoAnnounceInfo', 'AnnounceInfo', this.onAnnounceInfoEvent.bind(this));
        if (this.announceInfo.length === 0) {
            this.node.y = this.orignalPy * 1000;
        }
    },
    update: function update(dt) {
        if (!this.inited) {
            this.init();
        }
        this.sumdt += dt;
        if (this.sumdt >= 1) {
            this.currTime += 1000;
            this.sumdt -= 1;
        }

        if (this.isPlaying) {
            this.content.x -= 2;
            if (this.content.x + this.content.width <= this.minx) {
                for (var i = 0; i < this.announceInfo.length; i++) {
                    if (this.announceInfo[i].id === this.currid) {
                        this.announceInfo[i].nextShowTime = this.announceInfo[i].range * 1000 + this.currTime;
                        break;
                    }
                }
                this.isPlaying = false;
            }
        } else {
            var find = false;
            for (var _i = 0; _i < this.announceInfo.length; _i++) {
                if (this.announceInfo[_i].nextShowTime <= this.currTime) {
                    find = true;
                    this.isPlaying = true;
                    this.currid = this.announceInfo[_i].id;
                    this.content.x = this.startx;
                    this.contentLabel.string = this.announceInfo[_i].content;
                    break;
                }
            }
            if (find) {
                this.node.y = this.orignalPy;
            } else {
                this.node.y = this.orignalPy * 1000;
            }
        }
    },
    onDestroy: function onDestroy() {
        fun.event.remove('RoomGongGaoAnnounceInfo');
    },
    onAnnounceInfoEvent: function onAnnounceInfoEvent(data) {
        var tmp = [];
        data.forEach(function (value) {
            if (value.type !== 11) {
                value.nextShowTime = this.currTime;
                tmp.push(value);
            }
        }, this);
        this.announceInfo.forEach(function (value) {
            tmp.forEach(function (v, k) {
                if (v.id === value.id) {
                    tmp[k].nextShowTime = value.nextShowTime;
                }
            });
        });
        this.announceInfo = tmp;
        if (this.announceInfo.length === 0) {
            this.node.y = this.orignalPy * 1000;
        } else {
            this.node.y = this.orignalPy;
        }
    }
});

cc._RF.pop();