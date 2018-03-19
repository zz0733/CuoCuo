(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/poker/script/pukeComm/PukeData.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1dc3927kCtKz6NcIEK/wZqW', 'PukeData', __filename);
// poker/script/pukeComm/PukeData.js

"use strict";

var pukeDataPath = 'pukeDataPath';
var pukeData = {
    haveXuYa: false,
    isXuYa: false,
    skin: 1
};

module.exports = {
    cleanGameData: function cleanGameData() {
        pukeData.isRoomMaster = 1;
        pukeData.haveXuYa = false;
        pukeData.isXuYa = false;
        pukeData.skin = 1;
    },

    needSaveLocalData: function needSaveLocalData() {
        var data = {};
        data.skin = pukeData.skin;
        return data;
    },

    init: function init() {
        try {
            var data = JSON.parse(cc.sys.localStorage.getItem(pukeDataPath));
            for (var key in data) {
                pukeData[key] = data[key];
            }
        } catch (err) {
            log("--- getLocalData err : " + err);
        }
    },
    //保存数据到本地
    setLocalData: function setLocalData() {
        try {
            cc.sys.localStorage.setItem(pukeDataPath, JSON.stringify(this.needSaveLocalData()));
        } catch (err) {
            log("--- setLocalData err : " + err);
        }
    },
    getPukeData: function getPukeData() {
        return pukeData;
    },

    //-- 续押
    setXuYa: function setXuYa(xuya) {
        pukeData.isXuYa = xuya;
    },
    getXuYa: function getXuYa() {
        return pukeData.isXuYa;
    },
    getHaveXuYa: function getHaveXuYa() {
        return pukeData.haveXuYa;
    },

    //-- 皮肤保存
    setSkin: function setSkin(num) {
        pukeData.skin = num;
        this.setLocalData();
    },
    getSkin: function getSkin() {
        return pukeData.skin;
    }
};

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
        //# sourceMappingURL=PukeData.js.map
        