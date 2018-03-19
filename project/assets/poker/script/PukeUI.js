let PukeUtils  = require('PukeUtils');
let PukeDefine = require('PukeDefine');
let PukeData   = require('PukeData');
let Audio      = require('Audio');
let PukeCfg, PukeManager;

cc.Class({
    extends: cc.Component,

    properties: {
        ChildNode         : cc.Node,
        Background        : cc.Node,
        RoomInfoNode      : cc.Node,
        PukeAltas         : cc.SpriteAtlas,
        MenuBg            : cc.Node,
        Players           : cc.Node,
        Golds             : cc.Node,
        BtnReady          : cc.Node,
        BtnQiangZhuang    : cc.Node,
        BtnNotQiangZhuang : cc.Node,
        BtnCuoPai         : cc.Node,
        BtnLiangPai       : cc.Node,
        BtnInvite         : cc.Node,
        BtnLeave          : cc.Node,
        HintBack          : cc.Node,
        XiaZhuBtns        : cc.Node,
        BtnXuYa           : cc.Node,
        BtnTuiZhu         : cc.Node,
        BtnHead           : cc.Prefab,
        Puke              : cc.Prefab,
        Gold              : cc.Prefab,
        Skin              : cc.Prefab,
        PukeAccount       : cc.Prefab,
        CuoPai            : cc.Prefab,
        SetPrefab         : cc.Prefab,
        DisbandPrefab     : cc.Prefab,
        phoneStatus       : cc.Node,
    },

    onLoad: function () {
        fun.event.dispatch('Zhuanquan', {flag: false});
        cc.log(gameConst)
        if(fun.gameCfg.releaseType === gameConst.releaseType.apple){
            this.BtnInvite.active = false;
            this.BtnLeave.setPositionX(0);
        }
        this.RoomInfoNode.getChildByName('nnRoomInfo').active = false;
        this.RoomInfoNode.getChildByName('sgRoomInfo').active = false;
        this.RoomInfo = fun.db.getData('RoomInfo');
        this.GameType = this.RoomInfo.GameType;
        let PukeCfg = this.GameType === 2 ? require('SanGongCfg') : require('NiuNiuCfg');
        fun.net.setGameMsgCfg(PukeCfg);
        this.initSeat();
        this.XiaZhu    = new Array();
        for(let i=0; i<3; i++){
            this.XiaZhu[i] = this.XiaZhuBtns.getChildByName('btnXiaZhu'+(i+1));
        }
        PukeManager = this.GameType === 2 ? require('SanGongManager') : require('NiuNiuManager');
        PukeManager.initGame(this);
    },

    start: function(){
        let sg = this.Background.getChildByName('sangong');
        let nn = this.Background.getChildByName('niuniu');
        if (this.GameType === 2) {
            sg.active = true;
            nn.active = false;
        } else if (this.GameType === 4) {
            sg.active = false;
            nn.active = true;
        }
        this.Background.on('touchend', function () {
            if (this.MenuBg.active){
                this.MenuBg.active = false;
            }
            if (this._roomInfoUp !== undefined && this._roomInfoUp){
                this.onBtnRoomInfoClicked();
            }
        }, this);
        this.initPool();
        this.initNnRoomInfoDetail();
        this.initSgRoomInfoDetail();
        this.initState();
        fun.event.add('PukeUI_Chat', 'PukeChatUI', this.onPukeChatUI.bind(this));
        Audio.playMusic('pork', 'BGM150S.mp3');
    },

    update: function (dt) {
        if ((this.GameType === 2 && this.RoomInfo.DZhuang === 3) || (this.GameType === 4)) {
            PukeManager.update(dt);
        }
        if (this._isCountdownTime && this._CountdownTime > 0) {
            this._countDtTime += dt;
            if (this._countDtTime >= 1) {
                this._countDtTime -= 1;
                this._CountdownTime -= 1;
                this.HintBack.getChildByName('time').getComponent(cc.Label).string = this._CountdownTime;
                if (this._CountdownTime <= 0) {
                    this._isCountdownTime = false;
                }
            }
        }
        for(let i=0; i<6; i++){
            if (this._isJumpText[i]) {
                this._jumpDtTime[i] += dt;
                if(this._jumpDtTime[i] >= this._jumpTextTime){
                    this._jumpDtTime[i] -= this._jumpTextTime;
                    this._jumpTextNumber[i] = this._jumpTextNumber[i] === this._jumpTextLength[i] - 1 ? -2 : this._jumpTextNumber[i] + 1;
                    let jumpBy = cc.jumpBy(this._jumpTextTime, cc.p(0, 0), 20, 1);
                    if(this._jumpTextNumber[i] >= 0){
                        if (this._jumpTextArray[i][this._jumpTextNumber[i]] !== undefined) {
                            this._jumpTextArray[i][this._jumpTextNumber[i]].stopAction(jumpBy);
                            this._jumpTextArray[i][this._jumpTextNumber[i]].runAction(jumpBy);
                        }
                    }
                }
            }
        }
    },

    onDestroy : function(){
        fun.event.remove('PukeUI_Chat');
        PukeManager.onDestroy();
        Audio.stopMusic();
        this._jumpTextArray[i] = [];
    },

    //----- 根据 牌ID 取牌
    getPukeSpriteById : function (paiId) {
        if (paiId === 'pai') {
            return this.PukeAltas.getSpriteFrame('Paiback');
        } else {
            return this.PukeAltas.getSpriteFrame(paiId);
        }
    },
    //----- 根据座位号获取 Seat
    getSeatByNumber : function (num) {
        return this.Players.getChildByName('player' + num);
    },
    //----- 初始化对象池
    initPool : function () {
        this.GoldPool = new cc.NodePool(); //金币对象池
        for (let i = 0; i < PukeDefine.GOLD_POOL_NUMBER; ++i) {
            let gold = cc.instantiate(this.Gold);
            this.GoldPool.put(gold);
        }

        this.PukePool = new cc.NodePool(); //扑克对象池
        let pukePoolNumber = PukeDefine.GAME_TYPE[this.GameType].PUKE_NUMBER * 6;
        for (let i = 0; i < pukePoolNumber; ++i) {
            let puke = cc.instantiate(this.Puke);
            this.PukePool.put(puke);
        }

        this.CuoPaiPool = new cc.NodePool(); //搓牌对象池 只有一个
        let cuoPai = cc.instantiate(this.CuoPai);
        this.CuoPaiPool.put(cuoPai);
    },
    scheduleOnceFunc : function (func, time) {
        this.scheduleOnce(function(){
            func();
        }, time);
    },
    initState : function(){
        this._jumpTextArray = new Array();
        this._isJumpText = new Array();
        this._jumpDtTime = new Array();
        this._jumpTextNumber = new Array();
        this._jumpTextLength = new Array();
        this._jumpBy = new Array();
        this._jumpTextTime = PukeDefine.TEXT_JUMP_TIME;
        for (let i=0; i<6; ++i){
            this._jumpTextArray[i] = new Array();
            this._jumpBy[i] = new Array();  
        }
    },
    setState : function(msg){
        msg.state.active = true;
        let txt = msg.state.getChildByName('label');
        txt.getComponent(cc.Label).string = msg.content;
        let rgb0 = {r: 148, g: 151, b: 221, a: 255}; //do
        let rgb1 = {r: 190, g: 108, b: 53,  a: 255}; //not
        let color = msg.color === 0 ? rgb0 : rgb1;
        txt.color = new cc.Color(color);
        this.jumpTextAnim(txt, msg.content, color);
    },

    //----- 初始化座位
    initSeat : function () {
        let self = this;
        let pukeNumber   = PukeDefine.GAME_TYPE[this.GameType].PUKE_NUMBER;
        let pukePosition = PukeDefine.GAME_TYPE[this.GameType].PUKE_POSITION;
        this._spineCacheComplete = new Array();
        for(let i=1; i<=6; i++){
            let seat       = this.getSeatByNumber(i);
            let HeadBox    = seat.getChildByName('headBox');
            seat.HeadImg   = HeadBox.getChildByName('headImg');
            seat.Mask      = HeadBox.getChildByName('mask');
            seat.Name      = seat.getChildByName('name').getComponent(cc.Label);
            seat.Fen       = seat.getChildByName('fen').getChildByName('label').getComponent(cc.Label);
            seat.State     = seat.getChildByName('state');
            seat.YaBox     = seat.getChildByName('yaBox');
            seat.YaZhu     = seat.YaBox.getChildByName('yaZhu').getComponent(cc.Label);
            seat.Ying      = seat.getChildByName('ying');
            seat.YingLabel = seat.Ying.getChildByName('label').getComponent(cc.Label);
            seat.Shu       = seat.getChildByName('shu');
            seat.ShuLabel  = seat.Shu.getChildByName('label').getComponent(cc.Label);
            seat.ShuZi     = seat.getChildByName('shuzi');
            seat.ShuZiSp   = seat.ShuZi.getComponent(sp.Skeleton);
            if (this.GameType === 4) { //牛牛
                let url;
                if (i === 1) {
                    seat.ShuZi.setPosition(cc.p(490, -52));
                    seat.ShuZi.scale = 0.9;
                    url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.Niuniu_Dazi;
                } else {
                    seat.ShuZi.setPosition(cc.p(10, -190));
                    seat.ShuZi.scale = 1;
                    url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.Niuniu_Xiaozi;
                }
                PukeUtils.LoadRes(url, 'sp.SkeletonData', function(res){
                    seat.ShuZiSp.skeletonData = res;
                    self._spineCacheComplete[self._spineCacheComplete.length] = i;
                });
            } else if (this.GameType === 2) { //三公
                let url;
                if (i === 1) {
                    seat.ShuZi.setPosition(cc.p(475, -26));
                    seat.ShuZi.scale = 0.9;
                    url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.Sangong_Dazi;
                } else {
                    seat.ShuZi.setPosition(cc.p(20, -182));
                    seat.ShuZi.scale = 0.9;
                    url = PukeDefine.RESOURCE_FOLDER_PATH.SPINE.Sangong_Xiaozi;
                }
                PukeUtils.LoadRes(url, 'sp.SkeletonData', function(res){
                    seat.ShuZiSp.skeletonData = res;
                });
            }
            seat.Readying  = seat.getChildByName('readying');
            seat.ChatImg   = seat.getChildByName('chatImg');
            seat.Speaker   = seat.getChildByName('speaker');
            let who = i === 1 ? 'MINE_ACCOUNT' : 'OTHER_ACCOUNT';
            for (let num = 1; num <= 5; ++num) {
                seat['Puke'+num] = seat.getChildByName('puke' + num);
                if (num <= pukeNumber) {
                    let posx = PukeDefine.POSITION.PUKE[pukePosition][num][who].x;
                    seat['Puke'+num].setPositionX(posx);
                }
            }
            seat.Zhuang = seat.getChildByName('zhuang');
            seat.ZhuangSp = seat.Zhuang.getComponent(sp.Skeleton);
            if (i === 1) {
                seat.Zhuang.scale = 1.3;
                let DZhuangSp = seat.Zhuang.getChildByName('dingZhuang');
                DZhuangSp.setPositionX(DZhuangSp.getPositionX() - 20);
            }
            this.resetSeat(i);
        }
    },
    //----- 重置位置
    resetSeat : function (seatNumber) {
        let seat = this.getSeatByNumber(seatNumber);
        seat.active          = false;
        seat.State.active    = false;
        seat.Mask.active     = false;
        seat.YaBox.active    = false;
        seat.Shu.active      = false;
        seat.Ying.active     = false;
        seat.ShuZi.active    = false;
        seat.Readying.active = false;
        seat.ChatImg.active  = false;
        seat.Speaker.active  = false;
        for (let num = 1; num <= 5; ++num) {
            seat['Puke' + num].active = false;
        }
        seat.Zhuang.active   = false;
        seat.RoomIdx         = -1;
        seat.Ip              = '';
        seat.UserId          = -1;
        seat.Sex             = -1;
        seat.SeatNumber      = seatNumber;
        let uN = this.ChildNode.getChildByName('userinfo');
        for(let i = 0; i < uN.children.length; ++i){
            if (uN.children[i].getTag() === seatNumber) {
                uN.children[i].removeFromParent();
            }
        }
    },

    //----- 初始化房间信息
    initRoomInfo : function (msg) {
        this.Background.getChildByName('version').getComponent(cc.Label).string = gameConst.version;
        this.RoomInfoNode.getChildByName('roomid').getComponent(cc.Label).string = msg.RoomId;
        this.setJuShuText(msg.Round +'/'+ msg.Total);
        this.RoomInfoNode.getChildByName('zhuangwei').getComponent(cc.Label).string = msg.ZhuangWei;
        this.RoomInfoNode.getChildByName('difen').getComponent(cc.Label).string = msg.DiFen;
        this.BtnLeave.getChildByName('label').getComponent(cc.Label).string = msg.IsMaster;
        this.BtnReady.active = false;
        this.MenuBg.active   = false;
        this.showHint(false);
        this.setBtnXiaZhuActive(false);
        this.setBtnQZhuangActive(false);
        this.setBtnCuoPaiActive(false);
        this.setBtnInviteActive(false);
    },
    initSgRoomInfoDetail : function(){
        if (this.GameType !== 2) return;
        let roomInfo = this.RoomInfo;
        let sginfo = this.RoomInfoNode.getChildByName('sgRoomInfo');
        let sx = PukeDefine.ROOM_INFO.SHI_XIAN[roomInfo.TimeLimit];
        sginfo.getChildByName('shixian').getComponent(cc.Label).string = sx;
        let func = function(data){
            return data ? (data + '\n') : '';
        }
        let zsz = false, jzjr = false;
        for(let i=0; i<roomInfo.Special.length; ++i){
            if (roomInfo.Special[i] === 1) zsz = '涨缩注';
            if (roomInfo.Special[i] === 2) jzjr = '游戏开始后禁止加入';
        }
        let teshu = func(zsz) + func(jzjr);
        let teshuN = sginfo.getChildByName('teshu');
        teshuN.getComponent(cc.Label).string = teshu;
    },
    initNnRoomInfoDetail : function(){
        if (this.GameType !== 4) return;
        let roomInfo = this.RoomInfo.roomRule;
        let nninfo = this.RoomInfoNode.getChildByName('nnRoomInfo');
        let sx = '';//PukeDefine.ROOM_INFO.SHI_XIAN[roomInfo.timeLimit];
        nninfo.getChildByName('shixian').getComponent(cc.Label).string = sx;
        let kd = roomInfo.kanDou === 1 ? '坎斗(x5)' : false;
        let whn = roomInfo.wuHua === 1 ? '五花牛(x6)' : false;
        let zdn = roomInfo.zhaDan === 1 ? '炸弹牛(x8)' : false;
        let wxn = roomInfo.wuXiao === 1 ? '五小牛(x10)' : false;
        let func = function(data){
            return data ? (data + '\n') : '';
        }
        let wanfa = func(kd) + func(whn) + func(zdn) + func(wxn);
        let wanfaN = nninfo.getChildByName('wanfa');
        wanfaN.getComponent(cc.Label).string = wanfa;
        let bs = PukeDefine.NIUNIU_ROOM_INFO.TYPE_SCORE[roomInfo.typeScore - 1];
        let beishuN = nninfo.getChildByName('beishu');
        beishuN.setPositionY(wanfaN.getPositionY() - wanfaN.getContentSize().height + 20);
        beishuN.getComponent(cc.Label).string = bs;
        let xjtz = roomInfo.xianJia === 1 ? '闲家推注' : false;
        let jzjr = roomInfo.joinLimit === 1 ? '游戏开始后禁止加入' : '游戏开始后可以加入';
        let zsz = roomInfo.zhangSuo === 1 ? '涨缩注' : false;
        let sd = roomInfo.shunDou === 1 ? '顺斗' : false;
        let teshu = func(xjtz) + func(jzjr) + func(zsz) + func(sd);
        let teshuN = nninfo.getChildByName('teshu');
        teshuN.setPositionY(beishuN.getPositionY() - beishuN.getContentSize().height - 5);
        teshuN.getComponent(cc.Label).string = teshu;
    },
    //----- 创建房间房主座位
    setCreateSeat : function () {
        let seat = this.getSeatByNumber(1);
        seat.active = true;
        let UserInfo = fun.db.getData('UserInfo');
        cc.log(UserInfo)
        fun.utils.loadUrlRes(UserInfo.UserHeadUrl, seat.HeadImg);
        seat.Name.string = UserInfo.UserName;
        seat._Name       = UserInfo.UserName; //test
        seat.UserId      = UserInfo.UserId;
        seat.Fen.string  = 0;
        seat.RoomIdx     = 0;
        seat.Ip          = UserInfo.Ip;
        seat.Location    = UserInfo.location;
        seat.Sex         = UserInfo.UserSex;
        seat.HeadUrl     = UserInfo.UserHeadUrl;
        this.BtnReady.active = true;
        this.setBtnInviteActive(true);
        this.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
    },
    //----- 加入房间座位
    setEnterSeat : function (seatNumber, player) {
        let UserInfo = fun.db.getData('UserInfo');
        let seat = this.getSeatByNumber(seatNumber);
        seat.active = true;
        fun.utils.loadUrlRes(player.HeadUrl, seat.HeadImg);
        seat.Name.string = player.Name;
        seat._Name       = player.Name; //test
        seat.UserId      = player.UserId;
        seat.Fen.string  = player.Score;
        seat.RoomIdx     = player.RoomIdx;
        seat.Ip          = player.Ip ;
        seat.Location    = player.Address;
        seat.Sex         = player.Sex;
        seat.HeadUrl     = player.HeadUrl;
        if (player.Zhu <= 0) {
            seat.YaBox.active = false;
        } else {
            seat.YaBox.active = true;
            seat.YaZhu.string = player.Zhu;
        }

        let isMine = player.UserId === UserInfo.UserId ? true : false
        if (this.GameType === 2) { // 三公
            if (this.getGameStatus() === 1 || this.getGameStatus() === 2) {
                if (this.getGameStatus() === 1) {
                    this.setBtnInviteActive(true);
                }
                seat.Readying.active = player.Ready;
                if (isMine) {
                    this.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
                    this.BtnReady.active = !player.Ready;
                }
            } else if (this.getGameStatus() === 3 && isMine) {
                this.showHint(PukeDefine.HINT_TEXT.WAIT_QIANG_ZHUANG);
            } else if (this.getGameStatus() === 5 && isMine) {
                this.showHint(PukeDefine.HINT_TEXT.WAIT_XIA_ZHU);
            }
        } else if (this.GameType === 4) { // 牛牛
            if (this.getGameStatus() === 1 || this.getGameStatus() === 0) {
                if (this.getJuShuText().substring(0, 1) === '0' && this.getGameStatus() === 0) {
                    this.setBtnInviteActive(true);
                }
                if (isMine) {
                    this.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
                }
            }
            if (isMine) {
                if (player.newUser !== undefined && player.newUser && player.GamePhase > 1) {
                    this.showHint(PukeDefine.HINT_TEXT.WAIT_CURRENT_END);
                } else {
                    this.BtnReady.active = !player.Ready;
                }
            }
            if (this.getGameStatus() <= 1) {
                seat.Readying.active = player.Ready;
            } else {
                seat.Readying.active = false;
            }
        }
    },

    //----- 设置/获取 游戏状态 0/1-游戏未开始 2-开始游戏 3-游戏结束
    setGameStatus : function (status) {
        this.GameStatus = status;
    },
    getGameStatus : function () {
        return this.GameStatus;
    },
    //----- 点数/倍数Spine动画缓存完成
    getSpineCacheComplete : function () {
        return this._spineCacheComplete;
    },

    //----- 设置提示框显示信息
    showHint : function (content, id) {
        if (content) {
            this.HintBack.active = true;
            let con = this.HintBack.getChildByName('content');
            con.getComponent(cc.Label).string = content;
        } else {
            this.HintBack.active = false;
        }
    },
    setCountDownTime : function (active, time) {
        this.HintBack.getChildByName('time').active = active;
        this._countDtTime = 0;
        this._isCountdownTime = active;
        this._CountdownTime = time;
    },
    //----- 下注显示
    showXiaZhu : function (zhus) {
        if (zhus.length >= 3) { //BUG 当 > 3 时  应显示更多下注按钮
            for(let i=0; i<3; i++){
                this.XiaZhu[i].active = true;
                this.XiaZhu[i].getChildByName('label').getComponent(cc.Label).string = zhus[i];
                let posx = i === 0 ? -195 : (i === 1 ? 0 : 195)
                this.XiaZhu[i].setPositionX(posx);
            }
        } else if (zhus.length === 2) {
            this.XiaZhu[0].active = false;
            this.XiaZhu[1].active = true;
            this.XiaZhu[1].setPositionX(-120);
            this.XiaZhu[2].setPositionX(120);
            this.XiaZhu[1].getChildByName('label').getComponent(cc.Label).string = zhus[0];
            this.XiaZhu[2].getChildByName('label').getComponent(cc.Label).string = zhus[1];
        } else if (zhus.length === 1) {
            this.XiaZhu[0].active = false;
            this.XiaZhu[1].active = false;
            this.XiaZhu[2].setPositionX(0);
            this.XiaZhu[2].getChildByName('label').getComponent(cc.Label).string = zhus[0];
        }
    },
    //----- 玩家是否选择续押
    getIsXuYa : function () {
        return this.BtnXuYa.getComponent(cc.Toggle).isChecked;
    },
    //----- 单局结算后局数增加
    setJuShuText : function (text) {
        this.RoomInfoNode.getChildByName('jushu').getComponent(cc.Label).string = text;
    },
    getJuShuText : function () {
        return this.RoomInfoNode.getChildByName('jushu').getComponent(cc.Label).string;
    },

    //----- 获取 ChildNode
    getChildNode : function () {
        return this.ChildNode;
    },
    //----- 获取总结算 Prefab
    onTotalAccountAck : function () {
        return cc.instantiate(this.PukeAccount);
    },
    //----- 金币对象池操作
    putInGoldPool : function (msg) {
        this.GoldPool.put(msg);
    },
    getFromGoldPool : function () {
        return this.GoldPool.get();
    },
    //----- 获取金币父节点
    getGoldsNode : function () {
        return this.Golds;
    },
    //----- 获取扑克对象池
    getPukePool : function () {
        return this.PukePool;
    },
    //----- 获取搓牌的对象池
    getCuoPaiPool : function () {
        return this.CuoPaiPool;
    },
    //----- 获取解散房间 Prefab
    getDisband : function () {
        let copyDisband = cc.instantiate(this.DisbandPrefab);
        copyDisband.setPosition(cc.p(0, 0));
        copyDisband.parent = this.ChildNode.getChildByName('disband');
        return copyDisband;
    },

    //-------------------------------------------------------
    //--- 点击头像显示个人信息
    onBtnHeadClicked : function (sender, player) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let seat = this.getSeatByNumber(player);
        let data = {}
        data.name = seat.Name.string;
        data.id   = 'ID: ' + seat.UserId;
        data.addr = seat.Location === null ? '未开启定位' : seat.Location.locdesc;
        data.url  = seat.HeadUrl;
        data.isSelf  = parseInt(player) === 1 ? true : false;
        data.isNoLocation = true;
        data.selfUid = fun.db.getData('UserInfo').UserId;
        data.curUid  = seat.UserId;
        let head = cc.instantiate(this.BtnHead);
        let pos = PukeDefine.POSITION.DETAIL[player];
        head.setPosition(cc.p(pos.x, pos.y));
        head.getComponent('playerDetailUI').show(data);
        head.setTag(parseInt(player));
        head.parent = this.ChildNode.getChildByName('userinfo');
    },
    //--- 点击好友邀请
    onBtnInviteClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.wxShare();
    },
    //--- 点击设置
    onBtnSetClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.setMenuBgActive(false);
        let set = cc.instantiate(this.SetPrefab);
        set.setPosition(0, 0);
        set.getComponent('set').setGameType('pork');
        set.parent = this.ChildNode.getChildByName('userinfo');
    },
    //--- 点击换肤
    onBtnSkinClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.setMenuBgActive(false);
        this.copyPrefabActive(this.Skin, 'copySkin');
    },
    //--- 点击准备
    onBtnReadyClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.ReadyFunction();
    },
    //--- 点击抢庄/不抢庄
    onBtnQiangZhuangClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.QZhuangFunction(0);
    },
    onBtnNotQiangZhuangClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.QZhuangFunction(1);
    },
    //--- 点击下注
    onBtnXiaZhuClicked : function (sender, num) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.YaZhuFunction(num);
    },
    //--- 点击推注
    onBtnTuiZhuClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.TuiZhuFunction();
    },
    //--- 点击自动续押
    onBtnXuYaClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        let isXuYa = this.BtnXuYa.getComponent(cc.Toggle).isChecked;
        PukeData.setXuYa(isXuYa);
    },
    //--- 点击搓牌
    onBtnCuoPaiClicked : function (sender, type) {
        Audio.playEffect('hall', 'button_nomal.mp3');
        PukeManager.cuoPaiAnimation(type);
    },
    //--- 点击菜单栏
    onBtnMenuClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.MenuBg.active = !this.MenuBg.active;
    },
    //--- 点击显示房间详细信息
    onBtnRoomInfoClicked : function(){
        let roominfo = this.RoomInfoNode.getChildByName('roomInfo');
        let btn = this.RoomInfoNode.getChildByName('btnRoomInfo');
        let isUp = btn.getScaleY() < 0 ? true : false;
        this._roomInfoUp = isUp;
        let scaleX = isUp ? 1.5 : 2/3;
        let scaleY = isUp ? 3 : 1/3;
        let scaleBy = cc.scaleBy(0.1, scaleX, scaleY);
        roominfo.runAction(scaleBy);
        let pos = isUp ? {x: -500, y: -80} : {x: -555, y: 215}
        let moveTo = cc.moveTo(0.1, cc.p(pos.x, pos.y));
        btn.runAction(moveTo);
        if (this.GameType === 2) {
            let sg = this.RoomInfoNode.getChildByName('sgRoomInfo');
            sg.active = isUp;
        } else {
            this.scheduleOnce(function(){
                let nn = this.RoomInfoNode.getChildByName('nnRoomInfo');
                nn.active = isUp;
            }, 0.05);
        }
        btn.setScaleY(-(btn.getScaleY()));
    },
    
    //--- 点击离开(解散)房间
    onBtnLeaveClicked : function () {
        Audio.playEffect('hall', 'button_nomal.mp3');
        this.setMenuBgActive(false);
        PukeManager.LeaveRoomFunction();
    },

    //-------------------------------------------------------
    //-- 检测 Prefab 是否存在 存在则 Actice 否则 instantiate
    copyPrefabActive : function (prefab, copyPrefab, func) {
        if (this[copyPrefab]) {
            this[copyPrefab].active = true;
        } else {
            this[copyPrefab] = cc.instantiate(prefab);
            this[copyPrefab].setPosition(0, 0);
            this[copyPrefab].parent = this.ChildNode.getChildByName('userinfo');
            if (func) {
                func(this[copyPrefab]);
            }
        }
    },

    //-- 准备按钮是否显示
    setBtnReadyActive : function (active) {
        this.BtnReady.active = active;
    },
    //-- 抢庄按钮是否显示
    setBtnQZhuangActive : function (active) {
        this.BtnQiangZhuang.active    = active;
        this.BtnNotQiangZhuang.active = active;
    },
    //-- 邀请/离开按钮是否显示
    setBtnInviteActive : function (active) {
        if(fun.gameCfg.releaseType !== gameConst.releaseType.apple){
            this.BtnInvite.active = active;
        }
        this.BtnLeave.active  = active;
    },
    //-- 下注按钮是否显示
    setBtnXiaZhuActive : function (active) {
        this.XiaZhuBtns.active = active;
    },
    //-- 推注按钮是否显示
    setBtnTuiZhuActive : function (active) {
        this.BtnTuiZhu.active = active;
    },
    //-- 搓牌按钮是否显示
    setBtnCuoPaiActive : function (active) {
        this.BtnCuoPai.active   = active;
        this.BtnLiangPai.active = active;
    },
    //-- 菜单是否显示
    setMenuBgActive : function (active) {
        this.MenuBg.active = active;
    },
    //-- 自动续押是否显示
    setBtnXuYaActive : function (active) {
        this.BtnXuYa.active = active;
    },

    //-- 聊天消息
    onPukeChatUI : function(data){
        let fromSeat = PukeManager.getSeatByUserId(data.fromId);
        let toSeat = data.toId === null ? null : PukeManager.getSeatByUserId(data.toId)
        data.func(fromSeat, toSeat);
    },
    //-- 字体跳动
    jumpTextAnim : function(node, text, color){
        return;
        if (!node) {
            for(let i=0; i<6; ++i){
                this._isJumpText[i] = false;
                for(let j=0; j<this._isJumpText[i].length; ++j){
                    this._isJumpText[i][j].stopAction();
                }
            }
        } else {
            let sn = node.parent.parent.SeatNumber - 1;
            node.active = false;
            let len = text.length;
            let pos = node.getPosition();
            for(let i=0; i<len; ++i){
                let label;
                if (this._jumpTextArray[sn][i] === undefined){
                    this._jumpTextArray[sn][i] = new cc.Node('jumpText'+i);
                    label = this._jumpTextArray[sn][i].addComponent(cc.Label);
                } else {
                    label = this._jumpTextArray[sn][i].getComponent(cc.Label);
                }
                label.string = text.substring(i, i+1);
                label.fontSize = 30;
                this._jumpTextArray[sn][i].color = new cc.Color(color);
                this._jumpTextArray[sn][i].setPosition(cc.p(pos.x + i*25, pos.y));
                this._jumpTextArray[sn][i].parent = node.parent;
                this._jumpBy[sn][i] = cc.jumpBy(this._jumpTextTime, cc.p(0, 0), 20, 1);
            }
            this._jumpTextNumber[sn] = -1;
            this._jumpTextLength[sn] = len;
            this._jumpDtTime[sn] = 0;
            this._isJumpText[sn] = true;
        }
    }

});