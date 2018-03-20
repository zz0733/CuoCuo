/*
 *牌id对应牌*
	- 白皮: 1-21 / 22-42 / 43-63
	- 单匡: 64-84
	- 双框: 85-105 / 106-126
	- 花牌: 127-130 春夏秋冬 / 131-134 梅兰竹菊 / 135-136 白板
	- 11(1/22/43) 12(2) 13(3) 14(4) 15(5) 16(6) 22(7) 23(8) 24(9) 25(10) 26(11)    
	  33(12) 34(13) 35(14) 36(15) 44(16) 45(17) 46(18) 55(19) 56(20) 66(21)

 *牌对应牌的名称*
 	- 非花牌名称
	 	card_a_b_c / eg: car_0_1_1
		a: 0-白皮 1-双框 2-单匡
		b/c 代表对应的数字
	- 花牌名称
		春夏秋冬: card_spring  card_summer  card_autumn  card_winter
		梅兰竹菊: card_mei     card_lang    card_zhu     card_ju
	    白板   : card_bai

 *字段含义*
	- gamePhase: 游戏阶段 0-准备 1-发庄 2-摇色子 3-开始游戏/发牌 4-检查牌/打牌/补花 5-结算 6-解散房间
    - gameStatu: 游戏状态 1-未开始 2-进行中 3-已结束
    
 */

const HuaPai = ['spring', 'summer', 'autumn', 'winter', 'mei', 'lang', 'zhu', 'ju', 'bai', 'bai'];
const PaiId = ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '2_2', '2_3', '2_4', '2_5','2_6',
               '3_3', '3_4','3_5', '3_6', '4_4', '4_5', '4_6', '5_5', '5_6', '6_6'];

let whUtils = {

	getCardById(id) {
		let a = 0, bc = '1_1', newId = 1;
		if (id < 127) {
			if (id < 64) {
				a = 0;
				newId = id > 21 ? (id > 42 ? (id - 42) : (id - 21)) : id;
			} else if (id >= 64 && id < 85) {
				a = 2;
				newId = id - 63;
			} else {
				a = 1;
				newId = id > 105 ? (id - 105) : (id - 84)
			}
			bc = PaiId[newId-1];
			let name = 'card_' + a + '_' + bc;
			// cc.log('=== 非花牌 id, name: ', id, name);
			return name
		} else {
			let name = 'card_' + HuaPai[id-126-1];
			// cc.log('=== 花牌 id, name: ', id, name)
			return name;
		}
		return false;
	},

	getSaiziPointByCard(card) {
		return {p1: card.substr(7, 1), p2: card.substr(9, 1)};
	},

};

module.exports = whUtils;