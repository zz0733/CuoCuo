package protocol

type MsgRetCode struct {
	RetCode int
}

type MsgDisbandNotify struct {
	Disbanded bool /* true解散成功，false解散失败 */
}

type MsgDisbandVoteNotify struct {
	VoteInfo  map[int64]int
	BeginTime int64
	EndTime   int64
}

type MsgDisbandRoomVoteReq struct {
	OP int `json:"OP"` /* 操作，1：发起解散 2：投票同意解散 3：投票不同意解散 */
}

type MsgDisbandRoomVoteRsp struct {
	RetCode int
}

type MsgOutLineNotify struct {
	UserId int64 /* 进入房间的玩家ID */
}

type MsgOnLineNotify struct {
	UserId int64 /* 进入房间的玩家ID */
}

type MsgLeaveRoomNotify MsgOutLineNotify

type MsgReadyNextNotify struct {
	UserId int64 /* 进入房间的玩家ID */
}

type MsgCreateRoomReq struct {
	GameType int

	//RenShu       int8
	WanFa        int8 //房间玩法
	MoShi        int  //模式
	ShengPaiTime int8 //生牌阶段
	JuShu        int8 //局数选择
	ZhiFu        int8 //支付方式
	BaoPai       bool //是否包牌
	DingWei      bool //是否开启定位
}

type RoomOwner struct {
	UserId    int64
	RoomOrder int8
}

type MsgCreateRoomRsp struct {
	GameType int

	//RenShu       int8
	WanFa        int8 //房间玩法
	MoShi        int  //模式
	ShengPaiTime int8 //生牌阶段
	JuShu        int8 //局数选择
	ZhiFu        int8 //支付方式
	BaoPai       bool //是否包牌
	DingWei      bool //是否开启定位

	Owner RoomOwner
}

type MsgEnterRoomReq struct {
	RoomId int32
}

type RoomPlayer struct {
	UserId int64  //用户在游戏中的id
	Name   string // 玩家名称

	Sex       int    //用户性别
	HeadUrl   string //用户的头像
	Ip        string
	OnLine    bool
	RoomOrder int8
	Feng      int8 //玩家本门风

	Score int

	//	HandCount int
	//	AnGang    []int8
	//	MingGang  []int8
	//	Peng      []int8
	//	Chi       [][]int8
	//	Fan       []int8
}

// 创建房间回复
type MsgEnterRoomRsp struct {
	GameType int

	WanFa        int8 //房间玩法
	MoShi        int  //模式
	ShengPaiTime int8 //生牌阶段
	JuShu        int8 //局数选择
	ZhiFu        int8 //支付方式
	BaoPai       bool //是否包牌
	DingWei      bool //是否开启定位

	Round int //当前局数
	Quan  int //当前圈数

	Players []*RoomPlayer

	//	Hand []int8 //玩家手中的牌
}

type MsgEnterRoomNotify struct {
	UserId    int64  //用户在游戏中的id
	Name      string // 玩家名称
	Sex       int    //用户性别
	HeadUrl   string //用户的头像
	Ip        string
	RoomOrder int8
}

type MsgLeaveRoomRsp struct {
	Leave bool
}

// 本局庄家通知
type MsgZhuangNotify struct {
	UserId int64
	Quan int8
	Round int8
}

type PlayerPaiInfo struct {
	Mo       int8   //玩家摸到的牌
	Hand     []int8 //玩家手中的牌，数组第一个元素表示手牌数量
	AnGang   []int8
	MingGang []int8
	Peng     []int8
	Chi      [][]int8
	Fan      []int8
}

type LastCardInfo struct {
	UserId int64
	Type   int //１： 摸牌，２：打牌
	Card   int8
}

// 进入房间后若房间牌局开始下发的牌局通知
type MsgPaiJuInfoNotify struct {
	Left     int //剩余牌的数量
	LastCard LastCardInfo
	Players  map[int64]*PlayerPaiInfo
}

// 色子点数通知
type MsgSZDianShuNotify struct {
	DianShu []int
}

// 玩家初始牌
type MsgFaPaiNotify struct {
	Cards []int8
}

// 下发玩家摸牌
type MsgMoPaiNotify struct {
	UserId int64
	Card   int8
}

// 下发财神牌
type MsgCaiShenNotify struct {
	Card int8
}

// 将特殊牌翻到桌面上
type MsgShowPaiNotify struct {
	UserId int64
	Card   int8
}

// 翻出特殊牌后获取新牌
type MsgBuPaiNotify struct {
	UserId int64
	Card   int8
}

// 玩家能进行的操作通知
type MsgOpsNotify struct {
	Ops []int8
}

//// 玩家打牌通知 card为０时通知玩家打出手
//type MsgDaPaiNotify struct {
//	UserId int64
//	Card   int8
//}

// 玩家打牌请求
type MsgDaPaiReq struct {
	Card int8
}

// 玩家打牌通知
type MsgDaPaiNotify struct {
	UserId int64
	Card   int8 //为０时通知玩家该打牌
}

////　玩家胡牌
//type MsgHuReq struct {
//	Card int8
//}

// 杠牌
type MsgGangReq struct {
	Type int //杠牌类型(暗，明，补)
}

// 杠牌通知
type MsgGangNotify struct {
	UserId int64
	Type   int //杠牌类型(暗，明，补)
	Card   int8
}

// 碰牌通知
type MsgPengNotify struct {
	UserId int64
	Card   int8
}

// 吃牌
type MsgChiReq struct {
	Comb []int8 //吃牌组合
}

// 吃牌通知
type MsgChiNotify struct {
	UserId int64
	Card   int8
	Comb   []int8
}

type RoundPlayerAcc struct {
	Feng     int8 //本门风
	Type     int  // ０：无，１：胡，２：点炮
	AnGang   []int8
	MingGang []int8
	Peng     []int8
	Chi      [][]int8
	Combs    [][]int8
	HuCard   int8

	Fan []int8 //翻到桌上的牌

	DiHu   int //底数
	TaiShu int //台数
	HuShu  int //胡数
}

// 单局结算通知
type MsgRoundAccNotify struct {
	Players map[int64]*RoundPlayerAcc
}

type RoomPlayerAcc struct {
	ZiMo    int8 //自摸
	HuPai   int8 //胡牌
	LaZi    int8 //辣子
	BaoPai  int8 //包牌
	DianPao int8 //点炮

	Spend int //花费房卡
	Left  int //剩余房卡
	Score int //积分
}

// 房间总结算
type MsgRoomAccNotify struct {
	Players map[int64]*RoomPlayerAcc
}


// 牌局阶段
 type MsgPaiTime struct {
         Time int // 1: 生牌阶段
}