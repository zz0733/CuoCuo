"use strict";
cc._RF.push(module, 'bea12mlKy5H8KaQSweMLRE6', 'Audio');
// hall/script/comm/Audio.js

'use strict';

var hall_EffectPath = 'res/raw-assets/resources/hall/audio/sound/';
var hall_MusicPath = 'res/raw-assets/resources/hall/audio/music/';
var Pork_EffectPath = 'res/raw-assets/resources/poker/audio/sound/';
var Pork_MusicPath = 'res/raw-assets/resources/poker/audio/music/';
var Mahjong_EffectPath = 'res/raw-assets/resources/mahjong/audio/sound/';
var Mahjong_MusicPath = 'res/raw-assets/resources/mahjong/audio/music/';

module.exports = {

	playMusic: function playMusic(from, name, loop, volume) {
		var m_loop = loop === undefined ? true : loop;
		var m_volume = volume === undefined ? this.getMusicVolume() : volume;
		this.stopMusic();
		var path = void 0;
		if (from === 'hall') {
			path = hall_MusicPath + name;
		} else if (from === 'pork') {
			path = Pork_MusicPath + name;
		} else if (from === 'mahjong') {
			path = Mahjong_MusicPath + name;
		}
		this._musicId = cc.audioEngine.play(path, m_loop, m_volume);
	},
	pauseMusic: function pauseMusic() {
		if (this._musicId !== undefined) {
			cc.audioEngine.pause(this._musicId);
		}
	},
	resumeMusic: function resumeMusic() {
		if (this._musicId !== undefined) {
			cc.audioEngine.resume(this._musicId);
		}
	},
	stopMusic: function stopMusic() {
		if (this._musicId !== undefined) {
			cc.audioEngine.stop(this._musicId);
		}
	},
	setMusicVolume: function setMusicVolume(volume) {
		if (volume >= 0 && volume <= 1) {
			if (this._musicId !== undefined) {
				cc.audioEngine.setVolume(this._musicId, volume);
			}
		}
	},
	getMusicVolume: function getMusicVolume() {
		return fun.gameCfg.musicValume;
	},
	isMusicPlaying: function isMusicPlaying() {
		return cc.audioEngine.getState(this._musicId) === cc.audioEngine.AudioState.PLAYING;
	},

	//more 是后缀 有些音效有多条
	playEffect: function playEffect(from, pName, sex) {
		var more = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

		var path = void 0;
		var name = cc.sys.isNative ? pName.slice(0, -4) + more + ".mp3" : pName;
		if (from === 'hall') {
			path = hall_EffectPath + name;
		} else if (from === 'pork') {
			path = sex === undefined ? Pork_EffectPath + name : Pork_EffectPath + 'mandarin/' + sex + '_' + name;
		} else if (from === 'mahjong') {
			var gameType = fun.db.getData('RoomInfo').GameType;
			path = !sex ? Mahjong_EffectPath + name : Mahjong_EffectPath + sex + name;
		}
		if (cc.sys.isNative && !jsb.fileUtils.isFileExist(path)) {
			this.playEffect(from, pName, sex);
			return;
		}
		try {
			this._soundId = cc.audioEngine.play(path, false, this.getEffectVolume());
		} catch (err) {}
	},
	pauseEffect: function pauseEffect() {
		if (this._soundId !== undefined) {
			cc.audioEngine.pause(this._soundId);
		}
	},
	resumeEffect: function resumeEffect() {
		if (this._soundId !== undefined) {
			cc.audioEngine.resume(this._soundId);
		}
	},
	stopEffect: function stopEffect() {
		if (this._soundId !== undefined) {
			cc.audioEngine.stop(this._soundId);
		}
	},
	setEffectVolume: function setEffectVolume(volume) {
		if (volume >= 0 && volume <= 1) {
			this._soundVolume = volume;
		}
	},
	setEffectIsPlay: function setEffectIsPlay(isPlay) {
		this._isEffectPlay = isPlay;
	},
	getEffectVolume: function getEffectVolume() {
		if (!this._isEffectPlay) return fun.gameCfg.soundValume;
		var s = this._soundVolume;
		var sound = s ? s : s === 0 ? s : fun.gameCfg.soundValume;
		return sound;
	},

	pauseAll: function pauseAll() {
		this.setEffectIsPlay(false);
		cc.audioEngine.pauseAll();
	},
	resumeAll: function resumeAll() {
		this.setEffectIsPlay(true);
		cc.audioEngine.resumeAll();
	},
	stopAll: function stopAll() {
		cc.audioEngine.stopAll();
	}

};

cc._RF.pop();