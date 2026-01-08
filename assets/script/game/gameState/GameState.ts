/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 游戏状态实体
 * 管理全局游戏状态（金钱、时间、星级等）
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { GameStateModelComp } from "./model/GameStateModelComp";

/** 游戏状态模块 */
@ecs.register('GameState')
export class GameState extends CCEntity {
    GameStateModel!: GameStateModelComp;

    protected init() {
        this.addComponents<ecs.Comp>(GameStateModelComp);
    }
}
