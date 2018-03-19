let PukeDefine = {};

PukeDefine.VERSION = "1.0.0";

PukeDefine.TOTAL_CARDS_NUMBER      = 52;   // 牌的总数 没有大小王
PukeDefine.QIANG_ZHUANG_WAIT_TIME  = 5;    // 抢庄等待时间
PukeDefine.QIANG_ZHUANG_TURN_TIME  = 3;    // 抢庄转圈时间
PukeDefine.ZI_DONG_XU_YA_TIME      = 1;    // 自动续押时间
PukeDefine.SEND_CARD_DELAY         = 1;    // 发牌延时
PukeDefine.SEND_CARD_SINGLE_TIME   = 0.12; // 每张牌发下的时间
PukeDefine.SEND_CARD_COMPLETE_TIME = 0.5;  // 发牌完成后延时
PukeDefine.TOTAL_ACCOUNT_SHOW_TIME = 3;    // 总结算界面显示延时
PukeDefine.DISBAND_ROOM_DELAY_TIME = 1;    // 解散房间延时

PukeDefine.NIU_SEND_ACCOUNT_DELAY  = 0.5;  // 牛牛显示牌后向服务器发送结算延时
PukeDefine.ACCOUNT_CURRENT_JUSHU   = 0.5   // 结算后当前局数增加延时

PukeDefine.CREATE_JUSHU_MIN        = 10;   // 创建房间最低局数
PukeDefine.CREATE_JUSHU_MAX        = 40;   // 创建房间最高局数
PukeDefine.CREATE_JUSHU_SPACE      = 5;    // 创建房间局数递增递减

PukeDefine.CHAT_MESSAGE_SHOW_TIME  = 3;    // 表情显示时间
PukeDefine.GOLD_POOL_NUMBER        = 500;  // 金币对象池个数
PukeDefine.PUSH_GOLD_NUMBER        = 30;   // 押注金币固定数量
PukeDefine.TEXT_JUMP_TIME          = 0.4;  // 字体跳动时间

//-- 游戏种类 三公/牛牛
PukeDefine.GAME_TYPE = {
    2 : {
        TYPE : 2,
        CH_NAME : "三公",
        EN_NAME : "sangong",
        PUKE_NUMBER : 3,
        PUKE_POSITION : "SAN_GONG"
    },
    4 : {
        TYPE : 4,
        CH_NAME : "牛牛",
        EN_NAME : "niuniu",
        PUKE_NUMBER : 5,
        PUKE_POSITION : "NIU_NIU"
    }
};

