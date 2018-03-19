(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/hall/script/fun/funEvent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '07632RDh6xGWIFO3zvl2YYX', 'funEvent', __filename);
// hall/script/fun/funEvent.js

"use strict";

var handlers = {};

var funEvent = {
    add: function add(tag, event, handler) {
        var logFlag = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (handlers[tag]) {
            fun.log("funEvent", "error: this tag has added " + tag);
            return;
        }
        handlers[tag] = {
            event: event,
            handler: handler
        };
        if (logFlag) {
            fun.log("funEvent", "add new event " + tag + event);
        }
    },
    getSum: function getSum() {
        var count = 0;
        for (var key in handlers) {
            count++;
        }
        return count;
    },
    remove: function remove(tag) {
        var logFlag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        delete handlers[tag];
        if (logFlag) {
            fun.log("funEvent", "remove event success " + tag);
        }
    },
    dispatch: function dispatch(event, data) {
        var logFlag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        for (var k in handlers) {
            if (handlers[k].event === event) {
                if (logFlag) {
                    fun.log("funEvent", "dispatch event " + k + event, data);
                }
                handlers[k].handler(data);
            }
        }
    },
    clearUp: function clearUp() {
        handlers = {};
    }
};

module.exports = funEvent;

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
        //# sourceMappingURL=funEvent.js.map
        