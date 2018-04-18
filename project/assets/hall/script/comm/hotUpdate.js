const GameConst = require("GameCfg");
let NeedForce = false;

cc.Class({
    extends: cc.Component,

    properties: {
        manifestUrl: {
            url: cc.RawAsset,
            default: null,
        },

        gameName: {
            type: GameConst.gameName,
            default: GameConst.gameName.hall,
        },

        loseFileStr: {
            default: '本地文件丢失，请卸载后重新安装！',
        },

        loseRemoteFileStr: {
            default: '下载版本文件出错，请稍后再试！',
        },

        foundNewStr: {
            default: '发现新版本，请更新！',
        },

        updateErrStr: {
            default: '更新出错，请重试！',
        },

        updatePanelPrefab: {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad () {
        if (cc.sys.isBrowser) {
            return;
        }
        if (!fun.gameCfg.enableUpdate) {
            return;
        }
        let updatedGame = fun.db.getData('UpdatedGame');
        if (updatedGame && updatedGame[this.gameName]) {
            return;
        }

        const storagePath = cc.path.join(jsb.fileUtils.getWritablePath(), 'hotUpdate');
        this.atManager = new jsb.AssetsManager(this.manifestUrl, storagePath, this.versionCompare);
        this.atManager.retain();
        if (this.atManager.getState() === jsb.AssetsManager.State.UNCHECKED) {
            this.atManager.loadLocalManifest(this.manifestUrl);
        }
        if (!this.atManager.getLocalManifest() || !this.atManager.getLocalManifest().isLoaded()) {
            this.showError(this.loseFileStr);
            return;
        }

        this.checkListener = new jsb.EventListenerAssetsManager(this.atManager, this.checkUpdateCB.bind(this));
        cc.eventManager.addListener(this.checkListener, 1);
        this.atManager.checkUpdate();
        this.hasCheckListener = true;
    },

    versionCompare (versionA, versionB) {
        let va = versionA.split('.'), vb = versionB.split('.');
        NeedForce = vb[0] > va[0];
        for (let i = 0; i < va.length; ++i) {
            let a = parseInt(va[i]), b = parseInt(vb[i]);
            if (a !== b) {
                return a - b;
            }
        }
        if (vb.length > va.length) {
            return -1;
        } else {
            return 0;
        }
    },

    checkUpdateCB (event) {
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                fun.log('hotUpdate', this.gameName + 'checkUpdateCB ERROR_NO_LOCAL_MANIFEST');
                this.showError(this.loseFileStr);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                fun.log('hotUpdate', this.gameName + 'checkUpdateCB ERROR_DOWNLOAD_MANIFEST');
                this.showError(this.loseRemoteFileStr);
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                fun.log('hotUpdate', this.gameName + 'checkUpdateCB ERROR_PARSE_MANIFEST');
                this.showError(this.loseRemoteFileStr);
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.completeUpdate();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.reqVersionDetail();
                break;
            default:
                return;
        }
        if (this.hasCheckListener) {
            cc.eventManager.removeListener(this.checkListener);
            this.hasCheckListener = false;
        }
    },

    completeUpdate () {
        let updatedGame = fun.db.getData('UpdatedGame');
        updatedGame[this.gameName] = this.gameName;
        fun.db.setData('UpdatedGame', updatedGame);
    },

    reqVersionDetail () {
        this.updatePanel = cc.instantiate(this.updatePanelPrefab);
        const verUrl = this.atManager.getLocalManifest().getPackageUrl() + 'ver.txt';
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    if (NeedForce) {
                        this.forceUpdate();
                    } else {
                        this.updatePanel.parent = this.node;
                        this.updatePanel.getComponent('updatePanel').setVersionContent(xhr.responseText.split(':::'), this.startUpdate.bind(this));
                    }
                } else {
                    this.showGetUpdateContentError();
                }
            }
        }.bind(this);
        xhr.open("GET", verUrl, true);
        xhr.send();
    },

    forceUpdate () {
        let sdata = {
            contentStr: '您的客户端版本过低，请下载最新版本！',
            okBtnStr: '前往下载',
            okCb () {
                if (cc.sys.os === cc.sys.OS_ANDROID)
                    cc.sys.openURL(gameConst.forceUpdateUrl.android);
                else if (cc.sys.os === cc.sys.OS_IOS)
                    cc.sys.openURL(gameConst.forceUpdateUrl.ios);
            },
            closeCb () {
                fun.utils.endGame();
            }
        };
        fun.event.dispatch('MinDoubleButtonPop', sdata);
        jsb.fileUtils.removeDirectory(cc.path.join(jsb.fileUtils.getWritablePath(), "hotUpdate"));
    },

    startUpdate () {
        this.hasUpdateListener = true;
        this.updateListener = new jsb.EventListenerAssetsManager(this.atManager, this.updatingCB.bind(this));
        cc.eventManager.addListener(this.updateListener, 1);
        if (this.atManager.getState() === jsb.AssetsManager.State.UNINITED) {
            this.atManager.loadLocalManifest(this.manifestUrl);
        }
        this.atManager.update();
    },

    updatingCB (event) {
        let needRestart = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                fun.log('hotUpdate', this.gameName + 'updatingCB ERROR_NO_LOCAL_MANIFEST');
                this.showError(this.loseFileStr);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                fun.log('hotUpdate', this.gameName + 'updatingCB ERROR_DOWNLOAD_MANIFEST');
                this.showError(this.loseRemoteFileStr);
                break;
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                fun.log('hotUpdate', this.gameName + 'updatingCB ERROR_PARSE_MANIFEST');
                this.showError(this.loseRemoteFileStr);
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                fun.log('hotUpdate', this.gameName + 'updatingCB UPDATE_FAILED');
                this.showError(this.updateErrStr);
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                fun.log('hotUpdate', `Asset update error: ${event.getAssetId()}, ${event.getMessage()}`);
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                if(!this._getTotalBytes && event.getTotalBytes() !== 0){
                    console.log('--- event: ', event);
                    console.log('--- event.str: ', JSON.stringify(event));
                    console.log('--- getTotalBytes: ', event.getTotalBytes());
                    console.log('--- getTotalFiles: ', event.getTotalFiles());
                    console.log('--- getPercent: ', event.getPercent());
                    console.log('--- getPercentByFile: ', event.getPercentByFile());
                    console.log('--- getMessage: ', event.getMessage());
                    this.updatePanel.getComponent('updatePanel').setSourceSize(event.getTotalBytes()/(1024*1024));
                    this._getTotalBytes = true;
                }

                this.updatePanel.getComponent('updatePanel').updateProgress(event.getPercent());
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                needRestart = true;
                break;
        }

        if (needRestart) {
            if (this.hasUpdateListener) {
                cc.eventManager.removeListener(this.updateListener);
                this.hasUpdateListener = false;
            }
            let searchPaths = jsb.fileUtils.getSearchPaths();
            let newPaths = this.atManager.getLocalManifest().getSearchPaths();
            fun.log('hotUpdate', 'success ', newPaths);
            Array.prototype.unshift(searchPaths, newPaths);
            searchPaths.unshift(cc.path.join(jsb.fileUtils.getWritablePath(), "hotUpdate"));
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            fun.utils.restart();
        }
    },

    showError (str) {
        let data = {
            contentStr: str,
            okBtnStr: '重启',
            hideCloseBtn: true,
            okCb () {
                fun.utils.restart();
            }
        };
        fun.event.dispatch('MinSingleButtonPop', data)
    },

    onDestroy () {
        if (this.hasCheckListener) {
            cc.eventManager.removeListener(this.checkListener);
        }
        if (this.hasUpdateListener) {
            cc.eventManager.removeListener(this.updateListener);
        }
        if (this.atManager) {
            this.atManager.release();
        }
    },
});