PukeDefine.NIUNIU_ROOM_INFO = {
    MASKERS_TYPE : [
        "牛牛上庄",
        "固定庄家",
        "自由抢庄",
        "通比牛牛",
        "轮流庄"
    ],
    TYPE_SCORE : [
        "牛六x2, 牛七x2, 牛八x3, 牛九x3, 牛牛x5",  //1
        "牛六x2, 牛七x2, 牛八x3, 牛九x3, 牛牛x4",  //2
        "牛六x2, 牛七x2, 牛八x2, 牛九x3, 牛牛x4",  //3
        "牛八x2, 牛九x3, 牛牛x4",                  //4
        "牛六x2, 牛七x2, 牛八x2, 牛九x2, 牛牛x3",  //5
    ],
    TYPE_SCORE_EN : [
        ["Niu6X2", "Niu7X2", "Niu8X3", "Niu9X3", "NiuniuX5"],
        ["Niu6X2", "Niu7X2", "Niu8X3", "Niu9X3", "NiuniuX4"],
        ["Niu6X2", "Niu7X2", "Niu8X2", "Niu9X3", "NiuniuX4"],
        ["Niu6X1", "Niu7X1", "Niu8X2", "Niu9X3", "NiuniuX4"],
        ["Niu6X2", "Niu7X2", "Niu8X2", "Niu9X2", "NiuniuX3"]
    ],
    TYPE_SCORE_SPECIAL : [
        "WuhuaX6",
        "ZhadanX8",
        "WuxiaoniuX10"
    ],
    PAI_JU_SCORE : {
        NIU_NIU: [
            "meiniu",   //0
            "niu1",     //1
            "niu2",     //2
            "niu3",     //3
            "niu4",     //4
            "niu5",     //5
            "niu6",     //6
            "niu7",     //7
            "niu8",     //8
            "niu9",     //9
            "niuniu",   //10
            "kandou",   //11
            "4huaniu",  //12
            "5huaniu",  //13
            "zhadan",   //14
            "5xiaoniu"  //15
        ],
        SAN_GONG: [
            '0dian',    //0
            '1dian',    //1
            '2dian',    //2
            '3dian',    //3
            '4dian',    //4
            '5dian',    //6
            '6dian',    //6
            '7dian',    //7
            '8dian',    //8
            '9dian',    //9
            'hun',      //10
            'feiji',    //11
            'da',       //12
            'tian'      //13
        ]
    },
    NIU_SPECIAL : [
        "kanDou",     //坎斗5倍
        "wuHua",      //五花牛9倍
        "zhaDan",     //炸弹8倍
        "wuXiao",     //五小牛10倍
        "xianJia",    //闲家推注
        "joinLimit",  //中途禁止玩家进入游戏
        "zhangSuo",   //涨缩注
        "shunDou"     //顺斗(在开启坎斗情况下才有)
    ],
    GAME_STATUS : [
        "游戏未开始",  //1
        "开始游戏",   //2
        "游戏结束",   //3
    ]
};

PukeDefine.ROOM_INFO = {
    COST : [
        "均摊房费",    //1
        "冠军房费"     //2
    ],

    DI_FEN : [
        [ 1, 2, 3 ],  //1
        [ 2, 4, 6 ],  //2
        [ 3, 6, 9 ],  //3
        [ 10 ]
    ],

    ZHUANG_WEI : [
        "9点上庄",     //1
        "固定庄",      //2
        "自由抢庄",    //3
        "轮流庄"       //4
    ],

    SHI_XIAN : [
        "不限时",   //0
        "5秒开",   //1
        "10秒开",  //2
        "15秒开"   //3
    ],

    SPECIAL : {
        1 : [
            "涨缩注",
            "不能缩注"
        ], 
        2 : [
            "游戏开始后禁止加入",
            "游戏开始后允许加入"
        ]
    },

    ISMASTER : [
        "解散房间",
        "离开房间"
    ]
};

PukeDefine.HINT_TEXT = {
    WAIT_READY         : "等待玩家准备",
    WAIT_XIA_ZHU       : "等待玩家下注",
    WAIT_QIANG_ZHUANG  : "等待玩家抢庄",
    WAIT_TOTAL_ACCOUNT : "等待结算",
    WAIT_CURRENT_END   : "等待本局结束"
};

PukeDefine.BACKGROUND = [
    "poker/background/pk_zhuozi",
    "poker/background/pk_zhuozi2",
];

