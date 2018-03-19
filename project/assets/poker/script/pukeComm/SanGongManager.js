let SanGongManager = {};
let PukeData       = require('PukeData');
let funUtils       = require('funUtils');
let PukeUtils      = require('PukeUtils');
let PukeDefine     = require('PukeDefine');
let Audio = require('Audio');

SanGongManager.initGame = function(gameUICB){
    this.gameUICB = gameUICB;
    
    this.UserInfo = fun.db.getData('UserInfo', true);
    this.MineUserId = this.UserInfo.UserId;
    this.MineSeat = this.getSeatByNumber(1);
    this.data = fun.db.getData('RoomInfo');
    this.MineIsMaster = this.getRoomMasterByRoomInfo();
    this.FirstEnterRoom = true;
    this.initRoomInfo();
    this.initSeatInfo();
    this.initQZhuangFunction();
    this.initListener();
}

SanGongManager.update = function (dt) {
    if(this.StartChooseZhuang){
        this.qzDtTime = (this.qzDtTime || 0) + dt;
        let chaTime = PukeDefine.QIANG_ZHUANG_WAIT_TIME - this.DingZhuangTime;
        if(this.qzDtTime >= chaTime){
            this.gameUICB.setBtnQZhuangActive(false);
            this.gameUICB.showHint(false);
            this.seatNum = this.QiangZhuangSeat.length;
            let qzPersonNum = this.seatNum === 0 ? this.ZeroZhuangSeat.length : this.seatNum;
            this.TurnZhuangTime = PukeDefine.QIANG_ZHUANG_TURN_TIME/(5*qzPersonNum);
            this.tzDtSingle = 0;
            this.tzDtMore = 0;
            this.TurnZhuangCount = 0;
            this.TurnZhuang = true;
            this.StartChooseZhuang = false;
            this.qzDtTime = 0;
        }
    }
    if(this.TurnZhuang){
        if(this.seatNum === 0){
            this.tzDtSingle += dt;
            if(this.tzDtSingle >= this.TurnZhuangTime){
                this.tzDtSingle -= this.TurnZhuangTime;
                this.TurnZhuangCount = this.TurnZhuangCount === this.ZeroZhuangSeat.length ? 1 : (this.TurnZhuangCount + 1);
                this.setZhuangFalse();
                let seat = this.getSeatByNumber(this.ZeroZhuangSeat[this.TurnZhuangCount-1]);
                seat.Zhuang.active = true;
            }
        } else if (this.seatNum >= 2) {
            this.tzDtMore += dt;
            if(this.tzDtMore >= this.TurnZhuangTime){
                this.tzDtMore -= this.TurnZhuangTime;
                this.TurnZhuangCount = this.TurnZhuangCount === this.seatNum ? 1 : (this.TurnZhuangCount + 1);
                this.setZhuangFalse();
                let seat = this.getSeatByNumber(this.QiangZhuangSeat[this.TurnZhuangCount - 1]);
                seat.Zhuang.active = true;
            }
        }
    }
}

SanGongManager.onDestroy  = function(){
    this.cleanListener();
    this.UserInfo.RoomId = 0;
    fun.db.setData('UserInfo', this.UserInfo);
    this.SeatArray = [];
    this.UserInfo = {};
    this.data = {};
    this.faPaiPukes = [];
    this.faPaiSeats = [];
    this.QiangZhuangSeat = [];
    this.ZeroZhuangSeat = [];
    this.copyDisbandPrefab = undefined;
    this.copyTotalAccount = undefined;
}

