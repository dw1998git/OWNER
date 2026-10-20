import projChargingRobotUrl from '@/assets/proj-charging-robot.jpg?url'
import projDualArmUrl from '@/assets/proj-dual-arm.jpg?url'
import projCoffeeRobotUrl from '@/assets/proj-coffee-robot.jpg?url'
import projRailGrindingUrl from '@/assets/proj-rail-grinding.jpg?url'
import projGarageChargingUrl from '@/assets/proj-garage-charging.png?url'
import projPalletizingUrl from '@/assets/proj-palletizing.png?url'
import projWaterMeter from '@/assets/proj-water-meter.jpg?url'
import projWeldingUrl from '@/assets/proj-welding.png?url'
import projMagnaUrl from '@/assets/proj-magna.jpg?url'

export const projects = [
  {
    id: 1,
    title: '智能体咖啡机器人整机项目',
    role: '项目负责人',
    date: '2025.09 - 至今',
    image: projCoffeeRobotUrl,
    imageKey: 'proj-coffee-robot',
    descriptions: [
      '<strong>系统架构：</strong>基于 ROS2 设计智能体咖啡机器人整机软件架构，统筹感知、交互、决策与运动控制子系统的接口定义与数据流转。',
      '<strong>后端/AI：</strong>基于 LLM 挂载 RAG 搭建本地知识库系统，支持企业产品知识问答与个性化对话，实现私有化部署的智能交互后端。',
      '<strong>前端/交互：</strong>主导 IB4 智能交互体集成——多轴灵动屏 UI 与 IP 形象界面设计，结合三轴运动反馈与语音交互协同，实现多模态场景感知。',
      '<strong>全流程打通：</strong>打通「语音/触摸点单 → 意图理解 → 饮品制作 → 取杯交付」订单到取杯全流程，实现多模态交互与机器人控制的端到端系统闭环。'
    ],
    tags: ['ROS2', 'LLM+RAG', 'IB4智能交互体', '多模态感知', '端到端闭环']
  },
  {
    id: 2,
    title: '双臂机器人系统开发',
    role: '核心成员',
    date: '2025.01 - 2025.12',
    image: projDualArmUrl,
    imageKey: 'proj-dual-arm',
    descriptions: [
      '<strong>系统集成方向：</strong>基于六自由度人形机器人平台，开发具备人机交互功能的服务机器人系统，构建「感知-决策-执行」实时闭环。设计高精度运动规划与控制算法，融合动力学模型与多传感器反馈，提升运动稳定性。基于 AIMRT 中间件完成系统架构搭建。',
      '<strong>具身智能方向：</strong>基于 LeRobot 框架训练 VLA 模型，独立完成数据采集、模型训练、模型推理的完整链路，实现双臂机械臂自主完成抓取动作。复现 RDT2 机器人扩散策略模型，基于 UMI 数据训练策略模型并零样本部署至真机，成功执行自主叠衣等长时序操作任务。'
    ],
    tags: ['LeRobot VLA', 'RDT2', 'UMI零样本部署', 'AIMRT', '六自由度平台']
  },
  {
    id: 3,
    title: '理想汽车自动充电机器人项目',
    role: '核心成员',
    date: '2025.04 - 2025.05',
    image: projChargingRobotUrl,
    imageKey: 'proj-charging-robot',
    descriptions: [
      '主导环境感知与视觉伺服定位系统设计与实现，采用多线激光雷达构建动态场景感知体系，实时监测障碍物与碰撞风险。',
      '完成车辆泊位粗定位与运动路径规划引导；集成末端 3D 激光振镜相机，通过 Halcon 点云滤波与基于形状的 3D 匹配实现毫米级空间对准。',
      '配合龙门式行架+六轴机械臂协同架构，完成充电枪与充电口全流程自动插拔操作。'
    ],
    tags: ['多线激光雷达', 'Halcon 3D匹配', '3D激光振镜相机', '龙门行架+六轴机械臂']
  },
  {
    id: 4,
    title: '高铁立柱自动化维保打磨系统',
    role: '核心成员',
    date: '2024.09 - 2025.05',
    image: projRailGrindingUrl,
    imageKey: 'proj-rail-grinding',
    descriptions: [
      '完成机械臂选型与末端执行器集成方案，构建「视觉引导 + 力控反馈」双闭环控制框架。',
      '开发基于工业相机的三维点云建模与动态补偿定位算法，提升复杂工况下定位抗干扰能力。',
      '设计气浮导轨与精密力控模块协同控制策略，实现打磨力恒定控制。'
    ],
    tags: ['视觉引导+力控', '三维点云建模', '动态补偿定位', '气浮导轨', '恒力打磨']
  },
  {
    id: 5,
    title: 'Magna齿轴加工机床自动化改造',
    role: '核心成员',
    date: '2024.02 - 2024.06',
    image: projMagnaUrl,
    imageKey: 'proj-magna',
    descriptions: [
      '负责现场实施 200+ 台齿轴加工机床的自动化上下料改造，完成机器人与机床、传送带系统协同联调。',
      '应用梅卡曼德 3D 相机实现物料类型识别与加工状态检测，上料识别准确率达 99.5%。',
      '主导 HMI 触摸屏功能开发（权限管理、报警记录、IO 监控、配方管理、时效统计）。'
    ],
    tags: ['200+台改造', '梅卡曼德3D相机', '99.5%识别率', 'HMI开发']
  },
  {
    id: 6,
    title: '协作机器人激光焊接系统',
    role: '核心成员',
    date: '2024.01 - 2024.02',
    image: projWeldingUrl,
    imageKey: 'proj-welding',
    descriptions: [
      '基于协作机器人设计激光焊接系统，开发焊接寻迹轨迹规划与实时轨迹跟踪算法，实现复杂焊缝高精度跟踪。',
      '完成焊接设备工艺参数调试与系统优化，焊缝质量达行业标准要求。'
    ],
    tags: ['焊接寻迹', '实时轨迹跟踪', '协作机器人', '工艺参数优化']
  },
  {
    id: 7,
    title: '智能码垛工作站',
    role: '项目负责人',
    date: '2023.10 - 2023.12',
    image: projPalletizingUrl,
    imageKey: 'proj-palletizing',
    descriptions: [
      '针对多品类电子产品混线码垛需求，搭建模块化工作站架构，支持产线柔性切换。',
      '开发吸盘式/夹爪式末端执行器，完成抓具选型优化与抓取路径规划，实现高速平滑运动。',
      '开发上位机码垛工艺包程序，通过参数化配置支持多产品规格一键切换。'
    ],
    tags: ['模块化架构', '吸盘/夹爪末端执行器', '上位机工艺包', '参数化配置']
  },
  {
    id: 8,
    title: '上海立体车库新能源汽车自动充电系统',
    role: '项目负责人',
    date: '2023.05 - 2023.06',
    image: projGarageChargingUrl,
    imageKey: 'proj-garage-charging',
    descriptions: [
      '设计充电枪夹爪及自适应多车型接口标准的末端执行器，保证插拔可靠性。',
      '开发基于视觉传感器与图像处理算法的充电口精确定位系统。',
      '编写 PLC/运动控制器程序，完成机械臂轨迹规划与充电时序安全联锁；实现与车辆 BMS 系统及充电桩协议对接，支持多车型充电策略适配。'
    ],
    tags: ['视觉定位', 'PLC', 'BMS对接', '安全联锁', '多车型适配']
  },
  {
    id: 9,
    title: '厦门市政水表自动校表系统',
    role: '项目负责人',
    date: '2022.11 - 2023.02',
    image: projWaterMeter,
    imageKey: 'proj-water-meter',
    descriptions: [
      '设计机械臂+传送带协同的自动上下料系统，实现水表全流程无人化校准，稳定运行节拍达 120 件/小时。',
      '基于 PLC 逻辑控制与传感器信号采集，完成设备间速度同步与动作时序协调；集成 MES 系统接口实现生产数据自动上传与实时监控。',
      '应用光电/限位传感器实现碰撞防护。'
    ],
    tags: ['机械臂+传送带', 'PLC', 'MES对接', '120件/小时', '碰撞防护']
  }
]
