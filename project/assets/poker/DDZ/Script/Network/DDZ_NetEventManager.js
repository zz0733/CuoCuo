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
    fun.net.listen('PID_LOGINSERVER_ACK', this.PID_LOGINSERVER_ACK.bind(this));
    fun.net.listen('PID_DISSOLVE_BRO', this.PID_DISSOLVE_BRO.bind(this));
    fun.net.listen('PID_DISSOLVE_DESK', this.PID_DISSOLVE_DESK.bind(this));
    fun.net.listen('PID_LEAVEDESK_ACK', this.PID_LEAVEDESK_ACK.bind(this));
    fun.net.listen('PID_BREAK', this.PID_BREAK.bind(this));

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
    fun.net.rmListen('PID_LOGINSERVER_ACK');
    fun.net.rmListen('PID_DISSOLVE_BRO');
    fun.net.rmListen('PID_DISSOLVE_DESK');
    fun.net.rmListen('PID_LEAVEDESK_ACK');
    fun.net.rmListen('PID_BREAK');
};
DDZ_EventManager.PID_LOGINSERVER_ACK = function (msg) {
    if (msg.isOk == false) {
        cc.YL.err("登录失败");
        var UIROOT = cc.find("DDZ_UIROOT");
        if(msg.retMsg.code == -165){
            UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showDissResult("登录失败,房卡不足");
        }else{
            UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").showDissResult("登录失败");
        }

    }
},
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

    }
};
DDZ_EventManager.PID_DESKINFO = function (msg) {
    // 桌子信息
    cc.YL.DDZDeskInfo = msg;
    cc.YL.DDZGameManager.initDeskByData(msg);
};
DDZ_EventManager.PID_PLAYERINFO = function (msg) {
    if (msg.userId == fun.db.getData('UserInfo').UserId) {
        cc.YL.DDZselfPlayerInfo = msg;
        cc.YL.selfIndex = msg.index;
        cc.YL.DDZGameManager.initPlayerNode(msg);
        for (var i = 0; i < cc.YL.DDZPlayerInfoList.length; i++) {
            cc.YL.DDZGameManager.initPlayerNode(cc.YL.DDZPlayerInfoList[i]);
        }
    } else {
        if (cc.YL.selfIndex == 0 || cc.YL.selfIndex == 1 || cc.YL.selfIndex == 2) {
            cc.YL.DDZGameManager.initPlayerNode(msg);
        } else {
            cc.YL.DDZPlayerInfoList.push(msg);
        }
    }
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
    // cc.YL.DDZDeskInfo.status = 3;
    cc.YL.DDZGameManager.gameOpen(msg);
};
DDZ_EventManager.PID_HANDPOKER_INFO = function (msg) {
    cc.YL.DDZGameManager.handPokerManager(msg);
    // 手牌信息
    // cc.YL.DDZDeskInfo.status = 3;
};
DDZ_EventManager.PID_JIAOFEN = function (msg) {
    // 叫分开始广播
    cc.YL.DDZGameManager.startJiaoFen(msg);
    cc.YL.DDZDeskInfo.status = 4;
};
DDZ_EventManager.PID_JIAOFEN_ACK = function (msg) {
    // 叫分ack
    if (msg.retMsg < 0) {
        cc.YL.err("msg.retMsg", msg.retMsg);
    } else {
        cc.YL.DDZGameManager.updateJiaoFen(msg);
        cc.YL.DDZAudio.playSpecialEffect(msg.retMsg.userId, "jiaofen_" + msg.fen);
        var UIROOT = cc.find("DDZ_UIROOT");
<<<<<<< HEAD
        UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").initDiFen(msg.fen);
=======
        if(msg.fen != 0){
            UIROOT.getChildByName("MainNode").getComponent("DDZ_Main").initDiFen(msg.fen);
        }

>>>>>>> f8a5a6134d18df4ab898a5e431e5f0b36bc013ac
    }
};
DDZ_EventManager.PID_JIABEI = function (msg) {
    // 加倍开始广播
    cc.YL.DDZGameManager.startJiaBei(msg);
    cc.YL.DDZDeskInfo.status = 5;

};
DDZ_EventManager.PID_JIABEI_ACK = function (msg) {
    // 加倍ack
    if (msg.retMsg < 0) {
        cc.YL.err("msg.retMsg", msg.retMsg);
    } else {
        cc.YL.DDZGameManager.updateJiaBei(msg);
        cc.YL.DDZAudio.playSpecialEffect(msg.retMsg.userId,msg.jiaBeiResult == true ? "jiabei" : "bujiabei");
    }
};
DDZ_EventManager.PID_SEND_DIPAI = function (msg) {
    // 底牌广播
    cc.YL.DDZGameManager.showDiPai(msg);

};
DDZ_EventManager.PID_OUTCARD_ACK = function (msg) {
    // 出牌ack
    if (msg.isOk == false) {
        cc.YL.err("msg.isOk false 出牌失败");
        cc.YL.DDZGameAction.outCardFail();
    } else {
        cc.YL.lastOutCardData = msg;
        cc.YL.DDZGameManager.playerOutCard(msg);
        cc.YL.DDZAudio.playerOutSound(msg);

    }
};
DDZ_EventManager.PID_OVERTURN = function (msg) {
    // 操作overturn
    cc.YL.DDZPokerTip.analysis();
    cc.YL.DDZGameManager.overTurn(msg);
    cc.YL.DDZDeskInfo.status = 6;
};
DDZ_EventManager.PID_PASS_ACK = function (msg) {
    // 过牌ack
    if (msg.isOk < 0) {
        cc.YL.err("msg.isOk", msg.isOk);
    } else {
        cc.YL.DDZGameManager.showPass(msg);
        cc.YL.DDZAudio.playPass(msg.retMsg.userId);
    }
};
DDZ_EventManager.PID_ROUNDRESULT = function (msg) {
    // 单局结算
    cc.YL.DDZGameManager.showOneGameOver(msg);
    cc.YL.DDZDeskInfo.status = 7;
};
DDZ_EventManager.PID_LOTTERY = function (msg) {
    // 全局结算
    cc.YL.DDZGameManager.showAllGameOver(msg);
    cc.YL.DDZDeskInfo.status = 8;
};
DDZ_EventManager.PID_SENDMSG_ACK = function (msg) {
    // 发送消息ack
};
DDZ_EventManager.PID_CHATNOTIFY = function (msg) {
    // 聊天
};
DDZ_EventManager.PID_DISSOLVE_BRO = function (msg) {
    //解散过程中投票的刷新
    cc.YL.DDZGameAction.showDissUI(msg);
};
DDZ_EventManager.PID_DISSOLVE_DESK = function (msg) {
    //解散的结果
    cc.YL.DDZGameAction.showDissResult(msg);
};
DDZ_EventManager.PID_LEAVEDESK_ACK = function (msg) {
    // 离开的广播
    if (msg.isOk == false) {
    } else {
        cc.YL.DDZGameManager.playerLeave(msg);
    }
};
DDZ_EventManager.PID_BREAK = function(msg){
    cc.YL.DDZGameManager.PID_BREAK(msg);
};
module.exports = DDZ_EventManager;
cc.YL.DDZEventManager = DDZ_EventManager;