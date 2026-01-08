/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 生长系统
 * 处理作物生长逻辑
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Farm } from "../Farm";
import { CropStatus } from "../model/CropModel";
import { smc } from "../../common/SingletonModuleComp";

/**
 * 生长系统
 * 处理作物生长相关的业务逻辑
 */
@ecs.register('GrowthSystem')
export class GrowthSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    /** 更新间隔（秒） */
    private readonly UPDATE_INTERVAL: number = 1.0;
    
    /** 上次更新时间 */
    private lastUpdateTime: number = 0;

    filter(): ecs.IMatcher {
        return ecs.allOf(ecs.getMatcher(Farm));
    }

    entityEnter(e: Farm): void {
        console.log('[GrowthSystem] 生长系统已启动');
        this.lastUpdateTime = Date.now();
    }

    /**
     * 更新系统（每帧调用）
     * @param dt 帧间隔（秒）
     */
    update(dt: number): void {
        const now = Date.now();
        const elapsed = (now - this.lastUpdateTime) / 1000; // 转换为秒

        // 按固定间隔更新
        if (elapsed >= this.UPDATE_INTERVAL) {
            this.updateGrowth(elapsed);
            this.lastUpdateTime = now;
        }
    }

    /**
     * 更新所有作物的生长进度
     * @param deltaTime 时间间隔（秒）
     */
    private updateGrowth(deltaTime: number): void {
        const farmModel = smc.farm.FarmModel;
        const allFields = farmModel.getAllFields();

        for (const field of allFields) {
            for (const crop of field.crops) {
                if (crop.isEmpty() || crop.isMature() || crop.isSickStatus()) {
                    continue;
                }

                // 获取已生长时间
                const grownTime = crop.getGrownTime();
                
                // TODO: 从配置中获取作物总生长时间
                // 这里暂时使用固定值（实际应该从作物配置中读取）
                const totalGrowTime = 60; // 60秒成熟（示例值）

                // 更新生长进度
                crop.updateGrowth(grownTime, totalGrowTime);

                // 检查是否成熟
                if (crop.isMature()) {
                    console.log(`[GrowthSystem] 🌾 作物成熟: 田地[${field.idField}-${field.index}] 作物[${crop.cropId}]`);
                }
            }
        }
    }

    /**
     * 手动更新指定作物的生长进度
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引
     * @param totalGrowTime 总生长时间（秒）
     */
    public updateCropGrowth(fieldType: number, fieldIndex: number, slotIndex: number, totalGrowTime: number): void {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType as any, fieldIndex);
        if (!field) {
            return;
        }

        const crop = field.getCrop(slotIndex);
        if (!crop || crop.isEmpty()) {
            return;
        }

        const grownTime = crop.getGrownTime();
        crop.updateGrowth(grownTime, totalGrowTime);
    }

    /**
     * 加速生长（用于测试或特殊道具）
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引
     * @param seconds 加速的秒数
     */
    public accelerateGrowth(fieldType: number, fieldIndex: number, slotIndex: number, seconds: number): void {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType as any, fieldIndex);
        if (!field) {
            return;
        }

        const crop = field.getCrop(slotIndex);
        if (!crop || crop.isEmpty()) {
            return;
        }

        // 减少种植时间（相当于增加已生长时间）
        crop.plantTime -= seconds * 1000;
        console.log(`[GrowthSystem] ⚡ 加速生长: 田地[${fieldType}-${fieldIndex}] 槽位[${slotIndex}] +${seconds}秒`);
    }
}
