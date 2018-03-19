const UIPos = cc.Enum({
    xia: 0,
    you: 1,
    shang: 2,
    zuo: 3,
});
const SeatDir = ['xia', 'you', 'shang', 'zuo'];

cc.Class({
    extends: cc.Component,

    properties: {
        uiPos: {
            type: UIPos,
            default: UIPos.xia,
        },
    },

    onLoad () {
        this.playerUi = this.node.getComponent('playerUiWahua');
        this.playerUi.setWait();
        let roomInfo = fun.db.getData('RoomInfo');
        let userMap = roomInfo.userMap;
        let playerNum = roomInfo.roomRule.playerNum;
        let userInfo = fun.db.getData('UserInfo');
        userInfo.userId = userInfo.UserId.toString();
        userInfo.userName = userInfo.UserName;
        this._userId = userInfo.userId;
        let isUserMap = (userMap && userMap[this._userId]) ? true : false;
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
                    this._sort = (this._sort + 1) > (playerNum - 1) ? 0 : (this._sort + 1);
                }
                break;
            case UIPos.shang:
                if (playerNum === 2) {
                    this._sort = (this._sort + 1) > (playerNum - 1) ? 0 : (this._sort + 1);
                } else {
                    this._sort = (this._sort + 2) > (playerNum - 1) ? ((this._sort + 2 - playerNum) === 2 ? 1 : 0) : (this._sort + 2);
                }
                break;
            case UIPos.zuo:
                if (playerNum < 4) {
                    this.node.destroy();
                    return;
                } else {
                    this._sort = (this._sort - 1) < 0 ? 3 : (this._sort - 1);
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

    onDestroy() {
        fun.event.remove(this._enterRoomName);
        fun.event.remove(this._offLineStateName);
    },

    setPlayerUi(data) {
        for (const key in data.userMap) {
            if (data.userMap[key].sort === this._sort) {
                this._userId = parseInt(key);
                this.playerUi.setData(data.userMap[key], this.uiPos);
                return;
            }
        }
    },

    getUserId() {
        return this._userId;
    },

    onLineStateEvent(data) {
        if (data.userId === this._userId) {
            this.playerUi.showOffLine(data.flag);
        }
    },
});
