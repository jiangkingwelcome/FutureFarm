/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 田地数据模型（运行时数据）
 * 用于管理单个田地的状态和作物
 */

import { CropModel } from './CropModel';

/**
 * 田地类型枚举
 */
export enum FieldType {
    /** 农田 (1) */
    Field = 1,
    /** 畜栏 (2) */
    Cage = 2,
    /** 池塘 (3) */
    Pond = 3
}

/**
 * 田地数据模型
 * 对应 Unity 中单个田地的运行时状态
 */
export class FieldModel {
    /** 田地ID (1=农田, 2=畜栏, 3=池塘) */
    public idField: FieldType;
    
    /** 田地索引（在同类田地中的位置） */
    public index: number = 0;
    
    /** 当前等级 */
    public currentLevel: number = 1;
    
    /** 最大等级 */
    public maxLevel: number = 1;
    
    /** 田地中的作物/动物列表 */
    public crops: CropModel[] = [];

    constructor(idField: FieldType, index: number = 0, maxLevel: number = 1) {
        this.idField = idField;
        this.index = index;
        this.currentLevel = 1;
        this.maxLevel = maxLevel;
        this.crops = [];
    }

    /**
     * 初始化田地（根据配置创建指定数量的作物槽位）
     * @param cropCount 作物槽位数量
     */
    public initCropSlots(cropCount: number): void {
        this.crops = [];
        for (let i = 0; i < cropCount; i++) {
            this.crops.push(new CropModel());
        }
    }

    /**
     * 获取指定索引的作物
     * @param index 索引
     * @returns 作物模型，如果索引无效返回 null
     */
    public getCrop(index: number): CropModel | null {
        if (index >= 0 && index < this.crops.length) {
            return this.crops[index];
        }
        return null;
    }

    /**
     * 在指定位置种植作物
     * @param index 位置索引
     * @param cropId 作物ID
     * @returns 是否成功
     */
    public plantCrop(index: number, cropId: number): boolean {
        const crop = this.getCrop(index);
        if (!crop || !crop.isEmpty()) {
            return false;
        }
        
        crop.cropId = cropId;
        crop.plantTime = Date.now();
        crop.status = 'growing';
        
        return true;
    }

    /**
     * 收获指定位置的作物
     * @param index 位置索引
     * @returns 收获的作物ID，如果无法收获返回 0
     */
    public harvestCrop(index: number): number {
        const crop = this.getCrop(index);
        if (!crop || !crop.isMature()) {
            return 0;
        }
        
        const cropId = crop.cropId;
        crop.reset();
        
        return cropId;
    }

    /**
     * 获取空闲槽位索引
     * @returns 空闲槽位索引，如果没有空位返回 -1
     */
    public getEmptySlotIndex(): number {
        for (let i = 0; i < this.crops.length; i++) {
            if (this.crops[i].isEmpty()) {
                return i;
            }
        }
        return -1;
    }

    /**
     * 是否有空位
     */
    public hasEmptySlot(): boolean {
        return this.getEmptySlotIndex() >= 0;
    }

    /**
     * 获取成熟作物数量
     */
    public getMatureCropCount(): number {
        return this.crops.filter(c => c.isMature()).length;
    }

    /**
     * 获取生病作物数量
     */
    public getSickCropCount(): number {
        return this.crops.filter(c => c.isSick()).length;
    }

    /**
     * 升级田地
     * @returns 是否成功升级
     */
    public upgrade(): boolean {
        if (this.currentLevel >= this.maxLevel) {
            return false;
        }
        
        this.currentLevel++;
        console.log(`[FieldModel] 田地 ${this.index} 升级到 ${this.currentLevel} 级`);
        return true;
    }
}
