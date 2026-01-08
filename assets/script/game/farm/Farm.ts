/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 农场模块实体
 * 管理农场相关的所有组件和系统
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { FarmModelComp } from "./model/FarmModelComp";

/** 农场模块实体 */
@ecs.register('Farm')
export class Farm extends CCEntity {
    /** 农场数据组件 */
    FarmModel!: FarmModelComp;

    protected init(): void {
        this.addComponents<ecs.Comp>(FarmModelComp);
    }
}
