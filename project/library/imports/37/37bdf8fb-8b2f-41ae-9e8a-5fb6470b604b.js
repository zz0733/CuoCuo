"use strict";
cc._RF.push(module, '37bdfj7iy9Brp6KX7ZHC2BL', 'globalUI');
// hall/script/login/globalUI.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        zhuanquanPre: {
            type: cc.Prefab,
            default: null
        },

        minSingleButtonPre: {
            type: cc.Prefab,
            default: null
        },

        minDoubleButtonPre: {
            type: cc.Prefab,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.hasZhuanquan = false;
        this._hasNetZhuanquan = false;
        fun.event.add('GlobalUIZhuanquan', 'Zhuanquan', function (data) {
            var flag = false;
            var text = '';
            var from = 'normal';
            if (typeof data === 'boolean') {
                flag = data;
            } else {
                flag = data.flag;
                text = data.text || text;
                from = data.from;
            }
            if (from === 'net') {
                if (flag) {
                    if (!this._hasNetZhuanquan) {
                        this.netZhuanquan = cc.instantiate(this.zhuanquanPre);
                        this.netZhuanquan.parent = cc.director.getScene().getChildByName('Canvas');
                        this.netZhuanquan.setSiblingIndex(9998);
                        this._hasNetZhuanquan = true;
                    }
                    this.netZhuanquan.getComponent('zhuanquan').setString(text);
                } else {
                    if (this._hasNetZhuanquan) {
                        this.netZhuanquan.destroy();
                        this._hasNetZhuanquan = false;
                    }
                }
            }
            if (flag) {
                if (!this.hasZhuanquan) {
                    this.zhuanquan = cc.instantiate(this.zhuanquanPre);
                    this.zhuanquan.parent = cc.director.getScene().getChildByName('Canvas');
                    this.zhuanquan.setSiblingIndex(9998);
                    this.hasZhuanquan = true;
                }
                this.zhuanquan.getComponent('zhuanquan').setString(text);
            } else {
                if (this.hasZhuanquan) {
                    this.zhuanquan.destroy();
                    this.hasZhuanquan = false;
                }
            }
        }.bind(this));

        fun.event.add('GlobalUIMinSingleButtonPop', 'MinSingleButtonPop', function (data) {
            var mnode = cc.instantiate(this.minSingleButtonPre);
            mnode.parent = cc.director.getScene().getChildByName('Canvas') || cc.director.getScene().getChildByName('DDZ_UIROOT') || cc.director.getScene().getChildByName('DDZ_Replay');
            mnode.setSiblingIndex(9999);
            mnode.getComponent('minSingleButtonPop').init(data);
        }.bind(this));

        fun.event.add('GlobalUIMinDoubleButtonPop', 'MinDoubleButtonPop', function (data) {
            var mnode = cc.instantiate(this.minDoubleButtonPre);
            mnode.parent = cc.director.getScene().getChildByName('Canvas') || cc.director.getScene().getChildByName('DDZ_UIROOT') || cc.director.getScene().getChildByName('DDZ_Replay');
            mnode.setSiblingIndex(9999);
            mnode.getComponent('minDoubleButtonPop').init(data);
        }.bind(this));
    },
    onDestroy: function onDestroy() {
        fun.event.remove('GlobalUIZhuanquan');
        fun.event.remove('GlobalUIMinSingleButtonPop');
        fun.event.remove('GlobalUIMinDoubleButtonPop');
    }
});

cc._RF.pop();