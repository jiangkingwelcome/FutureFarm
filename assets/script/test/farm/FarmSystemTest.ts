/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 农场系统测试
 * 用于验证农场逻辑系统功能
 */

import { smc } from '../../game/common/SingletonModuleComp';
import { ecs } from 'db://oops-framework/libs/ecs/ECS';
import { PlantSystem } from '../../game/farm/system/PlantSystem';
import { GrowthSystem } from '../../game/farm/system/GrowthSystem';
import { HarvestSystem } from '../../game/farm/system/HarvestSystem';
import { BreedSystem } from '../../game/farm/system/BreedSystem';
import { FieldType } from '../../game/farm/model/FieldModel';
import { FarmDataMission } from '../../game/common/data/FarmData';
import { missionConfig } from '../../game/common/config/MissionConfig';

/**
 * 测试完整的种植→生长→收获流程
 */
export async function testFarmWorkflow(): Promise<void> {
    console.log('[Test] ========== 测试农场工作流程 ==========');
    
    try {
        // 1. 初始化农场数据
        console.log('[Test] 步骤1: 初始化农场数据...');
        const config = await missionConfig.loadMission(1);
        const farmDataMission = new FarmDataMission();
        farmDataMission.initFromConfig(config.farmData);
        
        const farmModel = smc.farm.FarmModel;
        farmModel.initFromConfig(1, farmDataMission);
        console.log('[Test] ✅ 农场数据初始化完成');
        
        // 2. 获取系统实例
        const plantSystem = ecs.getSystem(PlantSystem);
        const growthSystem = ecs.getSystem(GrowthSystem);
        const harvestSystem = ecs.getSystem(HarvestSystem);
        
        if (!plantSystem || !growthSystem || !harvestSystem) {
            throw new Error('系统未找到');
        }
        
        // 3. 种植作物
        console.log('[Test] 步骤2: 种植作物...');
        if (farmModel.fields.length > 0) {
            const success = plantSystem.plantCrop(FieldType.Field, 0, 1);
            if (success) {
                console.log('[Test] ✅ 种植成功');
            } else {
                console.warn('[Test] ⚠️ 种植失败（可能没有空位）');
            }
        } else {
            console.warn('[Test] ⚠️ 没有农田，跳过种植测试');
        }
        
        // 4. 检查生长状态
        console.log('[Test] 步骤3: 检查生长状态...');
        const matureCount = harvestSystem.getHarvestableCount();
        console.log(`[Test] 当前可收获作物数量: ${matureCount}`);
        
        // 5. 模拟生长（加速）
        console.log('[Test] 步骤4: 模拟生长（加速60秒）...');
        if (farmModel.fields.length > 0) {
            const field = farmModel.fields[0];
            const crop = field.crops.find(c => !c.isEmpty());
            if (crop) {
                const slotIndex = field.crops.indexOf(crop);
                growthSystem.accelerateGrowth(FieldType.Field, 0, slotIndex, 60);
                console.log('[Test] ✅ 生长加速完成');
                
                // 手动更新生长进度
                growthSystem.updateCropGrowth(FieldType.Field, 0, slotIndex, 60);
                console.log('[Test] ✅ 生长进度更新完成');
                
                // 检查是否成熟
                const isMature = crop.isMature();
                console.log(`[Test] 作物是否成熟: ${isMature}`);
            }
        }
        
        // 6. 收获作物
        console.log('[Test] 步骤5: 收获作物...');
        const harvestCount = harvestSystem.getHarvestableCount();
        if (harvestCount > 0) {
            const result = harvestSystem.harvestAllFields();
            if (result.success) {
                console.log(`[Test] ✅ 收获成功: ${result.count}个作物，获得${result.money}金币`);
            }
        } else {
            console.log('[Test] ⚠️ 没有可收获的作物');
        }
        
        console.log('[Test] ========== 农场工作流程测试完成 ==========');
    } catch (error) {
        console.error('[Test] ❌ 农场工作流程测试失败:', error);
        throw error;
    }
}

/**
 * 测试批量种植
 */
export function testBatchPlant(): void {
    console.log('[Test] 测试批量种植...');
    
    try {
        const plantSystem = ecs.getSystem(PlantSystem);
        if (!plantSystem) {
            throw new Error('PlantSystem 未找到');
        }
        
        const farmModel = smc.farm.FarmModel;
        if (farmModel.fields.length === 0) {
            console.warn('[Test] 没有农田，跳过测试');
            return;
        }
        
        const field = farmModel.fields[0];
        const emptyCount = field.crops.filter(c => c.isEmpty()).length;
        console.log(`[Test] 农田0的空位数量: ${emptyCount}`);
        
        const successCount = plantSystem.plantCropsBatch(FieldType.Field, 0, 1, 3);
        console.log(`[Test] ✅ 批量种植完成: 成功 ${successCount} 个`);
    } catch (error) {
        console.error('[Test] ❌ 批量种植测试失败:', error);
        throw error;
    }
}

/**
 * 测试动物养殖
 */
export function testBreedAnimal(): void {
    console.log('[Test] 测试动物养殖...');
    
    try {
        const breedSystem = ecs.getSystem(BreedSystem);
        if (!breedSystem) {
            throw new Error('BreedSystem 未找到');
        }
        
        const farmModel = smc.farm.FarmModel;
        if (farmModel.cages.length === 0) {
            console.warn('[Test] 没有畜栏，跳过测试');
            return;
        }
        
        const success = breedSystem.breedAnimal(FieldType.Cage, 0, 1);
        if (success) {
            console.log('[Test] ✅ 动物养殖成功');
        } else {
            console.warn('[Test] ⚠️ 动物养殖失败');
        }
    } catch (error) {
        console.error('[Test] ❌ 动物养殖测试失败:', error);
        throw error;
    }
}
