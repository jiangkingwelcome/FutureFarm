# 代码转换规范

## 概述

本文档详细说明Unity C#代码转换为Cocos Creator TypeScript的规范和最佳实践。

---

## 1. 类型系统转换

### 1.1 基础类型

```typescript
// C#                    →  TypeScript
int age                  →  age: number
float speed              →  speed: number
double precision         →  precision: number
string name              →  name: string
bool isActive            →  isActive: boolean
char c                   →  c: string
byte b                   →  b: number
```

### 1.2 数组与集合

```typescript
// C# 数组               →  TypeScript 数组
int[] numbers            →  numbers: number[]
string[] names           →  names: string[]
T[,] matrix              →  matrix: T[][]  // 二维数组

// C# List               →  TypeScript 数组
List<int> list           →  list: number[]
List<string> list        →  list: string[]
List<Item> items         →  items: Item[]

// C# Dictionary         →  TypeScript Map 或 对象
Dictionary<string, int>  →  map: Map<string, number>
                         →  或 obj: { [key: string]: number }
Dictionary<int, Item>    →  map: Map<number, Item>
```

### 1.3 可空类型

```typescript
// C#                    →  TypeScript
int? nullable            →  nullable: number | null
string? nullable         →  nullable: string | null
Item? item               →  item: Item | null
```

### 1.4 枚举

```csharp
// C#
public enum GameState {
    Idle = 0,
    Playing = 1,
    Paused = 2,
    GameOver = 3
}
```

```typescript
// TypeScript
export enum GameState {
    Idle = 0,
    Playing = 1,
    Paused = 2,
    GameOver = 3
}
```

---

## 2. 类与组件转换

### 2.1 MonoBehaviour → Component

```csharp
// Unity C#
using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float speed = 5f;
    public int health = 100;

    void Awake() { }
    void Start() { }
    void Update() { }
    void OnDestroy() { }
}
```

```typescript
// Cocos TypeScript
import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property
    speed: number = 5;

    @property
    health: number = 100;

    onLoad() { }    // = Awake
    start() { }     // = Start
    update(dt: number) { }  // = Update (dt = Time.deltaTime)
    onDestroy() { }
}
```

### 2.2 属性装饰器

```csharp
// Unity C#
[SerializeField] private float _speed;
public float speed = 5f;
[Header("Settings")]
public int maxHealth = 100;
[Range(0, 100)]
public float volume = 50f;
[HideInInspector]
public string secretKey;
```

```typescript
// Cocos TypeScript
import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Example')
export class Example extends Component {
    @property
    private _speed: number = 0;

    @property
    speed: number = 5;

    @property({ group: { name: 'Settings' } })
    maxHealth: number = 100;

    @property({ range: [0, 100, 1] })
    volume: number = 50;

    // 不使用@property则不显示在编辑器
    secretKey: string = '';
}
```

### 2.3 引用其他组件

```csharp
// Unity C#
public Transform target;
public SpriteRenderer spriteRenderer;
public Button submitButton;
```

```typescript
// Cocos TypeScript
import { _decorator, Component, Node, Sprite, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Example')
export class Example extends Component {
    @property(Node)
    target: Node = null!;

    @property(Sprite)
    spriteRenderer: Sprite = null!;

    @property(Button)
    submitButton: Button = null!;
}
```

---

## 3. 生命周期转换

### 3.1 完整生命周期对照

| Unity C# | Cocos TypeScript | 说明 |
|----------|------------------|------|
| `Awake()` | `onLoad()` | 组件加载时，初始化 |
| `OnEnable()` | `onEnable()` | 组件启用时 |
| `Start()` | `start()` | 第一帧之前 |
| `Update()` | `update(dt)` | 每帧调用 |
| `LateUpdate()` | `lateUpdate(dt)` | Update之后 |
| `FixedUpdate()` | - | 用schedule替代 |
| `OnDisable()` | `onDisable()` | 组件禁用时 |
| `OnDestroy()` | `onDestroy()` | 组件销毁时 |

### 3.2 FixedUpdate 替代方案

```csharp
// Unity C#
void FixedUpdate() {
    // 物理更新，固定时间间隔
}
```

```typescript
// Cocos TypeScript
onLoad() {
    // 使用 schedule 替代 FixedUpdate
    this.schedule(this.fixedUpdate, 0.02);  // 50fps
}

fixedUpdate() {
    // 固定时间间隔逻辑
}

onDestroy() {
    this.unschedule(this.fixedUpdate);
}
```

---

