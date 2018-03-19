(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/hall/hallMoreGame.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a2429H8BIRKbKEWORRuoHyx', 'hallMoreGame', __filename);
// hall/script/hall/hallMoreGame.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var bg = this.node.getChildByName('back');
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    onBtnCloseClick: function onBtnCloseClick() {
        require('Audio').playEffect('hall', 'button_close.mp3');
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
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
        //# sourceMappingURL=hallMoreGame.js.map
        