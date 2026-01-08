/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 农场数据类
 * 对应 Unity 的 FarmDataMission 相关类
 */

import { ItemBase, TypeShow } from './ItemBase';
import { FarmDataMissionData, FieldFarmData, BreedFarmData, HarvestFarmData } from '../config/MissionConfig';

/**
 * 农场田地数据
 * 对应 Unity 的 FieldFarm
 */
export class FieldFarm extends ItemBase {
    /** 田地ID (1=农田, 2=畜栏, 3=池塘) */
    public idField: number;
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

    constructor(id: number, startN?: number, targetN?: number, startL?: number, targetL?: number, maxLV?: number) {
        super();
        this.idField = id;
        this.startNumber = startN ?? 0;
        this.targetNumber = targetN ?? 0;
        this.startLevel = startL ?? 1;
        this.targetLevel = targetL ?? 1;
        this.maxLevel = maxLV ?? 1;
        this.currentNumber = this.startNumber;
        this.currentLevel = this.startLevel;
    }

    /**
     * 从配置数据初始化
     * @param config 配置数据
     */
    public initFromConfig(config: FieldFarmData): void {
        this.idField = config.idField;
        this.startNumber = config.startNumber;
        this.targetNumber = config.targetNumber;
        this.startLevel = config.startLevel;
        this.targetLevel = config.targetLevel;
        this.maxLevel = config.maxLevel;
        this.currentNumber = this.startNumber;
        this.currentLevel = this.startLevel;
        
        // 确保 maxLevel >= targetLevel
        if (this.maxLevel < this.targetLevel) {
            this.maxLevel = this.targetLevel;
        }
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
     * 返回田地ID
     */
    public getType(): number {
        return this.idField;
    }
}

/**
 * 农场养殖数据
 * 对应 Unity 的 BreedFarm
 */
export class BreedFarm extends ItemBase {
    /** 作物/动物ID */
    public idBreed: number;
    /** 初始数量 */
    public startNumber: number = 0;
    /** 目标种植数量 */
    public targetNumber: number = 0;

    constructor(id: number) {
        super();
        this.idBreed = id;
        this.startNumber = 0;
        this.targetNumber = 0;
    }

    /**
     * 从配置数据初始化
     * @param config 配置数据
     */
    public initFromConfig(config: BreedFarmData): void {
        this.idBreed = config.idBreed;
        this.startNumber = config.startNumber;
        this.targetNumber = config.targetNumber;
        this.currentNumber = 0; // BreedFarm 的 currentNumber 初始为 0
    }

    /**
     * 获取目标值
     * 根据 typeShow 返回 0 或 targetNumber
     */
    public getTarget(): number {
        if (this.typeShow === TypeShow.TargetLevel) {
            return 0;
        } else {
            return this.targetNumber;
        }
    }

    /**
     * 获取类型
     * 返回作物/动物ID
     */
    public getType(): number {
        return this.idBreed;
    }
}

/**
 * 农场收获目标
 * 对应 Unity 的 HarverstFarm
 */
export class HarvestFarm extends ItemBase {
    /** 田地类型ID (1=农田, 2=畜栏) */
    public idField: number;
    /** 目标收获数量 */
    public targetNumber: number = 0;

    constructor(id: number) {
        super();
        this.idField = id;
        this.targetNumber = 0;
        this.currentNumber = 0;
    }

    /**
     * 从配置数据初始化
     * @param config 配置数据
     */
    public initFromConfig(config: HarvestFarmData): void {
        this.idField = config.idField;
        this.targetNumber = config.targetNumber;
        this.currentNumber = 0;
    }

    /**
     * 获取目标值
     * 根据 typeShow 返回 0 或 targetNumber
     */
    public getTarget(): number {
        if (this.typeShow === TypeShow.TargetLevel) {
            return 0;
        } else {
            return this.targetNumber;
        }
    }

    /**
     * 获取类型
     * 返回田地类型ID
     */
    public getType(): number {
        return this.idField;
    }
}

/**
 * 农场模块数据
 * 对应 Unity 的 FarmDataMission
 */
export class FarmDataMission {
    /** 是否允许生病 */
    public isCanSick: boolean = false;
    /** 田地列表 */
    public fieldFarms: FieldFarm[] = [];
    /** 养殖列表 */
    public breedsFarm: BreedFarm[] = [];
    /** 农田收获目标 */
    public harvestField: HarvestFarm;
    /** 畜栏收获目标 */
    public harvestCage: HarvestFarm;

    constructor() {
        this.isCanSick = false;
        this.fieldFarms = [];
        this.breedsFarm = [];
        this.harvestField = new HarvestFarm(1);
        this.harvestCage = new HarvestFarm(2);
    }

    /**
     * 从配置数据初始化
     * @param config 配置数据
     */
    public initFromConfig(config: FarmDataMissionData): void {
        this.isCanSick = config.isCanSick;
        
        // 初始化田地列表
        this.fieldFarms = [];
        if (config.fields && config.fields.length > 0) {
            config.fields.forEach((fieldConfig, index) => {
                const field = new FieldFarm(fieldConfig.idField);
                field.initFromConfig(fieldConfig);
                field.index = index;
                this.fieldFarms.push(field);
            });
        }

        // 初始化养殖列表
        this.breedsFarm = [];
        if (config.breeds && config.breeds.length > 0) {
            config.breeds.forEach((breedConfig, index) => {
                const breed = new BreedFarm(breedConfig.idBreed);
                breed.initFromConfig(breedConfig);
                breed.index = index;
                this.breedsFarm.push(breed);
            });
        }

        // 初始化收获目标
        if (config.harvestField) {
            this.harvestField.initFromConfig(config.harvestField);
        }
        if (config.harvestCage) {
            this.harvestCage.initFromConfig(config.harvestCage);
        }
    }
}