## 4. 常用API转换

### 4.1 游戏对象操作

```csharp
// Unity C#
GameObject obj = new GameObject("name");
GameObject found = GameObject.Find("name");
Transform child = transform.Find("path/to/child");
T comp = GetComponent<T>();
T comp = GetComponentInChildren<T>();
T[] comps = GetComponentsInChildren<T>();
gameObject.SetActive(true);
Destroy(gameObject);
Destroy(gameObject, 2f);
DontDestroyOnLoad(gameObject);
Instantiate(prefab);
Instantiate(prefab, position, rotation);
```

```typescript
// Cocos TypeScript
import { Node, find, instantiate, director } from 'cc';

let obj = new Node("name");
let found = find("name");  // 全局查找
let child = this.node.getChildByPath("path/to/child");
let comp = this.getComponent(T);
let comp = this.getComponentInChildren(T);
let comps = this.getComponentsInChildren(T);
this.node.active = true;
this.node.destroy();
this.scheduleOnce(() => this.node.destroy(), 2);
director.addPersistRootNode(this.node);
let newNode = instantiate(prefab);
let newNode = instantiate(prefab);
newNode.setPosition(position);
newNode.setRotation(rotation);
```

### 4.2 Transform 操作

```csharp
// Unity C#
transform.position = new Vector3(1, 2, 3);
transform.localPosition = new Vector3(1, 2, 3);
transform.rotation = Quaternion.Euler(0, 90, 0);
transform.localScale = new Vector3(2, 2, 2);
transform.Translate(1, 0, 0);
transform.Rotate(0, 90, 0);
transform.LookAt(target);
transform.parent = newParent;
transform.SetParent(newParent, true);
```

```typescript
// Cocos TypeScript
import { Vec3, Quat } from 'cc';

this.node.setWorldPosition(new Vec3(1, 2, 3));
this.node.setPosition(new Vec3(1, 2, 3));  // local
this.node.setRotationFromEuler(0, 90, 0);
this.node.setScale(new Vec3(2, 2, 2));
this.node.translate(new Vec3(1, 0, 0));
// rotate需要手动实现
this.node.lookAt(target.getWorldPosition());
this.node.parent = newParent;
this.node.setParent(newParent, true);  // keepWorldTransform
```

### 4.3 输入处理

```csharp
// Unity C#
if (Input.GetKeyDown(KeyCode.Space)) { }
if (Input.GetKey(KeyCode.W)) { }
if (Input.GetMouseButtonDown(0)) { }
Vector3 mousePos = Input.mousePosition;
float horizontal = Input.GetAxis("Horizontal");
```

```typescript
// Cocos TypeScript
import { _decorator, Component, input, Input, EventKeyboard, EventMouse, KeyCode } from 'cc';

@ccclass('InputExample')
export class InputExample extends Component {
    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }

    onKeyDown(event: EventKeyboard) {
        if (event.keyCode === KeyCode.SPACE) { }
    }

    onKeyPressing(event: EventKeyboard) {
        if (event.keyCode === KeyCode.KEY_W) { }
    }

    onMouseDown(event: EventMouse) {
        if (event.getButton() === EventMouse.BUTTON_LEFT) { }
    }

    onMouseMove(event: EventMouse) {
        let pos = event.getLocation();
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_PRESSING, this.onKeyPressing, this);
        input.off(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
    }
}
```

### 4.4 触摸事件

```csharp
// Unity C# (NGUI)
void OnClick() { }
void OnPress(bool pressed) { }
void OnDrag(Vector2 delta) { }
```

```typescript
// Cocos TypeScript
import { _decorator, Component, Node, EventTouch } from 'cc';

@ccclass('TouchExample')
export class TouchExample extends Component {
    @property(Node)
    target: Node = null!;

    onLoad() {
        this.target.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.target.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.target.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        // = OnPress(true)
    }

    onTouchMove(event: EventTouch) {
        let delta = event.getDelta();  // = OnDrag
    }

    onTouchEnd(event: EventTouch) {
        // = OnClick / OnPress(false)
    }

    onDestroy() {
        this.target.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.target.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.target.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}
```

### 4.5 资源加载

```csharp
// Unity C#
GameObject prefab = Resources.Load<GameObject>("Prefabs/Enemy");
Texture2D tex = Resources.Load<Texture2D>("Textures/Icon");
AudioClip clip = Resources.Load<AudioClip>("Sounds/Click");
```

