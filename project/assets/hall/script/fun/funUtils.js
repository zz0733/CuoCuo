let loadedRes = {}; //缓存加载了的icon;

let loadEnd = function (filepath, callback) {
    cc.loader.load(filepath, function (err, tex) {
        if (err) {
            cc.error(err);
        } else {
            let spriteFrame = new cc.SpriteFrame(tex);
            if (spriteFrame) {
                spriteFrame.retain();
                callback(spriteFrame);
            }
        }
    });
};

let saveFile = function (filepath, callback, data) {
    if (typeof data !== 'undefined') {
        if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.createDirectory(dirpath);
        }

        if (jsb.fileUtils.writeDataToFile(new Uint8Array(data), filepath)) {
            fun.log('funUtils', 'Remote write file succeed.');
            loadEnd(filepath, callback);
        } else {
            fun.log('funUtils', 'Remote write file failed.');
        }
    } else {
        fun.log('funUtils', 'Remote download file failed.');
    }
};

let utils = {
    random (min, max) {
        min = parseFloat(min);
        max = parseFloat(max);
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    deepClone (data) {
        let dataCopy;
        if (data.constructor === Object) {
            dataCopy = new data.constructor();
        } else if (data.constructor === Array) {
            dataCopy = [];
        } else {
            dataCopy = new data.constructor(data.valueOf());
        }
        for (const key in data) {
            if (dataCopy[key] !== data[key]) {
                if (typeof(data[key]) === 'object') {
                    dataCopy[key] = this.deepClone(data[key]);
                } else {
                    dataCopy[key] = data[key];
                }
            }
        }
        return dataCopy;
    },

    restart () {
        cc.game.removePersistRootNode(fun.rootNode);
        fun.event.clearUp();
        fun.db.clearUp();
        fun.net.destroy();
        cc.audioEngine.stopAll();
        cc.game.restart();
    },

    endGame () {
        cc.game.end();
    },

    screenShoot (callback) {
        if (!cc.sys.isNative) { return; }
        const name = 'ScreenShoot.jpg';
        let rt = cc.RenderTexture.create(cc.winSize.width, cc.winSize.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        cc.director.getScene()._sgNode.addChild(rt);
        rt.setVisible(false);
        rt.begin();
        cc.director.getScene()._sgNode.visit();
        rt.end();
        rt.saveToFile('/'+name, cc.ImageFormat.PNG, true, function() {
            fun.log('funUtils', `save success ${name}`);
            rt.removeFromParent();
            if (callback) {
                callback(cc.path.join(jsb.fileUtils.getWritablePath(), name));
            }
        });
    },

    loadNative (id, url, callback) {
        if (cc.sys.isBrowser) {
            callback(null);
            return;
        }
        const dirpath = cc.path.join(jsb.fileUtils.getWritablePath(), 'img/');
        if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.createDirectory(dirpath);
        }
        const filepath = cc.path.join(dirpath, `${id}.png`);
        if (jsb.fileUtils.isFileExist(filepath)) {
            fun.log('funUtils', `Remote is find ${filepath}`);
            loadEnd(filepath, callback);
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            fun.log('funUtils', `xhr.readyState ${xhr.readyState} xhr.status ${xhr.status}`);
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    xhr.responseType = 'arraybuffer';
                    saveFile(filepath, callback, xhr.response);
                } else {
                    saveFile(filepath, callback, null);
                }
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    },

    getCreateRoomData(gameType) {
        let dataStr = cc.sys.localStorage.getItem(`createRoomData${gameType}`);
        if (dataStr && dataStr.length > 0) {
            return JSON.parse(dataStr);
        } else {
            return null;
        }
    },

    saveCreateRoomData(data) {
        cc.sys.localStorage.setItem(`createRoomData${data.GameType}`, JSON.stringify(data));
    },

     //加载 url 图片 如 头像
    loadUrlRes : function (url, imgNode) {
        if(!url || url === null || url === undefined || url.length < 4){
            // cc.error("--- load img err : " + url);
            this.setDefaultIcon(imgNode);
            return;
        }
        if(loadedRes[url]){
            let sf = new cc.SpriteFrame(loadedRes[url]);
            this.setIconRes(sf, imgNode);
            return;
        }
        let self = this;
        cc.loader.load({url : url, type : "png"}, function(err, texture) {
            if(err){
                cc.error("--- load img err : ", err, url);
                return;
            }
            loadedRes[url] = texture;
            let sf = new cc.SpriteFrame(texture);
            self.setIconRes(sf, imgNode);
        });
    },

    setIconRes : function (sf, imgNode) {
        var ow = imgNode.width;
        var oh = imgNode.height;
        imgNode.getComponent(cc.Sprite).spriteFrame = sf;
        imgNode.width = ow;
        imgNode.height = oh;
    },

    setDefaultIcon: function(imgNode){
        if(this.DefaultIconSprite){
            this.setIconRes(this.DefaultIconSprite, imgNode);
            return
        }
        let path = "hall/texture/icon_default"
        cc.loader.loadRes(path, cc.SpriteFrame, function(err, sf){
            if(!err){
                this.DefaultIconSprite = sf;
                this.setIconRes(sf, imgNode);
            }
        }.bind(this))
    },

    //Array forEach 遍历稀松数组时只会遍历有值的索引
    forEach : function(mList, cb){
        if(!mList){return}
        for(let i=0; i<mList.length; i++){
            try{
                cb(mList[i], i);
            }catch(e){
                fun.log("funUtils", "funUtils forEach : error", mList, cb, e,"end")
                break;
            }
            
        }
    },

    //将一个数转换成二进制， 得到操作列表
    getBinaryOpts : function (Opts) {
        Opts = parseInt(Opts);
        var str      = Opts.toString(2)+"";
        var optsList = [];
        var optIndex = 0; 
        for(let i=(str.length -1); i > -1; i--){
            var chatData = str.charAt(i);
            if(chatData == 1){
                optsList.push({Op : optIndex});
            }
            optIndex += 1;
        }
        return optsList
    },

    getCurTime : function(){
        var curDate = new Date();
        var minutes = curDate.getMinutes();
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return (curDate.getFullYear() + "/" + (curDate.getMonth()+1) + "/" + 
                curDate.getDate() + "/ " + curDate.getHours() + ":" + minutes );
    },

    getNetDelayTime : function(time){
        if (time <= 300)
            return {idx: 3, rgb: {r: 81, g: 255, b: 37, a: 255}};
        else if (time > 300 && time <= 400)
            return {idx: 2, rgb: {r: 242, g: 176, b: 36, a: 255}};
        else
            return {idx: 1, rgb: {r: 209, g: 0, b: 11, a: 255}};
    },

    // JS 获取 Map 长度, 加上一个 hasOwnProperty 判断过滤下原型中的属性就比较安全了
    getLength : function (obj) {
        let count = 0;
        for(let value in obj){
            if(obj.hasOwnProperty(value)){
                count ++;
            }
        }
        return count;
    },

    //
    setBtnEnabled : function(btnNode, isEnabled){
        btnNode.color = isEnabled ? cc.Color.WHITE : cc.Color.GRAY;
        btnNode.scale = isEnabled ? 1 : 0.94;
        if(btnNode.getComponent(cc.Button)){
            btnNode.getComponent(cc.Button).enabled = isEnabled;
        }
    },

    getMinMaxByArray(type, data) {
        if (type === 'min') {
            return Math.min.apply(Math, data);
        } else {
            return Math.max.apply(Math, data);
        }
    },
};

module.exports = utils;