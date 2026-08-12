# LIMS 采样管理数据看板 — 完整源代码包

> 技术栈：React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui + ECharts 5.x

---

## 一、文件结构

```
lims-dashboard-source/
  README.md                    # 本文档
  package.json                 # 依赖配置
  index.html                   # HTML入口
  vite.config.ts              # Vite配置
  tsconfig.json               # TypeScript配置
  tailwind.config.js          # Tailwind CSS配置
  postcss.config.js           # PostCSS配置
  src/
    main.tsx                  # React入口
    App.tsx                   # 根组件
    App.css                   # 全局样式（已清空，样式在index.css）
    index.css                 # 全局CSS变量 + Tailwind + 动画
    types/
      dashboard.ts            # TypeScript类型定义
    data/
      mockData.ts             # 全部Mock数据
    components/
      ui/                     # shadcn/ui组件（Dialog, ScrollArea等）
    sections/
      Header.tsx              # 顶部蓝色导航栏
      StatusPipeline.tsx      # 5列状态卡片（采样总数+4状态）
      KpiCards.tsx            # 3列KPI卡片（超期/活跃/空闲）
      TaskDurationDistribution.tsx  # 任务持续天数分布环形图
      LeaderLoad.tsx          # 人员任务负载（姓氏圆形+进度条）
      TaskTrend.tsx           # 近30天任务状态趋势折线图
      TotalOutputValue.tsx    # 总产值统计（对比柱状图+人均日产值）
      PersonnelTaskRanking.tsx  # 人员任务量排名+弹窗
      PersonnelOutputRanking.tsx # 人员产值排名+弹窗
      IdlePersonnel.tsx       # 空闲人员（紧凑卡片+弹窗）
      AreaDistribution.tsx    # 受检方区域分布（图表+列表双视图）
      OverdueProjects.tsx     # 超期任务表格（搜索/筛选/分页）
      ClientStats.tsx         # 客户统计表格（搜索/排序/分页）
      SamplingCalendar.tsx    # 采样日历（周视图/月视图甘特图）
      DetailDrawer.tsx        # 右侧详情抽屉
    pages/
      Home.tsx                # 主页面（组合所有模块）
```

---

## 二、设计系统

### 配色（中企后台蓝白风格，参照你系统截图）

| 角色 | 色值 | 说明 |
|------|------|------|
| 页面背景 | `#F0F2F5` | 浅灰白 |
| 卡片背景 | `#FFFFFF` | 纯白 |
| 顶部导航 | `linear-gradient(90deg, #1677FF, #1890FF)` | 蓝色渐变 |
| 主色 | `#1677FF` | 蓝 |
| 主色Hover | `#4096FF` | 亮蓝 |
| 主色Active | `#0958D9` | 深蓝 |
| 文字主色 | `#262626` | 深灰 |
| 正文 | `#595959` | 中灰 |
| 弱化文字 | `#8C8C8C` | 浅灰 |
| 边框 | `#E4E7ED` | 细线灰 |
| 绿 | `#52C41A` | 成功/轻度 |
| 橙 | `#FA8C16` | 警告/中度 |
| 红 | `#F5222D` | 错误/重度 |

### 字体
- Inter + system-ui + PingFang SC + Microsoft YaHei
- 数字使用 `font-variant-numeric: tabular-nums` 对齐

### 圆角
- 卡片/按钮：8px
- 小元素：6px

### 阴影
- 几乎无阴影，靠白色卡片在灰底上自然区分层次
- Hover 仅有轻微 `box-shadow: 0 2px 8px rgba(0,0,0,0.04)`

---

## 三、各模块功能说明

### 1. StatusPipeline — 5列状态卡片
- 采样任务总数（蓝色渐变卡片，白字）
- 待分配 / 待采样 / 采样中 / 已完结
- 点击弹出详情抽屉
- 数字有计数动画

### 2. KpiCards — 3列KPI
- 超期任务数（红色竖线）
- 活跃任务数（绿色竖线）
- 空闲人员数（蓝色竖线）
- 点击弹出详情

### 3. TaskDurationDistribution — 环形图
- 9个天数区间（1天~30天以上）
- 点击扇区弹出对应任务列表
- 中心显示总任务数

### 4. LeaderLoad — 人员任务负载（最新设计）
- **姓氏首字彩色圆形**（类似钉钉，未来可换真实头像）
- **升序排列**：在途任务少的在前，方便监管人员派任务
- **单色负载条**：长度表示相对负载
- **在途任务数 + 状态标签**（轻度/中度/重度）
- **底部评判标准**：轻度≤3 / 中度4~6 / 重度≥7
- **查看全部弹窗**：完整人员列表

### 5. TaskTrend — 30天趋势
- 4条折线（待分配/待采样/采样中/运输中）
- 日/周切换

### 6. TotalOutputValue — 总产值
- 日/周/月/年/总 5个维度
- 当期 vs 上一周期对比柱状图
- 人均日产值指标

### 7. PersonnelTaskRanking / PersonnelOutputRanking
- 日/周/月/年/总 切换
- 顶部3名带Medal图标
- 横向进度条
- 查看全部弹窗（12人完整列表）

### 8. IdlePersonnel — 空闲人员
- 紧凑卡片显示前3人
- 查看全部弹窗

### 9. AreaDistribution — 区域分布
- 图表视图：横向堆叠柱状图
- 列表视图：区域详情+客户列表

### 10. OverdueProjects — 超期任务表格
- 搜索（名称/编号/受检方）
- 状态筛选下拉
- 分页（每页5条）

### 11. ClientStats — 客户统计表格
- 搜索
- 按任务数/总任务排序
- 分页

### 12. SamplingCalendar — 采样日历
- 周视图/月视图切换
- 甘特条跨日连续展示
- 点击展开任务详情

### 13. DetailDrawer — 详情抽屉
- 右侧滑入
- 显示任务/人员/客户详情

---

## 四、Mock数据说明

所有数据在 `src/data/mockData.ts`：

- `projects`: 30+ 采样任务（含编号、名称、客户、状态、点位数、日期等）
- `statusCounts`: 4个状态统计
- `projectLeaders`: 10个项目负责人（姓名、总任务、在途、已完结）
- `allPersonnel`: 20个工作人员
- `trendData`: 30天趋势数据
- `clientStats`: 8个客户统计
- `areaStats`: 7个区域统计

**关键数据点**：
- 采样任务总数：77
- 项目负责人：王晓王、张如强、王小、刘喜龙、毛金达、石亮、周杰、李迪、陈明、赵伟
- 人员负载排序：升序（在途任务少的在前）

---

## 五、关键开发决策记录

1. **从"项目"视角改为"任务"视角** — 所有文字从"项目"改为"任务"
2. **去掉"运输中"状态卡片** — 只保留4个核心状态
3. **空闲工作组 → 空闲人员** — 粒度更细
4. **人员负载只显示在途任务** — 已完结不算负载
5. **负载排序升序** — 轻度在前，方便派任务
6. **总产值增加人均日产值指标**
7. **三个产值模块时间切换统一**（日/周/月/年/总）
8. **排名模块加查看全部弹窗**（12人完整列表）
9. **设计风格参照你的系统截图** — 蓝白配色、顶部蓝色渐变导航栏
10. **姓氏首字圆形替代头像** — 未来可直接替换为真实头像

---

## 六、安装和运行

```bash
cd lims-dashboard-source
npm install
npm run build
# 产物在 dist/ 目录
```

---

## 七、现有部署页面

当前部署地址：https://oozjqvmbom66u.ok.kimi.link
（此页面不受影响，继续可用）
