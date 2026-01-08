/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 产品数据模型（运行时数据）
 * 用于管理单个产品的生产状态
 */

/**
 * 产品状态枚举
 */
export enum ProductStatus {
    /** 等待中 */
    Waiting = 'waiting',
    /** 生产中 */
    Producing = 'producing',
    /** 已完成 */
    Completed = 'completed'
}

/**
 * 产品数据模型
 * 对应 Unity 中单个产品的运行时状态
 */
export class ProductModel {
    /** 产品ID */
    public productId: number = 0;
    
    /** 开始生产时间（时间戳，毫秒） */
    public startTime: number = 0;
    
    /** 状态 */
    public status: ProductStatus = ProductStatus.Waiting;
    
    /** 生产进度（0-100） */
    public progress: number = 0;

    constructor(productId: number = 0) {
        this.productId = productId;
        this.startTime = 0;
        this.status = ProductStatus.Waiting;
        this.progress = 0;
    }

    /**
     * 重置产品数据
     */
    public reset(): void {
        this.productId = 0;
        this.startTime = 0;
        this.status = ProductStatus.Waiting;
        this.progress = 0;
    }

    /**
     * 开始生产
     */
    public start(): void {
        this.startTime = Date.now();
        this.status = ProductStatus.Producing;
        this.progress = 0;
    }

    /**
     * 更新生产进度
     * @param productionTime 总生产时间（秒）
     */
    public updateProgress(productionTime: number): void {
        if (this.status !== ProductStatus.Producing || this.startTime === 0) {
            return;
        }

        const elapsed = (Date.now() - this.startTime) / 1000;
        this.progress = Math.min(100, (elapsed / productionTime) * 100);

        if (this.progress >= 100) {
            this.status = ProductStatus.Completed;
            this.progress = 100;
        }
    }

    /**
     * 检查是否完成
     */
    public isCompleted(): boolean {
        return this.status === ProductStatus.Completed;
    }

    /**
     * 获取已生产时间（秒）
     */
    public getElapsedTime(): number {
        if (this.startTime === 0) {
            return 0;
        }
        return Math.floor((Date.now() - this.startTime) / 1000);
    }
}
