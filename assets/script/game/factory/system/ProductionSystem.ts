/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 生产系统
 * 处理产品生产逻辑
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Factory } from "../Factory";
import { smc } from "../../common/SingletonModuleComp";
import { ProductModel, ProductStatus } from "../model/ProductModel";
import { MachineModel, MachineStatus } from "../model/MachineModel";

/**
 * 生产系统
 * 处理产品生产相关的业务逻辑
 */
@ecs.register('ProductionSystem')
export class ProductionSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ecs.getMatcher(Factory));
    }

    entityEnter(e: Factory): void {
        console.log('[ProductionSystem] 生产系统已启动');
    }

    /**
     * 开始生产产品
     * @param machineIndex 机器索引
     * @param productId 产品ID
     * @returns 是否成功
     */
    public startProduction(machineIndex: number, productId: number): boolean {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            console.warn(`[ProductionSystem] 机器不存在: index=${machineIndex}`);
            return false;
        }

        if (!machine.unlocked) {
            console.warn(`[ProductionSystem] 机器未解锁: index=${machineIndex}`);
            return false;
        }

        if (machine.status === MachineStatus.Broken) {
            console.warn(`[ProductionSystem] 机器已损坏: index=${machineIndex}`);
            return false;
        }

        // 创建产品并添加到队列
        const product = new ProductModel(productId);
        const success = machine.addToQueue(product);
        
        if (success) {
            // 如果机器空闲，立即开始生产
            if (machine.status === MachineStatus.Idle) {
                machine.startProduction();
            }
            console.log(`[ProductionSystem] ✅ 开始生产: 机器${machineIndex}, 产品${productId}`);
        }
        
        return success;
    }

    /**
     * 更新生产进度
     * 应该在每帧或定时调用
     * @param deltaTime 时间间隔（秒）
     */
    public updateProduction(deltaTime: number): void {
        const factoryModel = smc.factory.FactoryModel;
        
        factoryModel.machines.forEach((machine, index) => {
            if (machine.status === MachineStatus.Producing && machine.currentProduct) {
                // 获取生产时间（根据机器等级和产品类型，这里简化处理）
                const productionTime = this.getProductionTime(machine.currentProduct.productId, machine.currentLevel);
                
                // 更新产品进度
                machine.currentProduct.updateProgress(productionTime);
                
                // 检查是否完成
                if (machine.currentProduct.isCompleted()) {
                    this.completeProduction(index);
                }
            }
        });
    }

    /**
     * 完成生产
     * @param machineIndex 机器索引
     * @returns 完成的产品，如果没有则返回 null
     */
    public completeProduction(machineIndex: number): ProductModel | null {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            return null;
        }

        const product = machine.completeProduction();
        
        if (product) {
            // 增加已生产数量
            factoryModel.addProducedCount(1);
            
            console.log(`[ProductionSystem] ✅ 生产完成: 机器${machineIndex}, 产品${product.productId}`);
            
            // TODO: 触发生产完成事件，通知视图层更新
        }
        
        return product;
    }

    /**
     * 获取生产时间（秒）
     * @param productId 产品ID
     * @param machineLevel 机器等级
     * @returns 生产时间（秒）
     */
    private getProductionTime(productId: number, machineLevel: number): number {
        // TODO: 从配置中读取生产时间
        // 这里简化处理，根据产品ID和机器等级计算
        const baseTime = 10; // 基础生产时间10秒
        const levelBonus = machineLevel * 0.1; // 每级减少10%
        return baseTime * (1 - levelBonus);
    }

    /**
     * 批量生产产品
     * @param machineIndex 机器索引
     * @param productId 产品ID
     * @param count 数量
     * @returns 成功添加的数量
     */
    public batchProduction(machineIndex: number, productId: number, count: number): number {
        let successCount = 0;
        
        for (let i = 0; i < count; i++) {
            if (this.startProduction(machineIndex, productId)) {
                successCount++;
            } else {
                break; // 如果失败，停止添加
            }
        }
        
        console.log(`[ProductionSystem] 批量生产: 机器${machineIndex}, 产品${productId}, 成功${successCount}/${count}`);
        return successCount;
    }

    /**
     * 取消生产（从队列中移除）
     * @param machineIndex 机器索引
     * @param queueIndex 队列索引（0为当前生产的产品）
     * @returns 是否成功
     */
    public cancelProduction(machineIndex: number, queueIndex: number): boolean {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            return false;
        }

        if (queueIndex === 0 && machine.currentProduct) {
            // 取消当前生产
            machine.currentProduct = null;
            machine.status = MachineStatus.Idle;
            
            // 开始下一个产品
            if (machine.productionQueue.length > 0) {
                machine.startProduction();
            }
            
            console.log(`[ProductionSystem] ✅ 取消当前生产: 机器${machineIndex}`);
            return true;
        } else if (queueIndex > 0 && queueIndex <= machine.productionQueue.length) {
            // 从队列中移除
            machine.productionQueue.splice(queueIndex - 1, 1);
            console.log(`[ProductionSystem] ✅ 从队列移除: 机器${machineIndex}, 位置${queueIndex}`);
            return true;
        }

        return false;
    }
}
