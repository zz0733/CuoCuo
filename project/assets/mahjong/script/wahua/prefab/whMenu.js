cc.Class({
    extends: cc.Component,

    properties: {
        btnMenu: {
            type: cc.Node,
            default: null,
        },

        menuPrefab: {
            type: cc.Prefab,
            default: null,
        },

        setPrefab: {
            type: cc.Prefab,
            default: null,
        },

        skinPrefab: {
            type: cc.Prefab,
            default: null,
        },
    },

    onLoad () {
        this.menu = cc.instantiate(this.menuPrefab);
        this.menu.parent = this.node.parent;
        this.menu.active = false;

        this.btnMenu.on('click', this.onBtnMenuClick, this);
        this.node.parent.getChildByName('bg').on('click', this.onMenuActive, this);
        this.menu.getChildByName('btn_a').on('click', this.onBtnSettingClick, this);
        this.menu.getChildByName('btn_b').on('click', this.onBtnSkinClick, this);
        this.menu.getChildByName('btn_c').on('click', this.onBtnQuitClick, this);
        this.menu.getChildByName('btn_f').on('click', this.onMenuActive, this);
        this.menu.getChildByName('btn_2d').on('click', this.onBtnTwoDClick, this);
        this.menu.getChildByName('btn_3d').on('click', this.onBtnThreeClick, this);
        this.menu.on('click', this.onMenuActive, this);
    },

    onBtnSettingClick() {
        let set = cc.instantiate(this.setPrefab);
        set.parent = this.node.parent;
        this.onMenuActive();
    },

    onBtnSkinClick() {
        let skin = cc.instantiate(this.skinPrefab);
        skin.parent = this.node.parent;
        this.onMenuActive();
    },

    onBtnQuitClick() {
        fun.event.dispatch('wahuaQuitFromSetting');
        this.onMenuActive();
    },

    onBtnTwoDClick() {
        cc.log('--- onBtnTwoDClick ---');
        this.onMenuActive();
    },

    onBtnThreeClick() {
        cc.log('--- onBtnThreeClick ---');
        this.onMenuActive();
    },

    onBtnMenuClick() {
        this.menu.active = !this.menu.active;
    },

    onMenuActive() {
        this.menu.active = false;
    },
});
