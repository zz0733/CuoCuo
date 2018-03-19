"use strict";
cc._RF.push(module, 'a4b08RwMtVCTqy3p/ZKDzxU', 'CuoPai');
// poker/script/pukeComm/CuoPai.js

"use strict";

var PukeDefine = require("PukeDefine");
var PukeUtils = require("PukeUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        Background: cc.Node,
        PukeNode: cc.Node,
        Puke: sp.Skeleton,
        CuoPaiTime: 1000, // 搓牌时间 单位:毫秒
        ScaleTime: 1.2, // 搓牌翻牌动画时间
        liangPaiScaleTime: 4
    },

    startTouchFunc: function startTouchFunc(event) {
        this.beganTime = Date.parse(new Date());
        if (!cc.sys.isNative) {
            this.beganPos = event.getStartLocation();
            this.lastPos = cc.p(this.beganPos.x, this.beganPos.y);
        }
    },
    moveTouchFunc: function moveTouchFunc(event) {
        if (cc.sys.isNative) {
            this.setDisy(event.touch.getDelta().y);
        } else {
            var movePos = event.getLocation();
            var disy = movePos.y - this.lastPos.y;
            this.setDisy(disy);
            this.lastPos = cc.p(movePos.x, movePos.y);
        }
    },
    endCancelTouchFunc: function endCancelTouchFunc(event) {
        this.endTime = Date.parse(new Date());
        if (this.endTime - this.beganTime < this.CuoPaiTime) {
            if (cc.sys.isNative) {
                var disy = event.touch.getDelta().y;
                if (disy > 80) {
                    this.fanPai();
                    return;
                }
            } else {
                var pos = event.getLocation();
                var _disy = pos.y - this.beganPos.y;
                if (_disy > 80) {
                    this.fanPai();
                    return;
                }
            }
        }
        this.cancelFanPai();
    },
    touchOn: function touchOn() {
        this.Background.on('touchstart', this.startTouchFunc, this);
        this.Background.on('touchmove', this.moveTouchFunc, this);
        this.Background.on('touchend', this.endCancelTouchFunc, this);
        this.Background.on('touchcancel', this.endCancelTouchFunc, this);
    },
    touchOff: function touchOff() {
        this.Background.off('touchstart', this.startTouchFunc, this);
        this.Background.off('touchmove', this.moveTouchFunc, this);
        this.Background.off('touchend', this.endCancelTouchFunc, this);
        this.Background.off('touchcancel', this.endCancelTouchFunc, this);
    },

    update: function update(dt) {
        if (this.isFan) {
            return;
        }
        if (this.disy > 0) {
            if (this.state === "Bei") {
                this.Puke.setAnimation(0, "Fan", false);
                this.Puke.timeScale = this.ScaleTime;
                this.state = "Fan";
            } else if (this.state === "Fan") {
                if (this.playing) {
                    this.Puke.timeScale = this.ScaleTime;
                } else {
                    this.Puke.setAnimation(0, "Zheng", false);
                    this.state = "Zheng";
                }
            }
            this.disy = 0;
        } else if (this.disy < 0) {
            this.Puke.setAnimation(0, "Bei", false);
            this.Puke.timeScale = this.ScaleTime;
            this.state = "Bei";
            this.playing = true;
            this.disy = 0;
        } else if (this.disy === 0) {
            this.Puke.timeScale = 0;
        }
    },

    onDestroy: function onDestroy() {
        this.touchOff();
    },

    setDisy: function setDisy(disy) {
        if (disy < 0) {
            this.tmpDisy = this.tmpDisy + disy;
            if (this.tmpDisy < -5) {
                this.disy = this.tmpDisy;
                this.tmpDisy = 0;
            }
        } else {
            this.disy = disy;
            this.tmpDisy = 0;
        }
    },

    initPuke: function initPuke(data) {
        this.pukeNumber = Math.abs(data.num) - 3 || 4;
        this.modelIndex = 0;
        this.callback = data.cb;
        this.GameType = data.GameType;
        this.state = "Bei";
        this.isFan = false;
        this._rotateDelay = false;
        this.touchOn();
        if (data.from === "liangPai" || data.from === "showCard") {
            this.initAnimation("liangPai");
        } else {
            this.initAnimation();
        }
    },

    initAnimation: function initAnimation(type) {
        var self = this;
        this.playing = true;
        this.state = "Bei";
        this.disy = 0;
        this.tmpDisy = 0;
        var modelName = PukeDefine.PUKE['MODULE_NAME_' + this.GameType][this.modelIndex];
        var spName = modelName + "/" + modelName + "_" + this.pukeNumber;
        var url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.FAN_PAI + spName;
        self.Puke.setAnimation(0, "Bei", false);
        PukeUtils.LoadRes(url, "sp.SkeletonData", function (res) {
            self.Puke.skeletonData = res;
            self.Puke.setAnimation(0, "Bei", false);
            self.PukeNode.rotation = 0;
            if (type && type === "liangPai") {
                self.fanPai();
                self.touchOff();
            } else {
                self.touchOn();
            }
        });
        this.Puke.setCompleteListener(function (trackEntry) {
            if (trackEntry.animation.name === "Shang" || trackEntry.animation.name === "Xia" || trackEntry.animation.name === "Fan" || trackEntry.animation.name === "Zheng") {
                self.callback();
            }
        });
    },

    fanPai: function fanPai() {
        this.isFan = true;
        if (this.state === "Bei") {
            this.Puke.setAnimation(0, "Fan", false);
            this.Puke.addAnimation(0, "Zheng", false);
        } else if (this.state === "Fan") {
            this.Puke.addAnimation(0, "Zheng", false);
        }
        this.Puke.timeScale = this.ScaleTime * 2;
    },

    cancelFanPai: function cancelFanPai() {
        if (this.state === "Zheng") {
            return;
        }
        if (this.state === "Fan") {
            this.fanPai();
            return;
        }
        if (!this._rotateDelay) {
            this._rotateDelay = true;
            this.changCardModel();
        }
    },

    changCardModel: function changCardModel() {
        var self = this;
        this.Puke.setAnimation(0, "Bei", false);
        this.Puke.timeScale = this.ScaleTime;
        this.state = "Bei";
        this.isFan = false;
        this.playing = true;
        this.disy = 0;
        this.tmpDisy = 0;
        var rotation = cc.rotateBy(0.5, 90);
        this.PukeNode.runAction(cc.sequence(rotation, cc.callFunc(function () {
            self.modelIndex += 1;
            if (self.modelIndex >= 4) {
                self.modelIndex = 0;
            }
            self.initAnimation();
            self._rotateDelay = false;
        })));
    },

    onBtnCloseClicked: function onBtnCloseClicked() {
        this.fanPai();
    }
});

cc._RF.pop();