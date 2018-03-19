(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/createRoom/createRoomSys.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'b71e9sPAzlHhY4qkWkNEf5A', 'createRoomSys', __filename);
// hall/script/createRoom/createRoomSys.js

'use strict';

var createSys = function createSys() {
    this.updataParentN = function (node, gameType) {
        this.gameType = gameType;
        this.allHideList = {};
        this.createN = node.getChildByName('back').getChildByName('down');
        this.btnCreateN = this.createN.getChildByName("btnCreateRoom");
        this.btnRechargeN = this.createN.getChildByName("btnRecharge");
        this.btnCreateN.on("touchend", this.onCreateClicked, this);
        this.btnRechargeN.on("touchend", this.onRechargeClicked, this);
        this.oldCreate = fun.utils.getCreateRoomData(gameType) || {};
    };
    //child 自行实现
    this.onCreateClicked = function () {};
    this.onInfoChange = function () {};
    this.onRechargeClicked = function () {
        this.context.showStore(this.gameType);
    };
    this._setClickScale = function () {
        var clickScale = 1.04;
        return function (btnNode) {
            btnNode.on("touchstart", function () {
                this.scale = clickScale;
            }, btnNode);
            btnNode.on("touchend", function () {
                this.scale = 1;
            }, btnNode);
            btnNode.on("touchcancel", function () {
                this.scale = 1;
            }, btnNode);
        };
    }();
    this._setClickHide = function (childN) {
        childN.hideList = [];
        childN._hideSome = function () {
            childN.hideList.forEach(function (item) {
                item.active = false;
            });
        };
        childN._showSome = function () {
            childN.hideList.forEach(function (item) {
                item.active = true;
            });
        };
    };
    this.initSwitchItem = function (nodeName, clickData, defaultIndex, infoKey) {
        var _this = this;

        var itemNode = this.createN.getChildByName(nodeName);
        itemNode.cilckList = [];
        itemNode.chooseItem = function (chooseIndex) {
            itemNode.cilckList.forEach(function (item) {
                item.getChildByName("checkmark").active = false;
            });
            if (this.lastItem) {
                this.lastItem._showSome();
            }
            var curItem = itemNode.cilckList[chooseIndex];
            curItem.getChildByName("checkmark").active = true;
            this.lastItem = curItem;
            this.setRoomInfo(infoKey, curItem.clickData);
        }.bind(this);

        var _loop = function _loop(i) {
            nIndex = i + 1;

            var childN = itemNode.getChildByName("toggle" + nIndex);
            _this._setClickScale(childN);
            _this._setClickHide(childN);
            childN.clickData = clickData[i];
            childN.on("touchend", function (event) {
                itemNode.chooseItem(i);
            });
            itemNode.cilckList.push(childN);
        };

        for (var i = 0; i < clickData.length; i++) {
            var nIndex;

            _loop(i);
        }
        if (this.oldCreate[infoKey]) {
            var self = this;
            defaultIndex = clickData.findIndex(function (x) {
                return x == self.oldCreate[infoKey];
            });
        }

        if (defaultIndex >= 0) {
            itemNode.chooseItem(defaultIndex);
        }
    };

    this.initSingleItem = function (nodeName, defaultVale, infoKey) {
        var itemNode = this.createN.getChildByName(nodeName);
        var chilckItem = itemNode.getChildByName("toggle1");
        this._setClickHide(chilckItem);
        this._setClickScale(chilckItem);
        itemNode.setValue = this.oldCreate[infoKey] != undefined ? this.oldCreate[infoKey] : defaultVale;
        itemNode.refresh = function () {
            chilckItem.getChildByName("checkmark").active = itemNode.setValue;
            this.setRoomInfo(infoKey, itemNode.setValue);
        }.bind(this);

        chilckItem.on("touchend", function () {
            itemNode.setValue = !itemNode.setValue;
            itemNode.refresh();
        });
        itemNode.refresh();
    };

    this.initExplainItem = function (exNode, key, localData) {
        this.listenList = this.listenList || {};
        this.listenList[key] = function (value) {
            exNode.getComponent(cc.Label).string = localData[key + value];
        }.bind(this);
    };

    this.initItemHideList = function (nodeName, nodeIndex, valueK, hideList) {
        var childN = this.createN.getChildByName(nodeName).getChildByName("toggle" + nodeIndex);
        hideList.forEach(function (item) {
            var hideN = this.createN.getChildByName(item.name).getChildByName("toggle" + item.index);
            childN.hideList.push(hideN);
        }.bind(this));
        this.allHideList[valueK] = childN;
        this.checkHideUpdate();
    };

    this.checkHideUpdate = function () {
        for (var k in this.allHideList) {
            this.allHideList[k]._showSome();
        }
        for (var _k in this.roomInfo) {
            var valueK = _k + this.roomInfo[_k];
            if (this.allHideList[valueK]) {
                this.allHideList[valueK]._hideSome();
            }
        }
    };

    this.getRoomInfo = function () {
        return this.roomInfo;
    };

    this.setRoomInfo = function (key, value) {
        this.roomInfo = this.roomInfo || {};
        this.roomInfo[key] = value;
        this.onInfoChange();
        this.listenList = this.listenList || {};
        if (this.listenList[key]) {
            this.listenList[key](value);
        }
        this.checkHideUpdate();
    };

    this.gotoStore = function () {};
};

module.exports = {
    new: function _new() {
        return new createSys();
    }
};

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
        //# sourceMappingURL=createRoomSys.js.map
        