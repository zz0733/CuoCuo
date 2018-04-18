(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/mahjong/script/game/common/mjDataMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f0f651/fdRE34S0Q94vwSfl', 'mjDataMgr', __filename);
// mahjong/script/game/common/mjDataMgr.js

"use strict";

var GameDefine = require("mjGameDefine");
//server 筒1条2万3字4风5
//本地筒1万2条3特殊4
var ServerToLocalType = {
    1: 1,
    2: 3,
    3: 2
};

var gameData = {
    userId: undefined,
    roomInfo: {},
    roomPlayers: {},
    PlayerCOORD: {},
    isRoomMaster: false
};

var mjDataSys = function mjDataSys() {
    this.data = {
        CfgData: {
            gameName: "黄岩麻将",
            zhuangPaiCount: 14, //庄家牌的数量 
            totalPai: 136, //总共好多张牌
            liujupai: 14, //当剩余牌数为这个数目的时候就是流局
            paiScale: 1,
            MagicName: "Caishen",
            Dialect: "hymj/"
        },
        TesuPai: GameDefine.SPECIALPAIHY,
        createDate: GameDefine.CREATROOMHY
    };
    this.canQuickly = function (PaiID) {
        return true;
    };
    this.set = function (key, value) {
        this.data[key] = value;
    };
    this.get = function (key) {
        return this.data[key];
    };
    this.clean = function () {
        this.data = {};
    };
    this.initRoomPlayers = function (playerArray) {
        for (var i = 0; i < playerArray.length; i++) {
            var playerData = playerArray[i];
            if (!playerData) {
                continue;
            }
            playerData.isSelfPlayed = false;
            if (playerData.UserId == this.get(mjDataMgr.KEYS.UID)) {
                this.set(mjDataMgr.KEYS.SELFID, playerData.PlayerIdx);
                this.refreshDeskType();
                playerData.isSelfPlayed = true;
            }
            var PlayerIdx = playerData.PlayerIdx;
            this.setPlayerData(playerData, PlayerIdx);
        }
    };
    this.refreshDeskType = function () {
        var deskPosIdxs = [];
        var meIdx = this.get(mjDataMgr.KEYS.SELFID);
        deskPosIdxs[meIdx] = GameDefine.DESKPOS_TYPE.XIA;
        deskPosIdxs[(meIdx + 1) % 4] = GameDefine.DESKPOS_TYPE.YOU;
        deskPosIdxs[(meIdx + 2) % 4] = GameDefine.DESKPOS_TYPE.SHANG;
        deskPosIdxs[(meIdx + 3) % 4] = GameDefine.DESKPOS_TYPE.ZUO;
        this.set(mjDataMgr.KEYS.POSIDS, deskPosIdxs);
    };
    this.setPlayerData = function (playerData, posIndex) {
        if (playerData) {
            var isTruePlayer = true; //playerData.Icon.length > 4; //正式玩家服务器会返回来玩家icon
            playerData.showName = isTruePlayer ? playerData.Name : "游客" + playerData.UserId;
            playerData.showName = mjDataMgr.sliceName(playerData.showName);
            playerData.isTruePlayer = isTruePlayer;
            playerData.OnLine = playerData.Status != GameDefine.PLAYER_READY.OFFLINE;
            playerData.xdhs = playerData.Score || 0;
        }
        var roomPlayers = this.get(mjDataMgr.KEYS.PLAYERS) || {};
        roomPlayers[posIndex] = playerData;
        this.set(mjDataMgr.KEYS.PLAYERS, roomPlayers);
    };

    this.getPlayerData = function (PlayerIdx) {
        return this.get(mjDataMgr.KEYS.PLAYERS)[PlayerIdx];
    };

    this.getAllPlayersData = function () {
        return this.get(mjDataMgr.KEYS.PLAYERS);
    };

    this.setPlayerCOORD = function (idx, coord) {
        var playerCoords = this.get(mjDataMgr.KEYS.COORDS) || {};
        playerCoords[idx] = coord;
        this.set(mjDataMgr.KEYS.COORDS, playerCoords);
    };

    this.getPlayerCOORD = function (idx) {
        var playerCoords = this.get(mjDataMgr.KEYS.COORDS) || {};
        return playerCoords[idx];
    };

    this.isRoomMaster = function () {
        return this.get(mjDataMgr.KEYS.SELFID) == 0;
    };
    this.init = function () {
        var userInfo = fun.db.getData('UserInfo');
        this.set(mjDataMgr.KEYS.UID, userInfo.UserId);
        this.set(mjDataMgr.KEYS.CFG, this.data.CfgData);
        this.initRoomInfo();
    };
    this.getCeateItem = function (itemKey, roomInfo, dataKey) {
        var createDate = this.data.createDate;
        var item = this.data.createDate[itemKey];
        dataKey = dataKey || roomInfo[itemKey];
        var itemData = {};
        if (item) {
            itemData.name = item.name;
            itemData.content = item.data[dataKey];
        } else {
            fun.log("mj", "mjDataMgr getCeateItem: this itemKey has no  defined");
        }
        return itemData;
    };

    this.initRoomInfo = function () {
        var gameInfo = fun.db.getData('RoomInfo');
        var roomInfo = gameInfo.RoomInformation;
        roomInfo.showList = [];
        roomInfo.showList.push(this.getCeateItem("GameNum" + roomInfo.SpendMethod, roomInfo, roomInfo.GameNum));
        roomInfo.showList.push(this.getCeateItem("PaymentMethod", roomInfo));
        // roomInfo.showList.push(this.getCeateItem("NoticeType", roomInfo));
        roomInfo.showList.push(this.getCeateItem("GshOp", roomInfo));
        this.set(mjDataMgr.KEYS.ROOMINFO, roomInfo);
        var hymjData = fun.db.getData("hymajiang");
        if (hymjData.PlayerInfo) {
            //create room
            roomInfo.Quan = 1;
            roomInfo.Round = 0;
            hymjData.PlayerInfo.OnLine = true;
            this.initRoomPlayers([hymjData.PlayerInfo]);
            fun.db.setData("hymajiang", undefined);
            this.set(mjDataMgr.KEYS.ROOMID, fun.db.getData('RoomInfo').RoomId);
        } else {
            //enter room
            roomInfo.Quan = 1;
            roomInfo.Round = 0;
            this.initRoomPlayers(gameInfo.PlayersInfo);
            this.set(mjDataMgr.KEYS.ROOMID, roomInfo.RoomId);
        }
        this.set(mjDataMgr.KEYS.ROOMINFO, roomInfo);
        this.refreRoomCount();
    };

    this.refreRoomCount = function () {
        var roomInfo = this.get(mjDataMgr.KEYS.ROOMINFO);
        roomInfo.gameCountStr = "";
        var cfgData = this.data.createDate["GameNum" + roomInfo.SpendMethod].data[roomInfo.GameNum];
        cc.log("roomInfo ", roomInfo);
        cfgData = cfgData.slice(0, -1);
        if (roomInfo.SpendMethod == 1) {
            roomInfo.gameCountStr = roomInfo.Quan + "/" + cfgData + "<color=#B1C3C4>" + "圈 " + "</c>" + roomInfo.Round + "<color=#B1C3C4>" + "局" + "</c>";
        } else {
            roomInfo.gameCountStr = roomInfo.Round + "/" + cfgData + "<color=#B1C3C4>" + "局 " + "</c>";
        }
    };

    this.getLocalPaiID = function (id) {
        var localID = this.data.TesuPai[id];
        if (!localID) {
            var serverType = Math.floor(id / 10);
            var num = id - serverType * 10;
            var localType = ServerToLocalType[serverType];
            localID = num * 10 + localType;
        }
        return localID;
    };

    this.isBaiBan = function (id) {
        var localID = this.getLocalPaiID(id);
        return localID == 14;
    };
};

var wlDataSys = function wlDataSys() {
    this.data = {
        CfgData: {
            gameName: "温岭麻将",
            zhuangPaiCount: 17, //庄家牌的数量 
            totalPai: 144, //总共好多张牌
            liujupai: 14, //当剩余牌数为这个数目的时候就是流局
            paiScale: 0.84,
            isPuhua: true,
            MagicName: "Caishen",
            Dialect: "wlmj/"
        },
        TesuPai: GameDefine.SPECIALPAIWL,
        createDate: GameDefine.CREATROOMWL
    };

    this.canQuickly = function (PaiID) {
        //最开始温岭财神不能打，后来又能打
        // var gameManager = require('mjGameManager');
        // return (gameManager.CaiShenPai.indexOf(PaiID) == -1)
        return true;
    };

    this.initRoomPlayers = function (playerArray) {
        var SelfIdx = 0;
        for (var i = 0; i < playerArray.length; i++) {
            var playerData = playerArray[i];
            if (!playerData) {
                continue;
            }
            playerData.isSelfPlayed = false;
            // cc.log("---mjDataMgr.KEYS.UID---", this.get(mjDataMgr.KEYS.UID, playerData));
            if (playerData.UserId == this.get(mjDataMgr.KEYS.UID)) {
                SelfIdx = i;
            }
            var PlayerIdx = playerData.RoomOrder;
            playerData.PlayerIdx = PlayerIdx;
            this.setPlayerData(playerData, PlayerIdx);
        }
        var playerData = this.getPlayerData(SelfIdx);
        this.set(mjDataMgr.KEYS.SELFID, playerData.RoomOrder);
        this.refreshDeskType();
        playerData.isSelfPlayed = true;
    };
    this.setPlayerData = function (playerData, posIndex) {
        if (playerData) {
            cc.log("setPlayerData", playerData);
            var roomInfo = this.get(mjDataMgr.KEYS.ROOMINFO);
            playerData.Icon = playerData.HeadUrl || "";
            var isTruePlayer = true; //playerData.Icon.length > 4; //正式玩家服务器会返回来玩家icon
            playerData.name = playerData.UserName || playerData.Name;
            playerData.showName = isTruePlayer ? playerData.name : "游客" + playerData.UserId;
            playerData.showName = mjDataMgr.sliceName(playerData.showName);
            playerData.isTruePlayer = isTruePlayer;
            playerData.xdhs = playerData.Score || 0;
            playerData.Status = playerData.Ready ? GameDefine.PLAYER_READY.READY : GameDefine.PLAYER_READY.NO_READY;
        }
        var roomPlayers = this.get(mjDataMgr.KEYS.PLAYERS) || {};
        roomPlayers[posIndex] = playerData;
        this.set(mjDataMgr.KEYS.PLAYERS, roomPlayers);
    };
    this.isRoomMaster = function () {
        //wengling 先暂时都是离开房间
        // return this.get(mjDataMgr.KEYS.UID) == this.get(mjDataMgr.KEYS.ROOMINFO).Owner;
        // return false;

        return this.get(mjDataMgr.KEYS.UID) == this.get(mjDataMgr.KEYS.ROOMINFO).Owner.UserId;
    };

    this.initRoomInfo = function () {
        var roomInfo = fun.db.getData('RoomInfo');
        var createDate = this.data.createDate;
        roomInfo.showList = [];
        roomInfo.showList.push(this.getCeateItem("MoShi", roomInfo));
        roomInfo.showList.push(this.getCeateItem("JuShu", roomInfo));
        roomInfo.showList.push(this.getCeateItem("ShengPaiTime", roomInfo));
        roomInfo.showList.push(this.getCeateItem("ZhiFu", roomInfo));
        roomInfo.showList.push(this.getCeateItem("WanFa", roomInfo));
        roomInfo.showList.push(this.getCeateItem("RenShu", roomInfo));
        roomInfo.showList.push(this.getCeateItem("BaoPai", roomInfo));
        roomInfo.GameNum = roomInfo.JuShu;
        roomInfo.Round = roomInfo.Round || 0;
        roomInfo.Quan = roomInfo.Quan || 0;
        var playInfoList = new Array(4);
        if (roomInfo.Players) {
            //enter room
            roomInfo.Players.forEach(function (item, index) {
                playInfoList[item.RoomOrder] = item;
            });
        } else {
            //create room
            var player = fun.db.getData('UserInfo');
            player.Status = GameDefine.PLAYER_READY.NO_READY;
            player.OnLine = true;
            player.RoomOrder = roomInfo.Owner.RoomOrder;
            player.HeadUrl = player.UserHeadUrl;
            player.Address = player.location;
            player.Sex = player.UserSex;
            playInfoList[roomInfo.Owner.RoomOrder] = player;
        }
        this.initRoomPlayers(playInfoList);
        this.set(mjDataMgr.KEYS.ROOMINFO, roomInfo);
        this.set(mjDataMgr.KEYS.ROOMID, roomInfo.RoomId);
        this.refreRoomCount();
    };

    this.refreRoomCount = function () {
        var roomInfo = this.get(mjDataMgr.KEYS.ROOMINFO);
        roomInfo.gameCountStr = "";
        var cfgData = this.data.createDate.JuShu.data[roomInfo.JuShu];
        cc.log("roomInfo ", roomInfo);
        cfgData = cfgData.slice(0, -1);
        if (roomInfo.JuShu > 20) {
            roomInfo.gameCountStr = roomInfo.Round + "/" + cfgData + "<color=#B1C3C4>" + "局" + "</c>";
        } else {
            roomInfo.gameCountStr = roomInfo.Quan + "/" + cfgData + "<color=#B1C3C4>" + "圈 " + "</c>" + roomInfo.Round + "<color=#B1C3C4>" + "局" + "</c>";
        }
    };
};

var scmjDataSys = function scmjDataSys() {
    this.data = {
        CfgData: {
            gameName: "四川麻将",
            zhuangPaiCount: 13, //庄家牌的数量 
            totalPai: 108, //总共好多张牌
            liujupai: 0, //当剩余牌数为这个数目的时候就是流局
            paiScale: 0.84,
            isPuhua: true,
            Dialect: "scmj/"
        },
        createDate: GameDefine.CREATROOMSC
    };
    this.initRoomPlayers = function (playerArray) {
        var SelfIdx = 0;
        for (var i = 0; i < playerArray.length; i++) {
            var playerData = playerArray[i];
            if (!playerData) {
                continue;
            }
            playerData.isSelfPlayed = false;
            // cc.log("---mjDataMgr.KEYS.UID---", this.get(mjDataMgr.KEYS.UID, playerData));
            if (playerData.UserId == this.get(mjDataMgr.KEYS.UID)) {
                SelfIdx = i;
            }
            var PlayerIdx = playerData.RoomOrder;
            playerData.PlayerIdx = PlayerIdx;
            this.setPlayerData(playerData, PlayerIdx);
        }
        var playerData = this.getPlayerData(SelfIdx);
        this.set(mjDataMgr.KEYS.SELFID, playerData.RoomOrder);
        this.refreshDeskType();
        playerData.isSelfPlayed = true;
    };
    this.setPlayerData = function (playerData, posIndex) {
        if (playerData) {
            var roomInfo = this.get(mjDataMgr.KEYS.ROOMINFO);
            playerData.Icon = playerData.HeadUrl || "";
            var isTruePlayer = true; //playerData.Icon.length > 4; //正式玩家服务器会返回来玩家icon
            playerData.name = playerData.UserName || playerData.Name;
            playerData.showName = isTruePlayer ? playerData.name : "游客" + playerData.UserId;
            playerData.showName = mjDataMgr.sliceName(playerData.showName);
            playerData.isTruePlayer = isTruePlayer;
            playerData.xdhs = playerData.Score || 0;
            playerData.Status = playerData.Ready ? GameDefine.PLAYER_READY.READY : GameDefine.PLAYER_READY.NO_READY;
        }
        var roomPlayers = this.get(mjDataMgr.KEYS.PLAYERS) || {};
        roomPlayers[posIndex] = playerData;
        this.set(mjDataMgr.KEYS.PLAYERS, roomPlayers);
    };
    this.isRoomMaster = function () {
        return this.get(mjDataMgr.KEYS.UID) == this.get(mjDataMgr.KEYS.ROOMINFO).Owner.UserId;
    };

    this.initRoomInfo = function () {
        var roomInfo = fun.db.getData('RoomInfo');
        var createDate = this.data.createDate;
        cc.log('--- createDate: ', createDate);
        cc.log('--- createDate.MoShi: ', createDate.MoShi);
        var moshi = { name: createDate.MoShi.name, content: '' };
        var moShiL = '';
        for (var i = 0; i < roomInfo.MoShi.toString().length; ++i) {
            cc.log('--- i: ', i);
            moShiL = moShiL + createDate.MoShi.data[i][roomInfo.MoShi.substr(i, 1)];
            cc.log('--- moshiL : ', moShiL);
        }
        cc.log('--- moshiL2 : ', moShiL);
        roomInfo.showList = [];
        roomInfo.showList.push(this.getCeateItem("WanFa", roomInfo));
        // roomInfo.showList.push(this.getCeateItem("MoShi", roomInfo));
        roomInfo.showList.push(this.getCeateItem("FengDing", roomInfo));
        roomInfo.showList.push(this.getCeateItem("DiFen", roomInfo));
        roomInfo.showList.push(this.getCeateItem("FangFei", roomInfo));
        roomInfo.showList.push(this.getCeateItem("GuiZe", roomInfo));
        cc.log('--- sxxsss : ', this.getCeateItem("JuShu", roomInfo));
        roomInfo.showList.push(this.getCeateItem("JuShu", roomInfo));
        roomInfo.DingWeiN = roomInfo.DingWei ? 1 : 0;
        roomInfo.showList.push(this.getCeateItem("DingWei", roomInfo));
        roomInfo.GameNum = roomInfo.JuShu;
        roomInfo.Round = roomInfo.Round || 0;
        var playInfoList = new Array(4);
        if (roomInfo.Players) {
            //enter room
            roomInfo.Players.forEach(function (item, index) {
                playInfoList[item.RoomOrder] = item;
            });
        } else {
            //create room
            var player = fun.db.getData('UserInfo');
            player.Status = GameDefine.PLAYER_READY.NO_READY;
            player.OnLine = true;
            player.RoomOrder = roomInfo.Owner;
            player.HeadUrl = player.UserHeadUrl;
            player.Address = player.location;
            player.Sex = player.UserSex;
            playInfoList[roomInfo.Owner] = player;
        }
        this.initRoomPlayers(playInfoList);
        this.set(mjDataMgr.KEYS.ROOMINFO, roomInfo);
        this.set(mjDataMgr.KEYS.ROOMID, roomInfo.RoomId);
        this.refreRoomCount();
    };

    this.refreRoomCount = function () {
        var roomInfo = this.get(mjDataMgr.KEYS.ROOMINFO);
        roomInfo.gameCountStr = "";
        var totalJu = roomInfo.JuShu;
        roomInfo.gameCountStr = roomInfo.Round + "/" + totalJu + "<color=#B1C3C4>" + "局" + "</c>";
    };
};

//黄岩回放
var hyReDataSys = function hyReDataSys() {
    var oldData = new mjDataSys();
    this.data = oldData.data;

    // this.data.CfgData.paiScale = 1.1;
    this.initRoomInfo = function () {
        var gameInfo = fun.db.getData('RoomInfo');
        var roomInfo = gameInfo.RoomInformation || {};
        roomInfo.showList = [];
        roomInfo.showList.push(this.getCeateItem("GameNum" + roomInfo.SpendMethod, roomInfo, roomInfo.GameNum));
        roomInfo.showList.push(this.getCeateItem("PaymentMethod", roomInfo));
        // roomInfo.showList.push(this.getCeateItem("NoticeType", roomInfo));
        roomInfo.showList.push(this.getCeateItem("GshOp", roomInfo));
        roomInfo.gameCountStr = "";
        this.set(mjDataMgr.KEYS.ROOMINFO, roomInfo);
        this.set(mjDataMgr.KEYS.ROOMID, gameInfo.RoomId);
        this.initRoomPlayers(gameInfo);
    };

    this.initRoomPlayers = function (gameInfo) {
        var playerArray = gameInfo.players;
        var meIdx = gameInfo.meIdx;
        for (var i = 0; i < playerArray.length; i++) {
            var playerData = playerArray[i];
            playerData.isSelfPlayed = i == meIdx;
            if (i == 0) {
                this.set(mjDataMgr.KEYS.SELFID, meIdx);
                this.refreshDeskType();
            }
            this.setPlayerData(playerData, i);
        }
    };

    this.setPlayerData = function (playerData, posIndex) {
        playerData.Icon = playerData.icon;
        playerData.UserId = playerData.id;
        var isTruePlayer = true; //playerData.Icon.length > 4; //正式玩家服务器会返回来玩家icon
        playerData.showName = isTruePlayer ? playerData.name : "游客" + playerData.UserId;
        playerData.showName = mjDataMgr.sliceName(playerData.showName);
        playerData.isTruePlayer = isTruePlayer;
        playerData.OnLine = true;
        playerData.Sex = playerData.sex || playerData.Sex;
        playerData.xdhs = playerData.hushu;
        var roomPlayers = this.get(mjDataMgr.KEYS.PLAYERS) || {};
        roomPlayers[posIndex] = playerData;
        this.set(mjDataMgr.KEYS.PLAYERS, roomPlayers);
    };
    this.refreRoomCount = function () {
        var roomInfo = this.get(mjDataMgr.KEYS.ROOMINFO);
        roomInfo.gameCountStr = "";
    };
};

wlDataSys.prototype = new mjDataSys();
hyReDataSys.prototype = new mjDataSys();
scmjDataSys.prototype = new mjDataSys();

var instance;
var mjDataMgr = {
    init: function init() {
        var isReplay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var dfDataList = {};
        dfDataList[gameConst.gameType.maJiangWenLing] = wlDataSys;
        if (isReplay) {
            dfDataList[gameConst.gameType.maJiangHuangYan] = hyReDataSys;
        } else {
            dfDataList[gameConst.gameType.maJiangHuangYan] = mjDataSys;
        }
        dfDataList[gameConst.gameType.scMahjong] = scmjDataSys;

        var roomInfo = fun.db.getData('RoomInfo');
        var curGameType = roomInfo.GameType;
        var curDataSys = dfDataList[curGameType];
        if (curDataSys) {
            instance = new curDataSys();
            instance.init();
        } else {
            fun.log("mj", "mjDataMgr has no cur gameType : " + curGameType);
        }
    },

    getInstance: function getInstance() {
        return instance;
    },

    KEYS: {
        UID: "UserID",
        SELFID: "SelfIdx",
        ROOMID: "RoomID",
        ROOMINFO: "RoomInfo",
        COORDS: "CoordList",
        POSIDS: "IDPosList",
        PLAYERS: "RoomPlayers",
        CFG: "GameCfg"
    },
    get: function get(key) {
        return this.getInstance().get(key);
    },
    set: function set(key, value) {
        this.getInstance().set(key, value);
    },

    sliceName: function sliceName() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";

        if (name.length > 8) {
            name = name.slice(0, 8);
        }
        return name;
    }
};

module.exports = mjDataMgr;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=mjDataMgr.js.map
        