var Audio = require('Audio');

cc.Class({
    extends: cc.Component,
    properties: {
        detailPrefab: {
            type: cc.Prefab,
            default: null,
        },
        storePre: {
            type: cc.Prefab,
            default: null,
        },
    },

    onLoad () {
        this.bindNode();
        this.initUI();
    },
    onEnable () {
        this.animation.play("popScaleAnim");
    },
    bindNode: function () {
        this.downNode = this.node.getChildByName("back").getChildByName("down");
        this.fangFeiNode = this.downNode.getChildByName("fangfeiBox");
        this.diZhuFenNode = this.downNode.getChildByName("dizhuBox");
        this.renShuNode = this.downNode.getChildByName("renshuBox");
        this.fengDingNode = this.downNode.getChildByName("fengdingBox");
        this.wanFaNode = this.downNode.getChildByName("wanfaBox");
        this.GPSNode = this.downNode.getChildByName("gpsBox");
        this.fangKaNode = this.downNode.getChildByName("fangKaBox");
        this.deadLineNode = this.downNode.getChildByName("time");
        this.jushuNode = this.downNode.getChildByName("jushuBox");
        this.animation = this.node.getComponent(cc.Animation)
    },
    initUI: function () {
        this.initFangFeiToggle();
        this.initDiZhuFenToggle();
        this.initRenShuToggle();
        this.initWanFaToggle();
        this.initFengDingToggle();
        this.initGPSToggle();
        this.initJuShu();
    },
    initJuShu: function(){
        this.jushu = 8;
        this.jushuNode.getChildByName("box").getChildByName("num").getComponent(cc.Label).string = 8 +"";
    },
    initGPSToggle: function () {
        this.isGPS = false;
        this.GPSNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
    },
    initDiZhuFenToggle: function () {
        this.diZhuFen = 1;
        this.diZhuFenNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        this.diZhuFenNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;

    },
    initFangFeiToggle: function () {
        this.fangfei = 3;
        this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
        this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
    },
    initRenShuToggle: function () {
        this.renshu = 3;
        this.renShuNode.getChildByName("toggle1").active = true;
        this.renShuNode.getChildByName("toggle2").active = false;
        this.renShuNode.getChildByName("toggle3").active = false;
        //todo 暂时只有三人的

    },
    initWanFaToggle: function () {
        this.isThreeAndOne = false;
        this.isFourAndTwo = false;
        this.isDouble = false;
        this.wanFaNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
        this.wanFaNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
        this.wanFaNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;

    },
    initFengDingToggle: function () {
        this.fengDing = 4;
        this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
        this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
        this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
    },
    /****************点击事件处理**********/
    onClickDiZhuFenToggle: function (event, custom) {
        if (custom == "1") {
            this.diZhuFen = 1;
            this.diZhuFenNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.diZhuFenNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
        } else if (custom == "3") {
            this.diZhuFen = 3;
            this.diZhuFenNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.diZhuFenNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
        }
    },
    onClickFangFeiToggle: function (event, custom) {
        // AVG_PAY = 1; //平均支付
        // CHAMPION_PAY = 2; //冠军支付
        // OWNER_PAY = 3; //房主支付
        if (custom == "1") {
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
            this.fangfei = 3;
        } else if (custom == "2") {
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
            this.fangfei = 1;
        } else if (custom == "3") {
            this.fangFeiNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fangFeiNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
            this.fangfei = 2;
        }
    },
    onClickWanFaToggle: function (event, custom) {
        if (custom == "1") {
            this.isThreeAndOne = this.wanFaNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked;
        } else if (custom == "2") {
            this.isFourAndTwo = this.wanFaNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked;
        } else if (custom == "3") {
            this.isDouble = this.wanFaNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked;
        }
    },
    onClickFenDingToggle: function (event, custom) {
        if (custom == "4") {
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = true;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
            this.fengDing = 4;
        } else if (custom == "5") {
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = true;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = false;
            this.fengDing = 5;
        } else if (custom == "6") {
            this.fengDingNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = false;
            this.fengDingNode.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = true;
            this.fengDing = 6;
        }
    },
    onClickGPSToggle: function (event, custom) {
        this.isGPS = this.GPSNode.getChildByName("toggle1").getComponent(cc.Toggle).isChecked;
    },
    onClickJuShu: function(event, custom){
      if(custom == "1"){
          this.jushu = this.jushu == 24 ? 24 : this.jushu + 8;
          this.jushuNode.getChildByName("box").getChildByName("num").getComponent(cc.Label).string = this.jushu  +"";
      }else if(custom == "2"){
          this.jushu = this.jushu == 8 ? 8 : this.jushu - 8;
          this.jushuNode.getChildByName("box").getChildByName("num").getComponent(cc.Label).string = this.jushu  +"";
      }
    },

    onBtnCloseClick () {
        Audio.playEffect('hall', 'button_close.mp3');
        this.animation.play("popScaleOut").once('finished', function () {
            this.node.active = false;
            this.node.destroy();
        }, this);
    },
    onBtnRechargeClick() {
        cc.instantiate(this.storePre).parent = this.node;
    },

    onClickDetails: function(){
        let detail = cc.instantiate(this.detailPrefab);
        detail.parent = this.node;
        detail.getComponent('freeCardDetail').setDetail(data.FreeCardList, gameType);
    },
    showRoomCard(data) {
        this.currentCardLabel.string = data.TollCardCnt || 0;
        if (!data.FreeCardList || data.FreeCardList.length === 0) {
            this.freeCardL.string = 0;
            this.freeTimeBox.active = false;
        } else {
            this.freeTimeBox.active = true;
            let minTime = data.FreeCardList[0].ExpiredAt, freeCard = data.FreeCardList[0].Cnt;
            for (let i in data.FreeCardList) {
                let time = data.FreeCardList[i].ExpiredAt;
                if (minTime > time) {
                    minTime = time;
                    freeCard = data.FreeCardList[i].Cnt;
                }
            }
            let t = new Date(minTime * 1000);
            let date = t.getFullYear().toString().substr(2, 2) + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日';
            this.freeTimeL.string = date + '过期';
            this.freeCardL.string = freeCard;
        }
    },

    onBtnCreateRoomClick() {
        var DDZRoomInfo = {
            gameType : 6,
            payMode : this.fangfei,
            playerNum : this.renshu,
            base: this.diZhuFen,
            boomLimit: this.fengDing,
            playMode:null,
            canSanDaiDui: this.isThreeAndOne,
            canSiDaiDui: this.isFourAndTwo,
            canDouble:this.isDouble,
            RoundLimit:this.jushu,
            needGPS:this.isGPS,
        };
        if(this.isGPS){
            var gpsInfo = JSON.parse(fun.db.getData('UserInfo').location);
        }else{
            var gpsInfo = "";
        }
        var createInfo = {
            GameType : 6,
            roomInfo: DDZRoomInfo,
            userId:fun.db.getData('UserInfo').UserId,
            gpsInfo: gpsInfo,
        };
        fun.utils.saveCreateRoomData(createInfo);
        fun.event.dispatch('Zhuanquan', {flag: true, text: "创建房间中，请稍后..."});
        fun.net.pSend('CreateRoom', createInfo, function (msg) {
            if(msg.RetCode < 0){
                fun.event.dispatch('Zhuanquan', {flag: false});
            }else{
                cc.YL.network("创建房间发送成功");
            }
        });
    },

});
