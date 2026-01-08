/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 任务数据测试
 * 用于验证数据类是否能正确初始化和工作
 */

import { TargetCommon, StarMission } from '../../game/common/data/MissionData';
import { FarmDataMission } from '../../game/common/data/FarmData';
import { missionConfig } from '../../game/common/config/MissionConfig';

/**
 * 测试 TargetCommon 初始化
 */
export function testTargetCommon(): void {
    console.log('[Test] 测试 TargetCommon...');
    
    const target = new TargetCommon();
    target.initFromConfig({
        startMoney: 500,
        targetMoney: 1000,
        timeMission: 7,
        maxCustomer: 100,
        targetCustomerRate: 0,
        itemsInShop: [1, 2, 3],
        startScene: 1
    });

    console.log('[Test] ✅ TargetCommon 初始化成功');
    console.log('[Test] 初始金钱:', target.startMoney);
    console.log('[Test] 目标金钱:', target.targetMoney);
    console.log('[Test] 当前数量:', target.getCurrent());
    console.log('[Test] 目标值:', target.getTarget());
    console.log('[Test] 类型:', target.getType());
}

/**
 * 测试 StarMission 初始化
 */
export function testStarMission(): void {
    console.log('[Test] 测试 StarMission...');
    
    const star = new StarMission();
    star.initFromConfig({
        twoStar: 100,
        threeStar: 200,
        reward: [1, 2, 3]
    });

    console.log('[Test] ✅ StarMission 初始化成功');
    console.log('[Test] 二星条件:', star.twoStar);
    console.log('[Test] 三星条件:', star.threeStar);
    console.log('[Test] 奖励:', star.reward);
    console.log('[Test] 当前值50的星级:', star.getStar(50));
    console.log('[Test] 当前值150的星级:', star.getStar(150));
    console.log('[Test] 当前值250的星级:', star.getStar(250));
}

/**
 * 测试 FarmDataMission 初始化
 */
export async function testFarmDataMission(): Promise<void> {
    console.log('[Test] 测试 FarmDataMission...');
    
    try {
        // 加载第1关配置
        const config = await missionConfig.loadMission(1);
        
        // 初始化农场数据
        const farmData = new FarmDataMission();
        farmData.initFromConfig(config.farmData);

        console.log('[Test] ✅ FarmDataMission 初始化成功');
        console.log('[Test] 是否允许生病:', farmData.isCanSick);
        console.log('[Test] 田地数量:', farmData.fieldFarms.length);
        console.log('[Test] 作物数量:', farmData.breedsFarm.length);
        
        if (farmData.fieldFarms.length > 0) {
            const field = farmData.fieldFarms[0];
            console.log('[Test] 第一个田地ID:', field.idField);
            console.log('[Test] 初始数量:', field.startNumber);
            console.log('[Test] 当前数量:', field.getCurrent());
        }
        
        if (farmData.breedsFarm.length > 0) {
            const breed = farmData.breedsFarm[0];
            console.log('[Test] 第一个作物ID:', breed.idBreed);
            console.log('[Test] 目标数量:', breed.targetNumber);
        }
    } catch (error) {
        console.error('[Test] ❌ FarmDataMission 测试失败:', error);
        throw error;
    }
}

/**
 * 测试从配置加载完整任务数据
 */
export async function testLoadMissionData(): Promise<void> {
    console.log('[Test] 测试从配置加载完整任务数据...');
    
    try {
        const config = await missionConfig.loadMission(1);
        
        // 初始化 TargetCommon
        const targetCommon = new TargetCommon();
        targetCommon.initFromConfig(config.targetCommon);
        
        // 初始化 StarMission
        const starMission = new StarMission();
        starMission.initFromConfig(config.starCondition);
        
        // 初始化 FarmDataMission
        const farmData = new FarmDataMission();
        farmData.initFromConfig(config.farmData);

        console.log('[Test] ✅ 完整任务数据加载成功');
        console.log('[Test] 关卡ID:', config.id);
        console.log('[Test] 初始金钱:', targetCommon.startMoney);
        console.log('[Test] 时间限制:', targetCommon.maxTime);
        console.log('[Test] 田地数量:', farmData.fieldFarms.length);
        console.log('[Test] 作物数量:', farmData.breedsFarm.length);
        console.log('[Test] 二星条件:', starMission.twoStar);
        console.log('[Test] 三星条件:', starMission.threeStar);
    } catch (error) {
        console.error('[Test] ❌ 完整任务数据加载失败:', error);
        throw error;
    }
}