//-----------------------------------------------------------
//----- 座位号 调整
SanGongManager.updateSeatNumber = function (player) {
    let minePlayer = {};
    if (this.data.EnterRoom === 'enter') {
        for (let i in player) {
            let value = player[i];
            if (this.checkIsMineUserId(value.UserId)) {
                minePlayer = value;
            }
        }
    } else if (this.data.EnterRoom === 'create') {
        minePlayer = this.data;
    }
    this.SeatArray = new Array();
    for (let i=0; i<6; i++) {
        if (i === 0) {
            this.SeatArray[0] = minePlayer.RoomIdx;
        } else {
            this.SeatArray[i] = '';
        }
    }
    if (this.data.EnterRoom === 'enter') {
        for (let i in player) {
            let value = player[i];
            let cha = Math.abs(minePlayer.RoomIdx - value.RoomIdx);
            if (minePlayer.RoomIdx > value.RoomIdx) {
                this.SeatArray[6-cha] = value.RoomIdx;
            } else if (minePlayer.RoomIdx < value.RoomIdx) {
                this.SeatArray[cha] = value.RoomIdx;
            }
        }
    }
}
//----- 根据 RoomIdx 返回座位号
SanGongManager.getSeatNumberByRoomIdx = function (roomIdx) {
    for (let i = 0; i < this.SeatArray.length; i++) {
        if (this.SeatArray[i] === roomIdx) {
            return i+1;
        }
    }
    return roomIdx + 1;
}
//----- 根据 座位号 获取 Seat
SanGongManager.getSeatByNumber = function (num) {
    return this.gameUICB.getSeatByNumber(num);
}
//----- 根据 UserId 获取 Seat
SanGongManager.getSeatByUserId = function (id) {
    for (let i=1; i<=6; i++) {
        let seat = this.getSeatByNumber(i);
        if (parseInt(seat.UserId) === parseInt(id)) {
            return seat;
        }
    }
}
//----- 根据 牌ID 取牌
SanGongManager.getPukeSpriteById = function (id) {
    let paiId = id === 'pai' ? id : (Math.abs(id) - 3);
    return this.gameUICB.getPukeSpriteById(paiId);
}
//----- 清空 座位 信息
SanGongManager.cleanSeatData = function () {
    for(let i=1; i<=6; i++){
        let seat = this.getSeatByNumber(i);
        seat.Readying.active = false;
        for(let j=1; j<=3; j++){
            seat['Puke'+j].active = false;
        }
        seat.ShuZi.active = false;
        seat.YaBox.active = false;
        seat.Ying.active  = false;
        seat.Shu.active   = false;
    }
}
//----- 金币押注动画
SanGongManager.pushGold = function (seatNumber, goldNum) {
    this.gameUICB.getGoldsNode().active = true;
    let min = 2, max = 8, divisor = 12;
    for (let j=0; j<PukeDefine.PUSH_GOLD_NUMBER; j++) {
        let copyGold = this.gameUICB.getFromGoldPool();
        this.gameUICB.getGoldsNode().getChildByName('seat'+seatNumber).addChild(copyGold);
        let startPos = PukeDefine.POSITION.GOLD[seatNumber].START_POS;
        copyGold.setScale(0.6);
        copyGold.setPosition(cc.p(startPos.x, startPos.y));
        let time     = funUtils.random(min, max)/divisor;
        let endPos   = PukeDefine.POSITION.GOLD[seatNumber].END_POS;
        let randPx   = endPos.x + funUtils.random(-30, 30);
        let randPy   = endPos.y + funUtils.random(-30, 30);
        let distance = PukeUtils.pGetDistance(startPos, cc.p(randPx, randPy));
        let intCen   = Math.floor(distance/time);
        copyGold.setLocalZOrder(1000 - intCen);
        let moveto   = cc.moveTo(time, cc.p(randPx, randPy));
        moveto.easing(cc.easeSineInOut());
        copyGold.stopAllActions();
        copyGold.runAction(moveto);
    }
    Audio.playEffect('pork', 'gold.wav');
}
//----- 金币回收动画
SanGongManager.callInGold = function (winSeats) {
    this.gameUICB.getGoldsNode().active = true;
    let self = this;
    let overTime = 0;
    let min = 2, max = 10, min2 = 5, max2 = 15, divisor = 15;
    let zhuangSeatNumber = this.getSeatNumberByRoomIdx(this.CurrentZhuang);
    let zhuangStartPos = PukeDefine.POSITION.GOLD[zhuangSeatNumber].START_POS;
    for (let i=1; i<=6; i++) {
        let seat = this.getSeatByNumber(i);
        if (seat.RoomIdx != this.CurrentZhuang) {
            let goldSeat = this.gameUICB.getGoldsNode().getChildByName('seat'+i);
            if (goldSeat.childrenCount > 0) {
                for (let i=0; i<goldSeat.children.length; ++i) {
                    let gold = goldSeat.children[i];
                    let time = funUtils.random(min, max)/divisor;
                    overTime = Math.max(time, overTime);
                    let moveto = cc.moveTo(time, cc.p(zhuangStartPos.x, zhuangStartPos.y));
                    moveto.easing(cc.easeSineInOut());
                    gold.runAction(cc.sequence(moveto, cc.callFunc(function(){
                        self.gameUICB.putInGoldPool(gold);
                    })));
                }
            }
        }
    }
    Audio.playEffect('pork', 'gold.wav');
    this.gameUICB.scheduleOnceFunc(function(){
        let isZhuangShu = false;
        for (let i in winSeats) {
            let winSeat = winSeats[i];
            if (winSeat.RoomIdx != self.CurrentZhuang) {
                let goldWinSeat = self.gameUICB.getGoldsNode().getChildByName('seat'+winSeat.SeatNumber);
                let goldStartPos = PukeDefine.POSITION.GOLD[winSeat.SeatNumber].START_POS;
                for (let j in winSeat.Slice) {
                    let value = winSeat.Slice[j];
                    let maxTime = 0;
                    isZhuangShu = true;
                    for (let k = 0; k < PukeDefine.PUSH_GOLD_NUMBER; ++k) {
                        let gold = self.gameUICB.getFromGoldPool();
                        goldWinSeat.addChild(gold);
                        gold.setPosition(cc.p(zhuangStartPos.x, zhuangStartPos.y));
                        let time = funUtils.random(min2, max2)/divisor;
                        maxTime = Math.max(time, maxTime);
                        let moveto = cc.moveTo(time, cc.p(goldStartPos.x, goldStartPos.y));
                        moveto.easing(cc.easeSineInOut());
                        gold.stopAllActions();
                        gold.runAction(cc.sequence(moveto, cc.callFunc(function(){
                            for (let m = 0; m < goldWinSeat.children.length; ++m) {
                                let gold = goldWinSeat.children[m];
                                self.gameUICB.putInGoldPool(gold);
                            }
                        })));
                    }
                    self.gameUICB.scheduleOnceFunc(function(){
                        self.gameUICB.getGoldsNode().active = false;
                        for (let num in goldWinSeat.children) {
                            self.gameUICB.putInGoldPool(goldWinSeat.children[num]);
                        }
                    }, maxTime*0.98)
                }
            }
        }
        if (isZhuangShu) {
            Audio.playEffect('pork', 'gold.wav');
        }
    }, overTime);
}
//----- 发牌动画
SanGongManager.faPaiAnimation = function (index) {
    Audio.playEffect('pork', 'fapai.mp3');
    let self = this;
    if (index >= this.faPaiPukes.length) {
        this.gameUICB.scheduleOnceFunc(function(){
            self.setState('搓牌中');
            self.gameUICB.setBtnCuoPaiActive(true);
        }, PukeDefine.SEND_CARD_COMPLETE_TIME)
    } else {
        let self = this;
        let time = PukeDefine.SEND_CARD_SINGLE_TIME;
        let copyPuke = this.gameUICB.getPukePool().get();
        copyPuke.setPosition(0, 0);
        this.gameUICB.getChildNode().getChildByName('puke').addChild(copyPuke);
        let px = this.faPaiPukes[index].x, py = this.faPaiPukes[index].y;
        let moveto = cc.moveTo(time, cc.p(px, py));
        moveto.easing(cc.easeSineInOut());
        copyPuke.runAction(cc.sequence(moveto, cc.callFunc(function(){
            self.gameUICB.getPukePool().put(copyPuke);
            let count = index%3 + 1;
            let seat = self.faPaiSeats[Math.floor(index/3)]
            let seatPuke = seat.getChildByName('puke'+count);
            if (self.checkIsMineUserId(seat.UserId) && count != 3) {
                let puke = self.faPaiSeats.myCards[count-1];
                seatPuke.getComponent(cc.Sprite).spriteFrame = self.getPukeSpriteById(puke);
            } else {
                seatPuke.getComponent(cc.Sprite).spriteFrame = self.getPukeSpriteById('pai');
            }
            seatPuke.active = true;
            index += 1;
            self.faPaiAnimation(index);
        })));
    }
}
//----- 搓牌动画
SanGongManager.cuoPaiAnimation = function (type, showType) {
    this.gameUICB.setBtnCuoPaiActive(false);
    this.isCuoPaiComplete = false;
    if (this.copyCuoPai) {
        this.gameUICB.getCuoPaiPool().put(this.copyCuoPai);
    }
    let self = this;
    let seat = this.getSeatByNumber(1);
    let pukeCuo = seat.getChildByName('puke3');
    pukeCuo.active = false;
    this.copyCuoPai = this.gameUICB.getCuoPaiPool().get();
    this.copyCuoPai.setPosition(0, 0);
    this.gameUICB.getChildNode().getChildByName('cuopai').addChild(this.copyCuoPai);
    let data  = {};
    data.from = type;
    data.GameType = 'SANGONG';
    data.num  = this.CuoPaiNumber;
    data.cb   = function(){
        if (type != 'showCard') {
            fun.net.send('ShowCard', '');
        }
        if (showType !== undefined) {
            self.showTypeFunc(seat, showType);
        }
        self.isCuoPaiComplete = true;
        pukeCuo.active = true;
        pukeCuo.getComponent(cc.Sprite).spriteFrame = self.getPukeSpriteById(data.num);
        self.gameUICB.getCuoPaiPool().put(self.copyCuoPai);
    };
    this.copyCuoPai.getComponent('CuoPai').initPuke(data);
}
//----- 初始化抢庄
SanGongManager.initQZhuangFunction = function () {
    if (this.data != undefined && this.data.DZhuang === 3) {
        this.IsFreeQiangZhuang = true;
        this.QiangZhuangSeat   = new Array();
        this.ZeroZhuangSeat    = new Array();
        this.TurnZhuang        = false;
    }
}
//----- 游戏重连 准备显示
SanGongManager.reconnectReadyFunc = function () {
    this.FirstEnterRoom = false;
    if (this.data.Players != undefined) {
        for (let i in this.data.Players) {
            let player = this.data.Players[i];
            let seat = this.getSeatByUserId(player.UserId);
            if (player.Ready) {
                seat.Readying.active = true;
            }
            if (this.checkIsMineUserId(player.UserId) && !player.Ready) {
                this.gameUICB.setBtnReadyActive(true);
            }
        }
    }
}
//----- 检测是否为房主
SanGongManager.getRoomMasterByRoomInfo = function () {
    if (this.data.RoomIdx !== undefined) {
        return this.data.RoomIdx === 0 ? true : false;
    } else {
        let players = this.data.Players;
        for (let key in players) {
            if (this.checkIsMineUserId(players[key].UserId)) {
                return players[key].RoomIdx === 0 ? true : false;
            }
        }
    }
}
//----- 庄显示为 false
SanGongManager.setZhuangFalse = function () {
    for (let i = 0; i < 6; ++i) {
        let seat = this.getSeatByNumber(i+1);
        seat.Zhuang.active = false;
    }
}
//----- 检测是否为自己的UserId
SanGongManager.checkIsMineUserId = function(id){
    if (parseInt(id) === this.MineUserId)
        return true;
    else
        return false;
}
//----- 设置游戏状态
SanGongManager.setState = function(content){
    for(let i=0; i<6; ++i){
        let seat = this.getSeatByNumber(i+1);
        if (seat.active) {
            if (!content) {
                seat.State.active = false;
                this.gameUICB.jumpTextAnim(false);
            } else {
                let seatNumber = this.getSeatNumberByRoomIdx(this.CurrentZhuang);
                if (content === '下注中' && seatNumber === i+1)
                    console.log('庄家不下注');
                else
                    this.gameUICB.setState({state: seat.State, content: content, color: 0});
            }
        }
    }
}

