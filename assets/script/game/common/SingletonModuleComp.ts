/*
 * @Author: dgflash
 * @Date: 2021-07-03 16:13:17
 * @LastEditors: dgflash
 * @LastEditTime: 2022-08-05 18:25:56
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Account } from "../account/Account";
import type { Initialize } from "../initialize/Initialize";
import type { GameState } from "../gameState/GameState";
import type { Farm } from "../farm/Farm";
import type { Factory } from "../factory/Factory";

/** 游戏单例业务模块 */
@ecs.register('SingletonModule')
export class SingletonModuleComp extends ecs.Comp {
    /** 游戏初始化模块 */
    initialize: Initialize = null!;
    /** 游戏账号模块 */
    account: Account = null!;
    /** 游戏状态模块 */
    gameState: GameState = null!;
    /** 农场模块 */
    farm: Farm = null!;
    /** 工厂模块 */
    factory: Factory = null!;

    reset() { }
}

export var smc: SingletonModuleComp = ecs.getSingleton(SingletonModuleComp);
