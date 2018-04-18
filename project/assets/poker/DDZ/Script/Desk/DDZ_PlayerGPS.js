cc.Class({
    extends: cc.Component,

    properties: {},

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
        this.backN = this.node.getChildByName("back");
    },

    start () {

    },

    close (){
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },




    show(players){
        this.backN = this.node.getChildByName("back");
        var dis01 = null;
        var dis02 = null;
        var dis12 = null;
        for (var i = 0; i < players.length; i++) {
            if (players[i].UserId == fun.db.getData('UserInfo').UserId) {
                this.playerNodeShow(this.backN.getChildByName("player_0"), players[i]);
            }
            if (players[i].UserId == cc.YL.DDZrightPlayerInfo.userId) {
                this.playerNodeShow(this.backN.getChildByName("player_1"), players[i]);
                var points = {p1: players[0].Address, p2: players[1].Address};
                var dis01 = require('JSPhoneBaiDu').getDistanceByPoints(points);
            }
            if (players[i].UserId == cc.YL.DDZleftPlayerInfo.userId) {
                this.playerNodeShow(this.backN.getChildByName("player_2"), players[i]);
                var points = {p1: players[0].Address, p2: players[1].Address};
                var dis01 = require('JSPhoneBaiDu').getDistanceByPoints(points);
                var points = {p1: players[0].Address, p2: players[2].Address};
                var dis02 = require('JSPhoneBaiDu').getDistanceByPoints(points);
                var points = {p1: players[1].Address, p2: players[2].Address};
                var dis12 = require('JSPhoneBaiDu').getDistanceByPoints(points);
            }
        }
        if (dis01) {
            this.node.getChildByName("back").getChildByName("player_0").getChildByName("line_1").
            getChildByName("distance").getChildByName("content").getComponent(cc.Label).string = this.showDis(dis01).d;
            this.node.getChildByName("back").getChildByName("player_0").getChildByName("line_1").
            getChildByName("distance").getChildByName("content").color = this.showDis(dis01).c;
        }
        if (dis02) {
            this.node.getChildByName("back").getChildByName("player_0").getChildByName("line_2").
            getChildByName("distance").getChildByName("content").getComponent(cc.Label).string = this.showDis(dis01).d;
            this.node.getChildByName("back").getChildByName("player_0").getChildByName("line_2").
            getChildByName("distance").getChildByName("content").color = this.showDis(dis01).c;
        }
        if (dis12) {
            this.node.getChildByName("back").getChildByName("player_1").getChildByName("line_2").
            getChildByName("distance").getChildByName("content").getComponent(cc.Label).string = this.showDis(dis01).d;
            this.node.getChildByName("back").getChildByName("player_1").getChildByName("line_2").
            getChildByName("distance").getChildByName("content").color = this.showDis(dis01).c;
        }
    },
    showDis: function (dis) {
        var dColor = cc.Color.RED;
        var showDistance = Math.floor(dis) + "米";
        if (dis < 0) {
            showDistance = "距离未知";
            dColor = cc.Color.YELLOW;
        }
        if (dis > 1000) {
            showDistance = (dis / 1000).toFixed(2) + "千米";
            dColor = cc.Color.GREEN;
        }
        return {c: dColor, d: showDistance,}
    },
    playerNodeShow: function (node, data) {
        var playerN = node;
        var iconN = playerN.getChildByName("icon");
        var mainN = iconN.getChildByName("main");
        var waitN = iconN.getChildByName("wait");
        var contentN = mainN.getChildByName("content");
        fun.utils.loadUrlRes(data.HeadUrl, contentN);
        waitN.active = false;
        mainN.active = true;
    },

    // update (dt) {},
});