//-----------------------------------------------------------
//----- 初始化 房间 信息
SanGongManager.initRoomInfo = function () {
    this.gameUICB.setGameStatus(this.data.Status);
    this.RoundJuShu = this.data.Round;
    this.TotalJuShu = this.data.Total;
    this.DiFen      = PukeDefine.ROOM_INFO.DI_FEN[this.data.DFeng-1];
    this.ZhuangWei  = PukeDefine.ROOM_INFO.ZHUANG_WEI[this.data.DZhuang-1];
    this.Charge     = PukeDefine.ROOM_INFO.COST[this.data.Charge-1];
    this.IsMaster = PukeDefine.ROOM_INFO.ISMASTER[this.getRoomMasterByRoomInfo() ? 0 : 1];
    let msg = {
        RoomId    : this.data.RoomId,
        Round     : this.RoundJuShu,
        Total     : this.TotalJuShu,
        ZhuangWei : this.ZhuangWei,
        DiFen     : this.DiFen[0],
        IsMaster  : this.IsMaster,
    }
    this.gameUICB.initRoomInfo(msg);
}
//----- 初始化 座位 信息
SanGongManager.initSeatInfo = function () {
    if (this.data.EnterRoom === 'create') {
        this.updateSeatNumber();
        this.gameUICB.setCreateSeat();
    } else if (this.data.EnterRoom === 'enter') {
        this.CardsMap = {};
        this.updateSeatNumber(this.data.Players);
        for(let i=0; i<this.data.Players.length; i++){
            let value      = this.data.Players[i];
            let roomIdx    = value.RoomIdx;
            let seatNumber = this.getSeatNumberByRoomIdx(roomIdx);
            let seat = this.getSeatByNumber(seatNumber);
            if (!value.OnLine){
                seat.Mask.active = true;
            }
            this.gameUICB.setEnterSeat(seatNumber, value);
            if (value.Cards && value.Cards[0] != 0) {
                this.CardsMap[value.UserId] = {};
                this.CardsMap[value.UserId].Cards = value.Cards;
                if(value.Cards.length === 2){
                    for(let i=1; i<=3; i++){
                        let puke = this.getPukeSpriteById('pai');
                        seat['Puke'+i].active = true;
                        seat['Puke'+i].getComponent(cc.Sprite).spriteFrame = puke;
                    }
                } else if (value.Cards.length === 3){
                    for(let i=1; i<=3; i++){
                        let puke = this.getPukeSpriteById(value.Cards[i-1]);
                        seat['Puke'+i].active = true;
                        seat['Puke'+i].getComponent(cc.Sprite).spriteFrame = puke;
                    }
                }
            }
            if (this.checkIsMineUserId(value.UserId)) {
                this.RecentYaZhu = value.Zhu === 0 ? 1 : value.Zhu;
            }
        }
        if (this.data.Zhuang > -1) {
            this.CurrentZhuang = this.data.Zhuang;
            for(let i=1; i<=6; i++){
                let seat = this.getSeatByNumber(i);
                if(seat.RoomIdx === this.data.Zhuang){
                    seat.Zhuang.active = true;
                    seat.ZhuangSp.setAnimation(0, 'Zhong', false);
                }
            }
        }
    }
}
//----- 开始游戏准备
SanGongManager.startGameReady = function () {
    this.gameUICB.setGameStatus(6);
    this.gameUICB.setBtnInviteActive(false);
    for (let i=1; i<=6; i++){
        let seat = this.getSeatByNumber(i);
        seat.Readying.active = false;
        seat.YaBox.active = false;
    }
}

