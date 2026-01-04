/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-03
 * @Description: 主菜单界面组件
 */
import { _decorator, Button, Node } from "cc";
import { gui } from "db://oops-framework/core/gui/Gui";
import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCView } from "db://oops-framework/module/common/CCView";
import { smc } from "../../common/SingletonModuleComp";
import type { Account } from "../../account/Account";

const { ccclass, property } = _decorator;

/** 主菜单界面 */
@ccclass('MenuViewComp')
@ecs.register('MenuView', false)
@gui.register('MenuView', { layer: LayerType.UI, prefab: "gui/menu/menu", bundle: "resources" })
export class MenuViewComp extends CCView<Account> {

    start() {
        console.log('[MenuView] 主菜单界面启动');
        this.initButtons();
    }

    /** 初始化按钮事件 */
    private initButtons(): void {
        // 开始游戏按钮
        const btnStart = this.node.getChildByName('btn_start');
        if (btnStart) {
            btnStart.on(Node.EventType.TOUCH_END, this.onStartGame, this);
        }
    }

    /** 点击开始游戏 */
    private onStartGame(): void {
        console.log('[MenuView] 点击开始游戏');
        // TODO: 进入农场界面
        // 目前先关闭菜单
        this.remove();
    }

    reset() {
        this.node.destroy();
    }
}
