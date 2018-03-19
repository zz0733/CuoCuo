"use strict";
cc._RF.push(module, '33f57xoP4RJDq34N2qjmS1e', 'whMenu');
// mahjong/script/wahua/prefab/whMenu.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        btnMenu: {
            type: cc.Node,
            default: null
        },

        menuPrefab: {
            type: cc.Prefab,
            default: null
        },

        setPrefab: {
            type: cc.Prefab,
            default: null
        },

        skinPrefab: {
            type: cc.Prefab,
            default: null
        }
    },

    onLoad: function onLoad() {
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
    onBtnSettingClick: function onBtnSettingClick() {
        var set = cc.instantiate(this.setPrefab);
        set.parent = this.node.parent;
    },
    onBtnSkinClick: function onBtnSkinClick() {
        var skin = cc.instantiate(this.skinPrefab);
        skin.parent = this.node.parent;
    },
    onBtnQuitClick: function onBtnQuitClick() {
        fun.event.dispatch('wahuaQuitFromSetting');
    },
    onBtnTwoDClick: function onBtnTwoDClick() {
        cc.log('--- onBtnTwoDClick ---');
    },
    onBtnThreeClick: function onBtnThreeClick() {
        cc.log('--- onBtnThreeClick ---');
    },
    onBtnMenuClick: function onBtnMenuClick() {
        this.menu.active = !this.menu.active;
    },
    onMenuActive: function onMenuActive() {
        this.menu.active = false;
    }
});

cc._RF.pop();