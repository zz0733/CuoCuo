"use strict";
cc._RF.push(module, '497e0/7VN1OaIxBakc73UrS', 'playerDataWahua');
// mahjong/script/wahua/desk/playerDataWahua.js

'use strict';

var UIPos = cc.Enum({
    xia: 0,
    you: 1,
    shang: 2,
    zuo: 3
});
var SeatDir = ['xia', 'you', 'shang', 'zuo'];

cc.Class({
    extends: cc.Component,

    properties: {
        uiPos: {
            type: UIPos,
            default: UIPos.xia
        }
    },

    onLoad: function onLoad() {
        this.playerUi = this.node.getComponent('playerUiWahua');
        this.playerUi.setWait();
        var roomInfo = fun.db.getData('RoomInfo');
        var userMap = roomInfo.userMap;
        var playerNum = roomInfo.roomRule.playerNum;
        var userInfo = fun.db.getData('UserInfo');
        userInfo.userId = userInfo.UserId.toString();
        userInfo.userName = userInfo.UserName;
        this._userId = userInfo.userId;
        var isUserMap = userMap && userMap[this._userId] ? true : false;
        this._sort = 0;
        if (isUserMap) {
            this._sort = userMap[this._userId].sort;
        }
        switch (this.uiPos) {
            case UIPos.xia:
                {
                    if (isUserMap) {
                        this.playerUi.setData(userMap[this._userId], this.uiPos);
                    } else {
                        this.playerUi.setData(userInfo, this.uiPos);
                    }
                }
                break;
            case UIPos.you:
                if (playerNum === 2) {
                    this.node.destroy();
                    return;
                } else {
                    this._sort = this._sort + 1 > playerNum - 1 ? 0 : this._sort + 1;
                }
                break;
            case UIPos.shang:
                if (playerNum === 2) {
                    this._sort = this._sort + 1 > playerNum - 1 ? 0 : this._sort + 1;
                } else {
                    this._sort = this._sort + 2 > playerNum - 1 ? this._sort + 2 - playerNum === 2 ? 1 : 0 : this._sort + 2;
                }
                break;
            case UIPos.zuo:
                if (playerNum < 4) {
                    this.node.destroy();
                    return;
                } else {
                    this._sort = this._sort - 1 < 0 ? 3 : this._sort - 1;
                }
                break;
            default:
                break;
        }
        if (userMap) {
            this.setPlayerUi(roomInfo);
        }
        this._enterRoomName = 'RoomInfo' + fun.event.getSum();
        fun.event.add(this._enterRoomName, 'RoomInfo', this.setPlayerUi.bind(this));
        this._offLineStateName = 'OffLineState' + fun.event.getSum();
        fun.event.add(this._offLineStateName, 'OffLineState', this.onLineStateEvent.bind(this));
    },
    onDestroy: function onDestroy() {
        fun.event.remove(this._enterRoomName);
        fun.event.remove(this._offLineStateName);
    },
    setPlayerUi: function setPlayerUi(data) {
        for (var key in data.userMap) {
            if (data.userMap[key].sort === this._sort) {
                this._userId = parseInt(key);
                this.playerUi.setData(data.userMap[key], this.uiPos);
                return;
            }
        }
    },
    getUserId: function getUserId() {
        return this._userId;
    },
    onLineStateEvent: function onLineStateEvent(data) {
        if (data.userId === this._userId) {
            this.playerUi.showOffLine(data.flag);
        }
    }
});

cc._RF.pop();