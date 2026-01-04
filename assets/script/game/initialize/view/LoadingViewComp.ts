/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: jiangking
 * @LastEditTime: 2025-01-03
 * @Description: 游戏资源加载界面
 */
import { _decorator, tween, Tween, Node, Layers, UITransform, view, Widget, UIOpacity, Color, Vec3, Graphics } from "cc";
import { gui } from "db://oops-framework/core/gui/Gui";
import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { oops } from "db://oops-framework/core/Oops";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCViewVM } from "db://oops-framework/module/common/CCViewVM";
import type { Initialize } from "../Initialize";
import { smc } from "../../common/SingletonModuleComp";
import { MenuViewComp } from "../../menu/view/MenuViewComp";

const { ccclass, property } = _decorator;

/** 游戏资源加载 */
@ccclass('LoadingViewComp')
@ecs.register('LoadingView', false)
@gui.register('LoadingView', { layer: LayerType.UI, prefab: "loading/loading", bundle: "resources" })
export class LoadingViewComp extends CCViewVM<Initialize> {
    /** VM 组件绑定数据 */
    data: any = {
        /** 加载资源当前进度 */
        finished: 0,
        /** 加载资源最大进度 */
        total: 0,
        /** 加载资源进度比例值 */
        progress: "0",
        /** 加载流程中提示文本 */
        prompt: ""
    };

    // 进度控制
    private currentProgress: number = 0;
    private targetProgress: number = 0;
    private realProgress: number = 0;
    private fakeProgressSpeed: number = 0.35;
    private fakeProgressMax: number = 0.7;
    private useFakeProgress: boolean = true;

    private progressTween: Tween<any> | null = null;
    private startTime: number = 0;
    private minDisplayTime: number = 1000;

    // Logo 相关
    private logoNode: Node | null = null;
    private logoTween: Tween<any> | null = null;

    // 遮罩节点引用
    private maskNode: Node | null = null;

    start() {
        this.startTime = Date.now();
        this.currentProgress = 0;
        this.targetProgress = 0;
        this.realProgress = 0;

        // 修复背景节点适配问题 - 让背景覆盖整个屏幕（包括黑边）
        this.fixBackgroundFullScreen();

        // 创建 Logo
        this.createLogo();

        this.enter();
    }

    /**
     * 修复背景节点，使其完整显示在设计分辨率区域内
     */
    private fixBackgroundFullScreen(): void {
        const bgNode = this.node.getChildByName('bg');
        if (!bgNode) {
            console.warn('[LoadingView] bg 节点未找到');
            return;
        }

        // 背景图原始尺寸（2560x1440，比例16:9）
        const imageWidth = 2560;
        const imageHeight = 1440;
        const imageRatio = imageWidth / imageHeight;

        // 使用设计分辨率（1280x720）
        const designSize = view.getDesignResolutionSize();
        const designRatio = designSize.width / designSize.height;

        let targetWidth: number;
        let targetHeight: number;

        // 让背景图完整显示在设计分辨率区域内（类似 SHOW_ALL）
        if (imageRatio > designRatio) {
            // 图片比设计区域更宽，以宽度为准
            targetWidth = designSize.width;
            targetHeight = targetWidth / imageRatio;
        } else {
            // 图片比设计区域更高或相等，以高度为准
            targetHeight = designSize.height;
            targetWidth = targetHeight * imageRatio;
        }

        // 设置 bg 的 UITransform 尺寸
        let uiTransform = bgNode.getComponent(UITransform);
        if (!uiTransform) {
            uiTransform = bgNode.addComponent(UITransform);
        }
        uiTransform.setContentSize(targetWidth, targetHeight);
        uiTransform.setAnchorPoint(0.5, 0.5);

        // 确保 bg 居中
        bgNode.setPosition(0, 0, 0);

        console.log(`[LoadingView] 背景尺寸设置为: ${targetWidth.toFixed(0)}x${targetHeight.toFixed(0)}`);
        console.log(`[LoadingView] 设计分辨率: ${designSize.width}x${designSize.height}`);
        console.log(`[LoadingView] 图片比例: ${imageRatio.toFixed(2)}, 设计比例: ${designRatio.toFixed(2)}`);
    }

    /**
     * 创建背景遮罩层
     */
    private createFullScreenMask(): void {
        this.maskNode = new Node('FullScreenMask');
        this.maskNode.layer = Layers.Enum.UI_2D;
        this.node.insertChild(this.maskNode, 0);

        const designSize = view.getDesignResolutionSize();
        const visibleSize = view.getVisibleSize();
        const maxWidth = Math.max(designSize.width, visibleSize.width) * 2;
        const maxHeight = Math.max(designSize.height, visibleSize.height) * 2;

        const transform = this.maskNode.addComponent(UITransform);
        transform.setContentSize(maxWidth, maxHeight);
        transform.setAnchorPoint(0.5, 0.5);

        const graphics = this.maskNode.addComponent(Graphics);
        graphics.fillColor = new Color(0, 0, 0, 255);
        const halfWidth = maxWidth / 2;
        const halfHeight = maxHeight / 2;
        graphics.rect(-halfWidth, -halfHeight, maxWidth, maxHeight);
        graphics.fill();

        this.maskNode.setPosition(0, 0, 0);
    }

    update(dt: number) {
        // 假进度逻辑
        if (this.useFakeProgress && this.currentProgress < this.fakeProgressMax) {
            this.currentProgress = Math.min(
                this.currentProgress + this.fakeProgressSpeed * dt,
                this.fakeProgressMax
            );
            this.data.finished = this.currentProgress;
            this.data.total = 1;
            this.data.progress = (this.currentProgress * 100).toFixed(2);
        }
    }