//-----------------------------------------------------------
// 监听函数初始化
SanGongManager.initListener = function () {
    this.ListenCBList = [];
    this.pListenCBList = [];
    let self = this;
    let listen = function(cmd, cb, isPingTai){
        if (isPingTai) {
            fun.net.pListen(cmd, cb);
            self.pListenCBList.push(cmd);
        } else {
            fun.net.listen(cmd, cb);
            self.ListenCBList.push(cmd);
        }
    }
    listen('EnterRoom', this.onEnterRoomAck.bind(this), true);
    listen('OnLine',    this.onOnLineAck.bind(this), true);
    listen('OffLine',   this.onOffLineAck.bind(this), true);
    listen('ReadyNext',          this.onReadyNextAck.bind(this));
    listen('Qzhuang',            this.onQZhuangAck.bind(this));
    listen('Zhuang',             this.onZhuangAck.bind(this));
    listen('YaZhu',              this.onYaZhuAck.bind(this));
    listen('SomeOneYaZhu',       this.onSomeOneYaZhuAck.bind(this));
    listen('StartGame',          this.onStartGameAck.bind(this));
    listen('ShowCard',           this.onShowCardAck.bind(this));
    listen('AccountOne',         this.onSingleAccountAck.bind(this));
    listen('AccountAll',         this.onTotalAccountAck.bind(this));
    listen('LeaveRoom',          this.onLeaveRoomAck.bind(this));
    listen('DisbandRoomResult',  this.onDisbandRoomResultAck.bind(this));
    listen('DisbandRoomVote',    this.onDisbandRoomVoteAck.bind(this));
}
SanGongManager.cleanListener = function(){
    for (let i in this.ListenCBList) {
        fun.net.rmListen(this.ListenCBList[i]);
    }
    for (let i in this.pListenCBList) {
        fun.net.rmPListen(this.pListenCBList[i]);
    }
    this.ListenCBList = [];
    this.pListenCBList = [];
}

