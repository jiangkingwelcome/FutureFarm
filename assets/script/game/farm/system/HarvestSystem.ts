/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 收获系统
 * 处理作物收获逻辑
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Farm } from "../Farm";
import { FieldType } from "../model/FieldModel";
import { smc } from "../../common/SingletonModuleComp";

/**
 * 收获结果
 */
export interface HarvestResult {
    /** 是否成功 */
    success: boolean;
    /** 收获的作物ID */
    cropId: number;
    /** 收获数量 */
    count: number;
    /** 获得的金钱（如果有） */
    money: number;
}

/**
 * 收获系统
 * 处理收获相关的业务逻辑
 */
@ecs.register('HarvestSystem')
export class HarvestSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ecs.getMatcher(Farm));
    }

    entityEnter(e: Farm): void {
        console.log('[HarvestSystem] 收获系统已启动');
    }

    /**
     * 收获单个作物
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引
     * @returns 收获结果
     */
    public harvestCrop(fieldType: FieldType, fieldIndex: number, slotIndex: number): HarvestResult {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType, fieldIndex);
        
        if (!field) {
            console.warn(`[HarvestSystem] 田地不存在: type=${fieldType}, index=${fieldIndex}`);
            return { success: false, cropId: 0, count: 0, money: 0 };
        }

        const crop = field.getCrop(slotIndex);
        if (!crop || !crop.isMature()) {
            console.warn(`[HarvestSystem] 作物未成熟或不存在: type=${fieldType}, index=${fieldIndex}, slot=${slotIndex}`);
            return { success: false, cropId: 0, count: 0, money: 0 };
        }

        const cropId = crop.cropId;
        
        // 执行收获
        const harvestedCropId = farmModel.harvestCrop(fieldType, fieldIndex, slotIndex);
        
        if (harvestedCropId > 0) {
            // TODO: 从配置中获取作物售价
            // 这里暂时使用固定值（实际应该从作物配置中读取）
            const cropPrice = 10; // 每个作物10金币（示例值）
            
            // 增加金钱
            const gameStateModel = smc.gameState.GameStateModel;
            gameStateModel.addMoney(cropPrice);

            console.log(`[HarvestSystem] ✅ 收获成功: 田地[${fieldType}-${fieldIndex}] 槽位[${slotIndex}] 作物[${cropId}] 获得${cropPrice}金币`);

            return {
                success: true,
                cropId: harvestedCropId,
                count: 1,
                money: cropPrice
            };
        }

        return { success: false, cropId: 0, count: 0, money: 0 };
    }

    /**
     * 收获指定田地的所有成熟作物
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @returns 收获结果
     */
    public harvestAllMatureCrops(fieldType: FieldType, fieldIndex: number): HarvestResult {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType, fieldIndex);
        
        if (!field) {
            return { success: false, cropId: 0, count: 0, money: 0 };
        }

        let totalCount = 0;
        let totalMoney = 0;
        const cropIds: number[] = [];

        // 从后往前遍历，避免索引变化问题
        for (let i = field.crops.length - 1; i >= 0; i--) {
            if (field.crops[i].isMature()) {
                const result = this.harvestCrop(fieldType, fieldIndex, i);
                if (result.success) {
                    totalCount += result.count;
                    totalMoney += result.money;
                    cropIds.push(result.cropId);
                }
            }
        }

        if (totalCount > 0) {
            console.log(`[HarvestSystem] ✅ 批量收获完成: 田地[${fieldType}-${fieldIndex}] 收获${totalCount}个作物，获得${totalMoney}金币`);
        }

        return {
            success: totalCount > 0,
            cropId: cropIds.length > 0 ? cropIds[0] : 0,
            count: totalCount,
            money: totalMoney
        };
    }

    /**
     * 收获所有田地的所有成熟作物
     * @returns 收获结果
     */
    public harvestAllFields(): HarvestResult {
        const farmModel = smc.farm.FarmModel;
        const allFields = farmModel.getAllFields();

        let totalCount = 0;
        let totalMoney = 0;
        const cropIds: number[] = [];

        for (const field of allFields) {
            const result = this.harvestAllMatureCrops(field.idField as FieldType, field.index);
            if (result.success) {
                totalCount += result.count;
                totalMoney += result.money;
                if (result.cropId > 0) {
                    cropIds.push(result.cropId);
                }
            }
        }

        if (totalCount > 0) {
            console.log(`[HarvestSystem] ✅ 全农场收获完成: 共收获${totalCount}个作物，获得${totalMoney}金币`);
        }

        return {
            success: totalCount > 0,
            cropId: cropIds.length > 0 ? cropIds[0] : 0,
            count: totalCount,
            money: totalMoney
        };
    }

    /**
     * 获取可收获的作物数量
     * @param fieldType 田地类型（可选）
     * @param fieldIndex 田地索引（可选）
     * @returns 可收获的作物数量
     */
    public getHarvestableCount(fieldType?: FieldType, fieldIndex?: number): number {
        const farmModel = smc.farm.FarmModel;
        
        if (fieldType !== undefined && fieldIndex !== undefined) {
            // 获取指定田地
            const field = farmModel.getField(fieldType, fieldIndex);
            return field ? field.getMatureCropCount() : 0;
        } else {
            // 获取所有田地
            const matureCrops = farmModel.getAllMatureCrops();
            return matureCrops.length;
        }
    }
}