```typescript
// Cocos TypeScript
import { resources, Prefab, SpriteFrame, AudioClip } from 'cc';

// 异步加载（推荐）
resources.load("prefabs/enemy", Prefab, (err, prefab) => {
    if (err) { console.error(err); return; }
    let node = instantiate(prefab);
});

resources.load("textures/icon/spriteFrame", SpriteFrame, (err, sf) => {
    if (err) { console.error(err); return; }
    sprite.spriteFrame = sf;
});

resources.load("sounds/click", AudioClip, (err, clip) => {
    if (err) { console.error(err); return; }
    // 使用clip
});

// Promise 方式
async loadResources() {
    let prefab = await new Promise<Prefab>((resolve, reject) => {
        resources.load("prefabs/enemy", Prefab, (err, asset) => {
            if (err) reject(err);
            else resolve(asset);
        });
    });
}
```

### 4.6 场景管理

```csharp
// Unity C#
Application.LoadLevel("SceneName");
Application.LoadLevelAsync("SceneName");
SceneManager.LoadScene("SceneName");
SceneManager.LoadSceneAsync("SceneName");
```

```typescript
// Cocos TypeScript
import { director } from 'cc';

// 同步加载
director.loadScene("SceneName");

// 带回调
director.loadScene("SceneName", () => {
    console.log("场景加载完成");
});

// 预加载
director.preloadScene("SceneName", () => {
    director.loadScene("SceneName");
});
```

### 4.7 协程 → 异步/定时器

```csharp
// Unity C#
IEnumerator DoSomething() {
    yield return new WaitForSeconds(1f);
    Debug.Log("1秒后");
    yield return new WaitForSeconds(2f);
    Debug.Log("再2秒后");
}
StartCoroutine(DoSomething());
```

```typescript
// Cocos TypeScript - 方式1：schedule
this.scheduleOnce(() => {
    console.log("1秒后");
    this.scheduleOnce(() => {
        console.log("再2秒后");
    }, 2);
}, 1);

// Cocos TypeScript - 方式2：async/await + Promise
async doSomething() {
    await this.delay(1);
    console.log("1秒后");
    await this.delay(2);
    console.log("再2秒后");
}

delay(seconds: number): Promise<void> {
    return new Promise(resolve => {
        this.scheduleOnce(resolve, seconds);
    });
}
```

### 4.8 数据存储

```csharp
// Unity C#
PlayerPrefs.SetInt("key", 100);
PlayerPrefs.SetFloat("key", 1.5f);
PlayerPrefs.SetString("key", "value");
int val = PlayerPrefs.GetInt("key", 0);
PlayerPrefs.Save();
PlayerPrefs.DeleteKey("key");
PlayerPrefs.DeleteAll();
```

```typescript
// Cocos TypeScript
import { sys } from 'cc';

sys.localStorage.setItem("key", "100");
sys.localStorage.setItem("key", "1.5");
sys.localStorage.setItem("key", "value");

let val = parseInt(sys.localStorage.getItem("key") || "0");
// 自动保存，无需手动Save
sys.localStorage.removeItem("key");
sys.localStorage.clear();

// 存储对象
let data = { score: 100, name: "player" };
sys.localStorage.setItem("gameData", JSON.stringify(data));
let loaded = JSON.parse(sys.localStorage.getItem("gameData") || "{}");
```

---

## 5. NGUI → Cocos UI 转换

### 5.1 UI 组件对照

| NGUI | Cocos Creator |
|------|--------------|
| `UISprite` | `Sprite` |
| `UILabel` | `Label` |
| `UIButton` | `Button` |
| `UIInput` | `EditBox` |
| `UIToggle` | `Toggle` |
| `UISlider` | `Slider` |
| `UIProgressBar` | `ProgressBar` |
| `UIScrollView` | `ScrollView` |
| `UIGrid` | `Layout` (Grid) |
| `UITable` | `Layout` |
| `UIPanel` | `UITransform` + `Mask` |
| `UIAnchor` | `Widget` |
| `UIWidget` | `UITransform` |

### 5.2 NGUI 事件转换

```csharp
// Unity NGUI
UIEventListener.Get(gameObject).onClick = OnClick;
UIEventListener.Get(gameObject).onPress = OnPress;
UIEventListener.Get(gameObject).onDrag = OnDrag;

void OnClick(GameObject go) { }
void OnPress(GameObject go, bool pressed) { }
void OnDrag(GameObject go, Vector2 delta) { }
```

