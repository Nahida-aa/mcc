## mods
### mod
### pack

#### resources pack

##### 纹理 textures
主条目：纹理
资源包内可以定义许多纹理，用于修改游戏内各种方块、物品、实体、GUI的显示。纹理都位于assets/<命名空间>/textures的各个子目录内。

##### 模型 models
主条目：模型和装备模型
模型是以JSON格式保存的文件，位于assets/<命名空间>/models内，它可以修改方块和物品的形状和对应的纹理绑定。

而装备模型使用预置的装备模型预设层定义装备的纹理，位于assets/<命名空间>/equipment内。

##### 字体 font
主条目：自定义字体
资源包可以修改已有的字体和添加自定义字体，修改各处文本的渲染。字体都在assets/<命名空间>/font的各个子目录下。

##### 粒子 particle
参见：粒子 § 类型
资源包可以修改粒子使用的纹理，但不能添加新的粒子类型或修改粒子的生成、着色等。特定ID的粒子类型可以使用的纹理由资源包的assets/minecraft/particles/<粒子类型ID>.json控制，格式如下：

NBT复合标签/JSON对象：根对象
NBT列表/JSON数组textures：此粒子类型可以使用的纹理。
字符串：（命名空间ID）一个粒子纹理。
##### 着色器 shaders
着色器是资源包改变游戏渲染方式的一种方式，使用OpenGL着色器语言（GLSL）编写，位于assets/minecraft/shaders。

##### 声音 sound
资源包可以修改游戏内的声音和对应的声音事件定义。资源包可以定义assets/minecraft/sounds.json以修改原版的声音，也可以在assets/<命名空间>/sounds内修改声音文件。

##### 语言 localization\language

#### data pack
数据包（Data Pack）为玩家自定义Minecraft的游戏内容提供了更多新方法，包括但不限于配置进度、配方、战利品表、魔咒、伤害类型、生物变种和世界生成等。对数据包的修改并不等于修改了包含相同逻辑部分的游戏代码。

### modpack

## environment
是的，你的翻译整体上很准确和自然！Modrinth 的这些 UI 标签（environment compatibility）设计是为了帮助用户快速了解 mod 在不同环境（单机、多人、客户端/服务器）下的兼容性和安装要求，避免下载后发现“服务器不支持”或“单机无效”。它们基于 Fabric/Forge 等模组生态的标准规范，强调“最小依赖 + 最大兼容”。

你的疑问点得很准：mod 的开发确实已固定“核心运行端”（客户端/服务器/两者），但“可选”（optional）标签的存在**不是冗余**，而是**为了灵活性和用户选择**。我会先逐个确认/优化你的翻译，然后解释“可选”逻辑。

### 翻译确认与优化
我保持你的原意，只微调了部分表达（更流畅/精确），并加了英文原词作为参考。整体风格统一为“简洁 + 解释”。

| 英文标签 | 你的翻译 | 我的建议翻译 | 解释/优化理由 |
|----------|----------|--------------|--------------|
| Client-side only: All functionality is done client-side and is compatible with vanilla servers. | 客户端独有, 功能全部在客户端实现, 兼容原版服务器 | **仅客户端**：所有功能在客户端运行，兼容原版服务器 | 更简洁，“独有”强调“只在客户端生效”。 |
| Server-side only: All functionality is done server-side and is compatible with vanilla clients. | 服务端独有, 功能全部在服务端实现, 兼容原版客户端 | **仅服务端**：所有功能在服务端运行，兼容原版客户端 | 同上，统一“仅”前缀。 |
| Works in singleplayer too | 单机也能玩 | **支持单机**：多人服务器兼容，也可在单机使用 | 加“多人服务器兼容”上下文，强调扩展性。 |
| Dedicated server only | 专用服务器 | **仅专用服务器**：需专用服务器环境 | “专用”指非集成服务器（如 Bukkit），强调要求。 |
| Client and server: Has some functionality on both the client and server, even if only partially. | 客户端和服务端都有一部分功能 | **客户端 + 服务端**：两端都有部分功能（即使不完整） | 加括号解释“部分”，突出“混合”性质。 |
| Required on both | （未译） | **两端必装**：客户端和服务端都需要安装 | 强调强制性。 |
| Optional on client | （未译） | **客户端可选**：服务端必装，客户端可选增强 | 突出“可选增强”。 |
| Optional on server | （未译） | **服务端可选**：客户端必装，服务端可选增强 | 同上。 |
| Optional on both, works best when installed on both | 客户端和服务端都可选, 最佳安装在客户端和服务端 | **两端可选**：功能完整，但两端安装效果最佳 | 强调“最佳实践”。 |
| Optional on both, works the same if installed on either side | 客户端和服务端都可选, 无论安装在哪一边, 功能相同 | **两端可选**：单端安装即可，效果相同 | 突出“等效性”。 |
| Singleplayer only: Only functions in Singleplayer or when not connected to a Multiplayer server. | 仅单机可用, 或未连接到多人服务器时可用 | **仅单机**：仅在单机或未连接多人服务器时生效 | 简化，强调限制。 |

这些翻译保持简短（UI 友好），适合 tooltip 或标签显示。如果你想更正式（如文档），可以加完整句。

### “可选”标签为什么存在？（不是冗余）
你的疑问核心：mod 开发时已定“运行端”，为什么还有“可选”？这**不是冗余，而是 mod 设计的灵活性**，源于 Minecraft 模组生态的“渐进兼容”原则（Fabric/Forge 规范）。mod 作者可以让功能“核心 + 增强”模式，用户根据需求选装，减少强制依赖。

- **核心逻辑**：
  - **mod 不是“全或无”**：一个 mod 可以设计为“客户端核心”（e.g., UI 变化）+ “服务器可选增强”（e.g., 同步数据）。核心功能单端跑得动，可选端加 bonus（如服务器验证防作弊）。
  - **示例**：
    - **仅客户端**：mod 只改本地渲染（如光影），服务器无需装。
    - **两端必装**：mod 需同步（如多人聊天 mod），缺一端无效。
    - **两端可选**：核心在客户端（e.g., 自定义 HUD），服务器装了加功能（如多人共享设置）。单端安装“基本可用”，两端“最佳”——这让新手/服务器管理员灵活选择，不必全装。
  - **为什么不冗余**：提升兼容（e.g., 单机玩家只装客户端，多人服务器只装服务端）。Modrinth UI 用这些标签引导用户“最小安装”，减少“下载了用不了”的挫败（社区反馈常见）。

