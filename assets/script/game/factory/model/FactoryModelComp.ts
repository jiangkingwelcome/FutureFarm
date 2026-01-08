/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 工厂数据组件
 * 管理所有机器和产品数据
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { MachineModel, MachineStatus } from "./MachineModel";
import { ProductModel } from "./ProductModel";
import { FactoryDataMission } from "../../common/data/FactoryData";

/**
 * 工厂数据组件
 * 管理所有机器和产品数据
 */
@ecs.register('FactoryModel')
export class FactoryModelComp extends ecs.Comp {
    /** 机器列表 */
    public machines: MachineModel[] = [];

    /** 当前关卡ID */
    public currentMissionId: number = 0;

    /** 是否允许损坏 */
    public canBreak: boolean = false;

    /** 已生产产品总数 */
    public totalProduced: number = 0;

    /** 目标产品数量 */
    public targetProducts: number = 0;

    /** 工厂配置数据 */
    public factoryDataMission: FactoryDataMission | null = null;

    reset(): void {
        this.machines = [];
        this.currentMissionId = 0;
        this.canBreak = false;
        this.totalProduced = 0;
        this.targetProducts = 0;
        this.factoryDataMission = null;
    }

    /**
     * 初始化工厂数据
     * @param missionId 关卡ID
     * @param factoryDataMission 工厂配置数据
     */
    public initFromConfig(missionId: number, factoryDataMission: FactoryDataMission): void {
        this.currentMissionId = missionId;
        this.canBreak = factoryDataMission.positionUnlock.isCanBreak;
        this.targetProducts = factoryDataMission.targetProducts;
        this.factoryDataMission = factoryDataMission;

        // 清空现有数据
        this.machines = [];
        this.totalProduced = 0;

        // 初始化机器
        factoryDataMission.machinedatas.forEach((machineConfig) => {
            const machineModel = new MachineModel(
                machineConfig.iDMachine,
                machineConfig.index,
                machineConfig.maxLevel
            );
            
            machineModel.currentLevel = machineConfig.startLevel;
            machineModel.unlocked = machineConfig.index < factoryDataMission.positionUnlock.positionUnLockBegin;
            
            // 初始化机器数量（如果有多个相同机器）
            // 注意：这里简化处理，实际可能需要创建多个机器实例
            this.machines.push(machineModel);
        });

        console.log(`[FactoryModel] 初始化关卡 ${missionId}`);
        console.log(`[FactoryModel] 机器数量: ${this.machines.length}`);
        console.log(`[FactoryModel] 目标产品: ${this.targetProducts}`);
        console.log(`[FactoryModel] 允许损坏: ${this.canBreak}`);
    }

    /**
     * 获取指定索引的机器
     * @param index 索引
     */
    public getMachine(index: number): MachineModel | null {
        if (index >= 0 && index < this.machines.length) {
            return this.machines[index];
        }
        return null;
    }

    /**
     * 根据机器ID获取机器
     * @param machineId 机器ID
     */
    public getMachineById(machineId: number): MachineModel | null {
        return this.machines.find(m => m.machineId === machineId) || null;
    }

    /**
     * 获取所有空闲机器
     */
    public getIdleMachines(): MachineModel[] {
        return this.machines.filter(m => m.status === MachineStatus.Idle && m.unlocked);
    }

    /**
     * 获取所有生产中的机器
     */
    public getProducingMachines(): MachineModel[] {
        return this.machines.filter(m => m.status === MachineStatus.Producing);
    }

    /**
     * 获取所有损坏的机器
     */
    public getBrokenMachines(): MachineModel[] {
        return this.machines.filter(m => m.status === MachineStatus.Broken);
    }

    /**
     * 增加已生产产品数量
     * @param count 数量（默认1）
     */
    public addProducedCount(count: number = 1): void {
        this.totalProduced += count;
        console.log(`[FactoryModel] 已生产产品: ${this.totalProduced}/${this.targetProducts}`);
    }

    /**
     * 检查是否达到目标
     */
    public isTargetReached(): boolean {
        return this.targetProducts > 0 && this.totalProduced >= this.targetProducts;
    }
}
