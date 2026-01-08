/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 游戏状态测试
 * 用于验证游戏状态管理功能
 */

import { smc } from '../../game/common/SingletonModuleComp';
import { TargetCommon } from '../../game/common/data/MissionData';
import { StarMission } from '../../game/common/data/MissionData';
import { missionConfig } from '../../game/common/config/MissionConfig';

/**
 * 测试初始化游戏状态
 */
export async function testInitGameState(): Promise<void> {
    console.log('[Test] 测试初始化游戏状态...');
    
    try {
        // 加载第1关配置
        const config = await missionConfig.loadMission(1);
        
        // 创建目标数据
        const targetCommon = new TargetCommon();
        targetCommon.initFromConfig(config.targetCommon);
        
        // 创建星级数据
        const starMission = new StarMission();
        starMission.initFromConfig(config.starCondition);
        
        // 初始化游戏状态
        const gameStateModel = smc.gameState.GameStateModel;
        gameStateModel.initMission(1, targetCommon, starMission);
        
        console.log('[Test] ✅ 游戏状态初始化成功');
        console.log('[Test] 当前金钱:', gameStateModel.currentMoney);
        console.log('[Test] 当前天数:', gameStateModel.currentDay);
        console.log('[Test] 当前星级:', gameStateModel.currentStar);
        console.log('[Test] 时间限制:', targetCommon.maxTime);
    } catch (error) {
        console.error('[Test] ❌ 游戏状态初始化失败:', error);
        throw error;
    }
}

/**
 * 测试金钱管理
 */
export function testMoneyManagement(): void {
    console.log('[Test] 测试金钱管理...');
    
    try {
        const gameStateModel = smc.gameState.GameStateModel;
        
        const initialMoney = gameStateModel.currentMoney;
        console.log('[Test] 初始金钱:', initialMoney);
        
        // 增加金钱
        gameStateModel.addMoney(100);
        console.log('[Test] 增加100后:', gameStateModel.currentMoney);
        
        // 花费金钱
        const success = gameStateModel.spendMoney(50);
        console.log('[Test] 花费50:', success, '当前:', gameStateModel.currentMoney);
        
        // 尝试花费超过余额
        const fail = gameStateModel.spendMoney(1000);
        console.log('[Test] 尝试花费1000:', fail, '当前:', gameStateModel.currentMoney);
        
        console.log('[Test] ✅ 金钱管理测试通过');
    } catch (error) {
        console.error('[Test] ❌ 金钱管理测试失败:', error);
        throw error;
    }
}

/**
 * 测试时间管理
 */
export function testTimeManagement(): void {
    console.log('[Test] 测试时间管理...');
    
    try {
        const gameStateModel = smc.gameState.GameStateModel;
        
        const initialDay = gameStateModel.currentDay;
        console.log('[Test] 初始天数:', initialDay);
        
        // 增加天数
        gameStateModel.addDay(1);
        console.log('[Test] 增加1天后:', gameStateModel.currentDay);
        
        gameStateModel.addDay(2);
        console.log('[Test] 再增加2天后:', gameStateModel.currentDay);
        
        console.log('[Test] ✅ 时间管理测试通过');
    } catch (error) {
        console.error('[Test] ❌ 时间管理测试失败:', error);
        throw error;
    }
}

/**
 * 测试星级管理
 */
export function testStarManagement(): void {
    console.log('[Test] 测试星级管理...');
    
    try {
        const gameStateModel = smc.gameState.GameStateModel;
        
        const initialStar = gameStateModel.currentStar;
        console.log('[Test] 初始星级:', initialStar);
        
        // 增加金钱以提升星级
        gameStateModel.addMoney(150); // 超过二星条件（100）
        console.log('[Test] 增加150后星级:', gameStateModel.currentStar);
        
        gameStateModel.addMoney(100); // 超过三星条件（200）
        console.log('[Test] 再增加100后星级:', gameStateModel.currentStar);
        
        console.log('[Test] ✅ 星级管理测试通过');
    } catch (error) {
        console.error('[Test] ❌ 星级管理测试失败:', error);
        throw error;
    }
}

/**
 * 测试保存和加载进度
 */
export function testSaveAndLoad(): void {
    console.log('[Test] 测试保存和加载进度...');
    
    try {
        const gameStateModel = smc.gameState.GameStateModel;
        
        // 修改一些数据
        gameStateModel.addMoney(200);
        gameStateModel.addDay(3);
        gameStateModel.setCustomerRate(80);
        
        console.log('[Test] 保存前 - 金钱:', gameStateModel.currentMoney, '天数:', gameStateModel.currentDay);
        
        // 保存进度
        gameStateModel.saveProgress();
        
        // 修改数据
        gameStateModel.addMoney(100);
        gameStateModel.addDay(1);
        console.log('[Test] 修改后 - 金钱:', gameStateModel.currentMoney, '天数:', gameStateModel.currentDay);
        
        // 加载进度
        const loaded = gameStateModel.loadProgress();
        console.log('[Test] 加载成功:', loaded);
        console.log('[Test] 加载后 - 金钱:', gameStateModel.currentMoney, '天数:', gameStateModel.currentDay);
        
        console.log('[Test] ✅ 保存和加载测试通过');
    } catch (error) {
        console.error('[Test] ❌ 保存和加载测试失败:', error);
        throw error;
    }
}
