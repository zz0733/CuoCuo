(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/public/updatePanel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c4b36CCoAZERrOiDmL1h3IA', 'updatePanel', __filename);
// hall/script/public/updatePanel.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        progressNode: {
            type: cc.Node,
            default: null
        },

        btnUpdate: {
            type: cc.Node,
            default: null
        },

        gressNode: {
            type: cc.Node,
            default: null
        },

        content: {
            type: cc.Label,
            default: null
        },

        tipsNode: {
            type: cc.Node,
            default: null
        },

        sizeNode: {
            type: cc.Node,
            default: null
        },

        checkingUpdate: {
            type: cc.Node,
            default: null
        }
    },

    onLoad: function onLoad() {
        this.gressLabel = this.gressNode.getComponent(cc.Label);
        this.progressBar = this.progressNode.getComponent(cc.ProgressBar);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    onDisable: function onDisable() {
        this.animation.play(this.clips[1].name);
    },
    setVersionContent: function setVersionContent(data, updateCb) {
        this.content.string = data[0].replace(/\\n/g, "\n");
        this.updateCb = updateCb;
        this.btnUpdate.active = true;
        this.btnUpdate.once('click', this.onBtnUpdateClick, this);
        this.checkingUpdate.active = false;
    },
    setSourceSize: function setSourceSize(size) {
        this.tipsNode.active = false;
        this.gressNode.active = true;
        this.sizeNode.active = true;
        var sizeStr = size.toFixed(2);
        var cont = this.sizeNode.getChildByName('content');
        cont.getComponent(cc.Label).string = sizeStr;
        this.sizeNode.getChildByName('end').setPositionX(cont.getPositionX() + cont.getContentSize().width + 5);
    },
    onBtnUpdateClick: function onBtnUpdateClick() {
        require('Audio').playEffect('hall', 'button_nomal.mp3');
        if (this.updateCb) {
            this.updateCb();
        }
        this.tipsNode.active = true;
        this.progressNode.active = true;
        this.btnUpdate.active = false;
    },
    updateProgress: function updateProgress() {
        var percent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        this.progressBar.progress = percent;
        var percentStr = (percent * 100).toFixed(2) + "%";
        if (percentStr === "NaN%") {
            percentStr = '0%';
        }
        this.gressLabel.string = percentStr;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=updatePanel.js.map
        