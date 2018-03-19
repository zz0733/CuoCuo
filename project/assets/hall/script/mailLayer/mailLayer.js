let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {
        itemTemplate: {
            default: null,
            type: cc.Node,
        },

        scrollView: {
            default: null,
            type: cc.ScrollView,
        },

        spacing: {
            default: 0,
        },

        mailDetailPre: {
            type: cc.Prefab,
            default: null,
        },
    },

    init(reqCount, mailInfo) {
        if (!mailInfo) {
            mailInfo = [];
        }
        this.content = this.scrollView.content;
        this.totalCount = 0;
        this.reqCount = reqCount;
        let bg = this.node.getChildByName('back');
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

    addItems(mailInfo) {
        mailInfo.forEach(function (value) {
            let item = cc.instantiate(this.itemTemplate);
            item.parent = this.content;
            item.active = true;
            value.lId = this.totalCount;
            let time = new Date(value.time * 1000);
            value.timeStr = `${time.getFullYear()}年${time.getMonth()+1}月${time.getDate()}日`;
            item.getComponent('mailItem').updateItem(value);
            item.y = -item.height * (0.5 + this.totalCount) - this.spacing * this.totalCount;
            item.on('click', this.onItemClick.bind(this, this.totalCount, value));
            this.totalCount++;
        }, this);
        this.content.height = this.totalCount*(this.itemTemplate.height+this.spacing)+this.spacing;
        if (this.reqCount === mailInfo.length) {
            this.scrollView.node.once('scroll-to-bottom', this.onBottomCb, this);
        }
    },

    onEnable() {
        this.node.getComponent(cc.Animation).play('popScaleAnim');
    },

    onBottomCb() {
        fun.net.pSend('MailList', {Page: this.totalCount+1, Count: this.reqCount}, function (rsp) {
            if (rsp.mInfos && rsp.mInfos.length > 0) {
                this.addItems(rsp.mInfos);
            }
        }.bind(this));
    },

    onItemClick(index, data) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let callback = function(){
            fun.net.pSend('DelMail', {mId: data.mId}, function (rsp) {
                this.content.children.forEach(function (item) {
                    const lid = item.getComponent('mailItem').lId;
                    if (lid > index) {
                        item.y += (item.height + this.spacing);
                    } else if (lid === index) {
                        item.destroy();
                    }
                }, this);
            }.bind(this));
        }.bind(this);
        data.callback = callback;
        let mailDetail = cc.instantiate(this.mailDetailPre);
        mailDetail.getComponent('mailDetail').init(data);
        mailDetail.parent = this.node;
        if (data.mType === 1) {
            callback();
        }
    },

    onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animState = this.node.getComponent(cc.Animation).play('popScaleOut');
        this.animState.once('finished', function () {
            this.node.destroy();
        }.bind(this));
    },
});
