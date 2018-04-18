"use strict";
cc._RF.push(module, 'e478fshgfpD45AiU8DM0ovN', 'DDZ_MsgConfig');
// poker/DDZ/Script/Config/DDZ_MsgConfig.js

"use strict";

var DDZ_MsgConfig = {

    PID_HEARTBEAT: { id: "PID_HEARTBEAT", desc: "心跳消息", req: 0, rsp: 0, notify: 0 },

    PID_CREATEROOM_REQ: { id: "PID_CREATEROOM_REQ", desc: "客户端->服务端　请求创建房间", req: 109, rsp: 0, notify: 109 },

    PID_CREATEROOM_ACK: { id: "PID_CREATEROOM_ACK", desc: "服务端->客户端　请求创建房间ack", req: 209, rsp: 0, notify: 209 },

    PID_ENTERROOM_REQ: { id: "PID_ENTERROOM_REQ", desc: "客户端->服务端　请求进入房间", req: 110, rsp: 0, notify: 110 },

    PID_ENTERROOM_ACK: { id: "PID_ENTERROOM_ACK", desc: "服务端->客户端　请求进入房间ack", req: 210, rsp: 0, notify: 210 },

    PID_DESKINFO: { id: "PID_DESKINFO", desc: "服务端->客户端　deskinfo", req: 605, rsp: 0, notify: 605 },

    PID_PLAYERINFO: { id: "PID_PLAYERINFO", desc: "服务端->客户端　playerinfo", req: 606, rsp: 0, notify: 606 },

    PID_READY_REQ: { id: "PID_READY_REQ", desc: "客户端->服务端　ready req", req: 607, rsp: 0, notify: 607 },

    PID_READY_ACK: { id: "PID_READY_ACK", desc: "服务端->客户端  ready ack", req: 608, rsp: 0, notify: 608 },

    PID_OPENING: { id: "PID_OPENING", desc: "服务端->客户端  开局", req: 609, rsp: 0, notify: 609 },

    PID_HANDPOKER_INFO: { id: "PID_HANDPOKER_INFO", desc: "服务端->客户端　手牌信息", req: 610, rsp: 0, notify: 610 },

    PID_JIAOFEN: { id: "PID_JIAOFEN", desc: "服务端->客户端　开始叫分", req: 611, rsp: 0, notify: 611 },

    PID_JIAOFEN_REQ: { id: "PID_JIAOFEN_REQ", desc: "客户端->服务端　叫分请求", req: 612, rsp: 0, notify: 612 },

    PID_JIAOFEN_ACK: { id: "PID_JIAOFEN_ACK", desc: "服务端->客户端　叫分请求ack", req: 613, rsp: 0, notify: 613 },

    PID_JIABEI: { id: "PID_JIABEI", desc: "服务端->客户端　　开始加倍", req: 614, rsp: 0, notify: 614 },

    PID_JIABEI_REQ: { id: "PID_JIABEI_REQ", desc: "客户端->服务端　加倍req", req: 615, rsp: 0, notify: 615 },

    PID_JIABEI_ACK: { id: "PID_JIABEI_ACK", desc: "服务端->客户端　　加倍ack", req: 616, rsp: 0, notify: 616 },

    PID_SEND_DIPAI: { id: "PID_SEND_DIPAI", desc: "服务端->客户端　底牌", req: 617, rsp: 0, notify: 617 },

    PID_OUTCARD_REQ: { id: "PID_OUTCARD_REQ", desc: "客户端->服务端　出牌请求", req: 618, rsp: 0, notify: 618 },

    PID_OUTCARD_ACK: { id: "PID_OUTCARD_ACK", desc: "服务端->客户端  出牌ack", req: 619, rsp: 0, notify: 619 },

    PID_OVERTURN: { id: "PID_OVERTURN", desc: "服务端→客户端 overturn操作协议", req: 620, rsp: 0, notify: 620 },

    PID_PASS_REQ: { id: "PID_PASS_REQ", desc: "客户端->服务端 过req", req: 621, rsp: 0, notify: 621 },

    PID_PASS_ACK: { id: "PID_PASS_ACK", desc: "服务端→客户端 过ack", req: 622, rsp: 0, notify: 622 },

    PID_ROUNDRESULT: { id: "PID_ROUNDRESULT", desc: "服务端→客户端 单局结算", req: 623, rsp: 0, notify: 623 },

    PID_LOTTERY: { id: "PID_LOTTERY", desc: "服务端→客户端 全局结算", req: 624, rsp: 0, notify: 624 },

    PID_DISSOLVE_REQ: { id: "PID_DISSOLVE_REQ", desc: "客户端->服务端 PID_DISSOLVE_REQ", req: 625, rsp: 0, notify: 625 },

    PID_DISSOLVE_BRO: { id: "PID_DISSOLVE_BRO", desc: "服务端→客户端 PID_DISSOLVE_BRO", req: 626, rsp: 0, notify: 626 },

    PID_DISSOLVE_REPLY: { id: "PID_DISSOLVE_REPLY", desc: "客户端->服务端 PID_DISSOLVE_REPLY", req: 627, rsp: 0, notify: 627 },

    PID_DISSOLVE_DESK: { id: "PID_DISSOLVE_DESK", desc: "服务端→客户端 PID_DISSOLVE_DESK", req: 628, rsp: 0, notify: 628 },

    PID_LOGINSERVER_REQ: { id: "PID_LOGINSERVER_REQ", desc: "服务端->客户端　PID_LOGINSERVER_REQ", req: 629, rsp: 0, notify: 629 },

    PID_LOGINSERVER_ACK: { id: "PID_LOGINSERVER_ACK", desc: "服务端->客户端　PID_LOGINSERVER_ACK", req: 630, rsp: 0, notify: 630 },

    PID_LEAVEDESK_REQ: { id: "PID_LEAVEDESK_REQ", desc: "服务端→客户端 PID_LEAVEDESK_REQ", req: 631, rsp: 0, notify: 631 },

    PID_LEAVEDESK_ACK: { id: "PID_LEAVEDESK_ACK", desc: "服务端->客户端　PID_LEAVEDESK_ACK", req: 632, rsp: 0, notify: 632 },

    PID_CHATNOTIFY: { id: "PID_CHATNOTIFY", desc: "服务端->客户端　PID_CHATNOTIFY", req: 308, rsp: 0, notify: 308 },

    PID_BREAK: { id: "PID_BREAK", desc: "服务端->客户端　PID_BREAK", req: 635, rsp: 0, notify: 635 }

};
module.exports = DDZ_MsgConfig;

cc._RF.pop();