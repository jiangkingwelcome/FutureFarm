/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 养殖系统
 * 处理动物养殖逻辑（与种植系统类似，但针对动物）
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Farm } from "../Farm";
import { FieldType } from "../model/FieldModel";
import { CropStatus } from "../model/CropModel";
import { smc } from "../../common/SingletonModuleComp";
import { PlantSystem } from "./PlantSystem";
import { GrowthSystem } from "./GrowthSystem";
import { HarvestSystem } from "./HarvestSystem";

/**
 * 养殖系统
 * 处理动物养殖相关的业务逻辑
 * 注意：动物和植物的逻辑基本相同，但可能有特殊处理
 */
@ecs.register('BreedSystem')
export class BreedSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ecs.getMatcher(Farm));
    }

    entityEnter(e: Farm): void {
        console.log('[BreedSystem] 养殖系统已启动');
    }

    /**
     * 养殖动物（实际调用种植系统）
     * @param fieldType 田地类型（畜栏或池塘）
     * @param fieldIndex 田地索引
     * @param animalId 动物ID
     * @param slotIndex 槽位索引（可选）
     * @returns 是否成功
     */
    public breedAnimal(fieldType: FieldType, fieldIndex: number, animalId: number, slotIndex?: number): boolean {
        // 检查是否为动物类型田地
        if (fieldType !== FieldType.Cage && fieldType !== FieldType.Pond) {
            console.warn(`[BreedSystem] 不是动物类型田地: type=${fieldType}`);
            return false;
        }

        // 使用种植系统的逻辑（动物和植物的种植逻辑相同）
        const plantSystem = ecs.getSystem(PlantSystem);
        if (plantSystem) {
            return plantSystem.plantCrop(fieldType, fieldIndex, animalId, slotIndex);
        }

        return false;
    }

    /**
     * 检查动物是否生病
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引
     * @returns 是否生病
     */
    public checkAnimalSick(fieldType: FieldType, fieldIndex: number, slotIndex: number): boolean {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType, fieldIndex);
        
        if (!field) {
            return false;
        }

        const crop = field.getCrop(slotIndex);
        return crop ? crop.isSickStatus() : false;
    }

    /**
     * 设置动物生病
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引
     * @returns 是否成功
     */
    public setAnimalSick(fieldType: FieldType, fieldIndex: number, slotIndex: number): boolean {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType, fieldIndex);
        
        if (!field) {
            return false;
        }

        const crop = field.getCrop(slotIndex);
        if (!crop || crop.isEmpty()) {
            return false;
        }

        // 检查是否允许生病
        if (!farmModel.canSick) {
            console.log(`[BreedSystem] 当前关卡不允许生病`);
            return false;
        }

        crop.setSick();
        console.log(`[BreedSystem] ⚠️ 动物生病: 田地[${fieldType}-${fieldIndex}] 槽位[${slotIndex}]`);
        return true;
    }

    /**
     * 治愈动物
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引
     * @returns 是否成功
     */
    public cureAnimal(fieldType: FieldType, fieldIndex: number, slotIndex: number): boolean {
        const farmModel = smc.farm.FarmModel;
        const field = farmModel.getField(fieldType, fieldIndex);
        
        if (!field) {
            return false;
        }

        const crop = field.getCrop(slotIndex);
        if (!crop || !crop.isSickStatus()) {
            return false;
        }

        crop.cure();
        console.log(`[BreedSystem] ✅ 动物治愈: 田地[${fieldType}-${fieldIndex}] 槽位[${slotIndex}]`);
        return true;
    }

    /**
     * 收获动物（实际调用收获系统）
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引
     * @returns 收获结果
     */
    public harvestAnimal(fieldType: FieldType, fieldIndex: number, slotIndex: number) {
        const harvestSystem = ecs.getSystem(HarvestSystem);
        if (harvestSystem) {
            return harvestSystem.harvestCrop(fieldType, fieldIndex, slotIndex);
        }
        
        return { success: false, cropId: 0, count: 0, money: 0 };
    }

    /**
     * 获取所有生病的动物
     * @returns 生病动物列表
     */
    public getAllSickAnimals(): { fieldType: FieldType, fieldIndex: number, slotIndex: number }[] {
        const farmModel = smc.farm.FarmModel;
        const sickCrops = farmModel.getAllSickCrops();
        
        return sickCrops
            .filter(item => item.field.idField === FieldType.Cage || item.field.idField === FieldType.Pond)
            .map(item => ({
                fieldType: item.field.idField as FieldType,
                fieldIndex: item.field.index,
                slotIndex: item.slotIndex
            }));
    }
}
