/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 工厂数据类
 * 对应 Unity 的 FactoryDataMission 相关类
 */

import { ItemBase, TypeShow } from './ItemBase';

/**
 * 机器数据
 * 对应 Unity 的 MachineInData
 */
export class MachineInData extends ItemBase {
    /** 机器ID */
    public iDMachine: number;
    /** 初始数量 */
    public startNumber: number = 0;
    /** 目标数量 */
    public targetNumber: number = 0;
    /** 初始等级 */
    public startLevel: number = 1;
    /** 目标等级 */
    public targetLevel: number = 1;
    /** 最大等级 */
    public maxLevel: number = 1;

    constructor(iDMachine: number) {
        super();
        this.iDMachine = iDMachine;
        this.startNumber = 0;
        this.targetNumber = 0;
        this.startLevel = 1;
        this.targetLevel = 1;
        this.maxLevel = 1;
        this.currentLevel = 1;
        this.currentNumber = 0;
    }

    /**
     * 获取目标值
     * 根据 typeShow 返回 targetLevel 或 targetNumber
     */
    public getTarget(): number {
        if (this.typeShow === TypeShow.TargetLevel) {
            return this.targetLevel;
        } else {
            return this.targetNumber;
        }
    }

    /**
     * 获取类型
     * 返回机器ID
     */
    public getType(): number {
        return this.iDMachine;
    }
}

/**
 * 位置解锁数据
 * 对应 Unity 的 PositionUnLockInData
 */
export class PositionUnLockInData extends ItemBase {
    /** 初始解锁位置数 */
    public positionUnLockBegin: number;
    /** 目标解锁位置数 */
    public targetPositionUnlock: number;
    /** 是否允许损坏 */
    public isCanBreak: boolean = false;

    constructor(positionUnLockBegin: number, targetPositionUnlock: number = 0) {
        super();
        this.positionUnLockBegin = positionUnLockBegin;
        this.targetPositionUnlock = targetPositionUnlock;
        this.currentNumber = positionUnLockBegin;
    }

    /**
     * 获取目标值
     * 根据 typeShow 返回 0 或 targetPositionUnlock
     */
    public getTarget(): number {
        if (this.typeShow === TypeShow.TargetLevel) {
            return 0;
        } else {
            return this.targetPositionUnlock;
        }
    }

    /**
     * 获取类型
     * PositionUnLockInData 的类型固定为 0
     */
    public getType(): number {
        return 0;
    }
}

/**
 * 工厂模块数据
 * 对应 Unity 的 FactoryDataMission
 */
export class FactoryDataMission extends ItemBase {
    /** 位置解锁数据 */
    public positionUnlock: PositionUnLockInData;
    /** 机器数据列表 */
    public machinedatas: MachineInData[] = [];
    /** 目标产品数量 */
    public targetProducts: number = 0;

    constructor() {
        super();
        this.positionUnlock = new PositionUnLockInData(0, 0);
        this.machinedatas = [];
        this.targetProducts = 0;
    }

    /**
     * 从配置数据初始化
     * @param config 配置数据（从 JSON 解析）
     */
    public initFromConfig(config: any): void {
        // 解析位置解锁数据
        if (config.positionUnlock) {
            this.positionUnlock = new PositionUnLockInData(
                config.positionUnlock.positionUnLockBegin || 0,
                config.positionUnlock.targetPositionUnlock || 0
            );
            this.positionUnlock.isCanBreak = config.positionUnlock.isCanBreak || false;
        }

        // 解析机器数据
        this.machinedatas = [];
        if (config.machines && Array.isArray(config.machines)) {
            config.machines.forEach((machineConfig: any, index: number) => {
                const machine = new MachineInData(machineConfig.id || machineConfig.iDMachine || 0);
                machine.startNumber = machineConfig.startNumber || 0;
                machine.targetNumber = machineConfig.targetNumber || 0;
                machine.startLevel = machineConfig.startLevel || 1;
                machine.targetLevel = machineConfig.targetLevel || 1;
                machine.maxLevel = machineConfig.maxLevel || 1;
                machine.currentLevel = machine.startLevel;
                machine.currentNumber = machine.startNumber;
                machine.index = index;
                
                // 确保 maxLevel >= targetLevel
                if (machine.maxLevel < machine.targetLevel) {
                    machine.maxLevel = machine.targetLevel;
                }
                
                this.machinedatas.push(machine);
            });
            
            // 按机器ID排序
            this.machinedatas.sort((a, b) => a.iDMachine - b.iDMachine);
        }

        // 解析目标产品数量
        this.targetProducts = config.targetProducts || config.targetProductions || 0;
    }

    /**
     * 获取目标值
     * 根据 typeShow 返回 0 或 targetProducts
     */
    public getTarget(): number {
        if (this.typeShow === TypeShow.TargetLevel) {
            return 0;
        } else {
            return this.targetProducts;
        }
    }

    /**
     * 获取类型
     * FactoryDataMission 的类型固定为 0
     */
    public getType(): number {
        return 0;
    }
}
