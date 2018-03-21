cc.Class({
    extends: cc.Component,

    properties: {
        saiziPerfab: {
            type: cc.Prefab,
            default: null,
        },

        disbandRoomPerfab: {
            type: cc.Prefab,
            default: null,
        }
    },

    onLoad () {
        fun.event.add('commonWahuaSaiziEnd', 'wahuaSaiziEnd', this.initSaizi.bind(this));
        fun.event.add('commonWahuaDisbandRoom', 'wahuaDisbandRoom', this.initDisbandRoom.bind(this));
    },

    onDestroy() {
        fun.event.remove('commonWahuaSaiziEnd');
        fun.event.remove('commonWahuaDisbandRoom');
    },

    initSaizi(data) {
        let saizi = cc.instantiate(this.saiziPerfab);
        saizi.parent = this.node;
        saizi.getComponent('mjSaiziUI').wahuaPlay(data.point, function(){
            data.callback();
            saizi.destroy();
        }, this);
    },

    initDisbandRoom(data) {
        cc.log('--- initDisbandRoom ---')
        if (!this.disbandRoom) {
            this.disbandRoom = cc.instantiate(this.disbandRoomPerfab);
            this.disbandRoom.parent = this.node;
        }
        this.disbandRoom.getComponent('whVotingPopUI').setData(data);
    },

});
