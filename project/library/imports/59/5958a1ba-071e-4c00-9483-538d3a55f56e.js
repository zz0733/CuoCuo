"use strict";
cc._RF.push(module, '5958aG6Bx5MAJSDU406VfVu', 'funLog');
// hall/script/fun/funLog.js

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var logger = function () {
    function logger() {
        _classCallCheck(this, logger);

        if (cc.sys.isBrowser) {
            return;
        }
        var logPath = cc.path.join(jsb.fileUtils.getWritablePath(), 'cuocuolog');
        if (!jsb.fileUtils.isDirectoryExist(logPath)) {
            jsb.fileUtils.createDirectory(logPath);
        }
        var saveTime = fun.gameCfg.logSaveDay * 24 * 60 * 60 * 1000;
        var now = Date.now();
        var files = jsb.fileUtils.listFiles(logPath);
        for (var i = 0; i < files.length; i++) {
            if (cc.path.extname(files[i]) !== '.log') {
                continue;
            }
            var time = parseInt(cc.path.basename(files[i], '.log'), 10);
            if (now - time >= saveTime) {
                jsb.fileUtils.removeFile(files[i]);
            }
        }
        this.fileName = cc.path.join(logPath, now + '.log');
        if (!jsb.fileUtils.isFileExist(this.fileName)) {
            jsb.fileUtils.writeStringToFile('init log ' + now + '\n', this.fileName);
        }
    }

    _createClass(logger, [{
        key: 'log',
        value: function log(tag) {
            if (!gameConst.logTags[tag] || gameConst.logTags[tag] > fun.gameCfg.logLevel) {
                return;
            }

            for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                values[_key - 1] = arguments[_key];
            }

            if (cc.sys.isBrowser) {
                console.log('[' + tag + ']', values);
                return;
            }
            var valueStr = "";
            if (values.length === 1 && typeof values[0] === 'string') {
                valueStr = values[0];
            } else {
                valueStr = JSON.stringify(values);
            }
            var str = '[' + tag + '] ' + valueStr + ' \ttime:' + Date.now() + '\n';
            jsb.fileUtils.appendStringToFile(str, this.fileName);
            cc.log(str);
        }
    }, {
        key: 'upLoadLog',
        value: function upLoadLog(desc) {
            var logPath = cc.path.join(jsb.fileUtils.getWritablePath(), 'cuocuolog');
            var files = jsb.fileUtils.listFiles(logPath);
            var logurl = fun.gameCfg.logUrl;
            var socket = new WebSocket(logurl);
            socket.binaryType = 'arraybuffer';
            socket.onopen = function (event) {
                var userInfo = fun.db.getData('UserInfo');
                for (var i = 0; files.length; i++) {
                    if (cc.path.extname(files[i]) !== '.log') {
                        continue;
                    }
                    var req = {
                        UserId: userInfo.UserId || 100000,
                        UserName: userInfo.name || 'unknown',
                        FileName: cc.path.basename(files[i], '.log'),
                        FileConcent: jsb.fileUtils.getStringFromFile(files[i])
                    };
                    socket.send(JSON.stringify(req));
                }
                socket.close();
            };
            socket.onclose = function (event) {
                console.log("onclose");
            };
            socket.onerror = function (event) {
                console.log("onerror");
            };
            socket.onmessage = function (event) {
                console.log("onmessage");
            };
        }
    }]);

    return logger;
}();

module.exports = logger;

cc._RF.pop();