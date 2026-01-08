/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 工厂模块实体
 * 管理工厂相关的所有组件和系统
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCEntity } from "db://oops-framework/module/common/CCEntity";
import { FactoryModelComp } from "./model/FactoryModelComp";
import { ProductionSystem } from "./system/ProductionSystem";
import { MachineSystem } from "./system/MachineSystem";
import { QueueSystem } from "./system/QueueSystem";

/** 工厂模块实体 */
@ecs.register('Factory')
export class Factory extends CCEntity {
    /** 工厂数据组件 */
    FactoryModel!: FactoryModelComp;
    
    /** 生产系统 */
    ProductionSystem!: ProductionSystem;
    
    /** 机器管理系统 */
    MachineSystem!: MachineSystem;
    
    /** 队列系统 */
    QueueSystem!: QueueSystem;

    protected init(): void {
        this.addComponents<ecs.Comp>(FactoryModelComp);
        this.addSystems<ecs.System>(ProductionSystem, MachineSystem, QueueSystem);
    }
}
