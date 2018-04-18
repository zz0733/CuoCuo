let Audio = require('Audio');
cc.Class({
    extends: cc.Component,

    properties: {
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
        this._soundProgress = progressBar ? (progressBar.sound ? progressBar.sound : s) : s;
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

        bg.getChildByName('btnClose').on('click', this.onBtnCloseClick, this);
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
        if (this._soundProgress === 0)
            this.soundToggle.isChecked = false;
        else
            this.soundToggle.isChecked = true;
    },

    onMusicSliderSlide (event) {
        this.musicProgress.progress = event.detail.progress;
        fun.gameCfg.musicValume = event.detail.progress;
        this._musicProgress = fun.gameCfg.musicValume;
        if (this._musicProgress === 0)
            this.musicToggle.isChecked = false;
        else
            this.musicToggle.isChecked = true;
    },

    onSoundToggleClicked () {
        if(this.soundToggle.isChecked == true){
            this._soundProgress = 0.5;
        }
        this._soundVolum = this.soundToggle.isChecked ? this._soundProgress : 0;
        fun.gameCfg.soundValume = this._soundVolum;
        this.soundProgress.progress = this._soundVolum;
        this._soundProgress = fun.gameCfg.soundValume;
        this.soundSlider.getComponent(cc.Slider).progress = this._soundProgress;
    },

    onMusicToggleClicked () {
        if( this.musicToggle.isChecked == true){
            this._musicProgress = 0.5;
        }
        this._musicVolum = this.musicToggle.isChecked ? this._musicProgress : 0;
        fun.gameCfg.musicValume = this._musicVolum;
        this.musicProgress.progress = this._musicVolum;
        this._musicProgress = this._musicVolum;
        this.musicSlider.getComponent(cc.Slider).progress = this._musicProgress;
    },




    onBtnCloseClick() {
        Audio.playEffect('hall', 'button_close.mp3');
        if(this.soundToggle.isChecked == false){
            this._soundProgress = 0;
        }
        if( this.musicToggle.isChecked == false){
            this._musicProgress = 0;
        }
        fun.gameCfg.musicValume =   this._musicProgress;
        fun.gameCfg.soundValume =  this._soundProgress;
        let valumeData = JSON.stringify({sound: fun.gameCfg.soundValume, music: fun.gameCfg.musicValume});
        cc.sys.localStorage.setItem('valumeData', valumeData);
        let progressBar = JSON.stringify({sound: this._soundProgress, music: this._musicProgress});
        cc.sys.localStorage.setItem('progressBar', progressBar);
        this.animation.play(this.clips[1].name).once('finished', function () {
            this.node.destroy();
        }, this);
        cc.YL.DDZAudio.playBGM();
    },



});
