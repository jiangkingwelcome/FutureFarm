/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 游戏状态数据组件
 * 管理金钱、时间、星级等游戏状态数据
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { oops } from "db://oops-framework/core/Oops";
import { TargetCommon } from "../../common/data/MissionData";
import { StarMission } from "../../common/data/MissionData";

/**
 * 游戏状态数据组件
 */
@ecs.register('GameStateModel')
export class GameStateModelComp extends ecs.Comp {
    /** 当前关卡ID */
    public currentMissionId: number = 0;
    
    /** 关卡目标通用数据 */
    public targetCommon: TargetCommon | null = null;
    
    /** 星级评价条件 */
    public starMission: StarMission | null = null;
    
    /** 当前金钱 */
    public currentMoney: number = 0;
    
    /** 当前时间（天数） */
    public currentDay: number = 0;
    
    /** 当前星级（1, 2, 3） */
    public currentStar: number = 0;
    
    /** 当前顾客满意度 */
    public currentCustomerRate: number = 0;
    
    /** 是否游戏结束 */
    public isGameOver: boolean = false;
    
    /** 是否任务完成 */
    public isMissionComplete: boolean = false;

    reset() {
        this.currentMissionId = 0;
        this.targetCommon = null;
        this.starMission = null;
        this.currentMoney = 0;
        this.currentDay = 0;
        this.currentStar = 0;
        this.currentCustomerRate = 0;
        this.isGameOver = false;
        this.isMissionComplete = false;
    }

    /**
     * 初始化游戏状态
     * @param missionId 关卡ID
     * @param targetCommon 目标通用数据
     * @param starMission 星级评价条件
     */
    public initMission(missionId: number, targetCommon: TargetCommon, starMission: StarMission): void {
        this.currentMissionId = missionId;
        this.targetCommon = targetCommon;
        this.starMission = starMission;
        
        // 初始化当前值
        this.currentMoney = targetCommon.startMoney;
        this.currentDay = 0;
        this.currentStar = 1; // 默认1星
        this.currentCustomerRate = 0;
        this.isGameOver = false;
        this.isMissionComplete = false;
        
        // 更新目标数据的当前值
        targetCommon.currentNumber = this.currentMoney;
        
        console.log(`[GameStateModel] 初始化关卡 ${missionId}`);
        console.log(`[GameStateModel] 初始金钱: ${this.currentMoney}`);
        console.log(`[GameStateModel] 时间限制: ${targetCommon.maxTime} 天`);
    }

    /**
     * 增加金钱
     * @param amount 增加的数量
     */
    public addMoney(amount: number): void {
        if (amount <= 0) return;
        
        this.currentMoney += amount;
        if (this.targetCommon) {
            this.targetCommon.currentNumber = this.currentMoney;
        }
        
        this.updateStar();
        this.saveProgress();
        
        console.log(`[GameStateModel] 增加金钱: +${amount}, 当前: ${this.currentMoney}`);
    }

    /**
     * 减少金钱
     * @param amount 减少的数量
     * @returns 是否成功（余额不足返回 false）
     */
    public spendMoney(amount: number): boolean {
        if (amount <= 0) return true;
        if (this.currentMoney < amount) {
            console.warn(`[GameStateModel] 余额不足: 需要 ${amount}, 当前 ${this.currentMoney}`);
            return false;
        }
        
        this.currentMoney -= amount;
        if (this.targetCommon) {
            this.targetCommon.currentNumber = this.currentMoney;
        }
        
        this.updateStar();
        this.saveProgress();
        
        console.log(`[GameStateModel] 花费金钱: -${amount}, 当前: ${this.currentMoney}`);
        return true;
    }

    /**
     * 增加天数
     * @param days 增加的天数（默认1）
     */
    public addDay(days: number = 1): void {
        if (days <= 0) return;
        
        this.currentDay += days;
        
        // 检查是否超时
        if (this.targetCommon && this.currentDay >= this.targetCommon.maxTime) {
            this.isGameOver = true;
            console.log(`[GameStateModel] 游戏结束：时间到`);
        }
        
        this.saveProgress();
        
        console.log(`[GameStateModel] 增加天数: +${days}, 当前: ${this.currentDay}`);
    }

