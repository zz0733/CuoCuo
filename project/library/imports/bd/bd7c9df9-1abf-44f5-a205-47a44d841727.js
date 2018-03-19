"use strict";
cc._RF.push(module, 'bd7c935Gr9E9aIFR6RNhBcn', 'JSPhoneBaiDu');
// phone/JSPhoneBaiDu.js

'use strict';

var className = 'org/cocos2dx/javascript/AppActivity';
var baiDu = {

    //-- 百度定位
    getBaiDuLocation: function getBaiDuLocation() {
        if (cc.sys.os === cc.sys.OS_ANDROID) jsb.reflection.callStaticMethod(className, 'getBaiDuLocation', '()V');else if (cc.sys.os === cc.sys.OS_IOS) jsb.reflection.callStaticMethod('OCPhoneBaiDu', 'getBaiDuLocation');
    },

    //-- 百度定位 返回坐标
    reBaiDuLocation: function reBaiDuLocation(lat, lng, locdesc) {
        console.log('---* JS reBaiDuLocation *---');
        console.log('latitude:  ' + lat);
        console.log('longitude: ' + lng);
        console.log('locdesc:   ' + locdesc);
        if (parseInt(lat) === 0 && parseInt(lng) === 0) {
            return;
        }
        var userInfo = fun.db.getData('UserInfo');
        userInfo.location = { lat: lat, lng: lng, locdesc: locdesc };
        fun.db.setData('UserInfo', userInfo);
    },

    //-- 根据坐标算出两点之间的距离 lat-纬度 lng-经度
    getDistanceByPoints: function getDistanceByPoints(points) {
        /*
         * 格式要求
         * let points = {};
         * info.p1 = {lat:38.915, lng:115.404};
         * info.p2 = {lat:39.915, lng:116.404};
         * require('JSPhoneBaiDu').getDistanceByPoints(points);
         */
        var fD = function fD(a, b, c) {
            for (; a > c;) {
                a -= c - b;
            }for (; a < b;) {
                a += c - b;
            }return a;
        };
        var jD = function jD(a, b, c) {
            b != null && (a = Math.max(a, b));
            c != null && (a = Math.min(a, c));
            return a;
        };
        var yk = function yk(a) {
            return Math.PI * a / 180;
        };
        var Ce = function Ce(a, b, c, d) {
            var dO = 6370996.81;
            return dO * Math.acos(Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(b - a));
        };
        var getDistance = function getDistance(a, b) {
            if (!a || !b) return 0;
            a.lng = fD(a.lng, -180, 180);
            a.lat = jD(a.lat, -74, 74);
            b.lng = fD(b.lng, -180, 180);
            b.lat = jD(b.lat, -74, 74);
            return Ce(yk(a.lng), yk(b.lng), yk(a.lat), yk(b.lat));
        };
        return getDistance(points.p1, points.p2).toFixed(1); //单位: 米
    }
};

module.exports = baiDu;

cc._RF.pop();