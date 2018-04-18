"use strict";
cc._RF.push(module, 'fc6d8ycZ1lFybztgkOPI+TN', 'funNetMgr');
// hall/script/fun/funNetMgr.js

'use strict';

var CmdLength = 3;
var MaxPlatformCmd = 400;
var MsgTimeout = 1000 * 3;
var MaxHeartBeatTimes = 5;
var HeartBeatInterval = 1000 * 30;
var ConnectTimeOut = 1000 * 4;
var MaxUnLoginTime = 1000 * 30;
var MaxConnectTimes = 3;
var NormalCloseCode = 1000;
var PlatformMsgCfg = require("MessageCfg");
var GameMsgCfg = {};

var MgrState = cc.Enum({
    Init: 0,
    Connecting: 1,
    ConnectTimeOut: 2,
    ConnectError: 3,
    Connected: 4,
    Logined: 5,
    MsgTimeOut: 6,
    BeKicked: 7,
    Closed: 8,
    reConnect: 9
});

var len = function len(m) {
    var c = 0;
    for (var k in m) {
        c++;
    }
    return c;
};

cc.Class({
    connect: function connect(url, handler) {
        fun.log('net', 'connect url = ' + url + ', this.url = ' + this.url);
        this.url = url || this.url;
        if (handler) {
            this.openHandler.push(handler);
        }
        this.connectTimes++;
        this.lastConnectTime = this.currTime;

        this.socket = new WebSocket(this.url);
        this.socket.onopen = this._onOpen.bind(this);
        this.socket.onclose = this._onClose.bind(this);
        this.socket.onerror = this._onError.bind(this);
        this.socket.onmessage = this._onMessage.bind(this);
        if (this.state !== MgrState.reConnect) {
            this.state = MgrState.Connecting;
        }
    },
    addOpenCb: function addOpenCb(handler) {
        this.openHandler.push(handler);
    },
    setGameMsgCfg: function setGameMsgCfg() {
        var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        GameMsgCfg = cfg;
        if (len(GameMsgCfg) === 0) {
            this.listenMessageDelay = [];
        }
    },
    setState: function setState(state) {
        switch (state) {
            case 'Login':
                this.state = MgrState.Logined;
                break;
            case 'KickOff':
                this.state = MgrState.BeKicked;
                this.socket.close(NormalCloseCode);
                break;
        }
    },
    send: function send(cmdStr) {
        var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var handler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (!this._isConnected()) {
            fun.log('net', 'send error: unconnected');
            return false;
        }
        if (handler) {
            // 过滤网络不好时，用户重复发送的需回复相同同消息；如果确认不会同时发送需回复的消息，则可全屏蔽
            if (this.sendHandler[cmdStr]) {
                fun.log('net', 'send error: wait for response ' + cmdStr);
                return false;
            }
            this.lastResponseFlag = false;
            this.sendHandler[cmdStr] = handler;
            this._netStartDelayTime = Date.now();
        }
        this.lastSendTime = this.currTime;
        var cmd = GameMsgCfg[cmdStr].req;
        message = JSON.stringify(message);
        fun.log('net', 'send ' + cmdStr + ' ' + cmd + ' ' + message);
        this.socket.send(cmd + message);
        return true;
    },
    listen: function listen(cmdStr, handler) {
        if (this.listenHandler[cmdStr]) {
            fun.log('net', 'listener error, has added handler of ' + cmdStr);
            return;
        }
        fun.log('net', 'listen ' + cmdStr);
        this.listenHandler[cmdStr] = handler;
    },
    rmListen: function rmListen(cmdStr) {
        delete this.listenHandler[cmdStr];
    },
    close: function close() {
        var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : NormalCloseCode;

        fun.log('net', 'close xxxxx ' + code);
        if (this.socket) {
            this.socket.close(code);
        }
    },
    pSend: function pSend(cmdStr, message) {
        var handler = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (!this._isConnected()) {
            fun.log('net', 'pSend error: unconnected');
            return false;
        }
        if (handler) {
            if (cmdStr !== 'Heartbeat' && this.pSendHandler[cmdStr]) {
                fun.log('net', 'pSend error: wait for response ' + cmdStr);
                return false;
            }
            this.lastResponseFlag = false;
            this.pSendHandler[cmdStr] = handler;
            this._netStartDelayTime = Date.now();
        }
        this.lastSendTime = this.currTime;
        var cmd = PlatformMsgCfg[cmdStr].req;
        message = JSON.stringify(message);
        fun.log('net', 'pSend ' + cmdStr + ' ' + cmd + ' ' + message);
        this.socket.send(cmd + message);
        return true;
    },
    pListen: function pListen(cmdStr, handler) {
        if (this.pListenHandler[cmdStr]) {
            fun.log('net', 'pListen error, has added handler of ' + cmdStr);
            return;
        }
        fun.log('net', 'pListen ' + cmdStr);
        this.pListenHandler[cmdStr] = handler;
        var needDel = [];
        this.pListenMessageDelay.forEach(function (value, index) {
            if (value.cmdStr === cmdStr) {
                needDel.push(index);
                handler(value.message);
            }
        });
        for (var i = needDel.length - 1; i >= 0; i--) {
            this.pListenMessageDelay.splice(needDel[i], 1);
        }
    },
    rmPListen: function rmPListen(cmdStr) {
        delete this.pListenHandler[cmdStr];
    },
    ctor: function ctor() {
        this.state = MgrState.Init;

        this.dtsum = 0;
        this.currTime = Date.now();

        this.connectTimes = 0;
        this.lastConnectTime = null;
        this.url = fun.gameCfg.loginUrl;
        this.socket = null;
        this.openHandler = [];

        this.lastSendTime = null;
        this.lastResponseFlag = true;
        this.sendHeartbeatTimes = 0;

        this.sendHandler = {};
        this.listenHandler = {};
        this.pSendHandler = {};
        this.pListenHandler = {};
        this.listenMessageDelay = [];
        this.pListenMessageDelay = [];
    },
    destroy: function destroy() {
        if (this.socket) {
            this.socket.close(NormalCloseCode);
        }
    },
    update: function update(dt) {
        this.dtsum += dt;
        if (this.dtsum < 1) {
            return;
        }
        this.currTime += 1000;
        this.dtsum -= 1;

        switch (this.state) {
            case MgrState.Connecting:
                if (this.currTime - this.lastConnectTime > ConnectTimeOut) {
                    this._showConnectTimeOut(true);
                    this.socket.close(NormalCloseCode);
                }
                break;
            case MgrState.reConnect:
                if (this.currTime - this.lastConnectTime > ConnectTimeOut) {
                    this._showDisConnect(true);
                    this.socket.close(NormalCloseCode);
                }
                break;
            case MgrState.Connected:
                if (this.currTime - this.onOpenTime > MaxUnLoginTime) {
                    this.socket.close(NormalCloseCode);
                }
                break;
            case MgrState.Logined:
                // 检测消息是否超时
                if (this.lastResponseFlag) {
                    if (this.currTime - this.lastSendTime > HeartBeatInterval) {
                        this.sendHeartBeat();
                    }
                } else {
                    if (this.currTime - this.lastSendTime > MsgTimeout) {
                        this.sendHeartBeat();
                    }
                }
                // 检测是否有转场景的滞留消息
                if (len(GameMsgCfg) > 0 && this.listenMessageDelay.length > 0) {
                    var findFlag = false;
                    for (var i = 0; i < this.listenMessageDelay.length; i++) {
                        var data = this._getMsgCfgData(this.listenMessageDelay[i].cmd, GameMsgCfg);
                        if (data.cmdStr && data.netType === 'notify' && this.listenHandler[data.cmdStr]) {
                            findFlag = true;
                            break;
                        }
                    }
                    if (findFlag) {
                        this.listenMessageDelay.forEach(function (item) {
                            this._gonMessage(item.cmd, item.message, false);
                        }, this);
                        this.listenMessageDelay = [];
                    }
                }
                break;
        }
    },
    _onClose: function _onClose(event) {
        fun.log('net', '_onClose state = ' + this.state + ' ', event);
        switch (this.state) {
            case MgrState.Connecting:
                if (this.connectTimes < MaxConnectTimes) {
                    this.connect();
                } else {
                    this.state = MgrState.ConnectTimeOut;
                    this._showConnectError(true);
                }
                break;
            case MgrState.reConnect:
                if (this.connectTimes < MaxConnectTimes) {
                    this.connect();
                } else {
                    this.state = MgrState.ConnectTimeOut;
                    this._showConnectError(true);
                }
                break;
            case MgrState.Connected:
                this._showConnectError(false);
                break;
            case MgrState.Logined:
                this._reConnect();
                break;
        }
    },
    _reConnect: function _reConnect() {
        this.state = MgrState.reConnect;
        this.connect();
    },
    _onOpen: function _onOpen() {
        fun.log('net', '_onOpen');
        this.onOpenTime = this.currTime;
        this.lastConnectTime = null;
        this.connectTimes = 0;
        this._showMsgTimeOut(false);
        this._showConnectTimeOut(false);
        if (this.state === MgrState.reConnect) {
            var token = cc.sys.localStorage.getItem('Token');
            if (!token) {
                return;
            }
            fun.net.pSend('TokenLogin', { Token: token, Platform: cc.sys.os }, function (data) {
                fun.net.setState('Login');
                var userInfo = fun.db.getData('UserInfo');
                if (!data.RoomId || data.RoomId === 0) {
                    return;
                }
                fun.net.pSend('EnterRoom', { RoomId: data.RoomId, Address: userInfo.location }, function (rsp) {
                    fun.db.setData('RoomInfo', rsp);
                    fun.db.setData('EnterRoomId', data.RoomId);
                    fun.event.dispatch('ReconnectInGame', true);
                });
            });
        } else {
            this.state = MgrState.Connected;
            this.openHandler.forEach(function (handler) {
                handler();
            });
        }
    },
    _onError: function _onError(event) {
        fun.log('net', 'onError', event);
    },
    _onMessage: function _onMessage(event) {
        this.lastResponseFlag = true;
        var data = event.changeData || event.data;
        var cmd = parseInt(data.substr(0, CmdLength));
        var message = null;
        var str = data.substr(CmdLength, data.length);
        if (str && str.length > 0) {
            try {
                message = JSON.parse(str);
                if (message.Error) {
                    return;
                }
            } catch (err) {
                fun.log('net', '_onMessage json error ', err);
            }
        }
        // cc.YL.network("服务器推送的消息cmd:%s",cmd);
        if (cmd < MaxPlatformCmd) {
            this._ponMessage(cmd, message);
        } else {
            // 场景转换期间保存消息
            if (len(GameMsgCfg) > 0) {
                this._gonMessage(cmd, message, true);
            } else {
                this.listenMessageDelay.push({ cmd: cmd, message: message });
            }
        }
    },
    _gonMessage: function _gonMessage(cmd, message) {
        var save = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var data = this._getMsgCfgData(cmd, GameMsgCfg);
        if (!data.cmdStr) {
            fun.log('net', '_gonMessage error no cmdStr ' + cmd);
            return;
        }
        if (data.netType === 'rsp' && this.sendHandler[data.cmdStr]) {
            var timeCha = Date.now() - this._netStartDelayTime;
            fun.event.dispatch('NetDelayTime', timeCha); //1秒是1000
            fun.log('net', '_gonMessage callback', cmd, data.cmdStr, message);
            var cb = this.sendHandler[data.cmdStr];
            delete this.sendHandler[data.cmdStr];
            cb(message);
            return;
        }
        if (data.netType === 'notify' && this.listenHandler[data.cmdStr]) {
            fun.log('net', '_gonMessage handler ', cmd, data.cmdStr, message);
            this.listenHandler[data.cmdStr](message);
            return;
        }
        if (save) {
            this.listenMessageDelay.push({ cmd: cmd, message: message });
        } else {
            fun.log('net', '_gonMessage error no handler', cmd, data.cmdStr, message);
        }
    },
    _ponMessage: function _ponMessage(cmd, message) {
        var data = this._getMsgCfgData(cmd, PlatformMsgCfg);
        if (!data.cmdStr) {
            fun.log('net', '_ponMessage error no cmdStr ' + cmd);
            return;
        }
        if (data.netType === 'rsp' && this.pSendHandler[data.cmdStr]) {
            var timeCha = Date.now() - this._netStartDelayTime;
            fun.event.dispatch('NetDelayTime', timeCha); //1秒是1000
            if (data.cmdStr === 'CreateRoom' || data.cmdStr === 'EnterRoom') {
                fun.db.setData('NetDelayTime', timeCha);
            }
            fun.log('net', '_ponMessage callback', cmd, data.cmdStr, message);
            var cb = this.pSendHandler[data.cmdStr];
            delete this.pSendHandler[data.cmdStr];
            cb(message);
            return;
        }
        if (data.netType === 'notify') {
            if (this.pListenHandler[data.cmdStr]) {
                fun.log('net', '_ponMessage listen', cmd, data.cmdStr, message);
                this.pListenHandler[data.cmdStr](message);
            } else {
                this.pListenMessageDelay.push({ cmdStr: data.cmdStr, message: message });
            }
            return;
        }
        fun.log('net', '_ponMessage listen', cmd, data.cmdStr, message);
    },
    sendHeartBeat: function sendHeartBeat() {
        if (this.sendHeartbeatTimes >= MaxHeartBeatTimes) {
            this.socket.close(NormalCloseCode);
            return;
        }
        var flag = this.pSend('Heartbeat', '', function () {
            this._showMsgTimeOut(false);
            this.sendHeartbeatTimes = 0;
        }.bind(this));
        if (this.sendHeartbeatTimes > 0 && flag) {
            this._showMsgTimeOut(true);
        }
        this.sendHeartbeatTimes++;
    },
    _getMsgCfgData: function _getMsgCfgData(cmd, cfg) {
        for (var cmdStr in cfg) {
            if (cfg[cmdStr].rsp === cmd) {
                return { cmdStr: cmdStr, netType: 'rsp' };
            } else if (cfg[cmdStr].notify === cmd) {
                return { cmdStr: cmdStr, netType: 'notify' };
            }
        }
        return { cmdStr: false, netType: false };
    },
    _showConnectError: function _showConnectError(flag) {
        fun.log('net', 'showConnectError ' + flag);
        if (!flag) {
            return;
        }
        // const verUrl = '';
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = function() {
        //     if (xhr.readyState === 4) {
        //         if (xhr.status >= 200 && xhr.status < 400) {
        //             console.log(JSON.parse(xhr.responseText));
        //         }
        //     }
        // }
        // xhr.open("GET", verUrl, true);
        // xhr.send();
        fun.event.dispatch('Zhuanquan', { flag: false });
        var data = {
            contentStr: '连接失败，确认无误后重试',
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
    },
    _showDisConnect: function _showDisConnect() {
        fun.event.dispatch('Zhuanquan', { flag: false });
        var data = {
            contentStr: '与服务器断开连接！',
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
    },
    _showConnectTimeOut: function _showConnectTimeOut(flag) {
        fun.event.dispatch('Zhuanquan', { flag: flag, text: '网络连接中，请稍等...', from: 'net' });
    },
    _showMsgTimeOut: function _showMsgTimeOut(flag) {
        fun.event.dispatch('Zhuanquan', { flag: flag, text: '网络连接中，请稍等...', from: 'net' });
    },
    _isConnected: function _isConnected() {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    }
});

cc._RF.pop();