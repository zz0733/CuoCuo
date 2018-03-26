const DDZ_MsgConfig = {

    PID_HEARTBEAT: {id: "PID_HEARTBEAT", desc: "心跳消息", req: 0, rsp: 0, notify: 0,},

    PID_CREATEROOM_REQ: {id: "PID_CREATEROOM_REQ", desc: "客户端->服务端　请求创建房间", req: 1, rsp: 0, notify: 1,},

    PID_CREATEROOM_ACK: {id: "PID_CREATEROOM_ACK", desc: "服务端->客户端　请求创建房间ack", req: 2, rsp: 0, notify: 2,},

    PID_ENTERROOM_REQ: {id: "PID_ENTERROOM_REQ", desc: "客户端->服务端　请求进入房间", req: 3, rsp: 0, notify: 3,},

    PID_ENTERROOM_ACK: {id: "PID_ENTERROOM_ACK", desc: "服务端->客户端　请求进入房间ack", req: 4, rsp: 0, notify: 4,},

    PID_DESKINFO: {id: "PID_DESKINFO", desc: "服务端->客户端　deskinfo", req: 5, rsp: 0, notify: 5,},

    PID_PLAYERINFO: {id: "PID_PLAYERINFO", desc: "服务端->客户端　playerinfo", req: 6, rsp: 0, notify: 6,},

    PID_READY_REQ: {id: "PID_READY_REQ", desc: "客户端->服务端　ready req", req: 7, rsp: 0, notify: 7,},

    PID_READY_ACK: {id: "PID_READY_ACK", desc: "服务端->客户端  ready ack", req: 8, rsp: 0, notify: 8,},

    PID_OPENING: {id: "PID_OPENING", desc: "服务端->客户端  开局", req: 9, rsp: 0, notify: 9,},

    PID_HANDPOKER_INFO: {id: "PID_HANDPOKER_INFO", desc: "服务端->客户端　手牌信息", req: 10, rsp: 0, notify: 10,},

    PID_JIAOFEN: {id: "PID_JIAOFEN", desc: "服务端->客户端　开始叫分", req: 11, rsp: 0, notify: 11,},

    PID_JIAOFEN_REQ: {id: "PID_JIAOFEN_REQ", desc: "客户端->服务端　叫分请求", req: 12, rsp: 0, notify: 12,},

    PID_JIAOFEN_ACK: {id: "PID_JIAOFEN_ACK", desc: "服务端->客户端　叫分请求ack", req: 13, rsp: 0, notify: 13,},

    PID_JIABEI: {id: "PID_JIABEI", desc: "服务端->客户端　　开始加倍", req: 14, rsp: 0, notify: 14,},

    PID_JIABEI_REQ: {id: "PID_JIABEI_REQ", desc: "客户端->服务端　加倍req", req: 15, rsp: 0, notify: 15,},

    PID_JIABEI_ACK: {id: "PID_JIABEI_ACK", desc: "服务端->客户端　　加倍ack", req: 16, rsp: 0, notify: 16,},

    PID_SEND_DIPAI: {id: "PID_SEND_DIPAI", desc: "服务端->客户端　底牌", req: 17, rsp: 0, notify: 17,},

    PID_OUTCARD_REQ: {id: "PID_OUTCARD_REQ", desc: "客户端->服务端　出牌请求", req: 18, rsp: 0, notify: 18,},

    PID_OUTCARD_ACK: {id: "PID_OUTCARD_ACK", desc: "服务端->客户端  出牌ack", req: 19, rsp: 0, notify: 19,},

    PID_OVERTURN: {id: "PID_OVERTURN", desc: "服务端→客户端 overturn操作协议", req: 20, rsp: 0, notify: 20,},

    PID_PASS_REQ: {id: "PID_PASS_REQ", desc: "客户端->服务端 过req", req: 21, rsp: 0, notify: 21,},

    PID_PASS_ACK: {id: "PID_PASS_ACK", desc: "服务端→客户端 过ack", req: 22, rsp: 0, notify: 22,},

    PID_ROUNDRESULT: {id: "PID_ROUNDRESULT", desc: "服务端→客户端 单局结算", req: 23, rsp: 0, notify: 23,},

    PID_LOTTERY: {id: "PID_LOTTERY", desc: "服务端→客户端 全局结算", req: 24, rsp: 0, notify: 24,},

    PID_SENDMSG_REQ: {id: "PID_SENDMSG_REQ", desc: "客户端->服务端 chat req", req: 25, rsp: 0, notify: 25,},

    PID_SENDMSG_ACK: {id: "PID_SENDMSG_ACK", desc: "服务端→客户端 PID_SENDMSG_ACK", req: 26, rsp: 0, notify: 26,},

    PID_CHATNOTIFY: {id: "PID_CHATNOTIFY", desc: "服务端->客户端　PID_CHATNOTIFY", req: 308, rsp: 0, notify: 308,},


};
module.exports = DDZ_MsgConfig;
