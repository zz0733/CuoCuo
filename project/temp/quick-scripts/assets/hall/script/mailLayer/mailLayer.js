(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/mailLayer/mailLayer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fe45ck6oZtLg79qjLU4UbTf', 'mailLayer', __filename);
// hall/script/mailLayer/mailLayer.js

'use strict';

var Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: {
            default: null,
            type: cc.Node
        },

        scrollView: {
            default: null,
            type: cc.ScrollView
        },

        spacing: {
            default: 0
        },

        mailDetailPre: {
            type: cc.Prefab,
            default: null
        }
    },

    init: function init(reqCount, mailInfo) {
        if (!mailInfo) {
            mailInfo = [];
        }
        this.content = this.scrollView.content;
        this.totalCount = 0;
        this.reqCount = reqCount;
        var bg = this.node.getChildByName('back');
        // bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        if (mailInfo.length > 0) {
            cc.sys.localStorage.setItem('LastMailID', mailInfo[0].mId);
            bg.getChildByName('noEmail').active = false;
            this.scrollView.active = true;
            this.addItems(mailInfo);
        } else {
            // this.scrollView.node.active = false;
            bg.getChildByName('noEmail').active = true;
        }
    },
    addItems: function addItems(mailInfo) {
        mailInfo.forEach(function (value) {
            var item = cc.instantiate(this.itemTemplate);
            item.parent = this.content;
            item.active = true;
            value.lId = this.totalCount;
            var time = new Date(value.time * 1000);
            value.timeStr = time.getFullYear() + '\u5E74' + (time.getMonth() + 1) + '\u6708' + time.getDate() + '\u65E5';
            item.getComponent('mailItem').updateItem(value);
            item.y = -item.height * (0.5 + this.totalCount) - this.spacing * this.totalCount;
            item.on('click', this.onItemClick.bind(this, this.totalCount, value));
            this.totalCount++;
        }, this);
        this.content.height = this.totalCount * (this.itemTemplate.height + this.spacing) + this.spacing;
        if (this.reqCount === mailInfo.length) {
            this.scrollView.node.once('scroll-to-bottom', this.onBottomCb, this);
        }
    },
    onEnable: function onEnable() {
        this.node.getComponent(cc.Animation).play('popScaleAnim');
    },
    onBottomCb: function onBottomCb() {
        fun.net.pSend('MailList', { Page: this.totalCount + 1, Count: this.reqCount }, function (rsp) {
            if (rsp.mInfos && rsp.mInfos.length > 0) {
                this.addItems(rsp.mInfos);
            }
        }.bind(this));
    },
    onItemClick: function onItemClick(index, data) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        var callback = function () {
            fun.net.pSend('DelMail', { mId: data.mId }, function (rsp) {
                this.content.children.forEach(function (item) {
                    var lid = item.getComponent('mailItem').lId;
                    if (lid > index) {
                        item.y += item.height + this.spacing;
                    } else if (lid === index) {
                        item.destroy();
                    }
                }, this);
            }.bind(this));
        }.bind(this);
        data.callback = callback;
        var mailDetail = cc.instantiate(this.mailDetailPre);
        mailDetail.getComponent('mailDetail').init(data);
        mailDetail.parent = this.node;
        if (data.mType === 1) {
            callback();
        }
    },
    onBtnCloseClick: function onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animState = this.node.getComponent(cc.Animation).play('popScaleOut');
        this.animState.once('finished', function () {
            this.node.destroy();
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
        //# sourceMappingURL=mailLayer.js.map
        