    /**
     * 设置顾客满意度
     * @param rate 满意度（0-100）
     */
    public setCustomerRate(rate: number): void {
        this.currentCustomerRate = Math.max(0, Math.min(100, rate));
        
        if (this.targetCommon) {
            this.targetCommon.typeShow = 0; // 设置为显示满意度
            this.targetCommon.currentLevel = this.currentStar;
        }
        
        this.updateStar();
        this.saveProgress();
        
        console.log(`[GameStateModel] 顾客满意度: ${this.currentCustomerRate}`);
    }

    /**
     * 更新星级
     * 根据当前金钱或满意度计算星级
     */
    private updateStar(): void {
        if (!this.starMission) return;
        
        // 根据 typeShow 决定使用金钱还是满意度
        let currentValue: number;
        if (this.targetCommon && this.targetCommon.typeShow === 0) {
            currentValue = this.currentCustomerRate;
        } else {
            currentValue = this.currentMoney;
        }
        
        const newStar = this.starMission.getStar(currentValue);
        if (newStar !== this.currentStar) {
            const oldStar = this.currentStar;
            this.currentStar = newStar;
            console.log(`[GameStateModel] 星级提升: ${oldStar} → ${newStar}`);
        }
    }

    /**
     * 检查任务是否完成
     * @returns 是否完成
     */
    public checkMissionComplete(): boolean {
        if (!this.targetCommon) return false;
        
        // 检查金钱目标
        const moneyComplete = this.currentMoney >= this.targetCommon.targetMoney;
        
        // 检查满意度目标
        const rateComplete = this.currentCustomerRate >= this.targetCommon.targetCustomerRate;
        
        // 检查时间限制
        const timeComplete = this.currentDay < this.targetCommon.maxTime;
        
        this.isMissionComplete = moneyComplete && rateComplete && timeComplete;
        
        if (this.isMissionComplete) {
            console.log(`[GameStateModel] 任务完成！`);
        }
        
        return this.isMissionComplete;
    }

    /**
     * 获取当前进度百分比
     * @returns 进度百分比（0-100）
     */
    public getProgressPercent(): number {
        if (!this.targetCommon) return 0;
        
        // 根据 typeShow 决定使用哪个目标
        if (this.targetCommon.typeShow === 0) {
            // 满意度目标
            const target = this.targetCommon.targetCustomerRate;
            if (target <= 0) return 100;
            return Math.min(100, (this.currentCustomerRate / target) * 100);
        } else {
            // 金钱目标
            const target = this.targetCommon.targetMoney;
            if (target <= 0) return 100;
            return Math.min(100, (this.currentMoney / target) * 100);
        }
    }

    /**
     * 保存游戏进度
     */
    public saveProgress(): void {
        const progressData = {
            missionId: this.currentMissionId,
            money: this.currentMoney,
            day: this.currentDay,
            star: this.currentStar,
            customerRate: this.currentCustomerRate,
            isGameOver: this.isGameOver,
            isMissionComplete: this.isMissionComplete
        };
        
        oops.storage.setObject('gameProgress', progressData);
        console.log(`[GameStateModel] 保存进度:`, progressData);
    }

    /**
     * 加载游戏进度
     * @returns 是否成功加载
     */
    public loadProgress(): boolean {
        const progressData = oops.storage.getObject('gameProgress');
        if (!progressData) {
            console.log(`[GameStateModel] 没有保存的进度`);
            return false;
        }
        
        this.currentMissionId = progressData.missionId || 0;
        this.currentMoney = progressData.money || 0;
        this.currentDay = progressData.day || 0;
        this.currentStar = progressData.star || 1;
        this.currentCustomerRate = progressData.customerRate || 0;
        this.isGameOver = progressData.isGameOver || false;
        this.isMissionComplete = progressData.isMissionComplete || false;
        
        if (this.targetCommon) {
            this.targetCommon.currentNumber = this.currentMoney;
        }
        
        console.log(`[GameStateModel] 加载进度:`, progressData);
        return true;
    }

    /**
     * 重置游戏状态
     */
    public resetGame(): void {
        this.currentMissionId = 0;
        this.currentMoney = 0;
        this.currentDay = 0;
        this.currentStar = 1;
        this.currentCustomerRate = 0;
        this.isGameOver = false;
        this.isMissionComplete = false;
        this.targetCommon = null;
        this.starMission = null;
        
        oops.storage.remove('gameProgress');
        console.log(`[GameStateModel] 重置游戏状态`);
    }
}
