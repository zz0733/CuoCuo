const CmdLength = 3;
const MaxPlatformCmd = 400;
const MsgTimeout = 1000 * 3;
const MaxHeartBeatTimes = 5;
const HeartBeatInterval = 1000 * 30;
const ConnectTimeOut = 1000 * 4;
const MaxUnLoginTime = 1000 * 30;
const MaxConnectTimes = 3;
const NormalCloseCode = 1000;
const PlatformMsgCfg = require("MessageCfg");
let GameMsgCfg = {};

const MgrState = cc.Enum({
    Init: 0,
    Connecting: 1,
    ConnectTimeOut: 2,
    ConnectError: 3,
    Connected: 4,
    Logined: 5,
    MsgTimeOut: 6,
    BeKicked: 7,
    Closed: 8,
    reConnect: 9,
});

let len = function (m) {
    let c = 0;
    for (const k in m) {
        c++;
    }
    return c;
};

cc.Class({

    connect(url, handler) {
        fun.log('net', `connect url = ${url}, this.url = ${this.url}`);
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

    addOpenCb(handler) {
        this.openHandler.push(handler);
    },

    setGameMsgCfg(cfg = {}) {
        GameMsgCfg = cfg;
        if (len(GameMsgCfg) === 0) {
            this.listenMessageDelay = [];
        }
    },

    setState(state) {
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

    send(cmdStr, message={}, handler = false) {
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
        let cmd = GameMsgCfg[cmdStr].req;
        message = JSON.stringify(message);
        fun.log('net', `send ${cmdStr} ${cmd} ${message}`);
        this.socket.send(cmd + message);
        return true;
    },

    listen(cmdStr, handler) {
        if (this.listenHandler[cmdStr]) {
            fun.log('net', 'listener error, has added handler of ' + cmdStr);
            return;
        }
        fun.log('net', 'listen ' + cmdStr);
        this.listenHandler[cmdStr] = handler;
    },

    rmListen(cmdStr) {
        delete this.listenHandler[cmdStr];
    },

    close(code = NormalCloseCode) {
        fun.log('net', 'close xxxxx ' + code);
        if (this.socket) {
            this.socket.close(code);
        }
    },

    pSend(cmdStr, message, handler = false) {
        if (!this._isConnected()) {
            fun.log('net', 'pSend error: unconnected');
            return false;
        }
        if (handler) {
            if ((cmdStr !== 'Heartbeat') && this.pSendHandler[cmdStr]) {
                fun.log('net', 'pSend error: wait for response ' + cmdStr);
                return false;
            }
            this.lastResponseFlag = false;
            this.pSendHandler[cmdStr] = handler;
            this._netStartDelayTime = Date.now();
        }
        this.lastSendTime = this.currTime;
        let cmd = PlatformMsgCfg[cmdStr].req;
        message = JSON.stringify(message);
        fun.log('net', `pSend ${cmdStr} ${cmd} ${message}`);
        this.socket.send(cmd + message);
        return true;
    },

    pListen(cmdStr, handler) {
        if (this.pListenHandler[cmdStr]) {
            fun.log('net', 'pListen error, has added handler of ' + cmdStr);
            return;
        }
        fun.log('net', 'pListen ' + cmdStr);
        this.pListenHandler[cmdStr] = handler;
        let needDel = [];
        this.pListenMessageDelay.forEach(function (value, index) {
            if (value.cmdStr === cmdStr) {
                needDel.push(index);
                handler(value.message);
            }
        });
        for (let i = needDel.length - 1; i >= 0; i--) {
            this.pListenMessageDelay.splice(needDel[i], 1);
        }
    },

    rmPListen(cmdStr) {
        delete this.pListenHandler[cmdStr];
    },

    ctor () {
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

    destroy() {
        if (this.socket) {
            this.socket.close(NormalCloseCode);
        }
    },

    update(dt) {
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
                    let findFlag = false;
                    for (let i = 0; i < this.listenMessageDelay.length; i++){
                        const data = this._getMsgCfgData(this.listenMessageDelay[i].cmd, GameMsgCfg);
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

    _onClose(event) {
        fun.log('net', `_onClose state = ${this.state} `, event);
        switch  (this.state) {
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

    _reConnect() {
        this.state = MgrState.reConnect;
        this.connect();
    },

    _onOpen() {
        fun.log('net', '_onOpen');
        this.onOpenTime = this.currTime;
        this.lastConnectTime = null;
        this.connectTimes = 0;
        this._showMsgTimeOut(false);
        this._showConnectTimeOut(false);
        if (this.state === MgrState.reConnect) {
            let token = cc.sys.localStorage.getItem('Token');
            if (!token) {
                return;
            }
            fun.net.pSend('TokenLogin', {Token: token, Platform: cc.sys.os}, function(data) {
                fun.net.setState('Login');
                let userInfo = fun.db.getData('UserInfo');
                if (!data.RoomId || data.RoomId === 0) {
                    return;
                }
                fun.net.pSend('EnterRoom', {RoomId: data.RoomId, Address: userInfo.location}, function(rsp) {
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

    _onError(event) {
        fun.log('net', 'onError', event);
    },

    _onMessage(event) {
        this.lastResponseFlag = true;
        let data = event.changeData || event.data;
        let cmd = parseInt(data.substr(0, CmdLength));
        let message = null;
        let str = data.substr(CmdLength, data.length);
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
        if (cmd < MaxPlatformCmd) {
            this._ponMessage(cmd, message);
        } else {
            // 场景转换期间保存消息
            if (len(GameMsgCfg) > 0) {
                this._gonMessage(cmd, message, true);
            } else {
                this.listenMessageDelay.push({cmd: cmd, message: message});
            }
        }
    },

    _gonMessage(cmd, message, save = false) {
        const data = this._getMsgCfgData(cmd, GameMsgCfg);
        if (!data.cmdStr) {
            fun.log('net', '_gonMessage error no cmdStr ' + cmd);
            return;
        }
        if (data.netType === 'rsp' && this.sendHandler[data.cmdStr]) {
            let timeCha = Date.now() - this._netStartDelayTime;
            fun.event.dispatch('NetDelayTime', timeCha);//1秒是1000
            fun.log('net', '_gonMessage callback', cmd, data.cmdStr, message);
            let cb = this.sendHandler[data.cmdStr];
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
            this.listenMessageDelay.push({cmd: cmd, message: message});
        } else {
            fun.log('net', '_gonMessage error no handler', cmd, data.cmdStr, message);
        }
    },

    _ponMessage(cmd, message) {
        let data = this._getMsgCfgData(cmd, PlatformMsgCfg);
        if (!data.cmdStr) {
            fun.log('net', '_ponMessage error no cmdStr ' + cmd);
            return;
        }
        if (data.netType === 'rsp' && this.pSendHandler[data.cmdStr]) {
            let timeCha = Date.now() - this._netStartDelayTime;
            fun.event.dispatch('NetDelayTime', timeCha);//1秒是1000
            if(data.cmdStr === 'CreateRoom' || data.cmdStr === 'EnterRoom'){
                fun.db.setData('NetDelayTime', timeCha);
            }
            fun.log('net', '_ponMessage callback', cmd, data.cmdStr, message);
            let cb = this.pSendHandler[data.cmdStr];
            delete this.pSendHandler[data.cmdStr];
            cb(message);
            return;
        }
        if (data.netType === 'notify') {
            if (this.pListenHandler[data.cmdStr]) {
                fun.log('net', '_ponMessage listen', cmd, data.cmdStr, message);
                this.pListenHandler[data.cmdStr](message);
            } else {
                this.pListenMessageDelay.push({cmdStr: data.cmdStr, message: message});
            }
            return;
        }
        fun.log('net', '_ponMessage listen', cmd, data.cmdStr, message);
    },

    sendHeartBeat() {
        if (this.sendHeartbeatTimes >= MaxHeartBeatTimes) {
            this.socket.close(NormalCloseCode);
            return;
        }
        let flag = this.pSend('Heartbeat', '', function () {
            this._showMsgTimeOut(false);
            this.sendHeartbeatTimes = 0;
        }.bind(this));
        if (this.sendHeartbeatTimes > 0 && flag) {
            this._showMsgTimeOut(true);
        }
        this.sendHeartbeatTimes++;
    },

    _getMsgCfgData(cmd, cfg) {
        for (const cmdStr in cfg) {
            if (cfg[cmdStr].rsp === cmd) {
                return {cmdStr: cmdStr, netType: 'rsp'}
            } else if (cfg[cmdStr].notify === cmd) {
                return {cmdStr: cmdStr, netType: 'notify'}
            }
        }
        return {cmdStr: false, netType: false};
    },

    _showConnectError(flag) {
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
        fun.event.dispatch('Zhuanquan', {flag: false});
        let data = {
            contentStr: '连接失败，确认无误后重试',
            okBtnStr: '重试',
            closeBtnStr: '退出',
            okCb () {
                fun.utils.restart();
            },
            closeCb () {
                fun.utils.endGame();
            }
        };
        fun.event.dispatch('MinDoubleButtonPop', data);
    },

    _showDisConnect() {
        fun.event.dispatch('Zhuanquan', {flag: false});
        let data = {
            contentStr: '与服务器断开连接！',
            okBtnStr: '重试',
            closeBtnStr: '退出',
            okCb () {
                fun.utils.restart();
            },
            closeCb () {
                fun.utils.endGame();
            }
        };
        fun.event.dispatch('MinDoubleButtonPop', data);
    },

    _showConnectTimeOut(flag) {
        fun.event.dispatch('Zhuanquan', {flag: flag, text: '网络连接中，请稍等...', from: 'net'});
    },

    _showMsgTimeOut(flag) {
        fun.event.dispatch('Zhuanquan', {flag: flag, text: '网络连接中，请稍等...', from: 'net'});
    },

    _isConnected() {
        return this.socket !== null && this.socket.readyState === WebSocket.OPEN;
    },
});