/*********
 *  网络事件分发
 *  发送和接收
 *  分发ui等
 *  ********/
var DDZ_EventManager = cc.Class({});
DDZ_EventManager.init = function () {
    fun.net.setGameMsgCfg(require("DDZ_MsgConfig"));
    fun.net.listen('PID_HEARTBEAT', this.PID_HEARTBEAT.bind(this));
    fun.net.listen('PID_CREATEROOM_ACK', this.PID_CREATEROOM_ACK.bind(this));
    fun.net.listen('PID_ENTERROOM_ACK', this.PID_ENTERROOM_ACK.bind(this));
    fun.net.listen('PID_DESKINFO', this.PID_DESKINFO.bind(this));
    fun.net.listen('PID_PLAYERINFO', this.PID_PLAYERINFO.bind(this));
    fun.net.listen('PID_READY_ACK', this.PID_READY_ACK.bind(this));
    fun.net.listen('PID_OPENING', this.PID_OPENING.bind(this));
    fun.net.listen('PID_HANDPOKER_INFO', this.PID_HANDPOKER_INFO.bind(this));
    fun.net.listen('PID_JIAOFEN', this.PID_JIAOFEN.bind(this));
    fun.net.listen('PID_JIAOFEN_ACK', this.PID_JIAOFEN_ACK.bind(this));
    fun.net.listen('PID_JIABEI', this.PID_JIABEI.bind(this));
    fun.net.listen('PID_JIABEI_ACK', this.PID_JIABEI_ACK.bind(this));
    fun.net.listen('PID_SEND_DIPAI', this.PID_SEND_DIPAI.bind(this));
    fun.net.listen('PID_OUTCARD_ACK', this.PID_OUTCARD_ACK.bind(this));
    fun.net.listen('PID_OVERTURN', this.PID_OVERTURN.bind(this));
    fun.net.listen('PID_PASS_ACK', this.PID_PASS_ACK.bind(this));
    fun.net.listen('PID_ROUNDRESULT', this.PID_ROUNDRESULT.bind(this));
    fun.net.listen('PID_LOTTERY', this.PID_LOTTERY.bind(this));
    fun.net.listen('PID_SENDMSG_ACK', this.PID_SENDMSG_ACK.bind(this));
    fun.net.listen('PID_CHATNOTIFY', this.PID_CHATNOTIFY.bind(this));

};
DDZ_EventManager.destroy = function () {
    fun.net.rmListen('PID_HEARTBEAT');
    fun.net.rmListen('PID_CREATEROOM_ACK');
    fun.net.rmListen('PID_ENTERROOM_ACK');
    fun.net.rmListen('PID_DESKINFO');
    fun.net.rmListen('PID_PLAYERINFO');
    fun.net.rmListen('PID_READY_ACK');
    fun.net.rmListen('PID_OPENING');
    fun.net.rmListen('PID_HANDPOKER_INFO');
    fun.net.rmListen('PID_JIAOFEN');
    fun.net.rmListen('PID_JIAOFEN_ACK');
    fun.net.rmListen('PID_JIABEI');
    fun.net.rmListen('PID_JIABEI_ACK');
    fun.net.rmListen('PID_SEND_DIPAI');
    fun.net.rmListen('PID_OUTCARD_ACK');
    fun.net.rmListen('PID_OVERTURN');
    fun.net.rmListen('PID_PASS_ACK');
    fun.net.rmListen('PID_ROUNDRESULT');
    fun.net.rmListen('PID_LOTTERY');
    fun.net.rmListen('PID_SENDMSG_ACK');
    fun.net.rmListen('PID_CHATNOTIFY');
};
DDZ_EventManager.PID_HEARTBEAT = function (msg) {
    //心跳包
};
DDZ_EventManager.PID_CREATEROOM_ACK = function (msg) {
    //创建房间ack
    if (msg.retMsg < 0) {
        cc.YL.err("msg.retMsg", msg.retMsg);
    } else {
        cc.YL.log("创建房间成功");
    }

};
DDZ_EventManager.PID_ENTERROOM_ACK = function (msg) {
    // 进入房间ack
    if (msg.retMsg < 0) {
        cc.YL.err("msg.retMsg", msg.retMsg);
    } else {
        cc.YL.log("进入房间成功，跳转场景");
        cc.YL.DDZGameManager.LoadScene("DDZ_GameScene");
    }
};
DDZ_EventManager.PID_DESKINFO = function (msg) {
    // 桌子信息
    cc.YL.DDZDeskInfo = msg;
    cc.YL.DDZGameManager.initDeskByData(msg);
};
DDZ_EventManager.PID_PLAYERINFO = function (msg) {
    cc.YL.PlayerInfo = msg;
    cc.YL.DDZGameManager.initPlayerNode(msg);
};
DDZ_EventManager.PID_READY_ACK = function (msg) {
    // 准备ack
    if (msg.retMsg < 0) {
        cc.YL.err("msg.retMsg", msg.retMsg);
    } else {
        cc.YL.DDZGameManager.updateReady(msg);
    }
};
DDZ_EventManager.PID_OPENING = function (msg) {
    // 开局
    cc.YL.DDZGameManager.gameOpen(msg);
};
DDZ_EventManager.PID_HANDPOKER_INFO = function (msg) {
    cc.YL.DDZGameManager.handPokerManager(msg);
    // 手牌信息
};
DDZ_EventManager.PID_JIAOFEN = function (msg) {
    // 叫分开始广播
    cc.YL.DDZGameManager.startJiaoFen(msg);
};
DDZ_EventManager.PID_JIAOFEN_ACK = function (msg) {
    // 叫分ack
    if (msg.retMsg < 0) {
        cc.YL.err("msg.retMsg", msg.retMsg);
    } else {
        cc.YL.DDZGameManager.updateJiaoFen(msg);
    }
};
DDZ_EventManager.PID_JIABEI = function (msg) {
    // 加倍开始广播
    cc.YL.DDZGameManager.startJiaBei(msg);

};
DDZ_EventManager.PID_JIABEI_ACK = function (msg) {
    // 加倍ack
    if (msg.retMsg < 0) {
        cc.YL.err("msg.retMsg", msg.retMsg);
    } else {
        cc.YL.DDZGameManager.updateJiaBei(msg);
    }
};
DDZ_EventManager.PID_SEND_DIPAI = function (msg) {
    // 底牌广播
    cc.YL.DDZGameManager.showDiPai(msg);
};
DDZ_EventManager.PID_OUTCARD_ACK = function (msg) {
    // 出牌ack
    if (msg.isOk  == false) {
        cc.YL.err("msg.isOk false 出牌失败");
    } else {
        cc.YL.DDZGameManager.playerOutCard(msg);

    }
};
DDZ_EventManager.PID_OVERTURN = function (msg) {
    // 操作overturn
    cc.YL.DDZGameManager.overTurn(msg);
};
DDZ_EventManager.PID_PASS_ACK = function (msg) {
    // 过牌ack
    if (msg.isOk < 0) {
        cc.YL.err("msg.isOk", msg.isOk);
    } else {
        cc.YL.DDZGameManager.showPass(msg);
    }
};
DDZ_EventManager.PID_ROUNDRESULT = function (msg) {
    // 单局结算
    cc.YL.DDZGameManager.showOneGameOver(msg);
};
DDZ_EventManager.PID_LOTTERY = function (msg) {
    // 全局结算
    cc.YL.DDZGameManager.showAllGameOver(msg);
};
DDZ_EventManager.PID_SENDMSG_ACK = function (msg) {
    // 发送消息ack
};
DDZ_EventManager.PID_CHATNOTIFY = function (msg) {
    // 聊天
};

module.exports = DDZ_EventManager;
cc.YL.DDZEventManager = DDZ_EventManager;