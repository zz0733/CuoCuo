
cc.Class({
    extends: cc.Component,

    properties: {

    },


    start () {

    },
    onClickReady: function () {
        fun.net.send("PID_READY_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
        }, function () {
            cc.YL.log("准备发送OK");
        }.bind(this));
    },
});