PukeDefine.POSITION = {
    SEAT : {
        1 : { x : -530, y : -305 },
        2 : { x : -530, y : 50   },
        3 : { x : -325, y : 235  },
        4 : { x : 0   , y : 280  },
        5 : { x : 325 , y : 235  },
        6 : { x : 530 , y : 50   }
    },

    PUKE : {
        SAN_GONG : {  //3张牌
            1 : {
                MINE_ACCOUNT  : { x : 440, y : 65   },
                OTHER_ACCOUNT : { x : -30, y : -133 }
            },
            2 : {
                MINE_ACCOUNT  : { x : 490, y : 65   },
                OTHER_ACCOUNT : { x : 0  , y : -133 }
            },
            3 : {
                MINE_ACCOUNT  : { x : 540, y : 25   },
                OTHER_ACCOUNT : { x : 30 , y : -133 }
            },
        },
        NIU_NIU : {  //5张牌
            1 : {
                MINE  : { x : 410, y : 65   },
                OTHER : { x : -60, y : -133 },
                MINE_ACCOUNT  : { x : 410, y : 65   },
                OTHER_ACCOUNT : { x : -60, y : -133 }
            },
            2 : {
                MINE  : { x : 450, y : 65   },
                OTHER : { x : -30, y : -133 },
                MINE_ACCOUNT  : { x : 445, y : 65   },
                OTHER_ACCOUNT : { x : -35, y : -133 }
            },
            3 : {
                MINE  : { x : 490, y : 65   },
                OTHER : { x : 0  , y : -133 },
                MINE_ACCOUNT  : { x : 480, y : 65   },
                OTHER_ACCOUNT : { x : -10, y : -133 }
            },
            4 : {
                MINE  : { x : 530, y : 65   },
                OTHER : { x : 30 , y : -133 },
                MINE_ACCOUNT  : { x : 535, y : 65   },
                OTHER_ACCOUNT : { x : 35,  y : -133 }
            },
            5 : {
                MINE  : { x : 570, y : 65   },
                OTHER : { x : 60 , y : -133 },
                MINE_ACCOUNT  : { x : 570, y : 65   },
                OTHER_ACCOUNT : { x : 60,  y : -133 }
            }
        }
    },

    GOLD : {
        1 : {
            START_POS : { x : -495, y : -331 },
            END_POS   : { x : -280, y : -220 }
        },
        2 : {
            START_POS : { x : -537, y : 51   },
            END_POS   : { x : -330, y : -80 }
        },
        3 : {
            START_POS : { x : -323.5, y : 281.5 },
            END_POS   : { x : -190, y : 40  }
        },
        4 : {
            START_POS : { x : -11 , y : 304.5 },
            END_POS   : { x : 0   , y : 80   }
        },
        5 : {
            START_POS : { x : 322 , y : 278 },
            END_POS   : { x : 190 , y : 40  }
        },
        6 : {
            START_POS : { x : 537 , y : 57   },
            END_POS   : { x : 330 , y : -80 }
        }
    },

    DETAIL : {
        1: { x: -465, y: -178 },
        2: { x: -272, y: 98   },
        3: { x: -58 , y: 153  },
        4: { x: 41  , y: 97   },
        5: { x: 264 , y: 72   },
        6: { x: 265 , y: -69  }
        // 1: { x: 19  , y: 135  }, 根节点在seat下
        // 2: { x: 260 , y: -146 },
        // 3: { x: 49  , y: -226 },
        // 4: { x: 49  , y: -226 },
        // 5: { x: -65 , y: -226 },
        // 6: { x: -278, y: -146 }
    },

    ACCOUT_BOX : {
        1 : { x : -405,  y : 155  },
        2 : { x : 0,     y : 155  },
        3 : { x : 405 ,  y : 155  },
        4 : { x : -405,  y : -100 },
        5 : { x : 0,     y : -100 },
        6 : { x : 405,   y : -100 }
    }
};

PukeDefine.RESOURCE_FOLDER_PATH = {
    SPINE : {
        FAN_PAI        : "poker/spine/Fanpai/",
        Sangong_Dazi   : "poker/spine/Sangong_Dazi/Sangong_Dazi",
        Sangong_Xiaozi : "poker/spine/Sangong_Xiaozi/Sangong_Xiaozi",
        Niuniu_Dazi    : "poker/spine/Niuniu_Dazi/Niuniu_Dazi",
        Niuniu_Xiaozi  : "poker/spine/Niuniu_Xiaozi/Niuniu_Xiaozi"
    }

};

PukeDefine.PUKE = {
    MODULE_NAME_NIUNIU : [
        "HHeng",
        "Shu",
        "Heng",
        "SShu"
    ],
    MODULE_NAME_SANGONG : [
        "HHeng",
        "Shu",
        "Heng",
        "SShu"
    ]
};

module.exports = PukeDefine;