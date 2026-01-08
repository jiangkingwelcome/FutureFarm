/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 田地视图组件
 * 显示单个田地的状态和作物
 */

import { _decorator, Component, Node, Label, Sprite, SpriteFrame, UITransform, Color, EventTouch, tween, Vec3 } from "cc";
import { FieldModel, FieldType } from "../model/FieldModel";
import { CropModel, CropStatus } from "../model/CropModel";
import { CropViewComp } from "./CropViewComp";
import { smc } from "../../common/SingletonModuleComp";
import { ecs } from "db://oops-framework/libs/ecs/ECS";
import { PlantSystem } from "../system/PlantSystem";
import { HarvestSystem } from "../system/HarvestSystem";

const { ccclass, property } = _decorator;

/** 田地视图组件 */
@ccclass('FieldViewComp')
export class FieldViewComp extends Component {
    /** 田地数据模型 */
    private fieldModel: FieldModel | null = null;
    
    /** 田地类型 */
    private fieldType: FieldType = FieldType.Field;
    
    /** 田地索引 */
    private fieldIndex: number = 0;
    
    /** 背景精灵 */
    private bgSprite: Sprite | null = null;
    
    /** 等级标签 */
    private levelLabel: Label | null = null;
    
    /** 作物容器 */
    private cropContainer: Node | null = null;
    
    /** 作物视图列表 */
    private cropViews: CropViewComp[] = [];

    /** 初始化 */
    public init(fieldModel: FieldModel, fieldType: FieldType, fieldIndex: number): void {
        this.fieldModel = fieldModel;
        this.fieldType = fieldType;
        this.fieldIndex = fieldIndex;
        
        this.createUI();
        this.refresh();
        
        // 添加点击事件（需要确保节点可点击）
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.setContentSize(100, 100);
        }
        this.node.on(Node.EventType.TOUCH_END, this.onFieldClick, this);
    }

    /** 创建UI */
    private createUI(): void {
        // 创建背景
        const bgNode = new Node('Bg');
        bgNode.addComponent(UITransform).setContentSize(100, 100);
        this.bgSprite = bgNode.addComponent(Sprite);
        // TODO: 设置背景图片（从资源加载）
        bgNode.setPosition(0, 0, 0);
        this.node.addChild(bgNode);

        // 创建等级标签
        const levelNode = new Node('Level');
        levelNode.addComponent(UITransform).setContentSize(50, 20);
        this.levelLabel = levelNode.addComponent(Label);
        this.levelLabel.fontSize = 16;
        this.levelLabel.color = Color.WHITE;
        levelNode.setPosition(0, -40, 0);
        this.node.addChild(levelNode);

        // 创建作物容器
        this.cropContainer = new Node('Crops');
        this.cropContainer.addComponent(UITransform).setContentSize(100, 100);
        this.node.addChild(this.cropContainer);

        // 创建作物视图
        this.createCropViews();
    }

    /** 创建作物视图 */
    private createCropViews(): void {
        if (!this.fieldModel || !this.cropContainer) {
            return;
        }

        this.cropViews = [];
        
        // 根据田地类型决定作物布局
        const cropCount = this.fieldModel.crops.length;
        const cols = Math.ceil(Math.sqrt(cropCount));
        
        this.fieldModel.crops.forEach((crop, index) => {
            const cropNode = new Node(`Crop_${index}`);
            const transform = cropNode.addComponent(UITransform);
            transform.setContentSize(30, 30);
            
            const cropView = cropNode.addComponent(CropViewComp);
            cropView.init(crop, index);
            
            // 网格布局
            const row = Math.floor(index / cols);
            const col = index % cols;
            const spacing = 35;
            const startX = -(cols - 1) * spacing / 2;
            cropNode.setPosition(startX + col * spacing, (row - 1) * spacing / 2, 0);
            
            this.cropContainer!.addChild(cropNode);
            this.cropViews.push(cropView);
        });
    }

    /** 刷新显示 */
    public refresh(): void {
        if (!this.fieldModel) {
            return;
        }

        // 更新等级显示
        if (this.levelLabel) {
            this.levelLabel.string = `Lv.${this.fieldModel.currentLevel}`;
        }

        // 更新作物视图
        this.cropViews.forEach((view, index) => {
            if (index < this.fieldModel!.crops.length) {
                view.refresh();
            }
        });
    }

    /** 田地点击事件 */
    private onFieldClick(event: EventTouch): void {
        if (!this.fieldModel) {
            return;
        }

        console.log(`[FieldView] 点击田地: type=${this.fieldType}, index=${this.fieldIndex}`);
        
        // 检查是否有成熟作物
        const matureCrops = this.fieldModel.crops.filter(c => c.isMature());
        if (matureCrops.length > 0) {
            // 有成熟作物，执行收获
            this.harvestAllMatureCrops();
        } else {
            // 没有成熟作物，打开种植菜单
            this.openPlantMenu();
        }
    }

    /** 收获所有成熟作物 */
    private harvestAllMatureCrops(): void {
        const harvestSystem = ecs.getSystem(HarvestSystem);
        if (!harvestSystem) {
            return;
        }

        const result = harvestSystem.harvestAllMatureCrops(this.fieldType, this.fieldIndex);
        if (result.success) {
            console.log(`[FieldView] ✅ 收获成功: ${result.count}个作物，获得${result.money}金币`);
            
            // 刷新显示
            this.refresh();
            
            // 播放收获动画
            this.playHarvestAnimation();
        }
    }

    /** 打开种植菜单 */
    private openPlantMenu(): void {
        // 检查是否有空位
        if (!this.fieldModel || !this.fieldModel.hasEmptySlot()) {
            console.log(`[FieldView] 没有空位`);
            return;
        }

        // TODO: 显示作物选择界面
        // 临时：直接种植第一个作物（用于测试）
        const plantSystem = ecs.getSystem(PlantSystem);
        if (plantSystem) {
            const success = plantSystem.plantCrop(this.fieldType, this.fieldIndex, 1);
            if (success) {
                console.log(`[FieldView] ✅ 种植成功`);
                this.refresh();
            }
        }
    }

    /** 播放收获动画 */
    private playHarvestAnimation(): void {
        // 简单的缩放动画
        const originalScale = this.node.scale.clone();
        tween(this.node)
            .to(0.1, { scale: new Vec3(originalScale.x * 1.1, originalScale.y * 1.1, 1) })
            .to(0.1, { scale: originalScale })
            .start();
    }
}