```typescript
// Cocos TypeScript
import { _decorator, Component, Node, Button, EventTouch } from 'cc';

@ccclass('UIExample')
export class UIExample extends Component {
    @property(Button)
    btn: Button = null!;

    @property(Node)
    dragArea: Node = null!;

    onLoad() {
        this.btn.node.on('click', this.onClick, this);
        this.dragArea.on(Node.EventType.TOUCH_START, this.onPress, this);
        this.dragArea.on(Node.EventType.TOUCH_END, this.onRelease, this);
        this.dragArea.on(Node.EventType.TOUCH_MOVE, this.onDrag, this);
    }

    onClick() { }
    onPress(event: EventTouch) { }
    onRelease(event: EventTouch) { }
    onDrag(event: EventTouch) {
        let delta = event.getDelta();
    }
}
```

---

## 6. iTween → Tween 转换

### 6.1 基础动画

```csharp
// Unity iTween
iTween.MoveTo(gameObject, new Vector3(100, 100, 0), 1f);
iTween.ScaleTo(gameObject, Vector3.one * 2, 0.5f);
iTween.FadeTo(gameObject, 0f, 1f);
iTween.RotateTo(gameObject, new Vector3(0, 180, 0), 1f);
```

```typescript
// Cocos Tween
import { tween, Vec3, UIOpacity } from 'cc';

tween(this.node)
    .to(1, { position: new Vec3(100, 100, 0) })
    .start();

tween(this.node)
    .to(0.5, { scale: new Vec3(2, 2, 2) })
    .start();

// 透明度需要UIOpacity组件
let opacity = this.node.getComponent(UIOpacity);
tween(opacity)
    .to(1, { opacity: 0 })
    .start();

tween(this.node)
    .to(1, { eulerAngles: new Vec3(0, 180, 0) })
    .start();
```

### 6.2 缓动函数

```csharp
// Unity iTween
iTween.MoveTo(gameObject, iTween.Hash(
    "position", targetPos,
    "time", 1f,
    "easetype", iTween.EaseType.easeOutBounce
));
```

```typescript
// Cocos Tween
import { tween, Vec3, easing } from 'cc';

tween(this.node)
    .to(1, { position: targetPos }, { easing: 'bounceOut' })
    .start();

// 可用的easing:
// 'linear', 'smooth', 'fade'
// 'quadIn', 'quadOut', 'quadInOut'
// 'cubicIn', 'cubicOut', 'cubicInOut'
// 'quartIn', 'quartOut', 'quartInOut'
// 'quintIn', 'quintOut', 'quintInOut'
// 'sineIn', 'sineOut', 'sineInOut'
// 'expoIn', 'expoOut', 'expoInOut'
// 'circIn', 'circOut', 'circInOut'
// 'elasticIn', 'elasticOut', 'elasticInOut'
// 'backIn', 'backOut', 'backInOut'
// 'bounceIn', 'bounceOut', 'bounceInOut'
```

### 6.3 序列动画

```csharp
// Unity iTween (顺序)
iTween.MoveTo(gameObject, pos1, 1f);
// 需要用回调实现序列
```

```typescript
// Cocos Tween (链式调用)
tween(this.node)
    .to(1, { position: pos1 })
    .to(1, { position: pos2 })
    .to(1, { position: pos3 })
    .start();

// 带回调
tween(this.node)
    .to(1, { position: pos1 })
    .call(() => console.log("到达pos1"))
    .to(1, { position: pos2 })
    .call(() => console.log("动画完成"))
    .start();
```

---

## 7. 音频系统转换

```csharp
// Unity C#
public AudioSource audioSource;
public AudioClip clip;

audioSource.Play();
audioSource.PlayOneShot(clip);
audioSource.Stop();
audioSource.volume = 0.5f;
audioSource.loop = true;
```

```typescript
// Cocos TypeScript
import { _decorator, Component, AudioSource, AudioClip } from 'cc';

@ccclass('AudioExample')
export class AudioExample extends Component {
    @property(AudioSource)
    audioSource: AudioSource = null!;

    @property(AudioClip)
    clip: AudioClip = null!;

    playBGM() {
        this.audioSource.clip = this.clip;
        this.audioSource.loop = true;
        this.audioSource.play();
    }

    playSFX() {
        this.audioSource.playOneShot(this.clip, 1.0);  // volume
    }

    stop() {
        this.audioSource.stop();
    }

    setVolume(vol: number) {
        this.audioSource.volume = vol;
    }
}
```

---

## 8. XML数据读取转换

