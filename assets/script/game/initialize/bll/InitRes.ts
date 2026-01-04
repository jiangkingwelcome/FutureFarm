/*
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Date: 2025-01-03
 * @Description: 游戏初始化资源加载
 */
import { director } from "cc";
import { oops } from "db://oops-framework/core/Oops";
import { AsyncQueue, NextFunction } from "db://oops-framework/libs/collection/AsyncQueue";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Initialize } from "../Initialize";
import { LoadingViewComp } from "../view/LoadingViewComp";
import { GlobalMask } from "../../common/GlobalMask";

/** 初始化游戏公共资源 */
@ecs.register('InitRes')
export class InitResComp extends ecs.Comp {
    reset() { }
}

/** 初始化资源逻辑注册到Initialize模块中 */
@ecs.register('Initialize')
export class InitResSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(InitResComp);
    }

    entityEnter(e: Initialize): void {
        var queue: AsyncQueue = new AsyncQueue();

        // 显示 Loading 界面（包含 Logo）
        queue.push((next: NextFunction) => {
            (async () => {
                try {
                    console.log('[InitRes] 显示 Loading 界面');

                    // 隐藏 GlobalMask
                    GlobalMask.instance.hide(0);

                    // 隐藏场景中的静态 LoadingBg 节点
                    this.hideStaticLoadingBg();

                    // 显示 Loading 界面
                    await e.addUi(LoadingViewComp);
                    next();
                } catch (error) {
                    console.error('[InitRes] Loading 阶段出错:', error);
                    next(); // 即使出错也继续执行
                }
            })();
        });

        // 加载多语言包
        this.loadLanguage(queue);
        // 加载公共资源
        this.loadCommon(queue);
        // 结束时移除初始化组件
        this.onComplete(queue, e);

        queue.play();
    }

    /** 隐藏场景中的静态 LoadingBg 节点 */
    private hideStaticLoadingBg(): void {
        try {
            const scene = director.getScene();
            const guiNode = scene?.getChildByPath('root/gui');
            const loadingBgNode = guiNode?.getChildByName('LoadingBg');
            if (loadingBgNode) {
                loadingBgNode.active = false;
                console.log('[InitRes] 静态 LoadingBg 节点已隐藏');
            }
        } catch (error) {
            console.warn('[InitRes] 隐藏 LoadingBg 失败:', error);
        }
    }

    /** 加载化语言包（可选） */
    private loadLanguage(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            // 设置默认语言
            let lan = oops.storage.get("language");
            if (lan == null || lan == "") {
                lan = "zh";
                oops.storage.set("language", lan);
            }

            // 加载语言包资源
            oops.language.setLanguage(lan, next);
        });
    }

    /** 加载公共资源（必备） */
    private loadCommon(queue: AsyncQueue) {
        queue.push((next: NextFunction, params: any, args: any) => {
            oops.res.loadDir("common", next);
        });

        // TODO: 在这里加载你的游戏 bundle
        // 示例:
        // queue.push(async (next: NextFunction) => {
        //     console.log('[InitRes] Loading game bundle...');
        //     const bundle = await oops.res.loadBundle('your-bundle-name');
        //     next();
        // });
    }

    /** 加载完成后移除初始化组件 */
    private onComplete(queue: AsyncQueue, e: Initialize) {
        queue.complete = () => {
            try {
                e.remove(InitResComp);
            } catch (error) {
                console.error('[InitRes] 移除初始化组件出错:', error);
            }
        };
    }
}
