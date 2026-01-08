/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 机器数据模型（运行时数据）
 * 用于管理单个机器的状态和生产队列
 */

import { ProductModel } from './ProductModel';

/**
 * 机器状态枚举
 */
export enum MachineStatus {
    /** 空闲 */
    Idle = 'idle',
    /** 生产中 */
    Producing = 'producing',
    /** 已损坏 */
    Broken = 'broken',
    /** 已锁定 */
    Locked = 'locked'
}

/**
 * 机器数据模型
 * 对应 Unity 中单个机器的运行时状态
 */
export class MachineModel {
    /** 机器ID */
    public machineId: number;
    
    /** 机器索引（在工厂中的位置） */
    public index: number = 0;
    
    /** 当前等级 */
    public currentLevel: number = 1;
    
    /** 最大等级 */
    public maxLevel: number = 1;
    
    /** 状态 */
    public status: MachineStatus = MachineStatus.Idle;
    
    /** 生产队列 */
    public productionQueue: ProductModel[] = [];
    
    /** 当前生产的产品（如果有） */
    public currentProduct: ProductModel | null = null;
    
    /** 是否已解锁 */
    public unlocked: boolean = true;

    constructor(machineId: number, index: number = 0, maxLevel: number = 1) {
        this.machineId = machineId;
        this.index = index;
        this.currentLevel = 1;
        this.maxLevel = maxLevel;
        this.status = MachineStatus.Idle;
        this.productionQueue = [];
        this.currentProduct = null;
        this.unlocked = true;
    }

    /**
     * 添加产品到生产队列
     * @param product 产品模型
     * @returns 是否成功
     */
    public addToQueue(product: ProductModel): boolean {
        // TODO: 检查队列长度限制（根据机器等级）
        this.productionQueue.push(product);
        console.log(`[MachineModel] 机器 ${this.machineId} 添加产品到队列: ${product.productId}`);
        return true;
    }

    /**
     * 开始生产
     * @returns 是否成功
     */
    public startProduction(): boolean {
        if (this.status !== MachineStatus.Idle || this.productionQueue.length === 0) {
            return false;
        }

        this.currentProduct = this.productionQueue.shift() || null;
        if (this.currentProduct) {
            this.status = MachineStatus.Producing;
            this.currentProduct.startTime = Date.now();
            console.log(`[MachineModel] 机器 ${this.machineId} 开始生产: ${this.currentProduct.productId}`);
            return true;
        }

        return false;
    }

    /**
     * 完成生产
     * @returns 完成的产品，如果没有则返回 null
     */
    public completeProduction(): ProductModel | null {
        if (!this.currentProduct || this.status !== MachineStatus.Producing) {
            return null;
        }

        const product = this.currentProduct;
        this.currentProduct = null;
        this.status = MachineStatus.Idle;

        // 如果队列中还有产品，自动开始下一个
        if (this.productionQueue.length > 0) {
            this.startProduction();
        }

        console.log(`[MachineModel] 机器 ${this.machineId} 完成生产: ${product.productId}`);
        return product;
    }

    /**
     * 检查当前产品是否完成
     * @param productionTime 生产时间（秒）
     * @returns 是否完成
     */
    public checkProductionComplete(productionTime: number): boolean {
        if (!this.currentProduct || this.status !== MachineStatus.Producing) {
            return false;
        }

        const elapsed = (Date.now() - this.currentProduct.startTime) / 1000;
        return elapsed >= productionTime;
    }

    /**
     * 升级机器
     * @returns 是否成功升级
     */
    public upgrade(): boolean {
        if (this.currentLevel >= this.maxLevel) {
            return false;
        }

        this.currentLevel++;
        console.log(`[MachineModel] 机器 ${this.machineId} 升级到 ${this.currentLevel} 级`);
        return true;
    }

    /**
     * 设置损坏状态
     */
    public setBroken(): void {
        this.status = MachineStatus.Broken;
        console.log(`[MachineModel] 机器 ${this.machineId} 已损坏`);
    }

    /**
     * 修复机器
     */
    public repair(): void {
        if (this.status === MachineStatus.Broken) {
            this.status = MachineStatus.Idle;
            console.log(`[MachineModel] 机器 ${this.machineId} 已修复`);
        }
    }
}
