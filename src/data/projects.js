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
    title: '理想汽车自动充电机器人',
    role: '核心成员',
    date: '2025.05 - 至今',
    image: projChargingRobotUrl,
    imageKey: 'proj-charging-robot',
    descriptions: [
      '主导环境感知与视觉伺服定位系统设计与实现，采用多线激光雷达构建动态场景感知体系。完成车辆泊位粗定位与运动路径规划引导，实时监测运行区域障碍物与碰撞风险。',
      '集成末端3D激光振镜相机，通过Halcon点云滤波与基于形状的3D匹配实现毫米级空间对准（对准精度 ≤ 1mm）。配合龙门式行架+六轴机械臂协同架构，完成充电枪与充电口全流程自动插拔操作。'
    ],
    tags: ['多线激光雷达', 'Halcon 3D匹配', '毫米级对准', '龙门行架', '六轴机械臂']
  },
  {
    id: 2,
    title: '双臂机器人系统开发',
    role: '核心成员',
    date: '2025.01 - 2025.12',
    image: projDualArmUrl,
    imageKey: 'proj-dual-arm',
    descriptions: [
      '<strong>系统集成方向：</strong>基于六自由度人形机器人平台，开发具备人机交互功能的服务机器人系统。设计高精度运动规划与控制算法，结合动力学模型与传感器反馈提升运动稳定性。融合视觉识别、环境感知与传感器数据，构建实时感知-决策-执行系统。基于 AIMRT 中间件完成系统架构搭建，优化子系统接口与通信协议。',
      '<strong>AI方向：</strong>基于LeRobot框架架构训练VLA模型，进行数据采集、模型训练到模型推理的完整链路，实现机械臂自主完成抓取动作。完成RDT2复现，基于UMI数据训练的模型，零样本部署，实现自主叠衣等相关任务。'
    ],
    tags: ['LeRobot VLA', 'AIMRT', 'RDT2', '六自由度', '视觉感知']
  },
  {
    id: 3,
    title: '智能体咖啡机器人整机',
    role: '项目负责人',
    date: '2025.09 - 至今',
    image: projCoffeeRobotUrl,
    imageKey: 'proj-coffee-robot',
    descriptions: [
      '基于ROS2设计智能体咖啡机机器人系统整体架构。设计开发IB4智能交互体（多轴灵动屏+多模态感知）系统集成，屏幕IP形象+三轴运动反馈+语音交互协同，实现场景多模态感知。',
      '基于LLM挂载RAG搭建本地知识库系统，支持企业产品知识问答与个性对话，实现从订单下达到取杯的全流程语音/触摸交互。'
    ],
    tags: ['ROS2', 'IB4智能交互体', 'LLM+RAG', '多模态感知', '语音交互']
  },
  {
    id: 4,
    title: '高铁立柱自动化维保打磨',
    role: '核心成员',
    date: '2024.09 - 至今',
    image: projRailGrindingUrl,
    imageKey: 'proj-rail-grinding',
    descriptions: [
      '完成机械臂选型与末端执行器集成方案，构建「视觉引导 + 力控反馈」双闭环控制框架。',
      '开发基于工业相机的三维点云建模与动态补偿定位算法，提升定位抗干扰能力。设计气浮导轨与精密力控模块协同控制策略，实现打磨力恒定控制（波动 < 5%）。'
    ],
    tags: ['视觉引导+力控', '3D点云建模', '动态补偿', '气浮导轨']
  },
  {
    id: 5,
    title: '上海立体车库新能源汽车自动充电系统',
    role: '项目负责人',
    date: '2023.05 - 2023.06',
    image: projGarageChargingUrl,
    imageKey: 'proj-garage-charging',
    descriptions: [
      '设计充电枪夹爪及可自适应多车型接口标准的末端执行器，保证插拔可靠性。开发基于视觉传感器与图像处理算法的充电口精确定位系统（定位精度 +/-2mm）。',
      '编写PLC/运动控制器程序，完成机械臂轨迹规划与充电时序安全联锁。实现与车辆BMS系统及充电桩协议的对接，支持多车型充电策略适配。'
    ],
    tags: ['视觉定位', 'PLC', 'BMS对接', '多车型适配', '末端执行器']
  },
  {
    id: 6,
    title: '智能码垛工作站',
    role: '项目负责人',
    date: '2023.10 - 2023.12',
    image: projPalletizingUrl,
    imageKey: 'proj-palletizing',
    descriptions: [
      '针对多品类电子产品混线码垛需求，搭建模块化工作站架构，支持产线柔性切换。开发吸盘式/夹爪式末端执行器，完成抓具选型优化与抓取路径规划。',
      '编写机器人路径规划与轨迹生成算法，实现高速平滑运动（Cycle <= 4s）。开发上位机工艺包程序，通过参数化配置支持多产品规格一键切换。'
    ],
    tags: ['模块化架构', '吸盘/夹爪', 'Cycle 4s', '上位机工艺包', '参数化配置']
  },
  {
    id: 7,
    title: '厦门市政水表自动校表系统',
    role: '项目负责人',
    date: '2022.11 - 2023.02',
    image: projWaterMeter,
    imageKey: 'proj-water-meter',
    descriptions: [
      '设计机械臂+传送带协同的自动上下料系统，实现水表全流程无人化校准。基于PLC逻辑控制与传感器信号采集，完成设备间速度同步与动作时序协调。',
      '集成MES系统接口，实现生产数据自动上传与生产状态实时监控。应用光电/限位传感器实现碰撞防护，系统稳定运行节拍达120件/小时。'
    ],
    tags: ['MES对接', 'PLC', '120件/小时', '碰撞防护', '无人化校准']
  },
  {
    id: 8,
    title: '协作机器人激光焊接系统',
    role: '核心成员',
    date: '2024.01 - 2024.02',
    image: projWeldingUrl,
    imageKey: 'proj-welding',
    descriptions: [
      '基于协作机器人设计激光焊接系统，弥补传统焊接机器人灵活性不足的局限。开发焊接寻迹轨迹规划与实时轨迹跟踪算法，实现复杂焊缝的高精度跟踪。',
      '完成焊接设备工艺参数调试与系统优化，焊缝质量达行业标准要求。'
    ],
    tags: ['焊接寻迹', '实时轨迹跟踪', '协作机器人', '工艺参数优化']
  },
  {
    id: 9,
    title: 'Magna齿轴加工机床自动化改造',
    role: '核心成员',
    date: '2024.02 - 2024.06',
    image: projMagnaUrl,
    imageKey: 'proj-magna',
    descriptions: [
      '负责200+ 台齿轴加工机床的自动化上下料改造项目（现场实施）。应用梅卡曼德3D相机实现物料类型识别与加工状态检测，上料识别准确率99.5%。',
      '开发六轴协作机械臂上下料程序，完成机器人与机床、传送带系统协同联调。主导HMI触摸屏功能开发（权限管理、报警记录、IO监控、配方管理、时效统计）。'
    ],
    tags: ['200+台改造', '99.5%识别率', '3D相机', 'HMI开发', '协同联调']
  }
]
