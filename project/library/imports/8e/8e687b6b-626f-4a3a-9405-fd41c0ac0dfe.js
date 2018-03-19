"use strict";
cc._RF.push(module, '8e687trYm9KOpQF/UHArA3+', 'funDB');
// hall/script/fun/funDB.js

"use strict";

var _data = {};
var _pdb = {};

var db = {
    setData: function setData(key, value) {
        var logFlag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (logFlag) {
            fun.log("funDB", "set db " + key + value);
        }
        _data[key] = value;
        fun.event.dispatch(key, value, logFlag);
    },
    getData: function getData(key) {
        var logFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (logFlag) {
            fun.log("funDB", "get db " + key, _data[key]);
        }
        return _data[key] || {};
    },
    clearUp: function clearUp() {
        _data = {};
    },
    setNeedNotice: function setNeedNotice(flag) {
        _pdb.needNotice = flag;
    },
    getNeedNotice: function getNeedNotice(flag) {
        return _pdb.needNotice;
    }
};

module.exports = db;

cc._RF.pop();