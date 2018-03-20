cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefab: {
            type: cc.Prefab,
            default: null,
        },

        scrollView: {
            type: cc.Node,
            default: null,
        },

        noCard: {
            type: cc.Node,
            default: null,
        },

        btnClose: {
            type: cc.Node,
            default: null,
        },
    },

    onLoad () {
        this.view = this.scrollView.getChildByName('view');
        this.content = this.view.getChildByName('content');
        this.btnClose.on('click', this.onBtnCloseClick, this);
    },

    setDetail(data) {
        if (data && data.length !== 0) {
            this.noCard.active = false;
            for (let i in data) {
                let item = cc.instantiate(this.itemPrefab);
                item.setPosition(cc.p(0, -item.getContentSize().height * (parseInt(i) + 0.5)));
                item.parent = this.content;
                item.getComponent('freeCardItem').setData(data[i]);
            }
        }
        let itemsHight = 68 * data.length;
        let conSize = this.content.getContentSize();
        if (itemsHight > conSize.height) {
            this.content.setContentSize(conSize.width, itemsHight);
        }
    },

    onBtnCloseClick() {
        this.node.destroy();
    }

});