```csharp
// Unity C# - 读取XML
using System.Xml;

XmlDocument doc = new XmlDocument();
TextAsset xml = Resources.Load<TextAsset>("Config/mission");
doc.LoadXml(xml.text);
XmlNodeList nodes = doc.SelectNodes("//item");
foreach (XmlNode node in nodes) {
    string id = node.Attributes["id"].Value;
    int value = int.Parse(node.Attributes["value"].Value);
}
```

```typescript
// Cocos TypeScript - 使用JSON（推荐）
import { resources, JsonAsset } from 'cc';

interface MissionItem {
    id: string;
    value: number;
}

interface MissionConfig {
    items: MissionItem[];
}

resources.load("config/mission", JsonAsset, (err, asset) => {
    if (err) { console.error(err); return; }
    let config = asset.json as MissionConfig;
    for (let item of config.items) {
        console.log(item.id, item.value);
    }
});
```

---

## 9. Oops Framework 特有转换

### 9.1 使用ECS模式

```csharp
// Unity 传统单例
public class GameManager : MonoBehaviour {
    public static GameManager Instance;
    public int score;
    void Awake() { Instance = this; }
}
// 使用: GameManager.Instance.score
```

```typescript
// Cocos Oops Framework
// 1. 创建实体
@ecs.register('Game')
export class Game extends CCEntity {
    GameModel!: GameModel;
    protected init() {
        this.addComponents<ecs.Comp>(GameModel);
    }
}

// 2. 创建模型组件
@ecs.register('Game')
export class GameModel extends ecs.Comp {
    score: number = 0;
}

// 3. 注册单例
// SingletonModuleComp.ts
export class smc {
    static game: Game = null!;
}

// 4. 初始化
// Main.ts
smc.game = ecs.getEntity<Game>(Game);

// 5. 使用
smc.game.GameModel.score = 100;
```

### 9.2 使用事件系统

```csharp
// Unity 事件
public delegate void ScoreChanged(int score);
public static event ScoreChanged OnScoreChanged;
OnScoreChanged?.Invoke(100);
OnScoreChanged += HandleScoreChanged;
```

```typescript
// Cocos Oops Framework
import { oops } from "db://oops-framework/core/Oops";

// 定义事件
export class GameEvent {
    static SCORE_CHANGED = "SCORE_CHANGED";
}

// 发送事件
oops.message.dispatchEvent(GameEvent.SCORE_CHANGED, 100);

// 监听事件
oops.message.on(GameEvent.SCORE_CHANGED, this.onScoreChanged, this);

onScoreChanged(score: number) {
    console.log("分数变化:", score);
}

// 取消监听
oops.message.off(GameEvent.SCORE_CHANGED, this.onScoreChanged, this);
```

### 9.3 使用GUI系统

```csharp
// Unity 显示UI
Instantiate(dialogPrefab);
```

```typescript
// Cocos Oops Framework
import { oops } from "db://oops-framework/core/Oops";
import { UIID } from "./GameUIConfig";

// 显示UI
oops.gui.open(UIID.Dialog);

// 带参数
oops.gui.open(UIID.Dialog, { title: "提示", content: "确定吗？" });

// 关闭UI
oops.gui.remove(UIID.Dialog);
```

---

## 10. 常见问题处理

### 10.1 this 绑定问题

```typescript
// 错误 - 回调中this丢失
setTimeout(function() {
    this.doSomething();  // this是undefined
}, 1000);

// 正确 - 使用箭头函数
setTimeout(() => {
    this.doSomething();
}, 1000);

// 正确 - 使用bind
setTimeout(this.doSomething.bind(this), 1000);
```

### 10.2 异步加载资源

```typescript
// 错误 - 同步思维
let prefab = resources.load("prefab");  // 返回undefined

// 正确 - 回调方式
resources.load("prefab", Prefab, (err, prefab) => {
    // 在这里使用prefab
});

// 正确 - async/await
async loadPrefab(): Promise<Prefab> {
    return new Promise((resolve, reject) => {
        resources.load("prefab", Prefab, (err, prefab) => {
            if (err) reject(err);
            else resolve(prefab);
        });
    });
}
```

### 10.3 空引用检查

```typescript
// C# 可能的写法
if (target != null) { }

// TypeScript 等价写法
if (target) { }              // 检查null/undefined
if (target != null) { }      // 只检查null
if (target !== null && target !== undefined) { }  // 严格检查

// 可选链
let pos = target?.position;  // target为null则pos为undefined

// 空值合并
let name = target?.name ?? "default";
```

---

*最后更新：2025-01-07*
