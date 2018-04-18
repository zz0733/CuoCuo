"use strict";
cc._RF.push(module, '3af18zJCWVGm621GklPs3ni', 'hallActivity');
// hall/script/hall/hallActivity.js

'use strict';

var GameTypeEnum = cc.Enum({
    wlmj: 1,
    hymj: 3,
    wlwh: 5,
    ddz: 6,
    scmj: 7
});
var LingQuError = cc.Enum({
    FAILED: 1,
    RECIVED: 2,
    NOT_EXIST: 3,
    NO_SELF: 4
});

cc.Class({
    extends: cc.Component,

    properties: {
        shareCardItem: cc.Prefab
    },

    onLoad: function onLoad() {
        var bg = this.node.getChildByName('back');
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        this.leftBox = bg.getChildByName('leftBox');
        this.rightBox = bg.getChildByName('rightBox');
        this.shareCardBox = bg.getChildByName('shareCardBox');
        this.shareReceiveCode = bg.getChildByName('shareReceiveCode');
        this.shareRecording = bg.getChildByName('shareRecording');
        this.shareContent = bg.getChildByName('shareContent');
        this.lingCardBox = bg.getChildByName('lingCardBox');
        this._menuNum = this.rightBox.children.length;
        for (var i = 0; i < this._menuNum; ++i) {
            this.leftBox.getChildByName('btnActivity' + (i + 1)).on('click', this.onActivityMenuShow.bind(this, i + 1));
        }
        this.onActivityMenuShow(1);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
        var isApple = fun.gameCfg.releaseType === gameConst.releaseType.apple ? true : false;
        if (isApple) {
            this.leftBox.getChildByName('btnActivity2').active = false;
        }
        var isFisher = fun.gameCfg.releaseType === gameConst.releaseType.fisher ? true : false;
        if (isFisher) {
            this.leftBox.getChildByName('btnActivity3').destroy();
            this.leftBox.getChildByName('btnDown3').destroy();
            this._menuNum--;
        }
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    start: function start() {
        var hd3 = this.rightBox.getChildByName('huodong3');
        hd3.getChildByName('btnFx').on('click', function () {
            fun.net.pSend('TimeCardList', { Type: GameTypeEnum.wlmj }, function (rsp) {
                this._timeCardListFir = rsp;
                this.shareCardBox.active = true;
                this.initShareCardShow();
            }.bind(this));
        }.bind(this));
        hd3.getChildByName('btnLing').on('click', function () {
            this.shareReceiveCode.getChildByName('editBox').getComponent(cc.EditBox).string = '';
            this.shareReceiveCode.active = true;
        }.bind(this));
        this.initLingCardShow();
        fun.event.add('hallActivityItemNumber', 'shareCardItemNumber', function (data) {
            this._shareContentList = data;
            this.shareContent.getChildByName('InputLabel').getComponent(cc.EditBox).string = '';
            this.shareContent.active = true;
            var item = this.shareContent.getChildByName('item');
            item.getChildByName('card').getComponent(cc.Label).string = 'x' + data.Cnt;
            item.getChildByName('content').getComponent(cc.Label).string = '将在' + data.date + '过期';
            item.getChildByName('img').getChildByName('ka' + data.GameType).active = true;
        }.bind(this));
        fun.event.add('hallActivityItemAgain', 'shareCardItemAgain', function (data) {
            this.wxShareFriendCard(data.Order, data.ExpireAt, data.Cnt, data.date);
        }.bind(this));
    },
    onDestroy: function onDestroy() {
        fun.event.remove('hallActivityItemNumber');
        fun.event.remove('hallActivityItemAgain');
    },
    onActivityMenuShow: function onActivityMenuShow(count) {
        for (var i = 0; i < this._menuNum; ++i) {
            this.leftBox.getChildByName('btnActivity' + (i + 1)).active = true;
            this.leftBox.getChildByName('btnDown' + (i + 1)).active = false;
            this.rightBox.getChildByName('huodong' + (i + 1)).active = false;
        }
        this.leftBox.getChildByName('btnActivity' + count).active = false;
        this.leftBox.getChildByName('btnDown' + count).active = true;
        this.rightBox.getChildByName('huodong' + count).active = true;
        this.shareCardBox.active = false;
    },


    //分享限时卡初始化
    initShareCardShow: function initShareCardShow() {
        this.shareScrollView = this.shareCardBox.getChildByName('scrollView').getChildByName('view');
        this.shareScrollViewSize = this.shareScrollView.getContentSize();
        this.shareScrollViewCont = this.shareScrollView.getChildByName('content');
        this._shareGameType = 0;
        if (this._timeCardListFir.List) {
            this._shareGameType = this._timeCardListFir.Type;
            this.shareCardListView(this._timeCardListFir);
        }
        this.shareCardBox.getChildByName('tog').children.forEach(function (value) {
            value.on('click', function () {
                var type = GameTypeEnum[value.name];
                if (this._shareGameType === type) return;
                this._shareGameType = type;
                fun.net.pSend('TimeCardList', { Type: type }, function (rsp) {
                    if (!rsp || rsp.RetCode || rsp.Status) {
                        fun.event.dispatch('MinSingleButtonPop', { contentStr: '查询分享限时卡失败！' });
                    } else {
                        if (rsp.List) {
                            this.shareCardListView(rsp);
                        } else {
                            this.shareScrollViewCont.removeAllChildren();
                        }
                    }
                }.bind(this));
            }.bind(this));
        }.bind(this));
        this.shareCardBox.getChildByName('btnBack').on('click', function () {
            this.shareCardBox.active = false;
        }.bind(this));
        this.shareCardBox.getChildByName('btnJl').on('click', function () {
            fun.net.pSend('SharedTimeCardList', {}, function (rsp) {
                if (!rsp || rsp.RetCode || rsp.Status) {
                    fun.event.dispatch('MinSingleButtonPop', { contentStr: '查询分享限时卡记录失败！' });
                } else {
                    this.shareCardRecordView(rsp);
                    this.shareRecording.active = true;
                }
            }.bind(this));
        }.bind(this));
        this.shareRecording.getChildByName('btnClose').on('click', function () {
            this.shareRecording.active = false;
        }.bind(this));
        this.shareContent.getChildByName('btnFx').on('click', function () {
            var inputL = parseInt(this.shareContent.getChildByName('InputLabel').getComponent(cc.EditBox).string);
            if (!inputL || inputL <= 0) {
                fun.event.dispatch('MinSingleButtonPop', { contentStr: '请输入正确的数字！' });
            } else if (inputL > this._shareContentList.Cnt) {
                fun.event.dispatch('MinSingleButtonPop', { contentStr: '你所分享的限时卡数量超过你拥有的数量！' });
            } else {
                fun.net.pSend('ShareTimeCard', { OrderId: this._shareContentList.OrderId, Cnt: inputL }, function (rsp) {
                    if (!rsp || rsp.RetCode || rsp.Status) {
                        fun.event.dispatch('MinSingleButtonPop', { contentStr: '分享限时房卡失败！' });
                    } else {
                        for (var i = 0; i < this.shareScrollViewCont.children.length; ++i) {
                            var item = this.shareScrollViewCont.children[i];
                            if (item.orderId === this._shareContentList.OrderId) {
                                var itemL = item.getChildByName('card').getComponent(cc.Label);
                                var newCardNum = parseInt(itemL.string.substr(1, itemL.string.length - 1)) - inputL;
                                itemL.string = 'x' + newCardNum;
                                this._shareContentList.Cnt = newCardNum;
                                item.getComponent('shareCardItem').setData(this._shareContentList);
                            }
                        }
                        this.wxShareFriendCard(rsp.Order, this._shareContentList.ExpiredAt, inputL, this._shareContentList.date);
                    }
                    this.shareContent.active = false;
                }.bind(this));
            }
        }.bind(this));
        this.shareContent.getChildByName('btnClose').on('click', function () {
            this.shareContent.active = false;
        }.bind(this));
        this.shareContent.getChildByName('btnCancel').on('click', function () {
            this.shareContent.active = false;
        }.bind(this));
    },
    shareCardListView: function shareCardListView(data) {
        this.shareScrollViewCont.removeAllChildren();
        this.shareScrollViewCont.setContentSize(this.shareScrollViewSize.width, this.shareScrollViewSize.height);
        var itemSize = 0;
        for (var i = 0; i < data.List.length; i++) {
            var item = cc.instantiate(this.shareCardItem);
            var _list = data.List[i];
            itemSize = item.getContentSize().height;
            item.orderId = _list.OrderId;
            item.setPositionY(-i * 0.85 * itemSize - 40);
            _list.GameType = data.Type;
            item.getComponent('shareCardItem').setData(_list);
            item.parent = this.shareScrollViewCont;
        }
        var contSize = this.shareScrollViewCont.getContentSize();
        var itemHeight = itemSize * data.List.length;
        if (itemHeight > contSize.height) {
            this.shareScrollViewCont.setContentSize(contSize.width, itemHeight);
        }
    },


    //分享记录
    shareCardRecordView: function shareCardRecordView(data) {
        var noJiLu = this.shareRecording.getChildByName('noJiLu');
        if (!data.List) {
            noJiLu.active = true;
            return;
        }
        noJiLu.active = false;
        var scrollView = this.shareRecording.getChildByName('scrollView').getChildByName('view');
        var viewSize = scrollView.getContentSize();
        var contentN = scrollView.getChildByName('content');
        contentN.removeAllChildren();
        contentN.setContentSize(viewSize.width, viewSize.height);
        var itemSize = 0;
        for (var i = 0; i < data.List.length; ++i) {
            var item = cc.instantiate(this.shareCardItem);
            var _list = data.List[i];
            itemSize = item.getContentSize().height;;
            item.setPositionY(-i * 0.85 * itemSize - 40);
            _list.isJiLu = true;
            item.getComponent('shareCardItem').setData(_list);
            item.parent = contentN;
        }
        var contSize = contentN.getContentSize();
        var itemHeight = itemSize * data.List.length;
        if (itemHeight > contSize.height) {
            contentN.setContentSize(contSize.width, itemHeight);
        }
    },


    //点击领取限时卡
    initLingCardShow: function initLingCardShow() {
        var editBox = this.shareReceiveCode.getChildByName('editBox').getComponent(cc.EditBox);
        this.shareReceiveCode.getChildByName('btnLing').on('click', function () {
            var editLabel = editBox.string;
            var reg = /^[0-9a-zA-Z]+$/;
            if (editLabel.length < 16 || !reg.test(editLabel)) {
                fun.event.dispatch('MinSingleButtonPop', { contentStr: '请输入正确的领取码！' });
            } else {
                fun.net.pSend('ReceiveTimeCard', { Order: editLabel }, function (rsp) {
                    if (!rsp || rsp.RetCode) {
                        fun.event.dispatch('MinSingleButtonPop', { contentStr: '领取限时房卡失败！' });
                    } else if (rsp.Status) {
                        switch (rsp.Status) {
                            case LingQuError.NO_SELF:
                                fun.event.dispatch('MinSingleButtonPop', { contentStr: '不能领取自己分享的限时卡！' });
                                break;
                            case LingQuError.RECIVED:
                                fun.event.dispatch('MinSingleButtonPop', { contentStr: '领取码已被使用！' });
                                break;
                            case LingQuError.NOT_EXIST:
                                fun.event.dispatch('MinSingleButtonPop', { contentStr: '领取码错误或限时卡过期！' });
                                break;
                            default:
                                fun.event.dispatch('MinSingleButtonPop', { contentStr: '领取限时房卡失败！' });
                                break;
                        }
                    } else {
                        this.lingCardBox.getChildByName('img').getChildByName('ka' + rsp.GameType).active = true;
                        this.lingCardBox.getChildByName('num').getComponent(cc.Label).string = 'x' + rsp.Cnt;
                        var t = new Date(rsp.ExpireAt * 1000);
                        var date = t.getFullYear() + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日' + t.getHours() + '时' + t.getMinutes() + '分';
                        this.lingCardBox.getChildByName('time').getComponent(cc.Label).string = '到期时间: ' + date;
                        this.shareReceiveCode.active = false;
                        this.lingCardBox.active = true;
                    }
                }.bind(this));
            }
        }.bind(this));
        this.shareReceiveCode.getChildByName('btnClose').on('click', function () {
            this.shareReceiveCode.active = false;
        }.bind(this));
        this.shareReceiveCode.getChildByName('btnCancel').on('click', function () {
            this.shareReceiveCode.active = false;
        }.bind(this));
        this.lingCardBox.getChildByName('btnLing').on('click', function () {
            this.lingCardBox.active = false;
        }.bind(this));
    },
    wxShareFriendCard: function wxShareFriendCard(order, expireAt, num, date) {
        var url = gameConst.commonUrl.timeLimitCard;
        var name = encodeURI(fun.db.getData('UserInfo').UserName);
        var info = {};
        info.title = '收到新的限时卡';
        info.content = '请在' + date + '领取';
        info.url = url + '?' + 'fkid=' + order + '&fknumber=' + num + '&fkname=' + name + '&fkdate=' + expireAt;
        require('JSPhoneWeChat').WxShareFriend(info);
    },
    onBtnCloseClick: function onBtnCloseClick() {
        require('Audio').playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    }
});

cc._RF.pop();