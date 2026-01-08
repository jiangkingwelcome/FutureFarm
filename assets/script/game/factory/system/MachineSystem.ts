/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 机器管理系统
 * 处理机器升级、修复、解锁等逻辑
 */

import { ecs } from "db://oops-framework/libs/ecs/ECS";
import type { Factory } from "../Factory";
import { smc } from "../../common/SingletonModuleComp";
import { MachineModel, MachineStatus } from "../model/MachineModel";
import { GameStateModelComp } from "../../gameState/model/GameStateModelComp";

/**
 * 机器管理系统
 * 处理机器相关的业务逻辑
 */
@ecs.register('MachineSystem')
export class MachineSystem extends ecs.ComblockSystem implements ecs.IEntityEnterSystem {
    filter(): ecs.IMatcher {
        return ecs.allOf(ecs.getMatcher(Factory));
    }

    entityEnter(e: Factory): void {
        console.log('[MachineSystem] 机器管理系统已启动');
    }

    /**
     * 升级机器
     * @param machineIndex 机器索引
     * @param cost 升级费用（可选，如果不提供则从配置读取）
     * @returns 是否成功
     */
    public upgradeMachine(machineIndex: number, cost?: number): boolean {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            console.warn(`[MachineSystem] 机器不存在: index=${machineIndex}`);
            return false;
        }

        if (machine.currentLevel >= machine.maxLevel) {
            console.warn(`[MachineSystem] 机器已达到最大等级: index=${machineIndex}, level=${machine.currentLevel}`);
            return false;
        }

        // 计算升级费用
        if (cost === undefined) {
            cost = this.getUpgradeCost(machine.machineId, machine.currentLevel);
        }

        // 检查金钱
        const gameStateModel = smc.gameState.GameStateModel;
        if (gameStateModel.currentMoney < cost) {
            console.warn(`[MachineSystem] 金钱不足: 需要${cost}, 当前${gameStateModel.currentMoney}`);
            return false;
        }

        // 扣除金钱
        gameStateModel.spendMoney(cost);

        // 升级机器
        const success = machine.upgrade();
        
        if (success) {
            console.log(`[MachineSystem] ✅ 机器升级成功: index=${machineIndex}, level=${machine.currentLevel}`);
        }
        
        return success;
    }

    /**
     * 修复机器
     * @param machineIndex 机器索引
     * @param cost 修复费用（可选）
     * @returns 是否成功
     */
    public repairMachine(machineIndex: number, cost?: number): boolean {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(machineIndex);
        
        if (!machine) {
            console.warn(`[MachineSystem] 机器不存在: index=${machineIndex}`);
            return false;
        }

        if (machine.status !== MachineStatus.Broken) {
            console.warn(`[MachineSystem] 机器未损坏: index=${machineIndex}`);
            return false;
        }

        // 计算修复费用
        if (cost === undefined) {
            cost = this.getRepairCost(machine.machineId, machine.currentLevel);
        }

        // 检查金钱
        const gameStateModel = smc.gameState.GameStateModel;
        if (gameStateModel.currentMoney < cost) {
            console.warn(`[MachineSystem] 金钱不足: 需要${cost}, 当前${gameStateModel.currentMoney}`);
            return false;
        }

        // 扣除金钱
        gameStateModel.spendMoney(cost);

        // 修复机器
        machine.repair();
        
        console.log(`[MachineSystem] ✅ 机器修复成功: index=${machineIndex}`);
        return true;
    }

    /**
     * 解锁机器位置
     * @param positionIndex 位置索引
     * @param cost 解锁费用（可选）
     * @returns 是否成功
     */
    public unlockMachinePosition(positionIndex: number, cost?: number): boolean {
        const factoryModel = smc.factory.FactoryModel;
        const machine = factoryModel.getMachine(positionIndex);
        
        if (!machine) {
            console.warn(`[MachineSystem] 机器不存在: index=${positionIndex}`);
            return false;
        }

        if (machine.unlocked) {
            console.warn(`[MachineSystem] 机器已解锁: index=${positionIndex}`);
            return false;
        }

        // 计算解锁费用
        if (cost === undefined) {
            cost = this.getUnlockCost(positionIndex);
        }

        // 检查金钱
        const gameStateModel = smc.gameState.GameStateModel;
        if (gameStateModel.currentMoney < cost) {
            console.warn(`[MachineSystem] 金钱不足: 需要${cost}, 当前${gameStateModel.currentMoney}`);
            return false;
        }

        // 扣除金钱
        gameStateModel.spendMoney(cost);

        // 解锁机器
        machine.unlocked = true;
        
        console.log(`[MachineSystem] ✅ 机器位置解锁成功: index=${positionIndex}`);
        return true;
    }

    /**
     * 检查机器是否损坏（随机事件）
     * @param machineIndex 机器索引
     * @param failRatio 损坏概率（0-1）
     * @returns 是否损坏
     */
    public checkMachineFail(machineIndex: number, failRatio: number = 0.1): boolean {
        const factoryModel = smc.factory.FactoryModel;
        
        // 如果关卡不允许损坏，直接返回
        if (!factoryModel.canBreak) {
            return false;
        }

        const machine = factoryModel.getMachine(machineIndex);
        if (!machine || machine.status !== MachineStatus.Producing) {
            return false;
        }

        // 随机检查
        if (Math.random() < failRatio) {
            machine.setBroken();
            console.log(`[MachineSystem] ⚠️ 机器损坏: index=${machineIndex}`);
            return true;
        }

        return false;
    }

    /**
     * 获取升级费用
     * @param machineId 机器ID
     * @param currentLevel 当前等级
     * @returns 升级费用
     */
    private getUpgradeCost(machineId: number, currentLevel: number): number {
        // TODO: 从配置中读取升级费用
        // 这里简化处理
        const baseCost = 100;
        return baseCost * currentLevel;
    }

    /**
     * 获取修复费用
     * @param machineId 机器ID
     * @param currentLevel 当前等级
     * @returns 修复费用
     */
    private getRepairCost(machineId: number, currentLevel: number): number {
        // TODO: 从配置中读取修复费用
        // 这里简化处理
        const baseCost = 50;
        return baseCost * currentLevel;
    }

    /**
     * 获取解锁费用
     * @param positionIndex 位置索引
     * @returns 解锁费用
     */
    private getUnlockCost(positionIndex: number): number {
        // TODO: 从配置中读取解锁费用
        // 这里简化处理
        const baseCost = 200;
        return baseCost * (positionIndex + 1);
    }
}
