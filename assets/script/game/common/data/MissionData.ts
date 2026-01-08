/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 任务数据类
 * 对应 Unity 的 MissionData 相关类
 */

import { ItemBase, TypeShow } from './ItemBase';
import { TargetCommonData, StarConditionData } from '../config/MissionConfig';

/**
 * 关卡目标通用数据
 * 对应 Unity 的 TargetCommon
 */
export class TargetCommon extends ItemBase {
    /** 初始金钱 */
    public startMoney: number = 0;
    /** 目标金钱 */
    public targetMoney: number = 0;
    /** 最大时间（天数） */
    public maxTime: number = 0;
    /** 最大顾客数 */
    public maxCustomer: number = 100;
    /** 目标顾客满意度 */
    public targetCustomerRate: number = 0;
    /** 商店中的物品列表 */
    public itemsInShop: number[] = [];
    /** 起始场景 */
    public startScene: number = 1;

    constructor() {
        super();
        this.startMoney = 0;
        this.targetMoney = 0;
        this.maxTime = 0;
        this.maxCustomer = 100;
        this.targetCustomerRate = 0;
        this.itemsInShop = [];
        this.startScene = 1;
        this.currentNumber = this.startMoney;
    }

    /**
     * 从配置数据初始化
     * @param config 配置数据
     */
    public initFromConfig(config: TargetCommonData): void {
        this.startMoney = config.startMoney;
        this.targetMoney = config.targetMoney;
        this.maxTime = config.timeMission;
        this.maxCustomer = config.maxCustomer;
        this.targetCustomerRate = config.targetCustomerRate;
        this.itemsInShop = config.itemsInShop || [];
        this.startScene = config.startScene;
        this.currentNumber = this.startMoney;
    }

    /**
     * 获取目标值
     * 根据 typeShow 返回 targetCustomerRate 或 targetMoney
     */
    public getTarget(): number {
        if (this.typeShow === TypeShow.TargetLevel) {
            return this.targetCustomerRate;
        } else {
            return this.targetMoney;
        }
    }

    /**
     * 获取类型
     * TargetCommon 的类型固定为 0
     */
    public getType(): number {
        return 0;
    }
}

/**
 * 星级评价条件
 * 对应 Unity 的 StarMission
 */
export class StarMission {
    /** 二星条件值 */
    public twoStar: number = 0;
    /** 三星条件值 */
    public threeStar: number = 0;
    /** 奖励配置 [1星奖励, 2星奖励, 3星奖励] */
    public reward: number[] = [0, 0, 0];

    constructor() {
        this.reward = [0, 0, 0];
        this.twoStar = 0;
        this.threeStar = 0;
    }

    /**
     * 从配置数据初始化
     * @param config 配置数据
     */
    public initFromConfig(config: StarConditionData): void {
        this.twoStar = config.twoStar;
        this.threeStar = config.threeStar;
        this.reward = config.reward || [0, 0, 0];
    }

    /**
     * 根据当前值获取星级
     * @param currentValue 当前值（通常是金钱或满意度）
     * @returns 星级（1, 2, 3）
     */
    public getStar(currentValue: number): number {
        if (currentValue >= this.threeStar) {
            return 3;
        } else if (currentValue >= this.twoStar) {
            return 2;
        } else {
            return 1;
        }
    }

    /**
     * 获取指定星级的奖励
     * @param star 星级（1, 2, 3）
     * @returns 奖励值
     */
    public getReward(star: number): number {
        if (star >= 1 && star <= 3) {
            return this.reward[star - 1] || 0;
        }
        return 0;
    }
}
