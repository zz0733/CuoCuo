"use strict";
cc._RF.push(module, '697327HsPFER4ZHPSO4LnVQ', 'initFun');
// hall/script/fun/initFun.js

'use strict';

window.gameConst = require("GameCfg");
var chatCfg = require('ChatCfg');
var funNetMgr = require('funNetMgr');
var JSPhoneVoice = require('JSPhoneVoice');

cc.Class({
    extends: cc.Component,

    properties: {

        loginUrl: {
            type: gameConst.loginUrlType,
            default: gameConst.loginUrlType.intranet,
            displayName: '登陆服务器地址'
        },

        loginType: {
            type: gameConst.loginType,
            default: gameConst.loginType.weChat,
            displayName: '登陆类型'
        },

        enableUpdate: {
            default: true,
            displayName: '启用热更新'
        },

        voiceLanguage: {
            type: gameConst.voiceLanguage,
            default: gameConst.voiceLanguage.mandarin,
            displayName: '用户默认语音'
        },

        soundValume: {
            default: 0.8,
            min: 0,
            max: 1,
            displayName: '默认音效音量'
        },

        musicValume: {
            default: 0.8,
            min: 0,
            max: 1,
            displayName: '默认音乐音量'
        },

        enableAutoLogin: {
            default: true,
            displayName: '启用自动登陆'
        },

        logUrl: {
            default: "ws://192.168.1.89:6868/websocket",
            displayName: '提交日志地址'
        },

        logLevel: {
            type: gameConst.logLevel,
            default: gameConst.logLevel.info,
            displayName: '日志级别'
        },

        logSaveDay: {
            default: 3,
            displayName: '日志保存天数'
        },

        compileType: {
            default: gameConst.compileType.custom,
            type: gameConst.compileType,
            displayName: '编译配置',
            tooltip: 'custom：上面选项生效;其他选项将覆盖上面的配置'
        },

        releaseType: {
            type: gameConst.releaseType,
            default: gameConst.releaseType.normal,
            displayName: '发布方式'
        }
    },

    onLoad: function onLoad() {
        this.sumdt = 0;
        this.currTime = Date.now();
        this.announceInfo = [];
        var logger = require("funLog");
        window.fun = {
            gameCfg: {
                loginUrl: gameConst.loginUrl[this.loginUrl],
                logUrl: this.logUrl,
                loginType: this.loginType,
                enableAutoLogin: this.enableAutoLogin,
                logLevel: this.logLevel,
                logSaveDay: this.logSaveDay,
                enableUpdate: this.enableUpdate,
                voiceLanguage: this.voiceLanguage.mandarin,
                soundValume: this.soundValume,
                musicValume: this.musicValume,
                gameVersion: 0,
                releaseType: this.releaseType,
                netDelayTime: 0
            }
        };
        if (this.compileType > gameConst.compileType.custom) {
            for (var key in gameConst.compileContent[this.compileType]) {
                fun.gameCfg[key] = gameConst.compileContent[this.compileType][key];
            }
        }
        switch (fun.gameCfg.releaseType) {
            case gameConst.releaseType.apple:
                fun.gameCfg.loginUrl = gameConst.loginUrl[gameConst.loginUrlType.apple];
                break;
            case gameConst.releaseType.release:
                fun.gameCfg.loginUrl = gameConst.loginUrl[gameConst.loginUrlType.extranet];
                break;
            case gameConst.releaseType.fisher:
                fun.gameCfg.loginUrl = gameConst.loginUrl[gameConst.loginUrlType.fisher];
                break;
            default:
                break;
        }
        fun.logger = new logger();
        fun.log = fun.logger.log.bind(fun.logger);
        fun.base64 = require("funBase64");
        fun.event = require("funEvent");
        fun.db = require("funDB");
        fun.db.setData('UpdatedGame', {});
        fun.db.setData('MailInfo', {});
        fun.db.setData('AnnounceInfo', []);
        fun.db.setData('NewMailId', -1);
        fun.utils = require('funUtils');
        fun.csv = require('funCsv');
        fun.net = new funNetMgr();
        if (!fun.db.getNeedNotice()) {
            fun.db.setNeedNotice(false);
        }

        fun.rootNode = this.node;
        cc.game.addPersistRootNode(fun.rootNode);

        fun.net.addOpenCb(function () {
            fun.net.pListen('KickOff', function () {
                cc.sys.localStorage.removeItem('Token');
                fun.net.setState('KickOff');
                var data = {
                    contentStr: '账号在其它设备登录，请确认是否本人操作！',
                    okBtnStr: '重试',
                    closeBtnStr: '退出',
                    okCb: function okCb() {
                        fun.utils.restart();
                    },
                    closeCb: function closeCb() {
                        fun.utils.endGame();
                    }
                };
                fun.event.dispatch('MinDoubleButtonPop', data);
            });
        });

        fun.net.addOpenCb(function () {
            fun.net.pListen('Chat', function (data) {
                switch (data.chatType) {
                    case 'text':
                        data.content = chatCfg.exporText[fun.db.getData('RoomInfo').GameType][data.index];
                        break;
                    case 'emoji':
                        data.content = chatCfg.emoji[data.index];
                        break;
                    case 'voice':
                        var voiceName = Date.now() + "_" + data.from;
                        if (cc.sys.isNative) {
                            JSPhoneVoice.writeVoiceData(data.content, voiceName);
                        }
                        data.content = voiceName;
                        break;
                }
                fun.event.dispatch('RoomChat', data);
            });
        });

        fun.net.addOpenCb(function () {
            fun.net.pListen('RoomCard', function (data) {
                var userInfo = fun.db.getData('UserInfo');
                userInfo.RoomCard = data.CurrRoomCardNum;
                fun.db.setData('UserInfo', userInfo);
            });
        });

        fun.net.addOpenCb(function () {
            fun.net.pListen('Announce', function (data) {
                if (data.List) {
                    this.announceInfo = data.List;
                    fun.db.setData('AnnounceInfo', data.List);
                } else {
                    var announceInfo = fun.db.getData('AnnounceInfo');
                    if (data.Dels) {
                        data.Dels.forEach(function (value) {
                            for (var i = 0; i < announceInfo.length; i++) {
                                if (announceInfo[i].id === value) {
                                    announceInfo.splice(i, 1);
                                    break;
                                }
                            }
                        });
                    }
                    if (data.Adds) {
                        var noSuper = true,
                            superIdx = undefined;
                        for (var i = 0; i < announceInfo.length; ++i) {
                            if (announceInfo[i].type !== 11) {
                                noSuper = false;
                                superIdx = i;
                            }
                        }
                        if (noSuper) {
                            announceInfo = announceInfo.concat(data.Adds);
                        } else {
                            announceInfo[superIdx] = data.Adds;
                        }
                    }
                    this.announceInfo = announceInfo;
                    fun.db.setData('AnnounceInfo', announceInfo);
                }
            }.bind(this));
        }.bind(this));

        fun.net.addOpenCb(function () {
            fun.net.pListen('NewMailId', function (data) {
                fun.db.setData('NewMailId', data.mId);
            });
        });

        fun.net.addOpenCb(function () {
            fun.net.pListen('NewMail', function (data) {
                var mailInfo = db.getData('MailInfo');
                mailInfo[data.id] = data;
                fun.db.set('MailInfo', mailInfo);
            });
        });

        fun.net.addOpenCb(function () {
            fun.net.pListen('ServerError', function (data) {
                var dispatchData = {
                    okBtnStr: '关闭游戏',
                    contentStr: '与游戏服务器断开连接！',
                    okCb: function okCb() {
                        fun.utils.endGame();
                    },
                    closeCb: function closeCb() {
                        fun.utils.endGame();
                    }
                };
                fun.event.dispatch('MinSingleButtonPop', dispatchData);
            });
        });
        this._showState = true;
        cc.game.on(cc.game.EVENT_HIDE, this._gameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this._gameShow, this);
        cc.director.setDisplayStats(false);
        this._checkArrayFunc();
    },
    update: function update(dt) {
        fun.net.update(dt);
        this.sumdt += dt;
        if (this.sumdt >= 1) {
            this.sumdt -= 1;
            this.currTime += 1000;
            var flag = false;
            for (var i = this.announceInfo.length - 1; i > 0; i--) {
                if (this.announceInfo[i].end_time && this.announceInfo[i].end_time > 0 && this.announceInfo[i].end_time * 1000 <= this.currTime) {
                    flag = true;
                    this.announceInfo.splice(i, 1);
                }
            }
            if (flag) {
                fun.db.setData('AnnounceInfo', this.announceInfo);
            }
        }
    },
    onDestroy: function onDestroy() {
        cc.game.off(cc.game.EVENT_HIDE, this._gameHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this._gameShow, this);
    },
    _gameHide: function _gameHide() {
        //some browser will call this twice
        if (!this._showState) {
            return;
        }
        fun.net.sendHeartBeat();
        this._showState = false;
        cc.audioEngine.pauseMusic();
    },
    _gameShow: function _gameShow() {
        if (this._showState) {
            return;
        }
        fun.net.sendHeartBeat();
        this._showState = true;
        cc.audioEngine.resumeAll();
    },


    _checkArrayFunc: function _checkArrayFunc() {
        if (!Array.prototype.findIndex) {
            Object.defineProperty(Array.prototype, 'findIndex', {
                value: function value(predicate) {
                    // 1. Let O be ? ToObject(this value).
                    if (this == null) {
                        throw new TypeError('"this" is null or not defined');
                    }

                    var o = Object(this);

                    // 2. Let len be ? ToLength(? Get(O, "length")).
                    var len = o.length >>> 0;

                    // 3. If IsCallable(predicate) is false, throw a TypeError exception.
                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }

                    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
                    var thisArg = arguments[1];

                    // 5. Let k be 0.
                    var k = 0;

                    // 6. Repeat, while k < len
                    while (k < len) {
                        // a. Let Pk be ! ToString(k).
                        // b. Let kValue be ? Get(O, Pk).
                        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
                        // d. If testResult is true, return k.
                        var kValue = o[k];
                        if (predicate.call(thisArg, kValue, k, o)) {
                            return k;
                        }
                        // e. Increase k by 1.
                        k++;
                    }

                    // 7. Return -1.
                    return -1;
                }
            });
        }
    }

});

cc._RF.pop();