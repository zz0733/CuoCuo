(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/hall/hallActivity.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3af18zJCWVGm621GklPs3ni', 'hallActivity', __filename);
// hall/script/hall/hallActivity.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var bg = this.node.getChildByName('back');
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        this._leftBox = bg.getChildByName('leftBox');
        this._rightBox = bg.getChildByName('rightBox');
        this._menuNum = 2;
        for (var i = 0; i < this._menuNum; ++i) {
            this._leftBox.getChildByName('btnActivity' + (i + 1)).on('click', this.onActivityMenuShow.bind(this, i + 1));
        }

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();

        var isApple = fun.gameCfg.releaseType === gameConst.releaseType.apple ? true : false;
        if (isApple) {
            this._leftBox.getChildByName('btnActivity2').active = false;
        }
    },
    onEnable: function onEnable() {
        this.animation.play(this.clips[0].name);
    },
    onActivityMenuShow: function onActivityMenuShow(count) {
        for (var i = 0; i < this._menuNum; ++i) {
            this._leftBox.getChildByName('btnActivity' + (i + 1)).active = true;
            this._leftBox.getChildByName('btnDown' + (i + 1)).active = false;
            this._rightBox.getChildByName('huodong' + (i + 1)).active = false;
        }
        this._leftBox.getChildByName('btnActivity' + count).active = false;
        this._leftBox.getChildByName('btnDown' + count).active = true;
        this._rightBox.getChildByName('huodong' + count).active = true;
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
        //# sourceMappingURL=hallActivity.js.map
        