    onDestroy() {
        if (this.progressTween) {
            this.progressTween.stop();
            this.progressTween = null;
        }
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
    }

    /**
     * 初始化 Logo 节点
     */
    private createLogo(): void {
        this.logoNode = this.node.getChildByName('Logo');
        if (!this.logoNode) {
            console.warn('[LoadingView] Logo node not found in prefab');
            return;
        }
        this.playLogoAnimation();
    }

    /**
     * 播放 Logo 呼吸动画
     */
    private playLogoAnimation(): void {
        if (!this.logoNode) return;

        let opacity = this.logoNode.getComponent(UIOpacity);
        if (!opacity) {
            opacity = this.logoNode.addComponent(UIOpacity);
        }
        opacity.opacity = 0;

        // 保存预制体中的原始 scale
        const originalScale = this.logoNode.scale.clone();

        // 初始缩小 90%
        this.logoNode.setScale(
            originalScale.x * 0.9,
            originalScale.y * 0.9,
            originalScale.z
        );

        // 弹出动画到原始大小
        tween(this.logoNode)
            .to(0.5, { scale: originalScale }, { easing: 'backOut' })
            .start();

        tween(opacity)
            .to(0.5, { opacity: 255 }, { easing: 'sineOut' })
            .start();

        // 呼吸动画：在原始大小基础上微缩放
        const breatheUp = new Vec3(
            originalScale.x * 1.04,
            originalScale.y * 1.04,
            originalScale.z
        );

        this.logoTween = tween(this.logoNode)
            .delay(0.6)
            .to(1.5, { scale: breatheUp }, { easing: 'sineInOut' })
            .to(1.5, { scale: originalScale }, { easing: 'sineInOut' })
            .union()
            .repeatForever()
            .start();
    }

    enter() {
        this.loadRes().catch(error => {
            console.error('[LoadingView] Error in loadRes:', error);
        });
    }

    /** 加载资源 */
    private async loadRes() {
        try {
            this.data.progress = 0;
            await this.loadCustom();
            this.loadGameRes();
        } catch (error) {
            console.error('[LoadingView] loadRes error:', error);
            // 即使出错也尝试继续加载游戏资源
            this.loadGameRes();
        }
    }

    /** 加载游戏本地JSON数据 */
    private loadCustom() {
        this.data.prompt = "加载游戏数据...";
    }

    /** 加载初始游戏内容资源 */
    private loadGameRes() {
        this.data.prompt = "加载游戏内容...";
        oops.res.loadDir("game", this.onProgressCallback.bind(this), this.onCompleteCallback.bind(this));
    }

    /** 加载进度事件 */
    private onProgressCallback(finished: number, total: number, item: any) {
        this.realProgress = finished / total;
        if (this.realProgress > this.fakeProgressMax) {
            this.useFakeProgress = false;
            this.updateProgressSmooth(this.realProgress, 0.3);
        }
    }

    /** 加载完成事件 */
    private onCompleteCallback() {
        // 包装异步逻辑并捕获错误，避免 PromiseRejectionEvent
        this.handleLoadComplete().catch(error => {
            console.error('[LoadingView] Error in load complete handler:', error);
        });
    }

    /** 处理加载完成的异步逻辑 */
    private async handleLoadComplete(): Promise<void> {
        this.useFakeProgress = false;
        this.data.prompt = "准备就绪...";

        await this.updateProgressSmooth(1.0, 0.2);

        // 确保加载界面至少显示最小时间
        const elapsedTime = Date.now() - this.startTime;
        if (elapsedTime < this.minDisplayTime) {
            const remainingTime = this.minDisplayTime - elapsedTime;
            await new Promise(resolve => setTimeout(resolve, remainingTime));
        }

        console.log('[LoadingView] Resource loading complete, entering game...');

        // 打开主菜单界面
        await smc.account.addUi(MenuViewComp);

        // Loading 界面淡出
        this.fadeOutAndRemove();
    }

    /**
     * 平滑更新进度条
     */
    private updateProgressSmooth(targetProgress: number, duration: number = 0.3): Promise<void> {
        return new Promise((resolve) => {
            if (this.progressTween) {
                this.progressTween.stop();
            }

            const progressObj = { value: this.currentProgress };

            this.progressTween = tween(progressObj)
                .to(duration, { value: targetProgress }, {
                    easing: 'sineOut',
                    onUpdate: () => {
                        this.currentProgress = progressObj.value;
                        this.data.finished = progressObj.value;
                        this.data.total = 1;
                        this.data.progress = (progressObj.value * 100).toFixed(2);
                    }
                })
                .call(() => {
                    this.currentProgress = targetProgress;
                    this.data.finished = targetProgress;
                    this.data.total = 1;
                    this.progressTween = null;
                    resolve();
                })
                .start();
        });
    }

    /**
     * Loading 界面淡出并移除
     */
    private fadeOutAndRemove(): void {
        if (this.maskNode && this.maskNode.isValid) {
            this.maskNode.destroy();
            this.maskNode = null;
        }

        let uiOpacity = this.node.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = this.node.addComponent(UIOpacity);
        }
        uiOpacity.opacity = 255;

        tween(uiOpacity)
            .to(0.4, { opacity: 0 }, { easing: 'sineOut' })
            .call(() => {
                console.log('[LoadingView] Fade out complete, removing...');
                this.remove();
            })
            .start();
    }

    reset(): void { }
}
