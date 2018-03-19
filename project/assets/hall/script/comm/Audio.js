let hall_EffectPath    = 'res/raw-assets/resources/hall/audio/sound/';
let hall_MusicPath     = 'res/raw-assets/resources/hall/audio/music/';
let Pork_EffectPath    = 'res/raw-assets/resources/poker/audio/sound/';
let Pork_MusicPath     = 'res/raw-assets/resources/poker/audio/music/';
let Mahjong_EffectPath = 'res/raw-assets/resources/mahjong/audio/sound/';
let Mahjong_MusicPath  = 'res/raw-assets/resources/mahjong/audio/music/';

module.exports = {
	
	playMusic: function(from, name, loop, volume){
		let m_loop = loop === undefined ? true : loop;
		let m_volume = volume === undefined ? this.getMusicVolume() : volume;
		this.stopMusic();
		let path;
		if (from === 'hall') {
			path = hall_MusicPath + name;
		} else if (from === 'pork') {
			path = Pork_MusicPath + name;
		} else if (from === 'mahjong') {
			path = Mahjong_MusicPath + name
		}
		this._musicId = cc.audioEngine.play(path, m_loop, m_volume);
	},
	pauseMusic: function(){
		if(this._musicId !== undefined){
			cc.audioEngine.pause(this._musicId);
		}
	},
	resumeMusic: function(){
		if(this._musicId !== undefined){
			cc.audioEngine.resume(this._musicId);
		}
	},
	stopMusic: function(){
		if(this._musicId !== undefined){
			cc.audioEngine.stop(this._musicId);
		}
	},
	setMusicVolume: function(volume){
		if (volume >= 0 && volume <= 1) {
			if(this._musicId !== undefined){
				cc.audioEngine.setVolume(this._musicId, volume);
			}
		}
	},
	getMusicVolume: function(){
		return fun.gameCfg.musicValume;
	},
	isMusicPlaying: function(){
		return cc.audioEngine.getState(this._musicId) === cc.audioEngine.AudioState.PLAYING;
	},

	//more 是后缀 有些音效有多条
	playEffect: function(from, pName, sex, more=''){
		let path;
		let name = (cc.sys.isNative) ? pName.slice(0, -4) + more + ".mp3" : pName;
		if (from === 'hall') {
			path = hall_EffectPath + name;
		} else if (from === 'pork') {
			path = sex === undefined ? (Pork_EffectPath+name) : Pork_EffectPath+'mandarin/'+sex+'_'+name;
		} else if (from === 'mahjong') {
			let gameType = fun.db.getData('RoomInfo').GameType;
			path = !sex ? (Mahjong_EffectPath+name) : Mahjong_EffectPath+sex+name;
		}
		if(cc.sys.isNative && !jsb.fileUtils.isFileExist(path)){
			this.playEffect(from, pName, sex)
			return
		}
		try{
			this._soundId = cc.audioEngine.play(path, false, this.getEffectVolume());
		}catch(err){

		}
		
	},
	pauseEffect: function(){
		if(this._soundId !== undefined){
			cc.audioEngine.pause(this._soundId);
		}
	},
	resumeEffect: function(){
		if(this._soundId !== undefined){
			cc.audioEngine.resume(this._soundId);
		}
	},
	stopEffect: function(){
		if(this._soundId !== undefined){
			cc.audioEngine.stop(this._soundId);
		}
	},
	setEffectVolume: function(volume){
		if (volume >= 0 && volume <= 1) {
			this._soundVolume = volume;
		}
	},
	setEffectIsPlay: function(isPlay){
		this._isEffectPlay = isPlay;
	},
	getEffectVolume: function(){
		if (!this._isEffectPlay) return fun.gameCfg.soundValume;
		let s = this._soundVolume;
		let sound = s ? s : (s === 0 ? s : fun.gameCfg.soundValume);
		return sound;
	},

	pauseAll: function(){
		this.setEffectIsPlay(false);
		cc.audioEngine.pauseAll();
	},
	resumeAll: function(){
		this.setEffectIsPlay(true);
		cc.audioEngine.resumeAll();
	},
	stopAll: function(){
		cc.audioEngine.stopAll();
	},

};