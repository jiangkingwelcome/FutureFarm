/**
 * @Author: jiangking
 * @Email: jiangkingwelcome@vip.qq.com
 * @Phone: 13816629321
 * 
 * 作物视图组件
 * 显示单个作物的状态
 */

import { _decorator, Component, Node, Sprite, SpriteFrame, UITransform, Label, Color, ProgressBar } from "cc";
import { CropModel, CropStatus } from "../model/CropModel";

const { ccclass, property } = _decorator;

/** 作物视图组件 */
@ccclass('CropViewComp')
export class CropViewComp extends Component {
    /** 作物数据模型 */
    private cropModel: CropModel | null = null;
    
    /** 槽位索引 */
    private slotIndex: number = 0;
    
    /** 作物精灵 */
    private cropSprite: Sprite | null = null;
    
    /** 状态标签 */
    private statusLabel: Label | null = null;
    
    /** 进度条 */
    private progressBar: ProgressBar | null = null;

    /** 初始化 */
    public init(cropModel: CropModel, slotIndex: number): void {
        this.cropModel = cropModel;
        this.slotIndex = slotIndex;
        
        this.createUI();
        this.refresh();
    }

    /** 创建UI */
    private createUI(): void {
        // 创建作物精灵
        const spriteNode = new Node('CropSprite');
        spriteNode.addComponent(UITransform).setContentSize(30, 30);
        this.cropSprite = spriteNode.addComponent(Sprite);
        // TODO: 设置作物图片（从资源加载）
        spriteNode.setPosition(0, 0, 0);
        this.node.addChild(spriteNode);

        // 创建状态标签
        const statusNode = new Node('Status');
        statusNode.addComponent(UITransform).setContentSize(30, 15);
        this.statusLabel = statusNode.addComponent(Label);
        this.statusLabel.fontSize = 10;
        this.statusLabel.color = Color.WHITE;
        statusNode.setPosition(0, -20, 0);
        this.node.addChild(statusNode);

        // 创建进度条（用于显示生长进度）
        const progressNode = new Node('Progress');
        progressNode.addComponent(UITransform).setContentSize(30, 4);
        this.progressBar = progressNode.addComponent(ProgressBar);
        // TODO: 设置进度条样式
        progressNode.setPosition(0, 15, 0);
        this.node.addChild(progressNode);
    }

    /** 刷新显示 */
    public refresh(): void {
        if (!this.cropModel) {
            return;
        }

        // 更新显示状态
        if (this.cropModel.isEmpty()) {
            // 空槽位
            if (this.cropSprite) {
                this.cropSprite.enabled = false;
            }
            if (this.statusLabel) {
                this.statusLabel.string = '';
            }
            if (this.progressBar) {
                this.progressBar.progress = 0;
            }
        } else {
            // 有作物
            if (this.cropSprite) {
                this.cropSprite.enabled = true;
                // TODO: 根据作物ID和状态设置图片
            }
            
            if (this.statusLabel) {
                switch (this.cropModel.status) {
                    case CropStatus.Growing:
                        this.statusLabel.string = '🌱';
                        this.statusLabel.color = Color.GREEN;
                        break;
                    case CropStatus.Mature:
                        this.statusLabel.string = '✅';
                        this.statusLabel.color = Color.YELLOW;
                        break;
                    case CropStatus.Sick:
                        this.statusLabel.string = '⚠️';
                        this.statusLabel.color = Color.RED;
                        break;
                    default:
                        this.statusLabel.string = '';
                }
            }
            
            if (this.progressBar) {
                this.progressBar.progress = this.cropModel.growthProgress / 100;
            }
        }
    }
}
