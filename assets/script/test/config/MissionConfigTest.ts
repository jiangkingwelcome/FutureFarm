/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 关卡配置管理器测试
 * 用于验证配置加载功能
 */

import { missionConfig, MissionConfigData } from '../../game/common/config/MissionConfig';

/**
 * 测试加载第1关配置
 */
export async function testLoadMission1(): Promise<void> {
    console.log('[Test] 开始测试加载关卡1配置...');
    
    try {
        const config = await missionConfig.loadMission(1);
        
        console.log('[Test] ✅ 加载成功！');
        console.log('[Test] 关卡ID:', config.id);
        console.log('[Test] 初始金钱:', config.targetCommon.startMoney);
        console.log('[Test] 目标金钱:', config.targetCommon.targetMoney);
        console.log('[Test] 时间限制:', config.targetCommon.timeMission);
        console.log('[Test] 农场田地数量:', config.farmData?.fields?.length || 0);
        
        // 验证数据完整性
        if (!config.id) {
            throw new Error('关卡ID缺失');
        }
        if (config.targetCommon.startMoney === undefined) {
            throw new Error('初始金钱缺失');
        }
        
        console.log('[Test] ✅ 数据验证通过！');
    } catch (error) {
        console.error('[Test] ❌ 测试失败:', error);
        throw error;
    }
}

/**
 * 测试预加载所有配置
 */
export async function testPreloadAll(): Promise<void> {
    console.log('[Test] 开始测试预加载所有配置...');
    
    try {
        await missionConfig.preloadAll();
        const cacheSize = missionConfig.getCacheSize();
        
        console.log(`[Test] ✅ 预加载完成！缓存大小: ${cacheSize}`);
        
        if (cacheSize === 0) {
            throw new Error('预加载后缓存为空');
        }
    } catch (error) {
        console.error('[Test] ❌ 预加载测试失败:', error);
        throw error;
    }
}
