/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 农场数据模型测试
 * 用于验证农场数据初始化和管理功能
 */

import { smc } from '../../game/common/SingletonModuleComp';
import { FarmDataMission } from '../../game/common/data/FarmData';
import { missionConfig } from '../../game/common/config/MissionConfig';
import { FieldType } from '../../game/farm/model/FieldModel';

/**
 * 测试初始化农场数据
 */
export async function testInitFarmModel(): Promise<void> {
    console.log('[Test] 测试初始化农场数据...');
    
    try {
        // 加载第1关配置
        const config = await missionConfig.loadMission(1);
        
        // 创建农场配置数据
        const farmDataMission = new FarmDataMission();
        farmDataMission.initFromConfig(config.farmData);
        
        // 初始化农场模型
        const farmModel = smc.farm.FarmModel;
        farmModel.initFromConfig(1, farmDataMission);
        
        console.log('[Test] ✅ 农场数据初始化成功');
        console.log('[Test] 农田数量:', farmModel.fields.length);
        console.log('[Test] 畜栏数量:', farmModel.cages.length);
        console.log('[Test] 池塘数量:', farmModel.ponds.length);
        
        // 检查第一个农田
        if (farmModel.fields.length > 0) {
            const field = farmModel.fields[0];
            console.log('[Test] 第一个农田:');
            console.log('[Test]   - 索引:', field.index);
            console.log('[Test]   - 等级:', field.currentLevel);
            console.log('[Test]   - 最大等级:', field.maxLevel);
            console.log('[Test]   - 作物槽位:', field.crops.length);
            console.log('[Test]   - 空位数量:', field.crops.filter(c => c.isEmpty()).length);
        }
    } catch (error) {
        console.error('[Test] ❌ 农场数据初始化失败:', error);
        throw error;
    }
}

/**
 * 测试种植作物
 */
export function testPlantCrop(): void {
    console.log('[Test] 测试种植作物...');
    
    try {
        const farmModel = smc.farm.FarmModel;
        
        if (farmModel.fields.length === 0) {
            console.warn('[Test] 没有农田，跳过测试');
            return;
        }
        
        const field = farmModel.fields[0];
        const emptySlot = field.getEmptySlotIndex();
        
        if (emptySlot < 0) {
            console.warn('[Test] 没有空位，跳过测试');
            return;
        }
        
        console.log('[Test] 在农田0的槽位', emptySlot, '种植作物1');
        const success = farmModel.plantCrop(FieldType.Field, 0, 1, emptySlot);
        
        if (success) {
            const crop = field.getCrop(emptySlot);
            console.log('[Test] ✅ 种植成功');
            console.log('[Test] 作物ID:', crop?.cropId);
            console.log('[Test] 状态:', crop?.status);
        } else {
            console.error('[Test] ❌ 种植失败');
        }
    } catch (error) {
        console.error('[Test] ❌ 种植测试失败:', error);
        throw error;
    }
}

/**
 * 测试获取成熟作物
 */
export function testGetMatureCrops(): void {
    console.log('[Test] 测试获取成熟作物...');
    
    try {
        const farmModel = smc.farm.FarmModel;
        const matureCrops = farmModel.getAllMatureCrops();
        
        console.log('[Test] ✅ 成熟作物查询成功');
        console.log('[Test] 成熟作物数量:', matureCrops.length);
        
        matureCrops.forEach((item, index) => {
            console.log(`[Test] 成熟作物 ${index + 1}:`);
            console.log(`[Test]   - 田地类型: ${item.field.idField}`);
            console.log(`[Test]   - 田地索引: ${item.field.index}`);
            console.log(`[Test]   - 槽位索引: ${item.slotIndex}`);
            console.log(`[Test]   - 作物ID: ${item.crop.cropId}`);
        });
    } catch (error) {
        console.error('[Test] ❌ 成熟作物查询失败:', error);
        throw error;
    }
}
