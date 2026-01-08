/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-03
 * @Description: 主菜单界面组件
 */
import { _decorator, Button, Node, tween, Tween, Vec3, UIOpacity } from "cc";
import { gui } from "db://oops-framework/core/gui/Gui";
import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCView } from "db://oops-framework/module/common/CCView";
import { smc } from "../../common/SingletonModuleComp";
import type { Account } from "../../account/Account";
import { missionConfig } from "../../common/config/MissionConfig";

const { ccclass, property } = _decorator;

/** 主菜单界面 */
@ccclass('MenuViewComp')
@ecs.register('MenuView', false)
@gui.register('MenuView', { layer: LayerType.UI, prefab: "menu/menu", bundle: "gui" })
export class MenuViewComp extends CCView<Account> {

    private logoNode: Node | null = null;
    private btnStart: Node | null = null;
    private logoTween: Tween<Node> | null = null;
    private btnTween: Tween<Node> | null = null;

    start() {
        console.log('[MenuView] 主菜单界面启动');
        this.initNodes();
        this.playEnterAnimation();
        this.testConfigLoad();
    }

    /** 测试配置加载 */
    private async testConfigLoad(): Promise<void> {
        try {
            console.log('[MenuView] 开始测试配置加载...');
            const config = await missionConfig.loadMission(1);
            
            console.log('[MenuView] ✅ 配置加载成功！');
            console.log('[MenuView] 关卡ID:', config.id);
            console.log('[MenuView] 初始金钱:', config.targetCommon.startMoney);
            console.log('[MenuView] 时间限制:', config.targetCommon.timeMission);
            console.log('[MenuView] 农场田地数量:', config.farmData.fields.length);
            console.log('[MenuView] 作物数量:', config.farmData.breeds.length);
            
            // 验证数据完整性
            if (!config.id) {
                throw new Error('关卡ID缺失');
            }
            if (config.targetCommon.startMoney === undefined) {
                throw new Error('初始金钱缺失');
            }
            
            console.log('[MenuView] ✅ 配置数据验证通过！');
        } catch (error) {
            console.error('[MenuView] ❌ 配置加载测试失败:', error);
        }
    }

    /** 初始化节点引用 */
    private initNodes(): void {
        this.logoNode = this.node.getChildByName('Logo');
        this.btnStart = this.node.getChildByName('btn_start');

        // 绑定按钮事件
        if (this.btnStart) {
            this.btnStart.on(Node.EventType.TOUCH_END, this.onStartGame, this);
        }
    }

    /** 播放进入动画 */
    private playEnterAnimation(): void {
        // Logo 动画
        if (this.logoNode) {
            const originalScale = this.logoNode.scale.clone();

            // 初始状态
            this.logoNode.setScale(originalScale.x * 0.8, originalScale.y * 0.8, 1);

            // 弹出动画
            tween(this.logoNode)
                .to(0.5, { scale: originalScale }, { easing: 'backOut' })
                .call(() => {
                    this.playLogoBreathAnimation(originalScale);
                })
                .start();
        }

        // 按钮动画
        if (this.btnStart) {
            const originalScale = this.btnStart.scale.clone();
            this.btnStart.setScale(0, 0, 1);

            tween(this.btnStart)
                .delay(0.3)
                .to(0.4, { scale: originalScale }, { easing: 'backOut' })
                .call(() => {
                    this.playButtonPulseAnimation(originalScale);
                })
                .start();
        }
    }

    /** Logo 呼吸动画 */
    private playLogoBreathAnimation(originalScale: Vec3): void {
        if (!this.logoNode) return;

        const breatheUp = new Vec3(
            originalScale.x * 1.03,
            originalScale.y * 1.03,
            originalScale.z
        );

        this.logoTween = tween(this.logoNode)
            .to(1.5, { scale: breatheUp }, { easing: 'sineInOut' })
            .to(1.5, { scale: originalScale }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }

    /** 按钮脉冲动画 */
    private playButtonPulseAnimation(originalScale: Vec3): void {
        if (!this.btnStart) return;

        const pulseUp = new Vec3(
            originalScale.x * 1.05,
            originalScale.y * 1.05,
            originalScale.z
        );

        this.btnTween = tween(this.btnStart)
            .to(0.8, { scale: pulseUp }, { easing: 'sineInOut' })
            .to(0.8, { scale: originalScale }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }

    /** 点击开始游戏 */
    private onStartGame(): void {
        console.log('[MenuView] 点击开始游戏');

        // 停止动画
        this.stopAllAnimations();

        // 按钮缩放反馈
        if (this.btnStart) {
            tween(this.btnStart)
                .to(0.1, { scale: new Vec3(0.9, 0.9, 1) })
                .to(0.1, { scale: new Vec3(1, 1, 1) })
                .call(() => {
                    // TODO: 进入农场界面
                    console.log('[MenuView] 即将进入农场...');
                    this.remove();
                })
                .start();
        }
    }

    /** 停止所有动画 */
    private stopAllAnimations(): void {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
        if (this.btnTween) {
            this.btnTween.stop();
            this.btnTween = null;
        }
    }

    onDestroy() {
        this.stopAllAnimations();
    }

    reset() {
        this.stopAllAnimations();
        this.node.destroy();
    }
}