//--- 加入房间返回通知
SanGongManager.onEnterRoomAck = function(msg){
    if (this.checkIsMineUserId(msg.Player.UserId)) return;
    if (this.SeatArray === undefined) return;
    let roomIdx = msg.Player.RoomIdx;
    let cha = Math.abs(this.SeatArray[0] - roomIdx);
    if (this.SeatArray[0] > roomIdx) {
        this.SeatArray[6-cha] = roomIdx;
    } else {
        this.SeatArray[cha] = roomIdx;
    }
    this.gameUICB.setEnterSeat(this.getSeatNumberByRoomIdx(roomIdx), msg.Player);
}
//--- 准备返回通知
SanGongManager.onReadyNextAck = function(msg){
    if (!msg) { return; }
    if (this.checkIsMineUserId(msg.UserId)) {
        this.gameUICB.setBtnReadyActive(false);
        this.MineSeat.Readying.active = true;
    } else {
        if (msg.UserId === 0) {
            if (this.FirstEnterRoom) {
                this.reconnectReadyFunc();
            } else {
                this.gameUICB.setBtnReadyActive(true);
            }
        } else {
            let seat = this.getSeatByUserId(msg.UserId);
            seat.Readying.active = true;
            seat.Ying.active = false;
            seat.Shu.active = false;
        }
    }
}
//--- 抢庄通知
SanGongManager.onQZhuangAck = function(msg){
    if (msg.RetCode != undefined) {
        if (msg.RetCode === 0) {
            this.gameUICB.setBtnQZhuangActive(false);
        }
        return;
    }
    this.cleanSeatData();
    if (msg.UserId === 0) {
        Audio.playEffect('pork', 'remind.mp3');
        this.setState('抢庄中');
        this.gameUICB.setBtnInviteActive(false);
        this.gameUICB.setBtnQZhuangActive(true);
        this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_QIANG_ZHUANG);
        for(let i=1; i<=6; i++){
            let seat = this.getSeatByNumber(i);
            if (seat.active) {
                this.ZeroZhuangSeat[this.ZeroZhuangSeat.length] = i;
            }
        }
        this.DingZhuangTime    = 0;
        this.StartChooseZhuang = true;
    } else {
        let seat = this.getSeatByUserId(msg.UserId);
        if (msg.Op === 0) {
            let seatNumber = seat.SeatNumber;
            this.QiangZhuangSeat[this.QiangZhuangSeat.length] = seatNumber;
            this.gameUICB.setState({state: seat.State, content: '已抢庄', color: 0});
        } else if (msg.Op === 1) {
            this.gameUICB.setState({state: seat.State, content: '不抢庄', color: 1});
        }
    }
}
//--- 下发庄家通知
SanGongManager.onZhuangAck = function(msg){
    let self = this;
    this.CurrentZhuang = msg.Zhuang;
    this.setState(false);
    this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_XIA_ZHU);
    this.cleanSeatData();
    let zhuangFunc = function(){
        self.setState('下注中');
        let zhuangSeat = self.getSeatByNumber(self.getSeatNumberByRoomIdx(msg.Zhuang));
        self.gameUICB.setBtnXuYaActive(self.checkIsMineUserId(zhuangSeat.UserId) ? false : true);
        self.startGameReady();
        self.gameUICB.setBtnQZhuangActive(false);
        self.setZhuangFalse();
        zhuangSeat.Zhuang.active = true;
        zhuangSeat.ZhuangSp.setAnimation(0, 'Zhong', false);
    }
    let resetFunc = function(){
        self.TurnZhuang        = false;
        self.ZeroZhuangSeat    = [];
        self.QiangZhuangSeat   = [];
        self.DingZhuangTime    = 0;
        self.StartChooseZhuang = false;
        self.qzDtTime          = 0;
    }
    if (this.IsFreeQiangZhuang && this.QiangZhuangSeat.length != 1) {
        this.DingZhuangTime = PukeDefine.QIANG_ZHUANG_WAIT_TIME;
        this.gameUICB.scheduleOnceFunc(function(){
            resetFunc();
            zhuangFunc();
        }, PukeDefine.QIANG_ZHUANG_TURN_TIME);
    } else if (this.IsFreeQiangZhuang && this.QiangZhuangSeat.length === 1) {
        resetFunc();
        zhuangFunc();
    } else {
        zhuangFunc();
    }
}
//--- 押注提示通知
SanGongManager.onYaZhuAck = function(msg){
    if (msg === undefined || msg.Zhus === null) { return; }
    if (msg.RetCode != undefined) { return; }
    if (this.data.DZhuang !== 3) {
        Audio.playEffect('pork', 'remind.mp3');
    }
    let self = this;
    this.gameUICB.setBtnXiaZhuActive(true);
    this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_XIA_ZHU);
    this.startGameReady();
    this.gameUICB.showXiaZhu(msg.Zhus);
    this.cleanSeatData();  //清理单局结算
    if (this.gameUICB.getIsXuYa() && this.RecentYaZhu) {
        this.gameUICB.scheduleOnceFunc(function(){
            if (self.RecentYaZhu === 1) {
                self.gameUICB.onBtnXiaZhuClicked('', 1);
            } else if (self.RecentYaZhu === 2) {
                self.gameUICB.onBtnXiaZhuClicked('', 2);
            } else if (self.RecentYaZhu === 3) {
                self.gameUICB.onBtnXiaZhuClicked('', 3);
            }
        }, PukeDefine.ZI_DONG_XU_YA_TIME);
    }
}
//--- 押注通知
SanGongManager.onSomeOneYaZhuAck = function(msg){
    if (this.checkIsMineUserId(msg.UserId)) {
        this.gameUICB.setBtnXiaZhuActive(false);
    }
    let seat = this.getSeatByUserId(msg.UserId);
    seat.YaBox.active = true;
    seat.YaZhu.string = msg.Zhu;
    this.gameUICB.setState({state: seat.State, content: '已下注', color: 0});
    this.pushGold(seat.SeatNumber, msg.Zhu);
}
//--- 开始游戏通知
SanGongManager.onStartGameAck = function(msg){
    let self = this;
    this.gameUICB.showHint(false);
    this.setState(false);
    this.isCuoPaiComplete = false;
    this.gameUICB.scheduleOnceFunc(function(){
        self.CardsMap = msg.CardsMap;
        let sortCardsMap = new Array();
        let seatNumber   = self.getSeatNumberByRoomIdx(self.CurrentZhuang);
        for (let userid in msg.CardsMap) {
            for (let i=1; i<=6; i++) {
                let seat = self.getSeatByNumber(i);
                if (seat.UserId === parseInt(userid)) {
                    let cha = seatNumber - seat.SeatNumber;
                    let idx = cha >= 0 ? (cha) : (6 - Math.abs(cha));
                    sortCardsMap[idx] = {};
                    sortCardsMap[idx].UserId = userid;
                    sortCardsMap[idx].Cards  = msg.CardsMap[userid].Cards;
                }
            }
        }
        let pukes = [], idx = -1, seats = [];
        for (let k in sortCardsMap) {
            let value = sortCardsMap[k];
            for (let i=1; i<=6; i++) {
                let seat = self.getSeatByNumber(i);
                seat.Readying.active = false;
                if (seat.UserId === parseInt(value.UserId)) {
                    seats.push(seat);
                    let pos = seat.getPosition();
                    if (i === 1) {
                        seats.myCards = value.Cards;
                        self.CuoPaiNumber = value.Cards[2];
                    }
                    for (let j=1; j<=3; j++) {
                        idx += 1;
                        let fuhao = j === 1 ? -1 : (j === 3 ? 1 : 0);
                        pukes[idx] = {};
                        pukes[idx].x = i === 1 ? (fuhao * 30) : (pos.x + fuhao * 30);
                        pukes[idx].y = i === 1 ? pos.y * 0.8 : pos.y - seat.getContentSize().width/1.58;
                    }
                }
            }
        }
        self.faPaiPukes = pukes;
        self.faPaiSeats = seats;
        self.faPaiAnimation(0);
    }, PukeDefine.SEND_CARD_DELAY);
}
//--- 显示牌通知
SanGongManager.onShowCardAck = function(msg){
    let seat = this.getSeatByUserId(msg.UserId);
    this.gameUICB.setState({state: seat.State, content: '已亮牌', color: 0});
    let showType = {Dian: msg.Dian, Bei: msg.Bei}
    if (msg.UserId === seat.UserId) {
        if (this.checkIsMineUserId(msg.UserId)) {
            this.CuoPaiNumber = msg.Card;
            if(!this.isCuoPaiComplete){
                this.cuoPaiAnimation('showCard', showType);
            } else {
                this.showTypeFunc(seat, showType);
            }
        } else {
            for (let id in this.CardsMap) {
                if (parseInt(id) === msg.UserId) {
                    for (let i = 1; i <= 2; i++){
                        let puke = this.getPukeSpriteById(this.CardsMap[id].Cards[i-1]);
                        seat['Puke'+i].getComponent(cc.Sprite).spriteFrame = puke;
                    }
                }
            }
            let puke = this.getPukeSpriteById(msg.Card);
            seat['Puke3'].getComponent(cc.Sprite).spriteFrame = puke;
            this.showTypeFunc(seat, showType);
        }
    }
}
//--- 点数倍数显示
SanGongManager.showTypeFunc = function (seat, value) {
    let anim  = value.Dian;
    let effectName;
    if (value.Bei === 1 || value.Bei === 2 || value.Bei === 3) {
        anim = value.Dian + 'dian';
        effectName = value.Dian;
    } else if (value.Bei === 4) {
        anim = 'Hun';
        effectName = 10;
    } else if (value.Bei === 5) {
        anim = 'Fei';
        effectName = 11;
    } else if (value.Bei === 6) {
        anim = 'Da';
        effectName = 12;
    } else if (value.Bei === 9) {
        anim = 'Tian';
        effectName = 13;
    }
    seat.ShuZi.active = true;
    seat.ShuZiSp.setAnimation(0, anim, false);
    if (this.checkIsMineUserId(seat.UserId)){
        let type = PukeDefine.NIUNIU_ROOM_INFO.PAI_JU_SCORE['SAN_GONG'][effectName];
        let sex = this.UserInfo.Sex === 1 ? 'male' : 'female';
        Audio.playEffect('pork', type+'.mp3', sex);
    }
}
//--- 单局结算通知
SanGongManager.onSingleAccountAck = function(msg){
    this.setState(false);
    let accountMap = msg.AccountMap;
    let userArr    = {};
    let winSeats   = new Array();
    for (let id in accountMap) {
        let value  = accountMap[id];
        let winSeat   = this.getSeatByUserId(id);
        winSeat.Slice = value.Slice;
        winSeats[winSeats.length] = winSeat;
        let loseSeatArr = new Array();
        for (let i in value.Slice) {
            let slice  = value.Slice[i];
            let loseId = slice.UserId;
            let score  = slice.Score;
            loseSeatArr[i] = this.getSeatByUserId(loseId);
            winSeat.Fen.string = parseInt(winSeat.Fen.string) + score;
            loseSeatArr[i].Fen.string = parseInt(loseSeatArr[i].Fen.string) - score;
            userArr[id] = userArr[id] ? (userArr[id] + score) : score;
            userArr[loseId] = userArr[loseId] ? (userArr[loseId] - score) : (-score);
        }
    }
    this.callInGold(winSeats);
    for(let id in userArr) {
        let value = userArr[id];
        let seat  = this.getSeatByUserId(id);
        if (value > 0) {
            seat.Ying.active      = true;
            seat.Shu.active       = false;
            seat.YingLabel.string = '+' + value;
        } else {
            seat.Ying.active      = false;
            seat.Shu.active       = true;
            seat.ShuLabel.string  = value;
        }
    }
    for (let id in msg.BeiDianMap) {
        let value = msg.BeiDianMap[id];
        let seat  = this.getSeatByUserId(id);
        if (!seat.ShuZi) {
            this.showTypeFunc(seat, value);
        }
    }
    this.RoundJuShu += 1;
    if (this.RoundJuShu <= this.TotalJuShu) {
        this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_READY);
        this.gameUICB.setBtnReadyActive(true);
        this.gameUICB.setJuShuText(this.RoundJuShu + '/' + this.TotalJuShu);
    }
}
//--- 总结算通知
SanGongManager.onTotalAccountAck = function(msg){
    msg.RoomId       = this.data.RoomId;
    msg.JuShu        = this.TotalJuShu;
    msg.DiFen        = this.DiFen[0];
    msg.ZhuangWei    = this.ZhuangWei;
    msg.highestScore = 0;
    let self = this;
    let count         = -1;
    let newData       = new Array();
    for (let id in msg.Accounts) {
        let value = msg.Accounts[id];
        let seat = this.getSeatByUserId(id);
        msg.highestScore    = Math.max(value, msg.highestScore);
        count++;
        newData[count]       = {};
        newData[count].id    = id;
        newData[count].score = value;
        // newData[count].name  = seat.Name.string;
        newData[count].name  = seat._Name;
        newData[count].head  = seat.HeadUrl;
        newData[count].left  = msg.RoomCards[id].Left;
        newData[count].lost  = msg.RoomCards[id].Lost;
    }
    newData.sort(function(a, b){ return a.score < b.score; });
    msg.sortAccounts = newData;

    this.gameUICB.showHint(PukeDefine.HINT_TEXT.WAIT_TOTAL_ACCOUNT);
    let time = PukeDefine.TOTAL_ACCOUNT_SHOW_TIME;
    if (this.copyDisbandPrefab) {
        this.copyDisbandPrefab.removeFromParent();
        time = 0.1;
    }
    this.copyTotalAccount = this.gameUICB.onTotalAccountAck();
    this.copyTotalAccount.setPosition(0, 0);
    this.gameUICB.setCountDownTime(true, time);
    this.gameUICB.scheduleOnceFunc(function(){
        self.gameUICB.setCountDownTime(false);
        self.gameUICB.showHint(false);
        self.gameUICB.getChildNode().getChildByName('totalaccount').addChild(self.copyTotalAccount);
        self.copyTotalAccount.getComponent('PukeAccount').initTotalAccount(msg);
    }, time);
}

