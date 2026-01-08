/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 农场数据组件
 * 管理所有田地和作物数据
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { FieldModel, FieldType } from "./FieldModel";
import { CropModel } from "./CropModel";
import { FarmDataMission } from "../../common/data/FarmData";

/**
 * 农场数据组件
 * 管理所有田地和作物数据
 */
@ecs.register('FarmModel')
export class FarmModelComp extends ecs.Comp {
    /** 农田列表 */
    public fields: FieldModel[] = [];

    /** 畜栏列表 */
    public cages: FieldModel[] = [];

    /** 池塘列表 */
    public ponds: FieldModel[] = [];

    /** 当前关卡ID */
    public currentMissionId: number = 0;

    /** 是否允许生病 */
    public canSick: boolean = false;

    /** 收获统计 - 农田作物 */
    public harvestFieldCount: number = 0;

    /** 收获统计 - 畜栏动物 */
    public harvestCageCount: number = 0;

    /** 农场配置数据 */
    public farmDataMission: FarmDataMission | null = null;

    reset(): void {
        this.fields = [];
        this.cages = [];
        this.ponds = [];
        this.currentMissionId = 0;
        this.canSick = false;
        this.harvestFieldCount = 0;
        this.harvestCageCount = 0;
        this.farmDataMission = null;
    }

    /**
     * 初始化农场数据
     * @param missionId 关卡ID
     * @param farmDataMission 农场配置数据
     */
    public initFromConfig(missionId: number, farmDataMission: FarmDataMission): void {
        this.currentMissionId = missionId;
        this.canSick = farmDataMission.isCanSick;
        this.farmDataMission = farmDataMission;

        // 清空现有数据
        this.fields = [];
        this.cages = [];
        this.ponds = [];
        this.harvestFieldCount = 0;
        this.harvestCageCount = 0;

        // 初始化田地
        farmDataMission.fieldFarms.forEach((fieldConfig) => {
            const fieldModel = new FieldModel(
                fieldConfig.idField as FieldType,
                fieldConfig.index,
                fieldConfig.maxLevel
            );
            
            fieldModel.currentLevel = fieldConfig.startLevel;
            
            // 初始化作物槽位（根据 startNumber）
            fieldModel.initCropSlots(fieldConfig.startNumber);
            
            // 根据田地类型添加到对应列表
            if (fieldConfig.idField === FieldType.Field) {
                this.fields.push(fieldModel);
            } else if (fieldConfig.idField === FieldType.Cage) {
                this.cages.push(fieldModel);
            } else if (fieldConfig.idField === FieldType.Pond) {
                this.ponds.push(fieldModel);
            }
        });

        console.log(`[FarmModel] 初始化关卡 ${missionId}`);
        console.log(`[FarmModel] 农田: ${this.fields.length} 块`);
        console.log(`[FarmModel] 畜栏: ${this.cages.length} 个`);
        console.log(`[FarmModel] 池塘: ${this.ponds.length} 个`);
        console.log(`[FarmModel] 允许生病: ${this.canSick}`);
    }

    /**
     * 获取所有田地（包括农田、畜栏、池塘）
     */
    public getAllFields(): FieldModel[] {
        return [...this.fields, ...this.cages, ...this.ponds];
    }

    /**
     * 根据类型获取田地列表
     * @param fieldType 田地类型
     */
    public getFieldsByType(fieldType: FieldType): FieldModel[] {
        if (fieldType === FieldType.Field) {
            return this.fields;
        } else if (fieldType === FieldType.Cage) {
            return this.cages;
        } else if (fieldType === FieldType.Pond) {
            return this.ponds;
        }
        return [];
    }

    /**
     * 获取指定索引的田地
     * @param fieldType 田地类型
     * @param index 索引
     */
    public getField(fieldType: FieldType, index: number): FieldModel | null {
        const fields = this.getFieldsByType(fieldType);
        if (index >= 0 && index < fields.length) {
            return fields[index];
        }
        return null;
    }

    /**
     * 获取所有成熟作物
     */
    public getAllMatureCrops(): { field: FieldModel, slotIndex: number, crop: CropModel }[] {
        const result: { field: FieldModel, slotIndex: number, crop: CropModel }[] = [];

        for (const field of this.getAllFields()) {
            for (let i = 0; i < field.crops.length; i++) {
                if (field.crops[i].isMature()) {
                    result.push({ field, slotIndex: i, crop: field.crops[i] });
                }
            }
        }

        return result;
    }

    /**
     * 获取所有生病作物
     */
    public getAllSickCrops(): { field: FieldModel, slotIndex: number, crop: CropModel }[] {
        const result: { field: FieldModel, slotIndex: number, crop: CropModel }[] = [];

        for (const field of this.getAllFields()) {
            for (let i = 0; i < field.crops.length; i++) {
                if (field.crops[i].isSickStatus()) {
                    result.push({ field, slotIndex: i, crop: field.crops[i] });
                }
            }
        }

        return result;
    }

    /**
     * 收获指定田地的指定槽位
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引
     * @returns 收获的作物ID，如果无法收获返回 0
     */
    public harvestCrop(fieldType: FieldType, fieldIndex: number, slotIndex: number): number {
        const field = this.getField(fieldType, fieldIndex);
        if (!field) {
            return 0;
        }

        const cropId = field.harvestCrop(slotIndex);
        if (cropId > 0) {
            // 更新收获统计
            if (fieldType === FieldType.Field) {
                this.harvestFieldCount++;
            } else if (fieldType === FieldType.Cage) {
                this.harvestCageCount++;
            }
        }

        return cropId;
    }

    /**
     * 在指定田地种植作物
     * @param fieldType 田地类型
     * @param fieldIndex 田地索引
     * @param slotIndex 槽位索引（可选，不指定则自动找空位）
     * @param cropId 作物ID
     * @returns 是否成功
     */
    public plantCrop(fieldType: FieldType, fieldIndex: number, cropId: number, slotIndex?: number): boolean {
        const field = this.getField(fieldType, fieldIndex);
        if (!field) {
            return false;
        }

        // 如果没有指定槽位，自动找空位
        if (slotIndex === undefined) {
            slotIndex = field.getEmptySlotIndex();
            if (slotIndex < 0) {
                return false;
            }
        }

        return field.plantCrop(slotIndex, cropId);
    }
}
