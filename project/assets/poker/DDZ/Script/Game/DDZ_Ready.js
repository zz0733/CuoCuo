
cc.Class({
    extends: cc.Component,

    properties: {

    },


    start () {

    },
    onClickReady: function () {
        fun.net.send("PID_READY_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
        });
    },
});
