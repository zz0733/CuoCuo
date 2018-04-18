"use strict";
cc._RF.push(module, 'e7ebdCmaM5Nh7lE/ZMmwbeF', 'freeCardDetail');
// hall/script/public/freeCardDetail.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: {
            type: cc.Prefab,
            default: null
        },

        scrollView: {
            type: cc.Node,
            default: null
        },

        noCard: {
            type: cc.Node,
            default: null
        },

        btnClose: {
            type: cc.Node,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.view = this.scrollView.getChildByName('view');
        this.content = this.view.getChildByName('content');
        this.btnClose.on('click', this.onBtnCloseClick, this);
    },
    setDetail: function setDetail(data, gameType) {
        if (!data) return;
        if (data.length !== 0) {
            this.noCard.active = false;
            for (var i in data) {
                var item = cc.instantiate(this.itemPrefab);
                item.setPosition(cc.p(18, -item.getContentSize().height * (parseInt(i) + 0.5)));
                item.parent = this.content;
                item.getComponent('freeCardItem').setData(data[i], gameType);
            }
        }
        var itemsHight = 68 * data.length;
        var conSize = this.content.getContentSize();
        if (itemsHight > conSize.height) {
            this.content.setContentSize(conSize.width, itemsHight);
        }
    },
    onBtnCloseClick: function onBtnCloseClick() {
        this.node.destroy();
    }
});

cc._RF.pop();