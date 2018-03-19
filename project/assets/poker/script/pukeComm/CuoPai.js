let PukeDefine = require("PukeDefine");
let PukeUtils  = require("PukeUtils");

cc.Class({
    extends: cc.Component,

    properties: {
        Background        : cc.Node,
        PukeNode          : cc.Node,
        Puke              : sp.Skeleton,
        CuoPaiTime        : 1000,        // 搓牌时间 单位:毫秒
        ScaleTime         : 1.2,         // 搓牌翻牌动画时间
        liangPaiScaleTime : 4,
    },

    startTouchFunc : function (event) {
        this.beganTime = Date.parse(new Date());
        if (!cc.sys.isNative) {
            this.beganPos  = event.getStartLocation();
            this.lastPos   = cc.p(this.beganPos.x, this.beganPos.y);
        }
    },
    moveTouchFunc : function (event) {
        if (cc.sys.isNative) {
            this.setDisy(event.touch.getDelta().y);
        } else {
            let movePos   = event.getLocation();
            let disy      = movePos.y - this.lastPos.y;
            this.setDisy(disy);
            this.lastPos  = cc.p(movePos.x, movePos.y);
        }
    },
    endCancelTouchFunc : function (event) {
        this.endTime = Date.parse(new Date());
        if (this.endTime - this.beganTime < this.CuoPaiTime) {
            if (cc.sys.isNative) {
                let disy = event.touch.getDelta().y;
                if (disy > 80) {
                    this.fanPai();
                    return;
                }
            } else {
                let pos  = event.getLocation();
                let disy = pos.y - this.beganPos.y;
                if (disy > 80) {
                    this.fanPai();
                    return;
                }
            }
        }
        this.cancelFanPai();
    },
    touchOn : function () {
        this.Background.on('touchstart',  this.startTouchFunc,     this);
        this.Background.on('touchmove',   this.moveTouchFunc,      this);
        this.Background.on('touchend',    this.endCancelTouchFunc, this);
        this.Background.on('touchcancel', this.endCancelTouchFunc, this);
    },
    touchOff : function () {
        this.Background.off('touchstart',  this.startTouchFunc,     this);
        this.Background.off('touchmove',   this.moveTouchFunc,      this)
        this.Background.off('touchend',    this.endCancelTouchFunc, this);
        this.Background.off('touchcancel', this.endCancelTouchFunc, this);
    },

    update : function (dt) {
        if (this.isFan) { return; }
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
            this.state   = "Bei";
            this.playing = true;
            this.disy    = 0;
        } else if (this.disy === 0) {
            this.Puke.timeScale = 0;
        }
    },

    onDestroy : function () {
        this.touchOff();
    },

    setDisy : function (disy) {
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

    initPuke : function (data) {
        this.pukeNumber = Math.abs(data.num) - 3 || 4;
        this.modelIndex = 0;
        this.callback   = data.cb;
        this.GameType   = data.GameType;
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

    initAnimation : function (type) {
        let self = this;
        this.playing = true;
        this.state   = "Bei";
        this.disy    = 0;
        this.tmpDisy = 0;
        let modelName = PukeDefine.PUKE['MODULE_NAME_'+this.GameType][this.modelIndex];
        let spName   = modelName + "/" + modelName + "_" + this.pukeNumber;
        let url      = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.FAN_PAI + spName;
        self.Puke.setAnimation(0, "Bei", false);
        PukeUtils.LoadRes(url, "sp.SkeletonData", function(res){
            self.Puke.skeletonData = res;
            self.Puke.setAnimation(0, "Bei", false);
            self.PukeNode.rotation = 0;
            if(type && type === "liangPai"){
                self.fanPai();
                self.touchOff();
            } else {
                self.touchOn();
            }
        });
        this.Puke.setCompleteListener(trackEntry => {
            if (trackEntry.animation.name === "Shang" || 
                trackEntry.animation.name === "Xia"   || 
                trackEntry.animation.name === "Fan"   ||
                trackEntry.animation.name === "Zheng" ){
                self.callback();
            }
        });
    },

    fanPai : function () {
        this.isFan = true;
        if (this.state === "Bei") {
            this.Puke.setAnimation(0, "Fan", false);
            this.Puke.addAnimation(0, "Zheng", false);
        } else if (this.state === "Fan") {
            this.Puke.addAnimation(0, "Zheng", false);
        }
        this.Puke.timeScale = this.ScaleTime * 2;
    },

    cancelFanPai : function () {
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

    changCardModel : function () {
        let self = this;
        this.Puke.setAnimation(0, "Bei", false);
        this.Puke.timeScale = this.ScaleTime;
        this.state   = "Bei";
        this.isFan   = false;
        this.playing = true;
        this.disy    = 0;
        this.tmpDisy = 0;
        let rotation = cc.rotateBy(0.5, 90);
        this.PukeNode.runAction(cc.sequence(rotation, cc.callFunc(function(){
            self.modelIndex += 1;
            if (self.modelIndex >= 4) {
                self.modelIndex = 0;
            }
            self.initAnimation();
            self._rotateDelay = false;
        })));
    },

    onBtnCloseClicked : function () {
        this.fanPai();
    }
});