let _data = {};
let _pdb = {};

let db = {
    setData (key, value, logFlag = false) {
        if (logFlag) {
            fun.log("funDB", "set db " + key + value);
        }
        _data[key] = value;
        fun.event.dispatch(key, value, logFlag);
    },

    getData (key, logFlag = false) {
        if (logFlag) {
            fun.log("funDB", "get db " + key, _data[key]);
        }
        return _data[key] || {};
    },

    clearUp () {
        _data = {};
    },

    setNeedNotice(flag) {
        _pdb.needNotice = flag;
    },

    getNeedNotice(flag) {
        return _pdb.needNotice;
    }
};

module.exports = db;