// 离开(解散)房间
SanGongManager.onLeaveRoomAck = function(msg){
    if (msg.UserId && msg.UserId >= 0) {
        let seat = this.getSeatByUserId(msg.UserId);
        let pukeNumber = PukeDefine.GAME_TYPE[this.data.GameType].PUKE_NUMBER;
        this.gameUICB.resetSeat(seat.SeatNumber, pukeNumber);
    }
}
SanGongManager.onDisbandRoomResultAck = function(msg){
    let self = this;
    this.gameUICB.setMenuBgActive(false);
    if (msg.Disbanded) {
        this.gameUICB.scheduleOnceFunc(function(){
            if (!self.copyTotalAccount) {
                cc.director.loadScene('hall');
            }
        }, PukeDefine.DISBAND_ROOM_DELAY_TIME);
    } else {
        this.gameUICB.scheduleOnceFunc(function(){
            if (self.copyDisbandPrefab) {
                self.copyDisbandPrefab.active = false;
            }
        }, PukeDefine.DISBAND_ROOM_DELAY_TIME);
    }
}
SanGongManager.onDisbandRoomVoteAck = function(msg){
    if (!msg) { return; }
    if (msg.RetCode !== undefined) {
        if (msg.RetCode === 0) {
            cc.director.loadScene('hall');
        }
        return;
    }
    if (!this.copyDisbandPrefab) {
        this.copyDisbandPrefab = this.gameUICB.getDisband();
    }
    this.gameUICB.setMenuBgActive(false);
    this.copyDisbandPrefab.active = true;
    msg.GameType = 'sangong';
    for (let i = 1; i <= 6; i++) {
        let seat = this.getSeatByNumber(i);
        for (let id in msg.VoteInfo) {
            if (id == seat.UserId) {
                let state = msg.VoteInfo[id];
                msg.VoteInfo[id] = {};
                msg.VoteInfo[id].state = state;
                msg.VoteInfo[id].name = seat.Name.string;
                msg.VoteInfo[id].headUrl = seat.HeadUrl;
            }
        }
    }
    this.copyDisbandPrefab.getComponent('PukeDisband').disbandRoomInit(msg);
}
// 上线 离线
SanGongManager.onOnLineAck = function(msg){
    let seat = this.getSeatByUserId(msg.UserId);
    seat.Mask.active = false;
}
SanGongManager.onOffLineAck = function(msg){
    let seat = this.getSeatByUserId(msg.UserId);
    seat.Mask.active = true;
}

