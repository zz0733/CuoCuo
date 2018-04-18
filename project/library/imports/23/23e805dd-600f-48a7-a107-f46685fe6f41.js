"use strict";
cc._RF.push(module, '23e80XdYA9Ip6EH9GaF/m9B', 'whUtils');
// mahjong/script/wahua/common/whUtils.js

'use strict';

/**
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

var HuaPai = ['spring', 'summer', 'autumn', 'winter', 'mei', 'lang', 'zhu', 'ju', 'bai', 'bai'];
var PaiId = ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '2_2', '2_3', '2_4', '2_5', '2_6', // 1-11
'3_3', '3_4', '3_5', '3_6', '4_4', '4_5', '4_6', '5_5', '5_6', '6_6']; // 12-21

var whUtils = {

	/**
  * 获取数组中相同元素的下标
  * @param {Array} arr
  */
	getSameValueByArray: function getSameValueByArray(arr) {
		var list = [],
		    indexArr = [];
		for (var i = 0; i < arr.length; ++i) {
			var hasRead = false;
			for (var k = 0; k < list.length; ++k) {
				if (i === list[k]) {
					hasRead = true;
				}
			}
			if (!hasRead) {
				var _index = [],
				    haveSame = false;
				_index[0] = i;
				for (var j = i + 1; j < arr.length; ++j) {
					if (arr[i] == arr[j]) {
						list.push(j);
						_index[_index.length] = j;
						haveSame = true;
					}
				}
				if (haveSame) {
					indexArr[indexArr.length] = _index;
				}
			}
		}
		return indexArr;
	},


	/**
  * 根据牌id返回其对应的白皮的值
  * @param {INT} number 牌
  */
	getCardIndex: function getCardIndex(card) {
		var idx = card;
		var func = function func(id) {
			return id > 21 ? id - 21 : id;
		};
		if (idx < 127) {
			do {
				idx = func(idx);
			} while (idx > 21);
		}
		return idx;
	},


	/**
  * 对牌进行重新排序
  * @param {Array} cards 服务器发来的牌
  * cardsSort = {
  * 		cardArr:      [ ],  与服务器为准的牌的号码
  * 		indexArr:     [ ],  将白皮、单框和双框牌都换做白皮牌  即0-21
  * 		enableNumber: INT,  不能出的牌即不能触摸的牌的数量
  * 		songCardArr:  INT,  送牌的索引值数组
  * }
  * return cardsSort重新排好序的牌
  */
	setSortByCards: function setSortByCards(cards) {
		// 获取牌对应的白皮id
		var cardsSort = {};
		var indexArr = new Array();

		for (var i = 0; i < cards.length; ++i) {
			indexArr[i] = this.getCardIndex(cards[i]);
		}
		var sameIdxArr = this.getSameValueByArray(indexArr);

		// 小于127的牌 白皮 双框 单框 排序算法
		var sortPaiFunc = function sortPaiFunc(arr) {
			return arr.sort(function (a, b) {
				var ca = cards[a],
				    cb = cards[b];
				if (ca < 127 && cb < 127) {
					if (ca > 63 && ca < 85 && cb > 84 || cb > 63 && cb < 85 && ca > 84) {
						return ca - cb;
					} else {
						return cb - ca;
					}
				}
			});
		};

		// 检测多个相同元素中是否有杠 和 送牌
		var songCardArray = [];
		for (var _i = 0; _i < sameIdxArr.length; ++_i) {
			sameIdxArr[_i] = sortPaiFunc(sameIdxArr[_i]);
			if (sameIdxArr[_i].length > 2) {
				var gang = true,
				    bpCount = 0;
				for (var j = 0; j < sameIdxArr[_i].length; ++j) {
					if (cards[sameIdxArr[_i][j]] < 64) bpCount++;
				}
				switch (sameIdxArr[_i].length) {
					case 3:
						if (bpCount >= 1) gang = false;
						break;
					case 4:
						if (bpCount >= 2) gang = false;
						break;
					case 5:
						if (bpCount >= 3) gang = false;
						break;
					default:
						break;
				}
				if (gang) {
					if (sameIdxArr[_i].length > 3) {
						for (var s = 3; s < sameIdxArr[_i].length; s++) {
							songCardArray[songCardArray.length] = cards[sameIdxArr[_i][s]];
						}
					}
					sameIdxArr[_i] = [sameIdxArr[_i][0], sameIdxArr[_i][1], sameIdxArr[_i][2]];
				} else {
					if (sameIdxArr[_i].length > 2) {
						for (var _s = 2; _s < sameIdxArr[_i].length; _s++) {
							songCardArray[songCardArray.length] = cards[sameIdxArr[_i][_s]];
						}
					}
					sameIdxArr[_i] = [sameIdxArr[_i][0], sameIdxArr[_i][1]];
				}
			}
		}
		// cc.log('=== 4.sameIdxArr : ', sameIdxArr);

		// 重新排序
		var newCardArr = [],
		    newIndexArr = [],
		    newSameIdxArr = [];
		var singleCardArr = [],
		    singleIndexArr = [],
		    singleSameIdxArr = [];
		for (var _i2 = 0; _i2 < sameIdxArr.length; ++_i2) {
			for (var _j = 0; _j < sameIdxArr[_i2].length; ++_j) {
				var idx = sameIdxArr[_i2][_j];
				newCardArr[newCardArr.length] = cards[idx];
				newIndexArr[newIndexArr.length] = indexArr[idx];
				newSameIdxArr[newSameIdxArr.length] = idx;
			}
		}
		for (var _i3 = 0; _i3 < cards.length; ++_i3) {
			var same = false;
			for (var _j2 = 0; _j2 < newSameIdxArr.length; ++_j2) {
				if (_i3 === newSameIdxArr[_j2]) same = true;
			}
			if (!same) {
				singleSameIdxArr[singleSameIdxArr.length] = _i3;
			}
		}
		singleSameIdxArr.sort(function (a, b) {
			return cards[a] - cards[b];
		});
		singleSameIdxArr = sortPaiFunc(singleSameIdxArr);
		for (var _i4 = 0; _i4 < singleSameIdxArr.length; ++_i4) {
			if (cards[singleSameIdxArr[_i4]]) {
				singleCardArr[singleCardArr.length] = cards[singleSameIdxArr[_i4]];
				singleIndexArr[singleIndexArr.length] = indexArr[singleSameIdxArr[_i4]];
			}
		}
		newCardArr.push.apply(newCardArr, singleCardArr);
		newIndexArr.push.apply(newIndexArr, singleIndexArr);

		// 检测牌是否灰掉
		var enableNum = newSameIdxArr.length;
		for (var _i5 = 0; _i5 < newCardArr.length; ++_i5) {
			if (_i5 >= newSameIdxArr.length) {
				if (newCardArr[_i5] < 64) {
					enableNum = _i5;
					break;
				}
			}
		}

		cardsSort.cardArr = newCardArr;
		cardsSort.indexArr = newIndexArr;
		cardsSort.enableNumber = enableNum;
		cardsSort.songCardArr = songCardArray;
		fun.event.dispatch('whUpdatedCards', cardsSort);
		return cardsSort;
	},


	/**
  * 通过牌id获取牌的图片名称
  * @param {INT} id 牌id
  */
	getCardById: function getCardById(id) {
		var a = 0,
		    bc = '1_1',
		    newId = 1;
		if (id < 127) {
			if (id < 64) {
				a = 0;
				newId = id > 21 ? id > 42 ? id - 42 : id - 21 : id;
			} else if (id >= 64 && id < 85) {
				a = 2;
				newId = id - 63;
			} else {
				a = 1;
				newId = id > 105 ? id - 105 : id - 84;
			}
			bc = PaiId[newId - 1];
			var name = 'card_' + a + '_' + bc;
			return name;
		} else {
			var _name = 'card_' + HuaPai[id - 126 - 1];
			return _name;
		}
		return false;
	},


	/**
  * 检测牌是否暗色或者触摸
  * @param {INT} card     待检测的牌
  * @param {Array} cards  牌的数组
  * 			
  * 			                  - 相同牌型中有白皮 (摸牌暗 白皮显示送牌 并且单牌中的非送牌白皮暗)
  * 			  -	对子里有相同牌型 -			                        - 有: 摸牌暗
  *            -               - 相同牌型中没有白皮 单牌中是否有白皮 -
  *            -                                                  - 没有: 摸牌不暗
  *     - 框牌  -
  *     -      -                                                            - 有 摸牌和单牌暗 单牌中除去已配对的白皮是否还有白皮 如果没有则将剩余单牌中的框牌全部亮起
  *     -      -                                   - 有 摸牌与单牌是否有相同牌型 -
  *     -      - 对子里没有相同牌型 单牌中是否有白皮 -                            - 没有 摸牌暗
  *     -                                          - 没有 摸牌与单牌是否有相同牌型 如果有 则将配对的牌和摸牌一起暗掉
  * 摸牌 -
  *     -
  *     -                       - - 有 摸牌显示送牌 将单排中非送牌的白皮暗掉
  *     -                       -
  *     - 白皮 对子里是否有相同牌型 -                                                        - 有 摸牌和已配对的牌暗
  *                             -                       - 有 单牌中除去已配对的牌是否还有白皮 -
  *                             - 没有 单牌里是否有相同牌型 -                                - 没有 摸牌和已配对的牌暗 且 单牌中的其他牌亮
  *                                                     - 没有 单牌中是否有送牌 有送牌且摸牌不是送牌则摸牌暗
  * 
  * 出牌顺序:
  * 		  - 先打自己有杠的多余白皮
     *        - 再打自己已经拼对的多余白皮（也分生熟张）
     *        - 而后打其他玩家已经杠起的多余白皮（自己手中可以成型对子的除外）
     *        - 打白不留白：打过的白皮再摸上来必须先打掉
     *        - 有送子要先打送子
     *        - 先打熟张，再打生张
  * 
  * return { an: { }, liang: { }, song: { } }
  */
	checkCardEnable: function checkCardEnable(card, cardsAll) {
		var cards = cardsAll.cardArr;
		var singleIdx = void 0,
		    cardIdx = this.getCardIndex(card);
		for (var i = 0; i < cards.length; i += 2) {
			if (this.getCardIndex(cards[i]) !== this.getCardIndex(cards[i + 1])) {
				if (cards[i - 1] && this.getCardIndex(cards[i]) !== this.getCardIndex(cards[i - 1])) {
					singleIdx = i;
					break;
				}
				i++;
			}
		}
		if (card > 63) {
			var isBaiPi = false;
			for (var _i6 = singleIdx; _i6 < cards.length; ++_i6) {
				if (cards[_i6] < 64) isBaiPi = true;
			}
			for (var _i7 = 0; _i7 < singleIdx; ++_i7) {
				if (cardIdx === this.getCardIndex(cards[_i7]) && card !== cards[_i7]) {
					cc.log('--- 1.摸牌是框牌 且 对子里有 ---');
					if (cards[_i7 + 1] < 64) {
						// let reObject = { song: card[i+1] }
						return { song: cards[_i7 + 1] };
					}
					return true;
				}
			}
			if (isBaiPi) {
				for (var _i8 = singleIdx; _i8 < cards.length; ++_i8) {
					if (cardIdx === this.getCardIndex(cards[_i8]) && card !== cards[_i8]) {
						cc.log('--- 2.摸牌是框牌 且 对子里没有 且 单牌里有 ---');
						return cards[_i8];
					}
				}
				cc.log('--- 3.摸牌是框牌 且 对子里没有 且 单牌里没有 ---');
				return true;
			} else {
				for (var _i9 = singleIdx; _i9 < cards.length; ++_i9) {
					if (cardIdx === this.getCardIndex(cards[_i9]) && card !== cards[_i9]) {
						cc.log('--- 4.摸牌是框牌 且 对子里没有 且 单牌里有 ---');
						return cards[_i9];
					}
				}
				cc.log('--- 5.摸牌是框牌 且 对子里没有 且 单牌里没有 且 没有白皮 ---');
				return false;
			}
		} else {
			for (var _i10 = 0; _i10 < singleIdx; ++_i10) {
				if (cardIdx === this.getCardIndex(cards[_i10])) {
					cc.log('--- 6.摸牌是白皮 且 对子里有 ---');
					return { song: true };
				}
			}
			for (var _i11 = singleIdx; _i11 < cards.length; ++_i11) {
				if (cardIdx === this.getCardIndex(cards[_i11]) && card !== cards[_i11]) {
					cc.log('--- 7.摸牌是白皮 且 对子里没有 且 单牌里有 ---');
					return cards[_i11];
				}
			}
			cc.log('--- 8.摸牌是白皮 且 对子里没有 且 单牌里没有 ---');
			return false;
		}
	},


	/**
  * 根据牌的图片的名称获取色字的点数
  * @param {String} card 
  */
	getSaiziPointByCard: function getSaiziPointByCard(card) {
		return { p1: card.substr(7, 1), p2: card.substr(9, 1) };
	},


	/**
  * 获取数组的最值
  * @param {String} type 类型 最小值或者最大值
  * @param {Array} data 数组
  */
	getMinMaxByArray: function getMinMaxByArray(type, arr) {
		if (type === 'min') {
			return Math.min.apply(Math, arr);
		} else {
			return Math.max.apply(Math, arr);
		}
	},


	/**
  * 数组合并
  * @param {Array} arr1 数组1
  * @param {Array} arr2 数组2
  * return 新的数组
  */
	getArrayByDouble: function getArrayByDouble(arr1, arr2) {
		return arr1.push.apply(arr1, arr2);
	},


	/**
  * 获取当前节点转换到某节点下的坐标
  * @param {cc.Node} curNode     待转换坐标的节点
  * @param {cc.Node} targetNode  目标节点
  * return 坐标
  */
	getNodePos: function getNodePos(curNode, targetNode) {
		var worldPos = curNode.parent.convertToWorldSpaceAR(curNode.position);
		var pos = targetNode.convertToNodeSpaceAR(worldPos);
		return pos;
	},


	/**
  * 设置牌是否暗色或者能否触摸
  * @param {cc.Node} paiNode 牌的节点
  * @param {Bool} isTouch    是否触摸 
  * @param {Bool} isVisable  是否暗色
  */
	setPaiEnable: function setPaiEnable(paiNode, isTouch, isVisable) {
		paiNode.getChildByName('touchOff').active = !isTouch;
		var rgb = isVisable ? { r: 255, g: 255, b: 255, a: 255 } : { r: 187, g: 187, b: 187, a: 255 };
		paiNode.color = new cc.Color(rgb);
	}
};

module.exports = whUtils;

cc._RF.pop();