let className = 'org/cocos2dx/javascript/AppActivity';
let baiDu = {

    //-- 百度定位
    getBaiDuLocation : function(){
        if(cc.sys.os === cc.sys.OS_ANDROID)
            jsb.reflection.callStaticMethod(className, 'getBaiDuLocation', '()V');
        else if(cc.sys.os === cc.sys.OS_IOS)
            jsb.reflection.callStaticMethod('OCPhoneBaiDu', 'getBaiDuLocation');
    },

    //-- 百度定位 返回坐标
    reBaiDuLocation : function(lat, lng, locdesc){
        console.log('---* JS reBaiDuLocation *---');
        console.log('latitude:  ' + lat);
        console.log('longitude: ' + lng);
        console.log('locdesc:   ' + locdesc);
        if (parseInt(lat) === 0 && parseInt(lng) === 0) {
            return;
        }
        let userInfo = fun.db.getData('UserInfo');
        userInfo.location = {lat: lat, lng: lng, locdesc: locdesc};
        fun.db.setData('UserInfo', userInfo);
    },

    //-- 根据坐标算出两点之间的距离 lat-纬度 lng-经度
    getDistanceByPoints: function(points){
        /*
         * 格式要求
         * let points = {};
         * info.p1 = {lat:38.915, lng:115.404};
         * info.p2 = {lat:39.915, lng:116.404};
         * require('JSPhoneBaiDu').getDistanceByPoints(points);
         */
        let fD = function(a, b, c){
            for(; a > c;)
                a -= c - b;
            for(; a < b;)
                a += c - b;
            return a;
        }
        let jD = function(a, b, c){
            b != null && (a = Math.max(a, b));
            c != null && (a = Math.min(a, c));
            return a;
        }
        let yk = function(a){
            return Math.PI * a / 180;
        }
        let Ce = function(a, b, c, d){
            let dO = 6370996.81;
            return dO * Math.acos(Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(b - a));
        }
        let getDistance = function(a, b){
            if(!a || !b) return 0;
            a.lng = fD(a.lng, -180, 180);
            a.lat = jD(a.lat, -74, 74);
            b.lng = fD(b.lng, -180, 180);
            b.lat = jD(b.lat, -74, 74);
            return Ce(yk(a.lng), yk(b.lng), yk(a.lat), yk(b.lat));
        }
        return getDistance(points.p1, points.p2).toFixed(1); //单位: 米
    }
}

module.exports = baiDu;
