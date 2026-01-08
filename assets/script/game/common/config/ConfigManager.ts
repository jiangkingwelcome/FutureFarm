/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 配置管理器基类
 * 提供统一的配置加载、缓存、验证机制
 */

import { resources, JsonAsset } from 'cc';
import { oops } from 'db://oops-framework/core/Oops';

/**
 * 配置管理器基类
 * 所有配置加载器都应继承此类
 */
export abstract class ConfigManager<T> {
    /** 配置数据缓存 */
    protected _cache: Map<string, T> = new Map();
    
    /** 配置文件路径前缀 */
    protected abstract getConfigPath(): string;
    
    /**
     * 加载单个配置
     * @param key 配置键（文件名，不含扩展名）
     * @returns Promise<T> 配置数据
     */
    async load(key: string): Promise<T> {
        // 检查缓存
        if (this._cache.has(key)) {
            return this._cache.get(key)!;
        }
        
        // 构建完整路径
        const fullPath = `${this.getConfigPath()}/${key}`;
        
        return new Promise<T>(async (resolve, reject) => {
            try {
                // 先确保 bundle 已加载
                await oops.res.loadBundle('bundle');
            } catch (bundleErr) {
                console.warn(`[ConfigManager] Bundle 加载失败，尝试直接加载: ${bundleErr}`);
            }
            
            resources.load(fullPath, JsonAsset, (err: Error | null, asset: JsonAsset | null) => {
                if (err) {
                    console.error(`[ConfigManager] 加载配置失败: ${fullPath}`, err);
                    reject(err);
                    return;
                }
                
                if (!asset || !asset.json) {
                    const error = new Error(`配置文件为空: ${fullPath}`);
                    console.error(`[ConfigManager]`, error);
                    reject(error);
                    return;
                }
                
                // 验证配置数据
                const config = this.validate(asset.json as T, key);
                
                // 存入缓存
                this._cache.set(key, config);
                
                console.log(`[ConfigManager] 加载配置成功: ${fullPath}`);
                resolve(config);
            });
        });
    }
    
    /**
     * 批量加载配置
     * @param keys 配置键数组
     * @returns Promise<Map<string, T>> 配置数据映射
     */
    async loadBatch(keys: string[]): Promise<Map<string, T>> {
        const results = new Map<string, T>();
        
        const promises = keys.map(async (key) => {
            const config = await this.load(key);
            results.set(key, config);
        });
        
        await Promise.all(promises);
        return results;
    }
    
    /**
     * 预加载所有配置
     * 子类需要实现此方法，返回所有配置键
     */
    abstract preloadAll(): Promise<void>;
    
    /**
     * 验证配置数据
     * 子类可以重写此方法进行自定义验证
     * @param data 原始数据
     * @param key 配置键
     * @returns T 验证后的配置数据
     */
    protected validate(data: T, key: string): T {
        // 基础验证：检查数据不为空
        if (!data) {
            throw new Error(`配置数据为空: ${key}`);
        }
        return data;
    }
    
    /**
     * 清除缓存
     * @param key 可选，指定要清除的配置键。不传则清除所有
     */
    clearCache(key?: string): void {
        if (key) {
            this._cache.delete(key);
            console.log(`[ConfigManager] 清除缓存: ${key}`);
        } else {
            this._cache.clear();
            console.log(`[ConfigManager] 清除所有缓存`);
        }
    }
    
    /**
     * 获取缓存大小
     */
    getCacheSize(): number {
        return this._cache.size;
    }
}
