/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 种植系统
 * 处理作物种植逻辑
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Farm } from "../Farm";
import { FieldType } from "../model/FieldModel";
import { smc } from "../../common/SingletonModuleComp";

/**
 * 种植系统
 * 处理种植相关的业务逻辑
 */
@ecs.register('PlantSystem')
export class PlantSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ecs.getMatcher(Farm));
    }

    entityEnter(e: Farm): void {
        console.log('[PlantSystem] 种植系统已启动');
    }

    /**
     * 种植作物
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param cropId 作物ID
     * @param slotIndex 槽位索引（可选，不指定则自动找空位）
     * @returns 是否成功
     */
    public plantCrop(fieldType: FieldType, fieldIndex: number, cropId: number, slotIndex?: number): boolean {
        const farmModel = smc.farm.FarmModel;
        
        // 检查田地是否存在
        const field = farmModel.getField(fieldType, fieldIndex);
        if (!field) {
            console.warn(`[PlantSystem] 田地不存在: type=${fieldType}, index=${fieldIndex}`);
            return false;
        }

        // 如果没有指定槽位，自动找空位
        if (slotIndex === undefined) {
            slotIndex = field.getEmptySlotIndex();
            if (slotIndex < 0) {
                console.warn(`[PlantSystem] 没有空位: type=${fieldType}, index=${fieldIndex}`);
                return false;
            }
        }

        // 执行种植
        const success = farmModel.plantCrop(fieldType, fieldIndex, cropId, slotIndex);
        
        if (success) {
            const crop = field.getCrop(slotIndex);
            console.log(`[PlantSystem] ✅ 种植成功: 田地[${fieldType}-${fieldIndex}] 槽位[${slotIndex}] 作物[${cropId}]`);
            console.log(`[PlantSystem] 种植时间: ${new Date(crop!.plantTime).toLocaleTimeString()}`);
        } else {
            console.warn(`[PlantSystem] ❌ 种植失败: 田地[${fieldType}-${fieldIndex}] 槽位[${slotIndex}]`);
        }

        return success;
    }

    /**
     * 批量种植作物
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param cropId 作物ID
     * @param count 种植数量
     * @returns 成功种植的数量
     */
    public plantCropsBatch(fieldType: FieldType, fieldIndex: number, cropId: number, count: number): number {
        let successCount = 0;
        
        for (let i = 0; i < count; i++) {
            if (this.plantCrop(fieldType, fieldIndex, cropId)) {
                successCount++;
            } else {
                break; // 没有空位了，停止
            }
        }

        console.log(`[PlantSystem] 批量种植完成: 成功 ${successCount}/${count}`);
        return successCount;
    }

    /**
     * 检查是否可以种植
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @returns 是否有空位
     */
    public canPlant(fieldType: FieldType, fieldIndex: number): boolean {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType, fieldIndex);
        return field ? field.hasEmptySlot() : false;
    }

    /**
     * 获取可用空位数量
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @returns 空位数量
     */
    public getEmptySlotCount(fieldType: FieldType, fieldIndex: number): number {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType, fieldIndex);
        if (!field) {
            return 0;
        }

        return field.crops.filter(c => c.isEmpty()).length;
    }
}
