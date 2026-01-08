/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 配置管理器测试文件
 * 用于验证 ConfigManager 基类是否可以正常导入和使用
 */

import { ConfigManager } from '../../game/common/config/ConfigManager';

/**
 * 测试配置管理器导入
 * 如果导入成功且无报错，说明编译通过
 */
export function testConfigManagerImport(): void {
    console.log('[Test] ConfigManager 导入成功！');
    console.log('[Test] ConfigManager 类:', ConfigManager);
    
    // 验证类存在
    if (!ConfigManager) {
        throw new Error('ConfigManager 类未找到');
    }
    
    console.log('[Test] ✅ ConfigManager 基类验证通过');
}
