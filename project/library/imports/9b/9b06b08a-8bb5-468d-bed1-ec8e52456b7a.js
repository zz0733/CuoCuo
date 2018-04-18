"use strict";
cc._RF.push(module, '9b06bCKi7VGjb7R7I5SRWt6', 'DDZ_Tools');
// poker/DDZ/Script/Common/DDZ_Tools.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var DDZTools = cc.Class({});

DDZTools.SortPoker = function (arr) {
    return arr.sort(function (a, b) {
        return a - b;
    });
};

module.exports = DDZTools;
cc.YL.DDZTools = DDZTools;

cc._RF.pop();