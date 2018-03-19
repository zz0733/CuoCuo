cc.Class({
    extends: cc.Component,

    properties: {
        noDataN     : cc.Node,
        listContentN: cc.Node,
        listItemP   : cc.Prefab,
    },
    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    start () {

    },

    // update (dt) {},

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    close () {
        require("Audio").playEffect("hall", "button_close.mp3");
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },

    show(reportList){
        this.noDataN.active = (reportList.length == 0);
        this.listContentN.length = reportList.length * 132;
        reportList.forEach(function(itemData, index){
            let itemNode = cc.instantiate(this.listItemP);
            this.updateItem(itemNode, itemData);
            itemNode.getChildByName("jushu").getComponent(cc.Label).string = (index + 1);
            this.listContentN.addChild(itemNode);
            itemNode.setPosition(cc.p(0, -170 - index * 132));
        }.bind(this))
    },


    updateItem(item, data){
        var mjDataMgr = require("mjDataMgr");
        for(let i =0; i<4; i++){
            let playerNode = item.getChildByName("player_"+i);
            playerNode.active = data[i];
            if(data[i]){
                let playerData = mjDataMgr.getInstance().getPlayerData(i);
                fun.utils.loadUrlRes(playerData.Icon, playerNode.getChildByName("icon"));
                playerNode.getChildByName("name").getComponent(cc.Label).string   =playerData.showName;
                var score = data[i].xdhs > 0 ? "+" +  data[i].xdhs :  data[i].xdhs;
                playerNode.getChildByName("fenshu").getComponent(cc.Label).string = score;
                playerNode.getChildByName("add").getComponent(cc.Label).string    = score;
                playerNode.getChildByName("zhuang").active                        = data[i].isZhuangJia;
                playerNode.getChildByName("add").active                           = data[i].xdhs > 0;
                playerNode.getChildByName("fenshu").active                        = !(data[i].xdhs > 0);
                var tagN = playerNode.getChildByName("tag");
                // if(tagN){
                    tagN.getChildByName("hu").active = data[i].ishu;
                    tagN.getChildByName("lz").active = false;  //data[i].islz; 周睿说不显示
                    tagN.getChildByName("zm").active = data[i].iszm;
                    tagN.getChildByName("by").active = data[i].isby;
                    tagN.getChildByName("dp").active = (!data[i].isby && data[i].isdp)
                // }
            }
        }
    },
});
