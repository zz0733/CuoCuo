cc.Class({
    extends: cc.Component,

    properties: {
        gameName: {
            type: gameConst.gameName,
            default: gameConst.gameName.hall,
        },
    },

    onLoad () {
        if (cc.sys.isNative) {
            console.log('WritablePath = ' + jsb.fileUtils.getWritablePath());
            let JSPhoneVoice = require('JSPhoneVoice');
            JSPhoneVoice.clearOldVoice();
            require('JSPhoneBaiDu').getBaiDuLocation();
        }

        // let isRelease = fun.gameCfg.releaseType === gameConst.releaseType.release ? true : false;
        this._isApple = fun.gameCfg.releaseType === gameConst.releaseType.apple ? true : false;
        this._isFisher = fun.gameCfg.releaseType === gameConst.releaseType.fisher ? true : false;
        if (this._isFisher) {
            this.node.getChildByName('Haishang').active = true;
        }

        this.editBox = this.node.getChildByName('editBox');
        this.editBox.active = false;
        this.wxLoginBtn = this.node.getChildByName('btnWxLogin');
        this.ykLoginBtn = this.node.getChildByName('btnYkLogin');
        
        let isIDLogin = fun.gameCfg.loginType === gameConst.loginType.ID;
        this.ykLoginBtn.getChildByName('Label').getComponent(cc.Label).string = isIDLogin ? '账号登陆' : '游客登陆';
        cc.director.preloadScene("hall", function () {});

        if (cc.sys.isNative && fun.gameCfg.enableUpdate && !fun.db.getData('UpdatedGame')[this.gameName]) {
            this.wxLoginBtn.active = false;
            this.ykLoginBtn.active = false;
            fun.event.add('hallUpdatedGame', 'UpdatedGame', this.onCompleteUpdateEvent.bind(this));
        } else {
            this.initLogin();
        }
        this.node.getChildByName('version').getComponent(cc.Label).string = gameConst.version;
    },

    onDestroy () {
        fun.event.remove('hallUpdatedGame');
    },

    isWxAppInstalled (install) {
        if(!install && this._isApple){
            this.wxLoginBtn.active = false;
            this.ykLoginBtn.setPositionX(0);
            this.ykLoginBtn.active = true;
        } else {
            this.wxLoginBtn.active = true;
            this.wxLoginBtn.setPositionX(0);
            this.ykLoginBtn.active = false;
        }
    },

    initLogin() {
        let token = cc.sys.localStorage.getItem('Token');
        if (token && fun.gameCfg.enableAutoLogin) {
            fun.net.connect(fun.gameCfg.loginUrl, function () {
                fun.net.pSend('TokenLogin', {Token: token, Platform: cc.sys.os}, this.loginHandle.bind(this));
            }.bind(this))
        } else {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                this.wxLoginBtn.active = true;
                this.wxLoginBtn.setPositionX(0);
                this.ykLoginBtn.active = false;
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                this.isWxAppInstalled(require('JSPhoneWeChat').WxAppIsInstalled());
            } else {
                this.wxLoginBtn.active = true;
                this.ykLoginBtn.active = true;
            }
            if (fun.gameCfg.loginType === gameConst.loginType.ID) {
                this.editBox.active = true;
            }
            this.wxLoginBtn.on('click', this.onLoginBtnClick, this);
            this.ykLoginBtn.on('click', this.onGuestBtnClick, this);
        }
    },

    onCompleteUpdateEvent (data) {
        for (const k in data) {
            if (data[k] === this.gameName) {
                this.initLogin();
                break;
            }
        }
    },

    onLoginBtnClick (event) {
        require('Audio').playEffect('hall', 'button_nomal.mp3');
        fun.net.connect(fun.gameCfg.loginUrl, function () {
            this.weChatLogin();
        }.bind(this));
    },

    onGuestBtnClick(){
        fun.net.connect(fun.gameCfg.loginUrl, function () {
            switch (fun.gameCfg.loginType) {
                case gameConst.loginType.weChat:
                    this.guestLogin();
                case gameConst.loginType.guest:
                    this.guestLogin();
                    break;
                case gameConst.loginType.ID:
                    this.idLogin();
                    break;
            }
        }.bind(this));
    },

    weChatLogin () {
        fun.log('login', 'weChatLogin');
        require('JSPhoneWeChat').WxLogin(function(msg){
            if (msg.state) {
                let wxLogin = {Thirdparty: 1, OpenId: msg.openid, AccessToken: msg.token, Platform: cc.sys.os};
                if (fun.net._isConnected()) {
                    fun.net.pSend('ThirdLogin', wxLogin, this.loginHandle.bind(this));
                } else {
                    fun.net.connect(fun.gameCfg.loginUrl, function() {
                        fun.net.pSend('ThirdLogin', wxLogin, this.loginHandle.bind(this));
                    }.bind(this));
                }
            }
        }.bind(this));
    },

    guestLogin () {
        fun.log('login', 'guestLogin');
        fun.net.pSend('GustLogin', {UserId: 0}, this.loginHandle);
    },

    idLogin () {
        fun.log('login', 'idLogin');
        let id = this.editBox.getComponent(cc.EditBox).string;
        if (id.length !== 6) {
            fun.log('login', `error id ${id}`);
            return;
        }
        fun.net.pSend('GustLogin', {UserId: parseInt(id)}, this.loginHandle);
    },

    loginHandle (data) {
        if (data.RetCode && data.RetCode !== 0) {
            fun.log('login', 'login error: ', data);
            switch(data.RetCode){
                case 1: {
                        let func = function(){
                            this.wxLoginBtn.once('click', this.onLoginBtnClick, this);
                        }.bind(this)
                        fun.event.dispatch('MinSingleButtonPop', {okCb: func, contentStr: '服务器忙', closeCb: func});
                    }
                    break;
                case 2:
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: '非法游戏类型'});
                    break;
                case 3:
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: '登录失败'});
                    break;
                case 4: {
                        cc.sys.localStorage.removeItem('Token');
                        fun.utils.restart();
                    }
                    break;
                case 5:
                    fun.event.dispatch('MinSingleButtonPop', {contentStr: '非法第三方平台'});
                    break;
                default:
                    break;
            }
            return;
        }
        fun.net.setState('Login');
        let userInfo = fun.db.getData('UserInfo');
        if (userInfo.location !== undefined) {
            data.location = userInfo.location;
        } else {
            data.location = null;
        }
        fun.db.setData('UserInfo', data);
        cc.sys.localStorage.setItem('Token', data.Token);
        cc.director.loadScene('hall');
    },
});
