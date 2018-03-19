cc.Class({
    extends: cc.Component,

    properties: {
        min: {
            default: 2,
        },

        max: {
            default: 5,
        },
    },

    onLoad () {
        this.allReady = true;
        this.nextTime = fun.utils.random(this.min, this.max);
        this.node.children.forEach(function (v) {
            v.ready = true;
            let anim = v.getComponent(sp.Skeleton);
            if(anim) {
                anim.timeScale = 0;
                anim.setCompleteListener(function () {
                    v.ready = true;
                    anim.timeScale = 0;
                });
            }
            
        });
    },

    update (dt) {
        if (this.allReady) {
            this.nextTime -= dt;
            if (this.nextTime > 0) {
                return;
            }
            this.node.children.forEach(function (v) {
                v.ready = false;
                let anim =  v.getComponent(sp.Skeleton);
                if(anim) {
                    anim.timeScale = 1;
                }
                
            });
            this.allReady = false;
            this.nextTime = fun.utils.random(this.min, this.max);
        } else {
            let readySum = 0;
            this.node.children.forEach(function (v) {
                if (v.ready) {
                    readySum++;
                }
            });
            if (this.node.childrenCount === readySum) {
                this.allReady = true;
            }
        }
    },
});