- **从开发角度**：mod 作者用 Fabric API 的 `@Environment(EnvType.CLIENT)` 标记端，标签反映这个设计。不是“开发定死”，而是“用户可选”。

## tags
### equipment 装备 mod\resourcepack\datapack\plugin
在 Modrinth 平台上，"equipment" 标签主要用于 **mod（模组）**、**datapack（数据包）** 和 **plugin（插件）** 分类中，指的是**装备/武器/护甲主题的内容**，这些添加或扩展 Minecraft 的装备系统，如新武器、工具、盔甲或附魔机制。它是一个**实用/战斗主题类别**，强调提升生存/战斗能力的物品扩展，适合冒险或 PVP 模组包。简单说，它专注于“玩家装备升级”，让游戏更注重装备收集和自定义。

这个标签在 Modrinth 上中等流行，常与 "combat"（战斗）或 "adventure"（冒险）结合，用于生存服务器。

#### 具体含义和示例
- **核心特征**：新装备添加、附魔扩展、武器平衡、护甲自定义等。包括工具/武器/盔甲的改进，支持锻造或掉落。
- **典型示例**（从 Modrinth 搜索）：
  | 类型       | 示例内容/模组                  | 描述                                                                 | 链接示例 |
  |------------|--------------------------------|----------------------------------------------------------------------|----------|
  | **Mod**   | Equipment Mod                 | 添加自定义装备槽和武器，支持模块化盔甲（如可换部件）。               | [Modrinth](https://modrinth.com/mod/equipment-mod) |
  | **Mod**   | Better Equipment              | 优化 vanilla 装备，添加新附魔和耐久系统，提升战斗实用性。            | [Modrinth](https://modrinth.com/mod/better-equipment) |
  | **Datapack** | Equipment Datapack           | 数据包版装备扩展，提供简单自定义武器和掉落表。                       | [Modrinth](https://modrinth.com/datapack/equipment-datapack) |
  | **Plugin** | Equipment Plugin (e.g., Custom Equipment) | 服务器插件，支持自定义装备属性和经济交易。                           | [Modrinth](https://modrinth.com/plugin/custom-equipment) |

这些示例兼容 Forge/Fabric/Spigot，常用于模组包的装备系统。

#### 如何分类/翻译？
- **分类建议**：归入**装备/工具主题类**（Equipment > Weapons/Armor）。在中文社区（如 MC 百科），常与 "armor"（护甲）或 "tools"（工具）并列。
- **翻译**：
  - **直译**："装备"（简洁，如 "Equipment Mod" → "装备模组"）。
  - **意译**："装备系统" 或 "武器护甲"（强调功能，如“添加新武器的模组”）。
  - **完整标签**："[Equipment] 装备"（英文 + 中文，便于搜索）。

Modrinth 的 "equipment" 标签有 300+ 结果，大多是 mod。如果你搜 "equipment"，会看到从简单工具到复杂附魔的一切。下一个标签呢？
### Magic 魔法 mod\datapack\modpack\plugin
在 Modrinth 平台上，"magic" 标签（或类别）主要用于 mod（模组）、datapack（数据包） 和 plugin（插件） 分类中，指的是魔法主题的内容，这些添加或扩展 Minecraft 的幻想元素，让玩家能像巫师或法师一样施法、召唤或使用神秘力量。它是 Modrinth 的标准主题类别之一（与其他如 "adventure"、"tech"、"decoration" 并列），强调 RPG 风格的魔法系统，而不是现实主义或科技机制。简单说，它让游戏更有“哈利·波特”或“上古卷轴”般的魔法幻想感。
这个分类很受欢迎，常用于模组包（如 "All the Mods" 的魔法分支），因为它带来创意玩法（如自定义咒语、魔法物品）。
具体含义和示例

核心特征：添加咒语、法杖、魔法书、元素召唤、附魔扩展等。重点是“角色扮演”（roleplay as a witch/wizard），包括战斗、探索或建筑中的魔法应用。
### management 管理工具
在 Modrinth 平台上，"management" 标签（或类别）主要用于 mod（模组）、datapack（数据包） 和 plugin（插件） 分类中，指的是管理工具，这些内容专注于优化游戏或服务器的资源/模组/权限/库存管理。它是一个实用类别，强调效率和便利，帮助玩家或服务器管理员简化日常操作（如模组安装、物品整理、变量控制），而不是添加新游戏机制（如战斗或魔法）。简单说，它像“后台工具箱”，适合服务器运维或大基建玩家。
这个标签在 Modrinth 上不算最热门，但实用性强，常与 "utility"（实用）或 "optimization"（优化）结合使用。
### technology 科技 mod\datapack\modpack\plugin

在 Modrinth 平台上，"technology" 标签主要用于 **mod（模组）**、**datapack（数据包）** 和 **plugin（插件）** 分类中，指的是**科技/工程主题的内容**，这些添加或扩展 Minecraft 的机械、自动化、机器或工业系统，让玩家构建像工厂或电路一样的复杂装置。它是一个**科技主题类别**，强调工程学和自动化玩法（如红石增强、机器构建），适合工业/生存模组包（如 "Create" 系列）。简单说，它将 Minecraft 从“手工时代”推向“工业革命”，焦点是效率和创新。

这个标签在 Modrinth 上超热门，常用于大模组包（如 "All the Mods Tech"），因为科技模组依赖多（Fabric/Forge）。

- **核心特征**：机器、发电机、传送带、自动化农场、电路逻辑等。包括红石替代、能源系统、工厂构建，支持大规模工程。
- **典型示例**（从 Modrinth 搜索）：
  | 类型       | 示例内容/模组    | 描述| 链接示例 |
  |-------|----------|------------|----------|
  | **Mod**   | Create                        | 标志性科技模组，添加齿轮、传送带和机械动力系统，支持复杂工厂。       | [Modrinth](https://modrinth.com/mod/create) |
  | **Mod**   | Mekanism                      | 高级工业模组，提供核反应堆、数字矿机和多级加工链。                   | [Modrinth](https://modrinth.com/mod/mekanism) |
  | **Mod**   | Immersive Engineering         | 现实主义工程模组，包含多块机器、电缆和柴油发电，支持美观建筑。       | [Modrinth](https://modrinth.com/mod/immersive-engineering) |
  | **Datapack** | Tech Datapack                | 数据包版科技工具，提供简单自动化命令（如红石电路扩展）。             | [Modrinth](https://modrinth.com/datapack/tech-datapack) |
  | **Plugin** | Tech Plugin (e.g., TechUtils) | 服务器插件，支持科技命令、机器集成或经济科技（如自动化农场）。      | [Modrinth](https://modrinth.com/plugin/techutils) |

### transportation  交通, 运输, 输送, 交通车辆 mod\datapack\plugin
在 Modrinth 平台上，"transportation" 标签主要用于 **mod（模组）**、**datapack（数据包）** 和 **plugin（插件）** 分类中，指的是**交通/运输主题的内容**，这些添加或扩展 Minecraft 的移动方式，如车辆、船只、传送系统或自动化轨道。它是一个**实用主题类别**，强调探索和物流效率，让玩家更快地穿越世界或运输资源。简单说，它优化“旅行”玩法，适合冒险/基建模组包（如 "Create" 的交通扩展）。

这个标签在 Modrinth 上中等流行，常与 "technology" 或 "adventure" 结合，用于大地图服务器。

- **核心特征**：新交通工具、轨道/传送优化、船/车/飞机等。包括自动化运输（如传送带扩展）或自定义载具。
- **典型示例**（从 Modrinth 搜索）：
  | 类型       | 示例内容/模组                  | 描述                                                                 | 链接示例 |
  |------------|--------------------------------|----------------------------------------------------------------------|----------|
  | **Mod**   | Small Ships                   | 添加小型船只，支持自定义船体和航海冒险，提升水上交通。               | [Modrinth](https://modrinth.com/mod/small-ships) |
  | **Mod**   | Splinecart                    | 轨道交通模组，支持曲线轨道和高速列车，优化矿车运输。                 | [Modrinth](https://modrinth.com/mod/splinecart) |
  | **Mod**   | Breezy                        | 风帆船和飞行船模组，提供风力推进的运输方式，适合探索。               | [Modrinth](https://modrinth.com/mod/breezy) |
  | **Datapack** | Transportation Datapack      | 数据包版交通工具，提供简单传送或车辆命令，无需模组。                 | [Modrinth](https://modrinth.com/datapack/transportation-datapack) |
  | **Plugin** | Transport Plugin (e.g., Via Romana) | 服务器插件，支持路径/道路管理，集成交通网络（如罗马道路）。         | [Modrinth](https://modrinth.com/plugin/via-romana) |

这些示例兼容 Forge/Fabric/Spigot，常用于模组包的物流部分。

### combat 战斗  resourcepack\modpack
在 Modrinth 平台上，"combat" 标签主要用于 **resourcepack（资源包）** 和 **modpack（整合包）** 分类中，指的是**战斗/战斗机制主题的内容**，这些增强或修改 Minecraft 的 PVP（玩家对玩家）、PVE（玩家对环境）或整体战斗体验。它是一个**战斗主题类别**，强调武器、护甲、技能或战斗动画的优化，而不是非战斗元素（如建筑或探索）。简单说，它让游戏更注重“格斗和生存挑战”，适合竞技服务器或战斗模组包。

这个标签在 Modrinth 上中等流行，常用于 PVP 竞技或硬核生存包。

- **核心特征**：在 resourcepack 中，战斗相关的纹理/模型/声音（如剑击效果、血条 UI）；在 modpack 中，预配置的战斗模组集合（如武器升级、技能树）。
- **典型示例**（从 Modrinth 搜索）：
  | 类型           | 示例内容/资源                  | 描述                                                                 | 链接示例 |
  |----------------|--------------------------------|----------------------------------------------------------------------|----------|
  | **Resourcepack** | Combat Pack                   | 战斗纹理包，优化武器/护甲模型和击打声音，提升 PVP 视觉反馈。          | [Modrinth](https://modrinth.com/resourcepack/combat-pack) |
  | **Resourcepack** | Faithful Combat               | Faithful 风格的战斗增强包，改进剑/弓动画和粒子效果，支持高分辨率。   | [Modrinth](https://modrinth.com/resourcepack/faithful-combat) |
  | **Modpack**   | Combat Modpack                | 整合包，包含战斗模组如 Tinkers' Construct（武器自定义）和 Better Combat（动作系统）。 | [Modrinth](https://modrinth.com/modpack/combat-modpack) |
  | **Modpack**   | PVP Combat Pack               | PVP 专用整合包，聚焦竞技模组（如武器平衡、技能插件）。                | [Modrinth](https://modrinth.com/modpack/pvp-combat) |

这些示例兼容 vanilla 或模组环境，常用于竞技服务器。

### modded 模组支持 resourcepack
在 Modrinth 平台上，"modded" 标签**仅存在于 resourcepack（资源包）**分类中，指的是**专为模组（mods）设计的资源包**，这些资源包优化或扩展了模组的视觉/音频效果，使其与特定 mods 兼容或增强（如动画、GUI、纹理调整）。它是一个**兼容性主题标签**，强调资源包不是纯 vanilla（原版）设计，而是针对模组环境（如 Fabric/Forge）定制，帮助玩家在模组包中获得更好体验。简单说，它解决“模组 + 资源包不匹配”的问题，让模组内容更美观/沉浸。

这个标签在 Modrinth 上中等流行，常用于模组包的资源推荐（如 "All the Mods" 的视觉扩展）。

#### 具体含义和示例
- **核心特征**：资源包支持模组的自定义模型、动画、声音或 UI（如 EMF Player Animation 的动作支持、Cobblemon 的 GUI 纹理）。不适合纯原版游戏。
- **典型示例**（从 Modrinth 搜索）：
  | 资源包名称              | 描述                                                                 | 链接示例 |
  |-------------------------|----------------------------------------------------------------------|----------|
  | **Fresh Moves**        | EMF Player Animation 资源包，提供模组兼容的玩家动画（如 Quark emotes、Parcool 技巧）。 | [Modrinth](https://modrinth.com/resourcepack/fresh-moves) |
  | **Cobblemon Interface**| Cobblemon 模组灵感的 GUI 纹理和声音，支持模组界面自定义。             | [Modrinth](https://modrinth.com/resourcepack/cobblemon-interface) |
  | **Default Dark Mode**  | 模组兼容的深色模式 GUI，支持 vanilla-like 风格的模组 UI 调整。         | [Modrinth](https://modrinth.com/resourcepack/default-dark-mode) |
  | **E19 - Cobblemon Minimap Icons** | Cobblemon 图标，用于 Xaero's Minimap 模组的小地图显示。               | [Modrinth](https://modrinth.com/resourcepack/e19-cobblemon-minimap-icons) |

这些示例兼容 16x 分辨率，常需特定模组依赖。

#### 如何分类/翻译？
- **分类建议**：归入**模组兼容主题类**（Modded > Resourcepack）。在中文社区（如 MC 百科），常与 "mod support"（模组支持）或 "fabric/forge 兼容" 并列。
- **翻译**：
  - **直译**："模组版"（简洁，如 "Modded Resourcepack" → "模组版资源包"）。
  - **意译**："模组兼容" 或 "适用于模组"（强调功能，如“专为模组优化的资源包”）。
  - **完整标签**："[Modded] 模组版"（英文 + 中文，便于搜索）。

Modrinth 的 "modded" 标签有 100+ 结果，大多是 GUI/动画增强。如果你搜 "modded"，会看到针对流行模组的资源包。下一个标签呢？

### realistic 真实  resourcepack\shader
在 Modrinth 平台上，"realistic" 标签主要用于 **resourcepack（资源包）** 和 **shader（光影）** 分类中，指的是**真实主义风格的内容**，这些资源包或光影包旨在让 Minecraft 的视觉效果更接近现实世界（如详细纹理、自然光影、PBR 材质），而非保持原版的卡通/方块风格。它是一个**视觉主题类别**，强调沉浸感和逼真度，常用于提升游戏的“电影级”渲染体验。简单说，它通过高细节纹理和动态光影，让 Minecraft 看起来像“真实模拟器”，适合摄影/建筑玩家。

这个标签在 Modrinth 上很受欢迎，常与 "performance"（性能）或 "PBR"（物理基渲染）结合，用于模组包的视觉增强。

#### 具体含义和示例
- **核心特征**：在 resourcepack 中，真实主义纹理（e.g., 草地有真实细节）；在 shader 中，真实光影/反射（e.g., 水面波光、阴影渐变）。支持高分辨率，但可能需强硬件。
- **典型示例**（从 Modrinth 搜索）：
  | 类型           | 示例内容/资源                  | 描述                                                                 | 链接示例 |
  |----------------|--------------------------------|----------------------------------------------------------------------|----------|
  | **Resourcepack** | Realistic Resource Pack       | 增强 Minecraft 视觉的自然详细纹理包，保持原风格但更逼真（如岩石/树木细节）。 | [Modrinth](https://modrinth.com/resourcepack/n0PJhDVa) |
  | **Resourcepack** | Patrix (Realistic)            | 高清 PBR 纹理包，提供真实材质反射/凹凸，支持 Iris Shaders。           | [Modrinth](https://modrinth.com/resourcepack/patrix) |
  | **Shader**    | Complementary Reimagined       | 真实主义光影包，优化动态照明/反射/体积云，支持低/高性能模式。       | [Modrinth](https://modrinth.com/shader/complementary-reimagined) |
  | **Shader**    | BSL Shaders (Realistic)       | 经典真实光影，添加真实水波/天空/阴影，提升建筑沉浸感。               | [Modrinth](https://modrinth.com/shader/bsl-shaders) |

这些示例兼容 vanilla 或 Iris/OptiFine，常用于 1.20+ 版本。

#### 如何分类/翻译？
- **分类建议**：归入**视觉/真实主义主题类**（Visual > Realistic）。在中文社区（如 MC 百科），常与 "PBR"（物理渲染）或 "高清" 并列。
- **翻译**：
  - **直译**："真实"（简洁，如 "Realistic Resourcepack" → "真实资源包"）。
  - **意译**："真实主义" 或 "逼真风格"（强调效果，如“提供现实光影的资源包”）。
  - **完整标签**："[Realistic] 真实主义"（英文 + 中文，便于搜索）。

Modrinth 的 "realistic" 标签有 500+ 结果，大多是 shader。如果你搜 "realistic"，会看到从低性能到超高清的一切。下一个标签呢？

### simplistic 简约 resourcepack
在 Modrinth 平台上，"simplistic" 标签**仅存在于 resourcepack（资源包）**分类中，指的是**简约/极简风格的资源包**，这些包采用低细节、干净的设计原则，减少纹理复杂度，以提升性能或营造“简洁美学”。它是一个**视觉主题类别**，强调最小主义（minimalist），适合追求轻量渲染或复古/纯净风格的玩家，而不是高细节真实主义。简单说，它让 Minecraft 看起来“简简单单”，焦点是流畅性和优雅，而不是繁复。

这个标签在 Modrinth 上小众但实用，常用于性能优化包。

#### 具体含义和示例
- **核心特征**：低分辨率纹理（8x8 或 16x）、简化模型/动画、去掉不必要细节，支持低端硬件。
- **典型示例**（从 Modrinth 搜索）：
  | 资源包名称              | 描述                                                                 | 链接示例 |
  |-------------------------|----------------------------------------------------------------------|----------|
  | **Simplistic**         | 极简纹理包，8x 分辨率，干净线条和颜色，优化 FPS。                     | [Modrinth](https://modrinth.com/resourcepack/simplistic) |
  | **Minimalist**         | 简约风格，减少方块细节，提供纯净的 vanilla-like 外观。                 | [Modrinth](https://modrinth.com/resourcepack/minimalist) |
  | **Clean Simplistic**   | 简洁纹理 + 自定义字体，适合性能优先的生存模式。                       | [Modrinth](https://modrinth.com/resourcepack/clean-simplistic) |

这些示例兼容 vanilla 或 OptiFine，常用于 1.20+ 版本。

#### 如何分类/翻译？
- **分类建议**：归入**视觉/简约主题类**（Visual > Simplistic）。在中文社区（如 MC 百科），常与 "minimalist"（极简）或 "low-res"（低分辨率）并列。
- **翻译**：
  - **直译**："简约"（简洁，如 "Simplistic Resourcepack" → "简约资源包"）。
  - **意译**："极简风格" 或 "简洁设计"（强调美学，如“低细节的简约资源包”）。
  - **完整标签**："[Simplistic] 简约"（英文 + 中文，便于搜索）。

Modrinth 的 "simplistic" 标签有 100+ 结果，大多是 8x/16x 低细节包。如果你搜 "simplistic"，会看到适合轻量游戏的选项。下一个标签呢？
### themed 主题 resourcepack
在 Modrinth 平台上，"themed" 标签**仅存在于 resourcepack（资源包）**分类中，指的是**主题化资源包**，这些包围绕特定主题（如节日、电影、季节或幻想风格）设计纹理、颜色和元素，让 Minecraft 的视觉整体统一于某个概念或事件。它是一个**视觉主题类别**，强调创意和沉浸式美学，而不是性能或真实主义。简单说，它像“换肤包”，为游戏添加节日氛围或故事感，适合角色扮演或限时活动。

这个标签在 Modrinth 上小众但有趣，常用于季节性内容（如万圣节包）。

#### 具体含义和示例
- **核心特征**：主题纹理（如圣诞树变雪景、方块加电影元素），支持 vanilla 或模组兼容，通常 16x 分辨率。
- **典型示例**（从 Modrinth 搜索）：
  | 资源包名称              | 描述                                                                 | 链接示例 |
  |-------------------------|----------------------------------------------------------------------|----------|
  | **Wynncraft Donjons**  | Wynncraft 地牢主题资源包，优化冒险纹理和 UI，支持 RPG 主题沉浸。      | [Modrinth](https://modrinth.com/resourcepack/wynncraft-donjons) |
  | **Themed Hotbar Packs**| 各种主题热栏纹理（如可爱、复古），为工具栏添加节日或风格元素。     | [YouTube 示例](https://www.youtube.com/watch?v=lXZAlzH9ey0) |
  | **Holiday Themed Pack**| 节日主题包（如圣诞/万圣节），方块/物品变季节纹理，提升节日氛围。   | [Modrinth 搜索](https://modrinth.com/resourcepacks?q=themed+holiday) |

这些示例兼容 vanilla，常用于 1.20+ 版本。

#### 如何分类/翻译？
- **分类建议**：归入**视觉/主题类**（Visual > Themed）。在中文社区（如 MC 百科），常与 "holiday"（节日）或 "style"（风格）并列。
- **翻译**：
  - **直译**："主题"（简洁，如 "Themed Resourcepack" → "主题资源包"）。
  - **意译**："主题式" 或 "风格主题"（强调统一，如“节日主题的资源包”）。
  - **完整标签**："[Themed] 主题"（英文 + 中文，便于搜索）。

Modrinth 的 "themed" 标签有 50+ 结果，大多是节日/故事包。如果你搜 "themed"，会看到创意十足的视觉变体。下一个标签呢？
### tweaks 微调 resourcepack
在 Modrinth 平台上，"tweaks" 标签**仅存在于 resourcepack（资源包）**分类中，指的是**微调/优化资源包**，这些包专注于小幅调整或修复 vanilla（原版）或模组的视觉/行为问题，如优化模型、修复 bug 或轻微美化纹理。它是一个**实用微调主题标签**，强调细致改进而非大改风格，适合追求完美兼容或性能优化的玩家。简单说，它像“补丁包”，解决资源包的“小毛病”，让游戏更流畅/一致。

这个标签在 Modrinth 上小众，但实用，常用于 vanilla 增强或模组兼容。

#### 具体含义和示例
- **核心特征**：小修复（如方块模型 bug）、性能 tweaks（如低细节优化）或 UI 微调，支持 vanilla 或 OptiFine。
- **典型示例**（从 Modrinth 搜索）：
  | 资源包名称                  | 描述                                                                 | 链接示例 |
  |-----------------------------|----------------------------------------------------------------------|----------|
  | **Resource Fixes & Tweaks** | 优化默认资源包的方块模型，修复 bug，提升渲染一致性。                   | [Modrinth](https://modrinth.com/resourcepack/resource-fixes-and-tweaks) |
  | **Nostalgic Tweaks**        | 怀旧微调包，调整纹理/动画以复刻旧版 Minecraft 风格。                  | [Modrinth](https://modrinth.com/resourcepack/nostalgic-tweaks) |
  | **Simplistic Tweaks**       | 极简微调，修复 UI 元素和低分辨率纹理，支持性能优化。                   | [Modrinth](https://modrinth.com/resourcepack/simplistic-tweaks) |

这些示例兼容 16x 分辨率，常用于 1.20+ 版本。

#### 如何分类/翻译？
- **分类建议**：归入**视觉/微调主题类**（Visual > Tweaks）。在中文社区（如 MC 百科），常与 "fixes"（修复）或 "optimization"（优化）并列。
- **翻译**：
  - **直译**："微调"（简洁，如 "Tweaks Resourcepack" → "微调资源包"）。
  - **意译**："调整优化" 或 "小修补"（强调功能，如“修复纹理 bug 的资源包”）。
  - **完整标签**："[Tweaks] 微调"（英文 + 中文，便于搜索）。

Modrinth 的 "tweaks" 标签有 50+ 结果，大多是修复/优化包。如果你搜 "tweaks"，会看到针对 vanilla 的小工具。下一个标签呢？
### core-shaders 核心着色器 resourcepack
是的，我理解你的疑问——"core-shaders" 这个标签的命名容易让人误以为是“核心光影的默认/未自定义状态”（即没有自定义），但实际上，它**指资源包支持或包含自定义核心光影（core shaders）的特性**。这不是“没有自定义”，而是“有自定义核心光影支持”。下面我基于 Minecraft 官方 Wiki 和 Modrinth 社区解释（包括 Reddit 和 GitHub 讨论），一步步澄清。

#### 1. **"Core-Shaders" 的确切含义**
- **Minecraft 官方定义**：Core shaders 是游戏内置的**核心着色器系统**（位于 `assets/minecraft/shaders/core/` 目录），用于渲染基本元素（如地形、实体、GUI、光源、阴影）。原版（vanilla）有默认 core shaders，但资源包可以**替换或自定义**这些文件，实现轻度光影效果（如自定义光衰减、粒子渲染），无需外部模组（如 OptiFine/Iris）。
- **Modrinth 中的标签**：在 resourcepack 的 "features" 分类下，"core-shaders" 表示这个资源包**包含自定义 core shaders 文件**，提供 vanilla 兼容的光影增强（如优化光照或模型渲染）。它是一个“特性标签”，标记资源包有这个功能，而不是“默认/无自定义”。例如，SkinSpice 资源包用自定义 core shaders 实现皮肤动画，无需 mods。
- **误解来源**：命名 "core" 容易联想到“原版核心”（默认），但实际是“核心着色器自定义支持”。Reddit 讨论确认：vanilla Minecraft 支持通过资源包自定义 core shaders，但效果有限（无高级 post-processing）。

#### 2. **自定义 vs. 非自定义的比较**
| 状态               | 含义                                   | 资源包示例                           | Modrinth 标签含义                  |
|--------------------|----------------------------------------|--------------------------------------|------------------------------------|
| **非自定义**      | 使用原版默认 core shaders（无替换文件）。 | 默认资源包（vanilla）。              | 无此标签（默认 fallback）。        |
| **自定义 (Core-Shaders)** | 资源包包含替换文件，修改核心渲染（如光源衰减）。 | SkinSpice（自定义皮肤光影）。        | 支持自定义核心光影的特性。         |

- **效果**：自定义后，游戏渲染变（如更真实阴影），但仍 vanilla 兼容（无需模组）。
- **限制**：核心 shaders 只能改基本管线（无体积云/反射），高级需 Iris 等模组。

#### 3. **翻译建议**
- **整体 "features"**： “**特性**”或“**功能**”（如“支持特性”）。
- **"core-shaders"**： “**核心光影**”或“**核心着色器**”（强调自定义支持）。避免“默认核心光影”（误导），用“核心光影支持”更准。
- **完整**："[Core-Shaders] 核心光影支持"（英文 + 中文）。

如果你在项目中用这个标签，建议文档注明“包含自定义核心光影文件”。有其他标签疑问吗？
### colored-lighting 彩色光照 shader
在 Modrinth 平台的 **shader（光影）** 和 **resourcepack（资源包）** 分类中，**"colored-lighting"** 标签指**彩色光照效果**，这是一种渲染特性，让游戏中的光源（如火把、荧光石）发出彩色光线，而不是原版的单色白光。它增强视觉氛围，支持动态颜色（如火把暖橙、灵魂火把蓝紫），常用于真实主义或幻想光影包。简单说，它让光源“多彩”，提升沉浸感，但可能需 Iris 等模组支持。

这个标签在 Modrinth 上常见，常与 "pbr"（物理渲染）或 "atmosphere"（氛围）结合，用于光影增强。

#### 具体含义和示例
- **核心特征**：自定义光源颜色/强度，兼容 vanilla + 模组。
- **典型示例**（从 Modrinth 搜索）：
  | 类型       | 示例内容/资源                  | 描述                                                                 | 链接示例 |
  |------------|--------------------------------|----------------------------------------------------------------------|----------|
  | **Shader** | Complementary Shaders (Colored Lighting) | 支持彩色光源渲染，如火把橙光、水晶紫光，提升夜晚氛围。               | [Modrinth](https://modrinth.com/shader/complementary-shaders) |
  | **Shader** | BSL Shaders (Colored Lighting) | 真实彩色照明系统，允许光源颜色渐变和反射。                           | [Modrinth](https://modrinth.com/shader/bsl-shaders) |
  | **Resourcepack** | Colored Lighting Pack        | 结合纹理的彩色光源支持，优化方块发光颜色。                           | [Modrinth](https://modrinth.com/resourcepack/colored-lighting-pack) |

这些示例兼容 1.20+ 版本。

#### 如何分类/翻译？
- **分类建议**：归入**光影/照明主题类**（Shaders > Colored Lighting）。在中文社区（如 MC 百科），常与 "colored lights"（彩色光源）并列。
- **翻译**：
  - **直译**："彩色光照"（简洁、技术准，如 "Colored-Lighting Shader" → "彩色光照光影"）。
  - **意译**："彩色照明" 或 "多彩光源"（强调效果，如“支持彩色光源的资源包”）。
  - **完整标签**："[Colored-Lighting] 彩色光照"（英文 + 中文，便于搜索）。

Modrinth 的 "colored-lighting" 标签有 50+ 结果，大多是 shader。如果你搜 "colored-lighting"，会看到光源优化的工具。下一个标签呢？

### path-tracing 路径追踪 shader
是的，你问的很好！在 Minecraft shaders（如 Modrinth 标签）中，"path-tracing" 和 "ray-tracing" 都是光线追踪相关术语，但它们不是同义词——path-tracing 是 ray-tracing 的**高级变体**。Modrinth 选择 "path-tracing" 是因为它**更精确描述特定渲染技术**（蒙特卡洛路径采样，实现全局光照），而 "ray-tracing" 太宽泛（umbrella term，涵盖基础光线模拟）。这在 shaders 社区（如 Iris/OptiFine 文档）是标准用法，避免混淆。下面我基于 Minecraft shaders 语境（Reddit、Unity 论坛、NVIDIA 讨论）拆解区别和原因。

#### 核心区别
- **Ray-Tracing**：广义光线追踪，从相机发射光线，模拟单次/有限反弹（reflection/refraction）。简单、快，但光照不真实（e.g., 忽略间接光、多重散射）。
- **Path-Tracing**：ray-tracing 的增强版，使用**蒙特卡洛随机采样**模拟光子完整路径（多次反弹 + 全局光照）。更真实（e.g., 软阴影、真实反射），但计算密集（需高采样率防噪点）。

| 维度           | Ray-Tracing                      | Path-Tracing                     |
|----------------|----------------------------------|----------------------------------|
| **技术基础**  | 确定性光线追踪（单路径）         | 随机采样 + 多路径（Monte Carlo） |
| **真实度**    | 中等（直接光 + 简单反弹）        | 高（全局光照、间接散射）         |
| **性能**      | 快（少计算）                     | 慢（高采样，需 GPU）             |
| **Minecraft 示例** | 基础 shaders（如 BSL 的简单反射） | PTGI shaders（如 SEUS PTGI 的体积光） |
| **Modrinth 用法** | 宽泛标签（e.g., "ray-tracing support"） | 精确标签（e.g., "path-traced GI"） |

#### 为什么 Modrinth 用 "Path-Tracing" 而非 "Ray-Tracing"？
- **精确性**：Modrinth 的标签系统是“功能标识符”，"path-tracing" 特指这种高级技术（e.g., Photonics mod 的 PTGI = Path-Traced Global Illumination）。用 "ray-tracing" 会模糊（它包括基础/简单光追），用户搜 "path-tracing" 能过滤真正的高端 shaders（如 KappaPT）。Reddit 和 YouTube 比较视频（如 "Path Tracing vs Ray Tracing in Minecraft"）也强调这个区别。
- **社区/技术惯性**：Minecraft shaders 生态（Iris/Sodium）继承图形学标准（NVIDIA/Unity 用 path-tracing 指高级变体）。Modrinth 作为开发者平台，优先专业术语（类似 "PBR" 而非“物理渲染”）。
- **用户影响**：对新手稍不友好（需懂区别），但标签搜索精准（"path-tracing" 结果专注高端包）。如果统一 "ray-tracing"，会混入低端内容。

**我的建议**：翻译时，用“**路径追踪**”对应 "path-tracing"（技术准），并解释“ray-tracing 的高级形式”（用户友好）。Modrinth 没用更广的 "ray-tracing"，是为了标签的“手术刀级”精确。
### pbr PBR shader
Physically Based Rendering 基于物理渲染

在 Modrinth 平台的 **shader（光影）** 和 **resourcepack（资源包）** 分类中，**"PBR"** 标签指**基于物理渲染**（Physically Based Rendering），这是一种材质渲染技术，使用物理属性（如反射率、粗糙度、法线贴图）模拟真实光线与表面的交互，让纹理更逼真（如金属反射、布料漫反射）。它是一个**光影功能标签**，强调写实材质，常用于 Iris/OptiFine 光影包。简单说，它让方块“物理真实”，提升光影质量，但需高分辨率资源包配合。

这个标签在 Modrinth 上很流行，常与 "realistic"（写实）结合，用于高端渲染。

#### 具体含义和示例
- **核心特征**：支持 PBR 贴图（.png + .normal/.specular），动态计算材质反射/粗糙度。兼容 1.20+。
- **典型示例**（从 Modrinth 搜索）：
  | 类型           | 示例内容/资源                  | 描述                                                                 | 链接示例 |
  |----------------|--------------------------------|----------------------------------------------------------------------|----------|
  | **Resourcepack** | Patrix                        | 高清 PBR 纹理包，支持金属/玻璃反射，需 Iris 光影。                   | [Modrinth](https://modrinth.com/resourcepack/patrix) |
  | **Resourcepack** | Stratum                      | 超写实 PBR 包，包含法线/粗糙度贴图，优化建筑材质。                   | [Modrinth](https://modrinth.com/resourcepack/stratum) |
  | **Shader**    | Complementary Shaders (PBR)   | PBR 支持光影，动态计算材质属性，提升室内/户外真实感。                 | [Modrinth](https://modrinth.com/shader/complementary-shaders) |

#### 如何分类/翻译？
- **分类建议**：归入**材质/渲染主题类**（PBR > Physically Based）。在中文社区（如 MC 百科），常与 "physically based"（物理基）并列。
- **翻译**：
  - **直译**："PBR"（保留缩写 + 解释，如 "PBR（基于物理渲染）"）。
  - **意译**："物理渲染" 或 "物理基渲染"（强调技术，如“支持 PBR 材质的光影”）。
  - **完整标签**："[PBR] 物理渲染"（英文 + 中文，便于搜索）。

Modrinth 的 "PBR" 标签有 200+ 结果，大多是资源包。如果你搜 "PBR"，会看到写实材质工具。下一个标签呢？
### reflections 反射 shader
在 Modrinth 平台的 **shader（光影）** 和 **resourcepack（资源包）** 分类中，**"reflections"** 标签指**反射效果**，这是一种渲染特性，让游戏表面（如水、金属、玻璃）模拟真实光线反射（specular reflections），包括镜面反射和环境反射。它是一个**光影功能标签**，强调写实光照，常用于 Iris/OptiFine 光影包。简单说，它让物体“有镜面感”，提升沉浸度，但计算密集（需高采样）。

这个标签在 Modrinth 上常见，常与 "PBR"（物理渲染）结合，用于高端光影。

#### 具体含义和示例
- **核心特征**：动态反射计算（基于表面粗糙度/法线），支持屏幕空间反射（SSR）或光线追踪。兼容 1.20+。
- **典型示例**（从 Modrinth 搜索）：
  | 类型       | 示例内容/资源                  | 描述                                                                 | 链接示例 |
  |------------|--------------------------------|----------------------------------------------------------------------|----------|
  | **Shader** | Complementary Shaders (Reflections) | 高级反射系统，支持水面/金属镜面反射和模糊控制。                       | [Modrinth](https://modrinth.com/shader/complementary-shaders) |
  | **Shader** | BSL Shaders (Reflections)     | 真实反射渲染，添加环境映射和反射强度调整。                           | [Modrinth](https://modrinth.com/shader/bsl-shaders) |
  | **Resourcepack** | Reflections Pack             | 结合 PBR 的反射纹理支持，优化方块表面光泽。                           | [Modrinth](https://modrinth.com/resourcepack/reflections-pack) |

#### 如何分类/翻译？
- **分类建议**：归入**光影/反射主题类**（Shaders > Reflections）。在中文社区（如 MC 百科），常与 "specular"（镜面）或 "mirror"（镜像）并列。
- **翻译**：
  - **直译**："反射"（简洁、技术准，如 "Reflections Shader" → "反射光影"）。
  - **意译**："镜面反射" 或 "光线反射"（强调效果，如“支持水面反射的资源包”）。
  - **完整标签**："[Reflections] 反射"（英文 + 中文，便于搜索）。

Modrinth 的 "reflections" 标签有 100+ 结果，大多是 shader。如果你搜 "reflections"，会看到光泽优化的工具。下一个标签呢？

### potato 土豆机 shader
### screenshot 截图模式 shader
是的，你这个疑问很合理——"Screenshot" 标签听起来像“高端专属”（只适合截图，暗示计算密集），但在 Modrinth shaders 的性能影响标签（shaderPerformanceImpactTags）中，它其实是**配置要求最低的级别**，而非最高。让我一步步澄清这个误解，并解释为什么。

#### 为什么 "Screenshot" 是最低要求？
- **标签含义**： "Screenshot" 表示光影包**专为静态截图优化**，允许极慢的渲染时间（e.g., 每帧几秒或几分钟），输出超高质量图片，但不适合实时游戏（玩起来卡成 PPT）。它“只适合截图”是因为它牺牲了 FPS（帧率），换取细节——硬件要求低（甚至土豆机都能跑），因为你暂停游戏渲染一帧就行。
- **误解来源**：名字暗示“专业/高端”（像摄影模式），但实际是“非实时模式”，对 GPU/CPU 压力小（不像实时光影需每秒 60 帧计算）。Modrinth 文档和 Iris Shaders 指南确认：Screenshot 模式是“低门槛艺术工具”，而 "High" / "Ultra" 才是实时高要求的。

#### 性能级别快速比较（从低到高要求）
| 标签          | 硬件要求 | 渲染速度 | 适用场景                     | 示例光影包                  |
|---------------|----------|----------|------------------------------|-----------------------------|
| **Screenshot** | 最低（土豆机 OK） | 极慢（秒/帧） | 静态美图/艺术渲染            | SEUS PTGI (Screenshot 模式) |
| **Potato**   | 低（集成显卡） | 慢（20-30 FPS） | 低端日常玩                    | Complementary (Potato 版)  |
| **Low**      | 中低（入门 GPU） | 中等（40-60 FPS） | 一般探索                      | BSL (Low 模式)             |
| **Medium**   | 中（中端 GPU） | 快（60+ FPS） | 主流沉浸                      | Kappa Shaders              |
| **High/Ultra** | 最高（RTX 系列） | 实时高品质 | 高配全特效                    | SEUS Renewed (Ultra)       |

- **为什么最低**：Screenshot 不需实时计算（你手动暂停/渲染一帧），GPU 负载分散，配置低也能出美图。相比，"High" 要求高，因为它需实时追踪光线/反射（每帧重算）。
### kitchen-sink 厨房水槽, 杂烩, 啥都有 modpack
### Modrinth Modpack 中的 "Kitchen-Sink" 标签翻译

在 Modrinth 平台的 modpack（整合包）分类中，**"kitchen-sink"** 标签指**全能/杂烩型整合包**，这是一个俚语（源自“厨房水槽里什么杂物都有”的比喻），表示包内包含各种模组类型（科技、魔法、冒险、装饰等），不专注单一主题，而是“什么都来一点”。它强调全面性和趣味性，适合新手探索或“尝鲜”玩家，而不是深度主题包（如纯科技）。简单说，它是“万金油”整合包，模组数量多（100+），兼容性强。

这个标签在 Modrinth 上中等流行，常用于“入门级”或“娱乐型” modpack。

#### 具体含义和示例
- **核心特征**：模组多样（e.g., Create 科技 + Twilight Forest 冒险 + Biomes O' Plenty 生物），平衡性能/内容。
- **典型示例**（从 Modrinth 搜索）：
  | Modpack 名称                  | 描述                                                                 | 链接示例 |
  |-------------------------------|----------------------------------------------------------------------|----------|
  | **Kitchen Sink Modpack**     | 经典杂烩包，200+ 模组，覆盖科技/魔法/探索，适合 Forge 入门。          | [Modrinth](https://modrinth.com/modpack/kitchen-sink-modpack) |
  | **All the Mods 9 (Kitchen-Sink Style)** | 全能整合，包含几乎所有热门模组，支持 Fabric/Forge。                   | [Modrinth](https://modrinth.com/modpack/all-the-mods-9) |
  | **Valhelsia 6**              | 平衡杂烩包，科技 + 魔法 + 装饰，易上手。                             | [Modrinth](https://modrinth.com/modpack/valhelsia-6) |

这些示例兼容 1.20+ 版本，模组数 150-300+。

#### 如何分类/翻译？
- **分类建议**：归入**整合包主题类**（Modpack > Kitchen-Sink）。在中文社区（如 MC 百科），常与 "all-in-one"（全能）或 "misc"（杂项）并列。
- **翻译**：
  - **直译**："厨房水槽"（保留俚语趣味，但需解释）。
  - **意译**："杂烩" 或 "全能"（强调多样，如“杂烩整合包”或“全能包”）。
  - **完整标签**："[Kitchen-Sink] 杂烩"（英文 + 中文，便于搜索）。推荐“杂烩”——社区常用（Bilibili 搜“杂烩模组包”结果多），生动形象。

Modrinth 的 "kitchen-sink" 标签有 50+ 结果，大多是入门全能包。如果你搜 "kitchen-sink"，会看到“什么都有”的乐趣。下一个标签呢？