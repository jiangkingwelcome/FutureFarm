/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 作物/动物数据模型（运行时数据）
 * 用于管理单个作物/动物的状态
 */

/**
 * 作物状态枚举
 */
export enum CropStatus {
    /** 空 */
    Empty = 'empty',
    /** 生长中 */
    Growing = 'growing',
    /** 成熟 */
    Mature = 'mature',
    /** 生病 */
    Sick = 'sick'
}

/**
 * 作物数据模型
 * 对应 Unity 中单个作物/动物的运行时状态
 */
export class CropModel {
    /** 作物/动物ID */
    public cropId: number = 0;
    
    /** 种植时间（时间戳，毫秒） */
    public plantTime: number = 0;
    
    /** 生长阶段（0-100，表示生长进度百分比） */
    public growthProgress: number = 0;
    
    /** 状态 */
    public status: CropStatus = CropStatus.Empty;
    
    /** 是否生病 */
    public isSick: boolean = false;

    /**
     * 重置作物数据
     */
    public reset(): void {
        this.cropId = 0;
        this.plantTime = 0;
        this.growthProgress = 0;
        this.status = CropStatus.Empty;
        this.isSick = false;
    }

    /**
     * 检查是否为空
     */
    public isEmpty(): boolean {
        return this.status === CropStatus.Empty || this.cropId === 0;
    }

    /**
     * 检查是否成熟
     */
    public isMature(): boolean {
        return this.status === CropStatus.Mature && !this.isSick;
    }

    /**
     * 检查是否生病
     */
    public isSickStatus(): boolean {
        return this.isSick || this.status === CropStatus.Sick;
    }

    /**
     * 更新生长进度
     * @param growTime 生长时间（秒）
     * @param totalGrowTime 总生长时间（秒）
     */
    public updateGrowth(growTime: number, totalGrowTime: number): void {
        if (this.isEmpty() || this.isMature()) {
            return;
        }

        this.growthProgress = Math.min(100, (growTime / totalGrowTime) * 100);
        
        if (this.growthProgress >= 100) {
            this.status = CropStatus.Mature;
            this.growthProgress = 100;
        } else {
            this.status = CropStatus.Growing;
        }
    }

    /**
     * 设置生病状态
     */
    public setSick(): void {
        if (!this.isEmpty()) {
            this.isSick = true;
            this.status = CropStatus.Sick;
        }
    }

    /**
     * 治愈
     */
    public cure(): void {
        if (this.isSick) {
            this.isSick = false;
            // 恢复之前的状态
            if (this.growthProgress >= 100) {
                this.status = CropStatus.Mature;
            } else {
                this.status = CropStatus.Growing;
            }
        }
    }

    /**
     * 获取已生长时间（秒）
     */
    public getGrownTime(): number {
        if (this.plantTime === 0) {
            return 0;
        }
        return Math.floor((Date.now() - this.plantTime) / 1000);
    }
}
