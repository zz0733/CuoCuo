let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {
        dialectToggle: cc.Node,
    },

    onLoad() {
        let bg = this.node.getChildByName('back');
        this.soundToggle = bg.getChildByName('soundToggle').getComponent(cc.Toggle);
        this.soundProgress = bg.getChildByName('soundProgress').getComponent(cc.ProgressBar);
        this.soundSlider = bg.getChildByName('soundSlider');
        if (fun.gameCfg.soundValume === 0) {
            this.soundToggle.isChecked = false;
        } else {
            this.soundToggle.isChecked = true;
        }
        let progressBar = JSON.parse(cc.sys.localStorage.getItem('progressBar'));
        let s = fun.gameCfg.soundValume;
        this._soundProgress = progressBar ? (progressBar.sound ? progressBar.sound : s) : s
        this.soundProgress.progress = this._soundProgress;
        this.soundSlider.getComponent(cc.Slider).progress = this._soundProgress;
        this.soundSlider.on('slide', this.onSoundSliderSlide, this);

        this.musicToggle = bg.getChildByName('musicToggle').getComponent(cc.Toggle);
        this.musicProgress = bg.getChildByName('musicProgress').getComponent(cc.ProgressBar);
        this.musicSlider = bg.getChildByName('musicSlider');
        if (fun.gameCfg.musicValume === 0) {
            this.musicToggle.isChecked = false;
        } else {
            this.musicToggle.isChecked = true;
        }
        let m = fun.gameCfg.musicValume;
        this._musicProgress = progressBar ? (progressBar.music ? progressBar.music : m) : m;
        this.musicProgress.progress = this._musicProgress;
        this.musicSlider.getComponent(cc.Slider).progress = this._musicProgress;
        this.musicSlider.on('slide', this.onMusicSliderSlide, this);

        const languageBox = bg.getChildByName('languageBox');
        this.mandarinToggle = languageBox.getChildByName('toggle1').getComponent(cc.Toggle);
        this.localismToggle = languageBox.getChildByName('toggle2').getComponent(cc.Toggle);
        if (parseInt(fun.gameCfg.voiceLanguage) === gameConst.voiceLanguage.mandarin) {
            this.mandarinToggle.isChecked = true;
            this.localismToggle.isChecked = false;
        } else {
            this.mandarinToggle.isChecked = false;
            this.localismToggle.isChecked = true;
        }
        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
        this.writeOffBtn = bg.getChildByName('writeOffBtn');
        this.writeOffBtn.on('click', this.onWriteOffBtnClick, this);

        this.animation = this.node.getComponent(cc.Animation);
        this.clips = this.animation.getClips();
    },

    onEnable () {
        this.animation.play(this.clips[0].name);
    },

    onSoundSliderSlide (event) {
        this.soundProgress.progress = event.detail.progress;
        fun.gameCfg.soundValume = event.detail.progress;
        this._soundProgress = fun.gameCfg.soundValume;
        Audio.setEffectVolume(this._soundProgress);
        if (this._soundProgress === 0)
            this.soundToggle.isChecked = false;
        else
            this.soundToggle.isChecked = true;
    },

    onMusicSliderSlide (event) {
        this.musicProgress.progress = event.detail.progress;
        fun.gameCfg.musicValume = event.detail.progress;
        this._musicProgress = fun.gameCfg.musicValume;
        Audio.setMusicVolume(this._musicProgress);
        if (this._musicProgress === 0)
            this.musicToggle.isChecked = false;
        else
            this.musicToggle.isChecked = true;
    },

    onSoundToggleClicked () {
        this._soundVolum = this.soundToggle.isChecked ? this._soundProgress : 0;
        fun.gameCfg.soundValume = this._soundVolum;
        Audio.setEffectVolume(this._soundVolum);
    },

    onMusicToggleClicked () {
        this._musicVolum = this.musicToggle.isChecked ? this._musicProgress : 0;
        fun.gameCfg.musicValume = this._musicVolum;
        Audio.setMusicVolume(this._musicVolum);
    },

    setGameType (gameType) {
        if (gameType === 'pork') {
            this.dialectToggle.getComponent(cc.Toggle).interactable = false;
            this.dialectToggle.getChildByName('back').active = true;
        } else {
            this.dialectToggle.interactable = true;
            this.dialectToggle.getChildByName('back').active = false;
        }
    },

    onWriteOffBtnClick() {
        Audio.playEffect('hall', 'button_nomal.mp3');
        cc.sys.localStorage.removeItem('Token');
        fun.utils.restart();
    },

    onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        let s = this._soundVolum, m = this._musicVolum;
        fun.gameCfg.musicValume = (m && m > 0) ? m : (m === 0 ? 0 : fun.gameCfg.musicValume);
        fun.gameCfg.soundValume = (s && s > 0) ? s : (s === 0 ? 0 : fun.gameCfg.soundValume);
        let valumeData = JSON.stringify({sound: fun.gameCfg.soundValume, music: fun.gameCfg.musicValume});
        cc.sys.localStorage.setItem('valumeData', valumeData);
        fun.gameCfg.voiceLanguage = this.mandarinToggle.isChecked ? gameConst.voiceLanguage.mandarin : gameConst.voiceLanguage.huangYan;
        cc.sys.localStorage.setItem('voiceLanguage', fun.gameCfg.voiceLanguage);
        let progressBar = JSON.stringify({sound: this._soundProgress, music: this._musicProgress});
        cc.sys.localStorage.setItem('progressBar', progressBar);
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
    },

    hideWriteOffBtn() {
        this.writeOffBtn.active = false
    },

});
