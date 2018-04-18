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

const HuaPai = ['spring', 'summer', 'autumn', 'winter', 'mei', 'lang', 'zhu', 'ju', 'bai', 'bai'];
const PaiId = ['1_1', '1_2', '1_3', '1_4', '1_5', '1_6', '2_2', '2_3', '2_4', '2_5','2_6', // 1-11
               '3_3', '3_4','3_5', '3_6', '4_4', '4_5', '4_6', '5_5', '5_6', '6_6']; // 12-21

let whUtils = {

	/**
	 * 获取数组中相同元素的下标
	 * @param {Array} arr
	 */
	getSameValueByArray(arr) {
		let list = [], indexArr = [];
		for (let i = 0; i < arr.length; ++i) {
			let hasRead = false;
			for (let k = 0; k < list.length; ++k) {
				if (i === list[k]) {
					hasRead = true;
				}
			}
			if (!hasRead) {
				let _index = [], haveSame = false;
				_index[0] = i;
				for (let j = i + 1; j < arr.length; ++j) {
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
	getCardIndex(card) {
		let idx = card;
		let func = function (id) {
			return id > 21 ? id - 21 : id;
		}
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
	setSortByCards(cards) {
		// 获取牌对应的白皮id
		let cardsSort = {};
		let indexArr = new Array();

		for (let i = 0; i < cards.length; ++i) {
			indexArr[i] = this.getCardIndex(cards[i]);
		}
		let sameIdxArr = this.getSameValueByArray(indexArr);
		
		// 小于127的牌 白皮 双框 单框 排序算法
		let sortPaiFunc = function(arr) {
			 return arr.sort(function (a, b) {
				let ca = cards[a], cb = cards[b];
				if (ca < 127 && cb < 127) {
					if ((ca > 63 && ca < 85 && cb > 84) || (cb > 63 && cb < 85 && ca > 84)) {
						return ca - cb;
					} else {
						return cb - ca;
					}
				}
			});
		}

		// 检测多个相同元素中是否有杠 和 送牌
		let songCardArray = [];
		for (let i = 0; i < sameIdxArr.length; ++i) {
			sameIdxArr[i] = sortPaiFunc(sameIdxArr[i]);
			if (sameIdxArr[i].length > 2) {
				let gang = true, bpCount = 0;
				for (let j = 0; j < sameIdxArr[i].length; ++j) {
					if (cards[sameIdxArr[i][j]] < 64) bpCount++;
				}
				switch (sameIdxArr[i].length) {
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
					if (sameIdxArr[i].length > 3) {
						for (let s = 3; s < sameIdxArr[i].length; s++) {
							songCardArray[songCardArray.length] = cards[sameIdxArr[i][s]];
						}
					}
					sameIdxArr[i] = [sameIdxArr[i][0], sameIdxArr[i][1], sameIdxArr[i][2]];
				} else {
					if (sameIdxArr[i].length > 2) {
						for (let s = 2; s < sameIdxArr[i].length; s++) {
							songCardArray[songCardArray.length] = cards[sameIdxArr[i][s]];
						}
					}
					sameIdxArr[i] = [sameIdxArr[i][0], sameIdxArr[i][1]];
				}
			}
		}
		// cc.log('=== 4.sameIdxArr : ', sameIdxArr);

		// 重新排序
		let newCardArr = [], newIndexArr = [], newSameIdxArr = [];
		let singleCardArr = [], singleIndexArr = [], singleSameIdxArr = [];
		for (let i = 0; i < sameIdxArr.length; ++i) {
			for (let j = 0; j < sameIdxArr[i].length; ++j) {
				let idx = sameIdxArr[i][j];
				newCardArr[newCardArr.length] = cards[idx];
				newIndexArr[newIndexArr.length] = indexArr[idx];
				newSameIdxArr[newSameIdxArr.length] = idx;
			}
		}
		for (let i = 0; i < cards.length; ++i) {
			let same = false;
			for (let j = 0; j < newSameIdxArr.length; ++j) {
				if (i === newSameIdxArr[j]) same = true;
			}
			if (!same) {
				singleSameIdxArr[singleSameIdxArr.length] = i;
				
			}
		}
		singleSameIdxArr.sort(function (a, b) { return cards[a] - cards[b]; });
		singleSameIdxArr = sortPaiFunc(singleSameIdxArr);
		for (let i = 0; i < singleSameIdxArr.length; ++i) {
			if (cards[singleSameIdxArr[i]]) {
				singleCardArr[singleCardArr.length] = cards[singleSameIdxArr[i]];
				singleIndexArr[singleIndexArr.length] = indexArr[singleSameIdxArr[i]];
			}
		}
		newCardArr.push.apply(newCardArr, singleCardArr);
		newIndexArr.push.apply(newIndexArr, singleIndexArr);

		// 检测牌是否灰掉
		let enableNum = newSameIdxArr.length;
		for (let i = 0; i < newCardArr.length; ++i) {
			if (i >= newSameIdxArr.length) {
				if (newCardArr[i] < 64) {
					enableNum = i;
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
			return name
		} else {
			let name = 'card_' + HuaPai[id-126-1];
			return name;
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
	checkCardEnable(card, cardsAll) {
		let cards = cardsAll.cardArr;
		let singleIdx, cardIdx = this.getCardIndex(card);
		for (let i = 0; i < cards.length; i += 2) {
			if (this.getCardIndex(cards[i]) !== this.getCardIndex(cards[i+1])) {
				if (cards[i - 1] && this.getCardIndex(cards[i]) !== this.getCardIndex(cards[i-1])) {
					singleIdx = i;
					break;
				}
				i++;
			}
		}
		if (card > 63) {
			let isBaiPi = false;
			for (let i = singleIdx; i < cards.length; ++i) {
				if (cards[i] < 64) isBaiPi = true;
			}
			for (let i = 0; i < singleIdx; ++i) {
				if (cardIdx === this.getCardIndex(cards[i]) && card !== cards[i]) {
					cc.log('--- 1.摸牌是框牌 且 对子里有 ---');
					if (cards[i+1] < 64) {
						// let reObject = { song: card[i+1] }
						return { song: cards[i + 1] }
					}
					return true;
				}
			}
			if (isBaiPi) {
				for (let i = singleIdx; i < cards.length; ++i) {
					if (cardIdx === this.getCardIndex(cards[i]) && card !== cards[i]) {
						cc.log('--- 2.摸牌是框牌 且 对子里没有 且 单牌里有 ---');
						return cards[i];
					}
				}
				cc.log('--- 3.摸牌是框牌 且 对子里没有 且 单牌里没有 ---');
				return true;
			} else {
				for (let i = singleIdx; i < cards.length; ++i) {
					if (cardIdx === this.getCardIndex(cards[i]) && card !== cards[i]) {
						cc.log('--- 4.摸牌是框牌 且 对子里没有 且 单牌里有 ---');
						return cards[i];
					}
				}
				cc.log('--- 5.摸牌是框牌 且 对子里没有 且 单牌里没有 且 没有白皮 ---');
				return false;
			}
		} else {
			for (let i = 0; i < singleIdx; ++i) {
				if (cardIdx === this.getCardIndex(cards[i])) {
					cc.log('--- 6.摸牌是白皮 且 对子里有 ---');
					return { song: true };
				}
			}
			for (let i = singleIdx; i < cards.length; ++i) {
				if (cardIdx === this.getCardIndex(cards[i]) && card !== cards[i]) {
					cc.log('--- 7.摸牌是白皮 且 对子里没有 且 单牌里有 ---');
					return cards[i];
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
	getSaiziPointByCard(card) {
		return {p1: card.substr(7, 1), p2: card.substr(9, 1)};
	},


	/**
	 * 获取数组的最值
	 * @param {String} type 类型 最小值或者最大值
	 * @param {Array} data 数组
	 */
	getMinMaxByArray(type, arr) {
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
	getArrayByDouble(arr1, arr2) {
		return arr1.push.apply(arr1, arr2);
	},


	/**
	 * 获取当前节点转换到某节点下的坐标
	 * @param {cc.Node} curNode     待转换坐标的节点
	 * @param {cc.Node} targetNode  目标节点
	 * return 坐标
	 */
	getNodePos(curNode, targetNode) {
		let worldPos = curNode.parent.convertToWorldSpaceAR(curNode.position);
		let pos = targetNode.convertToNodeSpaceAR(worldPos);
		return pos;
	},


	/**
	 * 设置牌是否暗色或者能否触摸
	 * @param {cc.Node} paiNode 牌的节点
	 * @param {Bool} isTouch    是否触摸 
	 * @param {Bool} isVisable  是否暗色
	 */
	setPaiEnable(paiNode, isTouch, isVisable) {
		paiNode.getChildByName('touchOff').active = !isTouch;
		let rgb = isVisable ? { r: 255, g: 255, b: 255, a: 255 } : { r: 187, g: 187, b: 187, a: 255 }
		paiNode.color = new cc.Color(rgb)
	},

};

module.exports = whUtils;