let PukeDefine = require('PukeDefine');
let PukeUtils = require('PukeUtils');
let Audio = require('Audio');
let WanFaEnum = cc.Enum({
    kanDou: 1,
    wuHua: 2,
    zhaDan: 3,
    wuXiao: 4,
});
let SpecialEnum = cc.Enum({
    xianJia: 1,
    joinLimit: 2,
    zhangSuo: 3,
    shunDou: 4
});

cc.Class({
    extends: cc.Component,

    properties: {
        FangFei     : cc.Node,
        JuShu       : cc.Label,
        CurrentCard : cc.Label,
        RoomCard    : cc.Label,
        DingZhuang  : cc.Node,
        DiFen       : cc.Node,
        ShiXian     : cc.Node,
        TeShu       : cc.Node,
        WanFa       : cc.Node,
        BeiShu      : cc.Node,
        btnHitzone  : cc.Node,
    },

    onLoad () {
        if(fun.gameCfg.releaseType === gameConst.releaseType.apple){
            let down = this.node.getChildByName('back').getChildByName('down');
            down.getChildByName('btnRecharge').active = false;
            let createN = down.getChildByName('btnCreateRoom');
            createN.getChildByName('text').active = false;
            createN.getChildByName('num').active = false;
        }
        this.ListBack   = this.BeiShu.getChildByName("list").getChildByName("listback");
        this.BeiShuText = this.BeiShu.getChildByName("initLabel").getComponent(cc.Label);
        this.BeiShuText.string = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[0];
        for (let i = 0; i < this.ListBack.children.length; ++i) {
            let content = this.ListBack.getChildByName('content');
            for (let j in content.children) {
                let contentL = content.children[j].getComponent(cc.Label);
                contentL.string = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[j];
            }
        }
        this.setBeiShuBackActive(1);
        let createInfo = fun.utils.getCreateRoomData(gameConst.gameType.niuNiu);
        if (createInfo) {
            this.setToggleChecked('FangFei', createInfo.reduceCard);
            this.setToggleChecked('DingZhuang', createInfo.makersType);
            this.setToggleChecked('DiFen', createInfo.bottomScore);
            this.setToggleChecked('ShiXian', createInfo.timeLimit + 1);
            this.BeiShuText.string = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[createInfo.typeScore-1];
            this.setBeiShuBackActive(createInfo.typeScore);
            this.JuShu.string = (createInfo.roomNum + 1) * 5;
            this.setMuToggleNotChecked();
            for (let key in createInfo.Special) {
                for (let k in WanFaEnum) {
                    if (key === k) {
                        this.WanFa.getChildByName('toggle'+WanFaEnum[k]).getComponent(cc.Toggle).isChecked = true;
                    }
                }
                for (let k in SpecialEnum) {
                    if (key === k) {
                        this.TeShu.getChildByName('toggle'+SpecialEnum[k]).getComponent(cc.Toggle).isChecked = true;
                    }
                }                
            }
        }
        this.RoomCard.string = this.JuShu.string;
        
        this.KanDou  = this.WanFa.getChildByName("toggle1").getComponent(cc.Toggle);
        this.ShunDou = this.TeShu.getChildByName("toggle4");
        this.isShunDouShow(this.KanDou.isChecked);
        this.downAction = false;

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    setToggleChecked : function (name, value) {
        for (let i = 0; i < this[name].children.length; ++i) {
            this[name].getChildByName('toggle' + (i+1)).getComponent(cc.Toggle).isChecked = false;
        }
        this[name].getChildByName('toggle'+value).getComponent(cc.Toggle).isChecked = true;
    },

    setMuToggleNotChecked : function () {
        for (let i = 0; i < this.WanFa.children.length; ++i){
            this.WanFa.getChildByName('toggle'+(i+1)).getComponent(cc.Toggle).isChecked = false;
        }
        for (let i = 0; i < this.TeShu.children.length; ++i){
            this.TeShu.getChildByName('toggle'+(i+1)).getComponent(cc.Toggle).isChecked = false;
        }
    },

    setBeiShuBackActive : function (num) {
        let back = this.ListBack.getChildByName('back')
        for (let i in back.children) {
            back.children[i].active = false;
        }
        back.getChildByName('back'+parseInt(num)).active = true;
    },

    // 牛牛倍数下拉列表
    niuBtnBeiShuList : function () {
        this.listAction(this.downAction);
    },
    listAction : function (isDown) {
        this.downAction = !this.downAction;
        this.btnHitzone.active = !isDown;
        let position = { x : 0, y : 220 };
        if (!isDown) { position.y = 0; }
        let moveto = cc.moveTo(0.3, position);
        moveto.easing(cc.easeSineInOut());
        this.ListBack.stopAllActions();
        this.ListBack.runAction(moveto);
    },
    onBtnHitzoneClicked: function(){
        this.btnHitzone.active = false;
        this.listAction(true);
    },
    // 牛牛选择倍数
    niuChooseBeiShu : function (sender, num) {
        this.BeiShuText.string = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[parseInt(num)-1];
        this.setBeiShuBackActive(num);
        this.listAction(true);
    },

    // 减少局数
    onBtnLessClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let juShu = parseInt(this.JuShu.string);
        if (juShu > PukeDefine.CREATE_JUSHU_MIN) {
            this.JuShu.string = juShu - PukeDefine.CREATE_JUSHU_SPACE;
            this.RoomCard.string = this.JuShu.string;
        }
    },

    // 增加局数
    onBtnAddClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let juShu = parseInt(this.JuShu.string);
        if (juShu < PukeDefine.CREATE_JUSHU_MAX) {
            this.JuShu.string = juShu + PukeDefine.CREATE_JUSHU_SPACE;
            this.RoomCard.string = this.JuShu.string;
        }
    },

    // 牛牛创建房间
    onBtnCreateClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let data = {};
        data.Special = {};
        for (let i=1; i<=2; i++) {
            let togFF = this.FangFei.getChildByName("toggle"+i).getComponent(cc.Toggle);
            if (togFF.isChecked) {
                data.reduceCard = i; //房费
            }
        }
        for (let i=1; i<=4; i++) {
            let togDF = this.DiFen.getChildByName("toggle"+i).getComponent(cc.Toggle);
            if (togDF.isChecked) {
                data.bottomScore = i; //底分
            }
            let togSX = this.ShiXian.getChildByName("toggle"+i).getComponent(cc.Toggle);
            if (togSX.isChecked) {
                data.timeLimit = i-1; //时限
            }
            let togTS = this.TeShu.getChildByName("toggle"+i).getComponent(cc.Toggle);
            if (togTS.isChecked) {
                let name = PukeDefine.NIUNIU_ROOM_INFO.NIU_SPECIAL[i - 1 + 4];
                data.Special[name] = 1; //特殊
            }
            let togWF = this.WanFa.getChildByName("toggle"+i).getComponent(cc.Toggle);
            if (togWF.isChecked) {
                let name = PukeDefine.NIUNIU_ROOM_INFO.NIU_SPECIAL[i - 1];
                data.Special[name] = 1; //玩法
            }
        }
        for (let i=1; i<=5; i++) {
            let togDZ = this.DingZhuang.getChildByName("toggle"+i).getComponent(cc.Toggle);
            if (togDZ.isChecked) {
                data.makersType = i; //定庄
            }
        }
        let typeScore = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE;
        let typeScoreText = this.BeiShuText.string;
        for (let i in typeScore) {
            if (typeScoreText === typeScore[parseInt(i)]) {
                data.typeScore = parseInt(i)+1; //倍数
            }
        }
        data.Address  = fun.db.getData('UserInfo').location;
        data.GameType = gameConst.gameType.niuNiu; //游戏种类 - 牛牛
        data.Zone     = 0; //是否分区
        data.roomNum  = parseInt(this.JuShu.string)/5 - 1; //总局数
        fun.event.dispatch('Zhuanquan', true);
        fun.net.pSend('CreateRoom', data, function(rsp){
            fun.event.dispatch('Zhuanquan', false);
            if (rsp.returnStatu !== undefined && rsp.returnStatu === 1) {
                rsp.EnterRoom = 'create';
                fun.db.setData('RoomInfo', rsp);
                fun.utils.saveCreateRoomData(data);
                cc.director.preloadScene('puke', function(){
                    fun.event.dispatch('Zhuanquan', false);
                    cc.director.loadScene('puke');
                })
            } else {
                fun.event.dispatch('Zhuanquan', false);
                if (rsp.RetCode !== undefined && rsp.RetCode === 10) {
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: '服务未开启'});
                    fun.log('createNiuNiuRoom', `CreateRoom RetCode = ${rsp.RetCode}`);
                    return;
                }
                if (rsp.returnStatu === undefined || rsp.returnStatu === 2) {
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: '用户参数异常'});
                } else if (rsp.returnStatu === 3) {
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: '房卡不足'});
                } else {
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: '创建房间失败'});
                }
                fun.log('createNiuNiuRoom', `CreateRoom returnStatu = ${rsp.returnStatu}`);
            }
        }.bind(this));
    },

    isShunDouShow : function (isChecked) {
        this.ShunDou.getComponent(cc.Toggle).isChecked = isChecked;
        this.ShunDou.getChildByName("mask").active = !isChecked;
    },

    // 选择坎斗
    onBtnKanDouClicked : function () {
        this.isShunDouShow(this.KanDou.isChecked);
    },

    // 房卡充值
    onBtnRechargeClicked () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        cc.log('房卡充值')
    },

    onBtnCloseClick () {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function(){
            this.node.destroy();
        }, this);
    }
});
