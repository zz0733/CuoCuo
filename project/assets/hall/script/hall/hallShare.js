let Audio = require('Audio');
const HuoDongResult = cc.Enum({
    'FAILED':    0, //失败
    'SUCCESS':   1, //成功
    'EXPIRED':   2, //过期
    'WAITING':   3, //未开启
    'MISS':      4, //不存在
    'SUCCESSED': 5, //已完成
});
const TransformGameType = [3, 1, 5];//3-黄岩 5-挖花 1-温岭
const ExchangeResult = cc.Enum({
    'FAIL':    0, //失败
    'SUCCESS': 1, //成功
    'NOWAY':   2, //无法兑换
    'LACKOFF': 3, //物品不足
});

cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        let bg = this.node.getChildByName('back');
        for(let i=0; i<3; ++i){
            this['btnGame'+(i+1)] = bg.getChildByName('btnGame' + (i+1));
        }
        bg.getChildByName('btnShare').on('click', this.onBtnShareClick, this);
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        for(let i = 0; i < 3; ++i){
            bg.getChildByName('btnGame'+(i+1)).on('click', this.onBtnExchangeClick.bind(this, TransformGameType[i]));
        }

        this.checkRoomCard();
        
        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();

        this._leftTicket = bg.getChildByName('leftTicket').getComponent(cc.Label);
        fun.event.add('ShareWeChatShareResult', 'PhoneWeChatShareResult', function(result){
            if (result) {
                fun.csv.getHuoDong('day_share', function(huodong){
                    fun.net.pSend('HuoDong', {Type: parseInt(huodong.INT_Type)}, function(data){
                        if (data.result === HuoDongResult.SUCCESS) {
                            fun.event.dispatch('MinSingleButtonPop', {contentStr: '获得房卡兑换券 '+data.Delta+' 张'});
                            this._leftTicket.string = parseInt(this._leftTicket.string) + data.Delta;
                        } else if (data.result === HuoDongResult.SUCCESSED)
                            fun.event.dispatch('MinSingleButtonPop', {contentStr: '今日已完成分享获得房卡兑换券活动！'});
                        else
                            fun.event.dispatch('MinSingleButtonPop', {contentStr: '获取房卡兑换券失败！'});
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this));
    },

    onDestroy () {
        fun.event.remove('ShareWeChatShareResult');
    },

    checkRoomCard () {
        fun.net.pSend('RoomCard', {GameType: gameConst.gameType.maJiangHuangYan}, function(data) {
            if (data.TollCardCnt !== undefined) {
                this.btnGame1.getChildByName('num').getComponent(cc.Label).string = data.TollCardCnt;
            }
            fun.net.pSend('RoomCard', {GameType: gameConst.gameType.maJiangWenLing}, function(data) {
                if (data.TollCardCnt !== undefined) {
                    this.btnGame2.getChildByName('num').getComponent(cc.Label).string = data.TollCardCnt;
                }
            }.bind(this));
        }.bind(this));
        this.btnGame3.getChildByName('num').getComponent(cc.Label).string = 0;
    },

    setLeftTicket (num) {
        this._leftTicket.string = num;
    },

    onBtnShareClick () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        require('JSPhoneWeChat').WxShareCircle();
    },

    onBtnExchangeClick (gameType) {
        if (gameType === 5) {
            fun.event.dispatch('MinSingleButtonPop', {contentStr: '暂未开放兑换功能, 敬请期待！'});
            return;
        }
        if(parseInt(this._leftTicket.string) <= 0){
            fun.event.dispatch('MinSingleButtonPop', {contentStr: '房卡兑换券不足，请分享朋友圈获得房卡兑换券！'});
            return;
        }
        let gameTypeCN = gameConst.gameTypeZhNameMap[gameType];
        let content = '您是否要将所有的房卡兑换券兑换成 ' + gameTypeCN + ' 的房卡？';
        let okCb = function(){
            fun.net.pSend('ExchgGood', {Type: gameConst.itemCsv.voucher, GameType: gameType}, function(data){
                if(data.result === ExchangeResult.SUCCESS){
                    let nowCnt = parseInt(this._leftTicket.string) - data.itemCnt;
                    this._leftTicket.string = nowCnt < 0 ? 0 : nowCnt;
                    let contentSuc = '使用了 '+data.itemCnt+' 房卡兑换券兑换了 '+data.cardsCnt+' 张 '+gameTypeCN+' 房卡';
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: contentSuc});
                    for (let i=0; i<TransformGameType.length; ++i) {
                        if (TransformGameType[i] === gameType) {
                            let initNum = this['btnGame'+(i+1)].getChildByName('num').getComponent(cc.Label).string;
                            this['btnGame'+(i+1)].getChildByName('num').getComponent(cc.Label).string = initNum + data.cardsCnt;
                        }
                    }
                }else{
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: '兑换房卡失败！'});
                }
            }.bind(this));
        }.bind(this);
        fun.event.dispatch('MinSingleButtonPop', {contentStr: content, okCb: okCb});
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onBtnCloseClick () {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },

});
