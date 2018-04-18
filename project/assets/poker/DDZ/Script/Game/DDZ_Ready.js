
cc.Class({
    extends: cc.Component,

    properties: {

    },


    start () {

    },
    onClickReady: function () {
        cc.YL.DDZAudio.playBtnClick();
        fun.net.send("PID_READY_REQ", {
            userId: fun.db.getData('UserInfo').UserId,
        });
    },
    onClickShare: function(){
        cc.YL.DDZAudio.playBtnClick();
        var payTypeArr = ["", "平均支付", "冠军支付", "房主支付"];
        var ruleList = [payTypeArr[cc.YL.DDZDeskInfo.roomInfo.payMode], "封顶:" + cc.YL.DDZDeskInfo.roomInfo.boomLimit];
        cc.YL.DDZDeskInfo.roomInfo.canSanDaiDui ?
            ruleList.push("可三带一对") :
            "";
        cc.YL.DDZDeskInfo.roomInfo.canSiDaiDui ?
            ruleList.push("可四带两对") :
            "";
        cc.YL.DDZDeskInfo.roomInfo.canDouble ?
            ruleList.push("可加倍") :
            "";
        for(var i = 0; i < ruleList.length;i++){
            var content = ruleList[i]+" ";
        }
        var info   = {content : content};
        info.title ="斗地主" + "-房间号：" + cc.YL.DDZDeskInfo.password;
        require("JSPhoneWeChat").WxShareFriend(info);
    },
});
