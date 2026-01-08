/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 关卡配置数据结构定义
 * 对应 Unity 的 MissionData 结构
 */

import { ConfigManager } from './ConfigManager';

/**
 * 关卡目标通用数据
 * 对应 Unity TargetCommon
 */
export interface TargetCommonData {
    /** 初始金钱 */
    startMoney: number;
    /** 目标金钱 */
    targetMoney: number;
    /** 任务时间限制（天数） */
    timeMission: number;
    /** 最大顾客数 */
    maxCustomer: number;
    /** 目标顾客满意度 */
    targetCustomerRate: number;
    /** 商店中的物品列表 */
    itemsInShop: number[];
    /** 起始场景 */
    startScene: number;
}

/**
 * 星级评价条件
 * 对应 Unity StarMission
 */
export interface StarConditionData {
    /** 二星条件值 */
    twoStar: number;
    /** 三星条件值 */
    threeStar: number;
    /** 奖励配置 [1星奖励, 2星奖励, 3星奖励] */
    reward: number[];
}

/**
 * 农场田地数据
 * 对应 Unity FieldFarm
 */
export interface FieldFarmData {
    /** 田地ID (1=农田, 2=畜栏, 3=池塘) */
    idField: number;
    /** 初始数量 */
    startNumber: number;
    /** 目标数量 */
    targetNumber: number;
    /** 初始等级 */
    startLevel: number;
    /** 目标等级 */
    targetLevel: number;
    /** 最大等级 */
    maxLevel: number;
}

/**
 * 农场养殖数据
 * 对应 Unity BreedFarm
 */
export interface BreedFarmData {
    /** 作物/动物ID */
    idBreed: number;
    /** 初始数量 */
    startNumber: number;
    /** 目标种植数量 */
    targetNumber: number;
}

/**
 * 农场收获目标
 * 对应 Unity HarverstFarm
 */
export interface HarvestFarmData {
    /** 田地类型ID (1=农田, 2=畜栏) */
    idField: number;
    /** 目标收获数量 */
    targetNumber: number;
}

/**
 * 农场模块数据
 * 对应 Unity FarmDataMission
 */
export interface FarmDataMissionData {
    /** 是否允许生病 */
    isCanSick: boolean;
    /** 田地列表 */
    fields: FieldFarmData[];
    /** 养殖列表 */
    breeds: BreedFarmData[];
    /** 农田收获目标 */
    harvestField: HarvestFarmData;
    /** 畜栏收获目标 */
    harvestCage: HarvestFarmData;
}

/**
 * 完整关卡配置数据
 * 对应 Unity MissionData 的完整结构
 */
export interface MissionConfigData {
    /** 关卡ID */
    id: number;
    /** 目标通用数据 */
    targetCommon: TargetCommonData;
    /** 星级条件 */
    starCondition: StarConditionData;
    /** 农场数据 */
    farmData: FarmDataMissionData;
    /** 工厂数据（后续实现） */
    factoryData?: any;
    /** 商店数据（后续实现） */
    shopData?: any;
    /** 城镇数据（后续实现） */
    townData?: any;
    /** 提示文本（中文） */
    tip_vi?: string;
    /** 提示文本（英文） */
    tip_en?: string;
    /** 新物品列表 */
    newItems?: any[];
}

/**
 * 关卡配置管理器
 * 继承自 ConfigManager，提供关卡配置的加载和管理
 */
export class MissionConfigManager extends ConfigManager<MissionConfigData> {
    private static _instance: MissionConfigManager | null = null;
    
    /**
     * 获取单例实例
     */
    static getInstance(): MissionConfigManager {
        if (!MissionConfigManager._instance) {
            MissionConfigManager._instance = new MissionConfigManager();
        }
        return MissionConfigManager._instance;
    }
    
    /**
     * 配置路径前缀
     */
    protected getConfigPath(): string {
        return 'bundle/config/missions';
    }
    
    /**
     * 加载指定关卡配置
     * @param level 关卡编号（1, 2, 3...）
     * @returns Promise<MissionConfigData> 关卡配置数据
     */
    async loadMission(level: number): Promise<MissionConfigData> {
        const key = `mission_${level}`;
        return await this.load(key);
    }
    
    /**
     * 预加载所有关卡配置
     * 注意：这里假设有50个关卡，实际数量需要根据项目调整
     */
    async preloadAll(): Promise<void> {
        const totalMissions = 50; // 根据实际关卡数量调整
        const keys: string[] = [];
        
        for (let i = 1; i <= totalMissions; i++) {
            keys.push(`mission_${i}`);
        }
        
        console.log(`[MissionConfigManager] 开始预加载 ${totalMissions} 个关卡配置...`);
        await this.loadBatch(keys);
        console.log(`[MissionConfigManager] 预加载完成`);
    }
    
    /**
     * 验证配置数据
     * 重写父类方法，添加关卡特定的验证逻辑
     */
    protected validate(data: MissionConfigData, key: string): MissionConfigData {
        // 调用父类验证
        const validated = super.validate(data, key);
        
        // 关卡特定验证
        if (!validated.id) {
            throw new Error(`关卡配置缺少 id 字段: ${key}`);
        }
        
        if (!validated.targetCommon) {
            throw new Error(`关卡配置缺少 targetCommon 字段: ${key}`);
        }
        
        if (validated.targetCommon.startMoney === undefined && validated.targetCommon.startMoney !== 0) {
            console.warn(`关卡 ${validated.id} 的初始金钱未设置`);
        }
        
        return validated;
    }
    
    /**
     * 获取关卡数量
     * 这个方法需要根据实际配置文件数量来确定
     */
    getMissionCount(): number {
        return 50; // 根据实际数量调整
    }
}

// 导出单例实例的便捷访问
export const missionConfig = MissionConfigManager.getInstance();
