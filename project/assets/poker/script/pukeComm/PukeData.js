const pukeDataPath = 'pukeDataPath';
let pukeData = {
    haveXuYa     : false,
    isXuYa       : false,
    skin         : 1,
};

module.exports = {
    cleanGameData : function(){
        pukeData.isRoomMaster = 1;
        pukeData.haveXuYa     = false;
        pukeData.isXuYa       = false;
        pukeData.skin         = 1;
    },

    needSaveLocalData : function () {
        let data = {};
        data.skin = pukeData.skin;
        return data;
    },

    init : function () {
        try {
            let data = JSON.parse(cc.sys.localStorage.getItem(pukeDataPath));
            for (let key in data) {
                pukeData[key] = data[key];
            }
        }catch(err){
            log("--- getLocalData err : " + err);
        }
    },
    //保存数据到本地
    setLocalData : function () {
        try {
            cc.sys.localStorage.setItem(pukeDataPath, JSON.stringify(this.needSaveLocalData()));
        } catch(err) {
            log("--- setLocalData err : " + err);
        }
    },
    getPukeData : function () {
        return pukeData;
    },

    //-- 续押
    setXuYa : function (xuya) {
        pukeData.isXuYa = xuya;
    },
    getXuYa : function () {
        return pukeData.isXuYa;
    },
    getHaveXuYa : function () {
        return pukeData.haveXuYa;
    },

    //-- 皮肤保存
    setSkin : function (num) {
        pukeData.skin = num;
        this.setLocalData();
    },
    getSkin : function () {
        return pukeData.skin;
    },
};