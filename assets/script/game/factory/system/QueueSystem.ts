/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 队列系统
 * 处理生产队列管理逻辑
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Factory } from "../Factory";
import { smc } from "../../common/SingletonModuleComp";
import { MachineModel, MachineStatus } from "../model/MachineModel";
import { ProductModel } from "../model/ProductModel";

/**
 * 队列系统
 * 处理生产队列相关的业务逻辑
 */
@ecs.register('QueueSystem')
export class QueueSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ecs.getMatcher(Factory));
    }

    entityEnter(e: Factory): void {
        console.log('[QueueSystem] 队列系统已启动');
    }

    /**
     * 获取机器的队列信息
     * @param machineIndex 机器索引
     * @returns 队列信息对象
     */
    public getQueueInfo(machineIndex: number): {
        current: ProductModel | null;
        queue: ProductModel[];
        totalCount: number;
        maxQueueSize: number;
    } {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            return {
                current: null,
                queue: [],
                totalCount: 0,
                maxQueueSize: this.getMaxQueueSize(machineIndex)
            };
        }

        return {
            current: machine.currentProduct,
            queue: [...machine.productionQueue],
            totalCount: (machine.currentProduct ? 1 : 0) + machine.productionQueue.length,
            maxQueueSize: this.getMaxQueueSize(machineIndex)
        };
    }

    /**
     * 清空机器队列
     * @param machineIndex 机器索引
     * @returns 是否成功
     */
    public clearQueue(machineIndex: number): boolean {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            return false;
        }

        // 清空队列
        machine.productionQueue = [];
        
        // 如果正在生产，停止当前生产
        if (machine.currentProduct) {
            machine.currentProduct = null;
            machine.status = MachineStatus.Idle;
        }

        console.log(`[QueueSystem] ✅ 清空队列: 机器${machineIndex}`);
        return true;
    }

    /**
     * 调整队列顺序（将某个产品移到前面）
     * @param machineIndex 机器索引
     * @param fromIndex 源索引（队列中的位置，0为当前生产）
     * @param toIndex 目标索引
     * @returns 是否成功
     */
    public reorderQueue(machineIndex: number, fromIndex: number, toIndex: number): boolean {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            return false;
        }

        // 不能移动当前生产的产品
        if (fromIndex === 0 || toIndex === 0) {
            return false;
        }

        // 调整索引（减去1，因为0是当前生产）
        const queueFromIndex = fromIndex - 1;
        const queueToIndex = toIndex - 1;

        if (queueFromIndex < 0 || queueFromIndex >= machine.productionQueue.length ||
            queueToIndex < 0 || queueToIndex >= machine.productionQueue.length) {
            return false;
        }

        // 移动元素
        const [moved] = machine.productionQueue.splice(queueFromIndex, 1);
        machine.productionQueue.splice(queueToIndex, 0, moved);

        console.log(`[QueueSystem] ✅ 调整队列顺序: 机器${machineIndex}, ${fromIndex} -> ${toIndex}`);
        return true;
    }

    /**
     * 检查队列是否已满
     * @param machineIndex 机器索引
     * @returns 是否已满
     */
    public isQueueFull(machineIndex: number): boolean {
        const queueInfo = this.getQueueInfo(machineIndex);
        return queueInfo.totalCount >= queueInfo.maxQueueSize;
    }

    /**
     * 获取队列剩余空间
     * @param machineIndex 机器索引
     * @returns 剩余空间数量
     */
    public getQueueRemainingSpace(machineIndex: number): number {
        const queueInfo = this.getQueueInfo(machineIndex);
        return Math.max(0, queueInfo.maxQueueSize - queueInfo.totalCount);
    }

    /**
     * 获取最大队列大小
     * @param machineIndex 机器索引
     * @returns 最大队列大小
     */
    private getMaxQueueSize(machineIndex: number): number {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            return 0;
        }

        // TODO: 从配置中读取队列大小
        // 这里简化处理，根据机器等级决定队列大小
        const baseQueueSize = 5;
        return baseQueueSize + Math.floor(machine.currentLevel / 2);
    }

    /**
     * 获取所有机器的队列统计
     * @returns 统计信息
     */
    public getAllQueuesStats(): {
        totalMachines: number;
        totalProducts: number;
        producingMachines: number;
        idleMachines: number;
        brokenMachines: number;
    } {
        const factoryModel = smc.factory.FactoryModel;
        
        let totalProducts = 0;
        let producingMachines = 0;
        let idleMachines = 0;
        let brokenMachines = 0;

        factoryModel.machines.forEach(machine => {
            if (machine.currentProduct) {
                totalProducts++;
            }
            totalProducts += machine.productionQueue.length;

            switch (machine.status) {
                case MachineStatus.Producing:
                    producingMachines++;
                    break;
                case MachineStatus.Idle:
                    idleMachines++;
                    break;
                case MachineStatus.Broken:
                    brokenMachines++;
                    break;
            }
        });

        return {
            totalMachines: factoryModel.machines.length,
            totalProducts,
            producingMachines,
            idleMachines,
            brokenMachines
        };
    }
}
