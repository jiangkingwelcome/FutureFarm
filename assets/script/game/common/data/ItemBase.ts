/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 基础数据类
 * 对应 Unity 的 ItemAbstract
 * 所有任务目标数据类的基类
 */

/**
 * 显示类型枚举
 * 0 = 目标等级, 1 = 目标数量
 * 在商店数据中：0 = 生产, 1 = 销售
 */
export enum TypeShow {
    /** 目标等级 */
    TargetLevel = 0,
    /** 目标数量 */
    TargetNumber = 1
}

/**
 * 基础数据类（抽象）
 * 所有任务目标数据类都应继承此类
 */
export abstract class ItemBase {
    /** 索引 */
    public index: number = 0;
    
    /** 
     * 显示类型
     * 0 = 目标等级, 1 = 目标数量
     * 在商店数据中：0 = 生产, 1 = 销售
     */
    public typeShow: TypeShow = TypeShow.TargetLevel;
    
    /** 当前数量 */
    public currentNumber: number = 0;
    
    /** 当前等级 */
    public currentLevel: number = 0;

    /**
     * 获取当前值
     * 根据 typeShow 返回 currentLevel 或 currentNumber
     * 在 TargetCommon 中：currentLevel = 当前星级, currentNumber = 当前金钱
     */
    public getCurrent(): number {
        if (this.typeShow === TypeShow.TargetLevel) {
            return this.currentLevel;
        } else {
            return this.currentNumber;
        }
    }

    /**
     * 获取目标值（抽象方法）
     * 子类必须实现此方法
     */
    public abstract getTarget(): number;

    /**
     * 获取类型（抽象方法）
     * 子类必须实现此方法
     * 例如：田地类型（1=农田, 2=畜栏, 3=池塘）、作物ID等
     */
    public abstract getType(): number;
}
