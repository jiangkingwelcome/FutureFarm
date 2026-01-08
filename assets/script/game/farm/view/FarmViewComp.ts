/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 农场主界面组件
 * 显示和管理农场UI
 */

import { _decorator, Node, Label, Sprite, SpriteFrame, UITransform, Vec3, tween } from "cc";
import { gui } from "db://oops-framework/core/gui/Gui";
import { LayerType } from "db://oops-framework/core/gui/layer/LayerEnum";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { CCView } from "db://oops-framework/module/common/CCView";
import { smc } from "../../common/SingletonModuleComp";
import type { Farm } from "../Farm";
import { FieldType } from "../model/FieldModel";
import { FieldViewComp } from "./FieldViewComp";

const { ccclass, property } = _decorator;

/** 农场主界面 */
@ccclass('FarmViewComp')
@ecs.register('FarmView', false)
@gui.register('FarmView', { layer: LayerType.UI, prefab: "farm/farm_view", bundle: "gui" })
export class FarmViewComp extends CCView<Farm> {
    /** 田地容器节点 */
    @property(Node)
    fieldContainer: Node = null!;

    /** 农田容器节点 */
    @property(Node)
    fieldFieldsContainer: Node = null!;

    /** 畜栏容器节点 */
    @property(Node)
    fieldCagesContainer: Node = null!;

    /** 池塘容器节点 */
    @property(Node)
    fieldPondsContainer: Node = null!;

    /** 金钱显示标签 */
    @property(Label)
    moneyLabel: Label = null!;

    /** 天数显示标签 */
    @property(Label)
    dayLabel: Label = null!;

    /** 星级显示标签 */
    @property(Label)
    starLabel: Label = null!;

    /** 田地视图组件列表 */
    private fieldViews: FieldViewComp[] = [];

    start() {
        console.log('[FarmView] 农场界面启动');
        this.initUI();
        this.refresh();
    }

    /** 初始化UI */
    private initUI(): void {
        // 创建田地视图
        this.createFieldViews();
        
        // 监听游戏状态变化
        this.updateGameStateDisplay();
    }

    /** 创建田地视图 */
    private createFieldViews(): void {
        const farmModel = smc.farm.FarmModel;
        
        // 清空现有视图
        this.fieldViews = [];
        if (this.fieldFieldsContainer) {
            this.fieldFieldsContainer.removeAllChildren();
        }
        if (this.fieldCagesContainer) {
            this.fieldCagesContainer.removeAllChildren();
        }
        if (this.fieldPondsContainer) {
            this.fieldPondsContainer.removeAllChildren();
        }

        // 创建农田视图
        farmModel.fields.forEach((field, index) => {
            const container = this.fieldFieldsContainer || this.fieldContainer;
            if (container) {
                const fieldView = this.createFieldView(container, field, FieldType.Field, index);
                this.fieldViews.push(fieldView);
            }
        });

        // 创建畜栏视图
        farmModel.cages.forEach((field, index) => {
            const container = this.fieldCagesContainer || this.fieldContainer;
            if (container) {
                const fieldView = this.createFieldView(container, field, FieldType.Cage, index);
                this.fieldViews.push(fieldView);
            }
        });

        // 创建池塘视图
        farmModel.ponds.forEach((field, index) => {
            const container = this.fieldPondsContainer || this.fieldContainer;
            if (container) {
                const fieldView = this.createFieldView(container, field, FieldType.Pond, index);
                this.fieldViews.push(fieldView);
            }
        });

        console.log(`[FarmView] 创建了 ${this.fieldViews.length} 个田地视图`);
    }

    /** 创建单个田地视图 */
    private createFieldView(parent: Node, field: any, fieldType: FieldType, index: number): FieldViewComp {
        // 创建田地节点
        const fieldNode = new Node(`Field_${fieldType}_${index}`);
        const transform = fieldNode.addComponent(UITransform);
        transform.setContentSize(100, 100); // 默认大小
        
        // 添加田地视图组件
        const fieldView = fieldNode.addComponent(FieldViewComp);
        fieldView.init(field, fieldType, index);
        
        // 设置位置（简单的网格布局）
        const row = Math.floor(index / 3);
        const col = index % 3;
        fieldNode.setPosition(col * 120 - 120, -row * 120 + 200, 0);
        
        parent.addChild(fieldNode);
        
        return fieldView;
    }

    /** 刷新界面 */
    public refresh(): void {
        // 更新游戏状态显示
        this.updateGameStateDisplay();
        
        // 更新所有田地视图
        this.fieldViews.forEach(view => {
            view.refresh();
        });
    }

    /** 更新游戏状态显示 */
    private updateGameStateDisplay(): void {
        const gameStateModel = smc.gameState.GameStateModel;
        
        if (this.moneyLabel) {
            this.moneyLabel.string = `金钱: ${gameStateModel.currentMoney}`;
        }
        
        if (this.dayLabel) {
            this.dayLabel.string = `天数: ${gameStateModel.currentDay}`;
        }
        
        if (this.starLabel) {
            this.starLabel.string = `星级: ${gameStateModel.currentStar}⭐`;
        }
    }

    /** 打开种植选择界面（TODO: 后续实现） */
    public openPlantMenu(fieldType: FieldType, fieldIndex: number): void {
        console.log(`[FarmView] 打开种植菜单: 田地[${fieldType}-${fieldIndex}]`);
        // TODO: 显示作物选择界面
    }

    reset() {
        this.fieldViews = [];
        this.node.destroy();
    }
}
