cc.Class({
    extends: cc.Component,

    properties: {
        mask: {
            type: cc.Node,
            default: null,
        },

        content: {
            type: cc.Node,
            default: null,
        },

        contentLabel: {
            type: cc.Label,
            default: null,
        },
    },

    onLoad () {
        this.init();
    },


    init(){
        this.minx = this.mask.x - this.mask.width / 2 - 50;
        this.startx = this.content.x;
        this.isPlaying = false;
        this.sumdt = 0;
        this.inited = true
        this.currTime = Date.now();
        this.orignalPy = this.node.y;

        this.announceInfo = [];
        let data = fun.db.getData('AnnounceInfo') || [];
        data.forEach(function(value) {
            if (value.type !== 11) {
                value.nextShowTime = this.currTime;
                this.announceInfo.push(value);
            }
        }, this);
        fun.event.add('RoomGongGaoAnnounceInfo', 'AnnounceInfo', this.onAnnounceInfoEvent.bind(this));
        if (this.announceInfo.length === 0) {
            this.node.y = this.orignalPy * 1000;
        }
    },


    update(dt) {
        if(!this.inited){
            this.init();
        }
        this.sumdt += dt;
        if (this.sumdt >= 1) {
            this.currTime += 1000;
            this.sumdt -= 1;
        }

        if (this.isPlaying) {
            this.content.x -= 2;
            if (this.content.x + this.content.width <= this.minx) {
                for (let i = 0; i < this.announceInfo.length; i++) {
                    if (this.announceInfo[i].id === this.currid) {
                        this.announceInfo[i].nextShowTime = this.announceInfo[i].range * 1000 + this.currTime;
                        break;
                    } 
                }
                this.isPlaying = false;
            }
        } else {
            let find = false;
            for (let i = 0; i < this.announceInfo.length; i++) {
                if (this.announceInfo[i].nextShowTime <= this.currTime) {
                    find = true;
                    this.isPlaying = true;
                    this.currid = this.announceInfo[i].id;
                    this.content.x = this.startx;
                    this.contentLabel.string = this.announceInfo[i].content;
                    break;
                }
            }
            if (find) {
                this.node.y = this.orignalPy;
            } else {
                this.node.y = this.orignalPy * 1000;
            }
        }
    },

    onDestroy() {
        fun.event.remove('RoomGongGaoAnnounceInfo')
    },

    onAnnounceInfoEvent(data) {
        let tmp = [];
        data.forEach(function(value) {
            if (value.type !== 11) {
                value.nextShowTime = this.currTime;
                tmp.push(value);
            }
        }, this);
        this.announceInfo.forEach(function(value) {
            tmp.forEach(function(v, k) {
                if (v.id === value.id) {
                    tmp[k].nextShowTime = value.nextShowTime;
                }
            });
        });
        this.announceInfo = tmp;
        if (this.announceInfo.length === 0) {
            this.node.y = this.orignalPy * 1000;
        } else {
            this.node.y = this.orignalPy;
        }
    }
});
