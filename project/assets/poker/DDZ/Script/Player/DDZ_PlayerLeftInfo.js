/******* 左边玩家
 * 除牌以外的其他相关操作
 * 渲染头像，分数，聊天等
 * *******/
cc.Class({
    extends: cc.Component,

    properties: {
        // message ddz_base_playerInfo {
        //     optional int64 userId = 1; //ID
        //     optional string nickName = 2; //昵称
        //     optional int32 sex = 3; //性别
        //     optional string headUrl = 4; //头像
        //     optional int32 coin = 5; //分数（金币）
        //     optional playerGameStatus status = 6; //游戏状态
        //     optional bool isReady = 7; //是否准备
        //     optional bool isBreak = 8; //是否掉线
        //     optional bool isLeave = 9; //是否离开
        //     optional int32 score = 10; //分数
        //     optional string ip = 11; //玩家IP
        // }
    },
    onLoad () {
        this.playerInfo = null;
    },
    initLeftPlayerNode: function(data){
        this.playerInfo = data;
        this.clearNodeUI();
        this.initNodeUI(data);
    },
    clearNodeUI: function(){

    },
    initNodeUI: function(){

    },
    showAndHideReady: function(isReady){

    },
});
