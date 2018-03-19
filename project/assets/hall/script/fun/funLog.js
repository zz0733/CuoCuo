class logger {
    constructor() {
        if (cc.sys.isBrowser) {
            return;
        }
        const logPath = cc.path.join(jsb.fileUtils.getWritablePath(), 'cuocuolog');
        if (!jsb.fileUtils.isDirectoryExist(logPath)) {
            jsb.fileUtils.createDirectory(logPath);
        }
        const saveTime = fun.gameCfg.logSaveDay * 24 * 60 * 60 * 1000;
        const now = Date.now();
        const files = jsb.fileUtils.listFiles(logPath);
        for (let i = 0; i < files.length; i++) {
            if (cc.path.extname(files[i]) !== '.log') {
                continue;
            }
            const time = parseInt(cc.path.basename(files[i], '.log'), 10);
            if (now - time >= saveTime) {
                jsb.fileUtils.removeFile(files[i]);
            }
        }
        this.fileName = cc.path.join(logPath, now + '.log');
        if (!jsb.fileUtils.isFileExist(this.fileName)) {
            jsb.fileUtils.writeStringToFile(`init log ${now}\n`, this.fileName);
        }
    }

    log(tag, ...values) {
        if (!gameConst.logTags[tag] || gameConst.logTags[tag] > fun.gameCfg.logLevel) {
            return;
        }
        if (cc.sys.isBrowser) {
            console.log(`[${tag}]`, values);
            return;
        }
        let valueStr = "";
        if (values.length === 1 && (typeof values[0] === 'string')) {
            valueStr = values[0];
        } else {
            valueStr = JSON.stringify(values)
        }
        let str = `[${tag}] ${valueStr} \ttime:${Date.now()}\n`;
        jsb.fileUtils.appendStringToFile(str, this.fileName);
        cc.log(str);
    }

    upLoadLog(desc) {
        const logPath = cc.path.join(jsb.fileUtils.getWritablePath(), 'cuocuolog');
        const files = jsb.fileUtils.listFiles(logPath);
        const logurl = fun.gameCfg.logUrl;
        let socket = new WebSocket(logurl);
        socket.binaryType = 'arraybuffer';
        socket.onopen = function (event) {
            let userInfo = fun.db.getData('UserInfo');
            for (let i = 0; files.length; i++) {
                if (cc.path.extname(files[i]) !== '.log') {
                    continue;
                }
                let req = {
                    UserId: userInfo.UserId || 100000,
                    UserName: userInfo.name || 'unknown',
                    FileName: cc.path.basename(files[i], '.log'),
                    FileConcent: jsb.fileUtils.getStringFromFile(files[i]),
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
}

module.exports = logger;