//-----------------------------------------------------------
//--- 押注大小
SanGongManager.YaZhuFunction = function (yanum) {
    this.RecentYaZhu = parseInt(yanum);
    fun.net.send('YaZhu', {Zhu : this.DiFen[yanum-1]}, function(rsp){
        if (rsp.RetCode !== undefined && rsp.RetCode != 0) {
            this.gameUICB.setBtnXiaZhuActive(false);
        }
    }.bind(this));
}
//--- 离开(解散)房间
SanGongManager.LeaveRoomFunction = function () {
    if (this.gameUICB.getGameStatus() === 1) {
        if (this.MineIsMaster) {
            fun.net.send('DisbandRoomVote', {OP : 1}, function(rsp){
                if (rsp.RetCode !== undefined && rsp.RetCode === 0) {
                    cc.director.loadScene('hall');
                }
            }.bind(this));
        } else {
            fun.net.send('LeaveRoom', {OP : 1}, function(rsp){
                if(rsp.Leave){
                    cc.director.loadScene('hall');
                }
            }.bind(this));
        }
    } else {
        fun.net.send('DisbandRoomVote', {OP : 1});
    }
}
//--- 准备
SanGongManager.ReadyFunction = function () {
    fun.net.send('ReadyNext', '', function(rsp){
        if (rsp.RetCode !== undefined && rsp.RetCode === 0) {
            this.gameUICB.setBtnReadyActive(false);
            this.MineSeat.Readying.active = true;
        }
    }.bind(this));
}
//--- 抢庄
SanGongManager.QZhuangFunction = function (type) {
    fun.net.send('Qzhuang', {OP : type}, function(rsp){
        if (rsp.RetCode !== undefined && rsp.RetCode === 0) {
            this.gameUICB.setBtnQZhuangActive(false);
        }
    }.bind(this));
}
//--- 微信分享
SanGongManager.wxShare = function () {
    let jushu    = this.TotalJuShu + '局';
    let difen    = '底分' + this.DiFen[0];
    let info     = {};
    info.title   = '三公-房间号：' + this.data.RoomId;
    info.content = jushu + ', ' + this.Charge + ', ' + this.ZhuangWei + ', ' + difen;
    require('JSPhoneWeChat').WxShareFriend(info);
}

module.exports = SanGongManager;