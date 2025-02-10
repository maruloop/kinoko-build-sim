import { addSafeEventListener } from "./helper";
import { showResetModal } from './resetModal';
import LZString from 'lz-string';

interface Talent {
  id: number;
  name: string;
}
interface Dependency {
  nodeId: number;
  requiredLevel: number;
}
interface TalentNode {
  id: number;
  talent: Talent;
  maxLevel: number;
  dependsOn: Dependency[];
  isStart: boolean;
  isEnd: boolean;
}

interface NodeDepths {
  [nodeId: number]: number;
}

interface SerializedTalentNode {
  nodeId: string;
  currentLevel: number;
}

interface SerializedTalentTree {
  jobId: number;
  position: string;
  treeStatus: string;
  nodes: SerializedTalentNode[];
}

type TalentDirection = "top" | "left" | "right";

const TreeStatus = {
  UNLOCKED: "unlocked",
  ACTIVE: "active",
  LOCKED: "locked",
  COMPLETED: "completed",
} as const;

interface JobTalentGraph {
  id: number;
  name: string;
  talents: Record<TalentDirection, TalentNode[]>
}

// https://www.noobshroom.com/posts/talent-generator
const talents: Record<string, Talent> = {
  'ATK': { id: 1, name: '攻撃強化' },
  'DEF': { id: 2, name: '防御強化' },
  'HP': { id: 3, name: '体力強化' },
  'PAL_REGEN': { id: 4, name: '仲間治癒' },
  'Wound': { id: 5, name: '重傷' },
  'PAL_DMG': { id: 6, name: '仲間ダメ強化' },
  'PAL_ATK_SPD': { id: 7, name: '仲間攻撃速度' },
  'PAL_IGNORE_EVASION': { id: 8, name: '仲間回避無視' },
  'IGNORE_EVASION': { id: 9, name: '回避無視' },
  'ASSISTED_COMBO': { id: 10, name: '協力連撃' },
  'PAL_CRIT_DMG': { id: 11, name: '仲間会心ダメ' },
  'REGENERATION': { id: 12, name: '回復' },
  'EVASION': { id: 13, name: '回避' },
  'CRIMSON_SPIRIT': { id: 14, name: '赤焔戦魂' },
  'COUNTER_RES': { id: 15, name: '反撃軽減' },
  'PAL_RES': { id: 16, name: '仲間軽減' },
  'SKILL_RES': { id: 17, name: '技能軽減' },
  'COMBO_RES': { id: 18, name: '連撃軽減' },
  'BASIC_ATK_RES': { id: 19, name: '通常軽減' },
  'LAUNCH': { id: 20, name: '打ち上げ' },
  'CRIT_RES': { id: 21, name: '会心抵抗' },
  'SKILL_CD': { id: 22, name: 'エネ回復' },
  'SKILL_REGEN': { id: 23, name: '技能回復' },
  'SKILL_DMG': { id: 24, name: '技能ダメ' },
  'IGNORE_COUNTER': { id: 25, name: '反撃無視' },
  'ENDLESS_OUTBURST': { id: 26, name: '無尽放出' },
  'SKILL_CRIT_DMG': { id: 27, name: '技能会心ダメ' },
  'IGNORE_LAUNCH': { id: 28, name: '打上無視' },
  'TEMPORAL_COMPRESSION': { id: 29, name: '時間操作' },
  'STUN': { id: 30, name: 'ダウン' },
  'COMBO_REGEN': { id: 31, name: '連撃回復' },
  'COMBO_DMG': { id: 32, name: '連撃ダメ' },
  'ATK_SPD': { id: 33, name: '攻撃速度' },
  'IGNORE_STUN': { id: 34, name: 'ダウン無視' },
  'GALE_BARRAGE': { id: 35, name: '連射' },
  'HEALING_AMOUNT_RATE': { id: 36, name: '治癒' },
  'CRIT_DMG': { id: 37, name: '会心ダメ' },
  'EAGER_MOMENTUM': { id: 38, name: '溜め打ち' },
  'HEALING': { id: 39, name: '治癒' },
  'COUNTER_DMG': { id: 40, name: '反撃ダメ' },
  'COUNTER_REGEN': { id: 41, name: '反撃回復' },
  'BASIC_ATK_DMG': { id: 42, name: '通常ダメ' },
  'IGNORE_COMBO': { id: 43, name: '連撃無視' },
  'RAMPAGE': { id: 44, name: '狂暴' },
  'ASCENSION': { id: 45, name: '昇華' }
}

const jobTalents: JobTalentGraph[] = [
  {
    id: 1,
    name: '狂戦士',
    talents: {
      top: [
        { id: 1, talent: talents.DEF, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.ATK, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.HP, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.COUNTER_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.PAL_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.SKILL_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.COMBO_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.EVASION, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.BASIC_ATK_RES, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.REGENERATION, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ],
      left: [
        { id: 1, talent: talents.HP, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.ATK, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.DEF, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.REGENERATION, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.CRIT_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.HEALING_AMOUNT_RATE, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.COUNTER_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.IGNORE_COMBO, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.IGNORE_EVASION, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.ASCENSION, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ],
      right: [
        { id: 1, talent: talents.ATK, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.DEF, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.HP, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.COUNTER_REGEN, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.BASIC_ATK_DMG, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.COUNTER_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.CRIT_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.IGNORE_COMBO, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.IGNORE_EVASION, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.RAMPAGE, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ]
    }
  },
  {
    id: 2,
    name: '射手',
    talents: {
      top: [
        { id: 1, talent: talents.DEF, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.ATK, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.HP, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.COUNTER_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.PAL_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.SKILL_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.COMBO_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.EVASION, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.BASIC_ATK_RES, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.HEALING, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ],
      left: [
        { id: 1, talent: talents.HP, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.DEF, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.ATK, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.HEALING_AMOUNT_RATE, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.EVASION, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.CRIT_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.COMBO_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.IGNORE_STUN, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.IGNORE_EVASION, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.EAGER_MOMENTUM, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ],
      right: [
        { id: 1, talent: talents.ATK, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.DEF, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.HP, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.COMBO_REGEN, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.IGNORE_LAUNCH, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.COMBO_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.ATK_SPD, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.IGNORE_EVASION, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.IGNORE_STUN, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.GALE_BARRAGE, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ]
    }
  },
  {
    id: 3,
    name: '魔法使い',
    talents: {
      top: [
        { id: 1, talent: talents.DEF, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.ATK, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.HP, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.COUNTER_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.PAL_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.SKILL_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.COMBO_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.EVASION, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.BASIC_ATK_RES, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.STUN, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ],
      left: [
        { id: 1, talent: talents.ATK, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.DEF, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.HP, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.SKILL_CRIT_DMG, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.Wound, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.IGNORE_LAUNCH, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.SKILL_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.IGNORE_COUNTER, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.IGNORE_EVASION, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.TEMPORAL_COMPRESSION, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ],
      right: [
        { id: 1, talent: talents.HP, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.DEF, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.ATK, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.SKILL_REGEN, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.SKILL_DMG, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.SKILL_CD, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.CRIT_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.IGNORE_COUNTER, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.IGNORE_EVASION, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.ENDLESS_OUTBURST, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ]
    }
  },
  {
    id: 4,
    name: '獣使い',
    talents: {
      top: [
        { id: 1, talent: talents.DEF, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.ATK, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.HP, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.COUNTER_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.PAL_RES, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.SKILL_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.COMBO_RES, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.EVASION, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.BASIC_ATK_RES, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.LAUNCH, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ],
      left: [
        { id: 1, talent: talents.HP, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.ATK, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.DEF, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.REGENERATION, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.EVASION, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.PAL_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.PAL_CRIT_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.PAL_IGNORE_EVASION, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.IGNORE_EVASION, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.CRIMSON_SPIRIT, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ],
      right: [
        { id: 1, talent: talents.ATK, dependsOn: [], maxLevel: 20, isStart:true, isEnd: false },
        { id: 2, talent: talents.DEF, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 3, talent: talents.HP, dependsOn: [{nodeId:1, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 4, talent: talents.PAL_REGEN, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 5, talent: talents.Wound, dependsOn: [{nodeId:2, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 6, talent: talents.PAL_ATK_SPD, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 7, talent: talents.PAL_DMG, dependsOn: [{nodeId:3, requiredLevel: 10}], maxLevel: 20, isStart:false, isEnd: false },
        { id: 8, talent: talents.PAL_IGNORE_EVASION, dependsOn: [{nodeId:4, requiredLevel: 10}, {nodeId:5, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 9, talent: talents.IGNORE_EVASION, dependsOn: [{nodeId:6, requiredLevel: 10}, {nodeId:7, requiredLevel: 10}], maxLevel: 10, isStart:false, isEnd: false },
        { id: 10, talent: talents.ASSISTED_COMBO, dependsOn: [{nodeId:8, requiredLevel: 5}, {nodeId:9, requiredLevel: 5}], maxLevel: 1, isStart:false, isEnd: true },
      ]
    }
  },
]

const rowIndexByNumNodes: { [key: number]: number[] } = {
  1: [4],
  2: [2, 6],
  4: [1, 3, 5, 7],
};

const QUERY_KEY = 'back-talents';

function renderBackTalents() {
  renderBackTalentsJobPanels();
  renderBackTalentsTrees();
}

function renderBackTalentsJobPanels() {
  const container = document.getElementById("back-talenents-tree-selection-container") as HTMLDivElement;
  container.innerHTML = '';

  if (!container) {
    console.error("Container not found");
    return;
  }

  jobTalents.forEach((jobTalent, index) => {
    const panel = document.createElement("div");
    panel.classList.add("back-talenents-job-panel");

    const text = document.createElement("div");
    text.classList.add("job-name");
    text.textContent = jobTalent.name;

    const directions = ["top", "left", "right"];
    directions.forEach((direction) => {
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = `jobTalent`;
      radioInput.id = `jobTalent-${jobTalent.id}-${direction}`;
      radioInput.classList.add("talent-radio");

      if (direction === "top" && index === 0) {
        radioInput.checked = true;
      }

      const label = document.createElement("label");
      label.classList.add("dot", direction);
      label.setAttribute("for", radioInput.id);

      panel.appendChild(radioInput);
      panel.appendChild(label);
    });

    panel.appendChild(text);
    container.appendChild(panel);
  });
}

function renderBackTalentsTrees() {
  const container = document.getElementById('back-talents-tree-container') as HTMLDivElement;
  container.innerHTML = '';

  jobTalents.forEach(jobtalent => {
    container.appendChild(renderBackTalentsTree(jobtalent, "left"));
    container.appendChild(renderBackTalentsTree(jobtalent, "top"));
    container.appendChild(renderBackTalentsTree(jobtalent, "right"));
  });
}

function renderBackTalentsTree(jobTalentGraph: JobTalentGraph, position: TalentDirection): HTMLDivElement {
  const talentGraph = jobTalentGraph.talents[position];
  const grid = document.createElement('div');
  grid.classList.add('talent-grid');
  grid.setAttribute('id', `jobTalentGraph-${jobTalentGraph.id}-${position}`);
  grid.dataset.jobId = String(jobTalentGraph.id);
  grid.dataset.position = position;
  grid.dataset.treeStatus = TreeStatus.UNLOCKED;

  const depths = calculateNodeDepths(talentGraph);
  const groupedNodes = groupNodesByDepth(talentGraph, depths);
  const columns = groupedNodes.size;
  const rows = calculateGridRows(groupedNodes) * 2 - 1;
  grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${rows}, auto)`;

  groupedNodes.forEach((nodesAtDepth, depth) => {
    const columnIndex = depth - 1;

    nodesAtDepth.forEach((node, index) => {
      const rowIndex = rowIndexByNumNodes[nodesAtDepth.length]?.[index];

      const nodeElement = document.createElement('div');
      nodeElement.classList.add('talent-node', position);
      nodeElement.dataset.nodeId = `jobTalentGraph-${jobTalentGraph.id}-${position}-${node.id}`;
      nodeElement.dataset.currentLevel = '0';
      nodeElement.dataset.maxLevel = node.maxLevel.toString();
      node.dependsOn.forEach((dep) => {
        const parentNodeElementId = `jobTalentGraph-${jobTalentGraph.id}-${position}-${dep.nodeId}`;
        const parentNodeElement = grid.querySelector<HTMLElement>(`[data-node-id="${parentNodeElementId}"]`);
        if(parentNodeElement){
          parentNodeElement.dataset.requiredLevel = String(dep.requiredLevel);
        }
      });

      const nameElement = document.createElement('div');
      nameElement.textContent = node.talent.name;
      nameElement.classList.add('talent-name');

      const levelControl = document.createElement('div');
      levelControl.classList.add('level-control');

      const decrement10Button = document.createElement('button');
      decrement10Button.textContent = '-10';
      decrement10Button.classList.add('talent-button', 'decrement10');

      const decrementButton = document.createElement('button');
      decrementButton.textContent = '-';
      decrementButton.classList.add('talent-button', 'decrement');

      const levelDisplay = document.createElement('span');
      levelDisplay.textContent = '0';
      levelDisplay.classList.add('level-display');

      const incrementButton = document.createElement('button');
      incrementButton.textContent = '+';
      incrementButton.classList.add('talent-button', 'increment');

      const increment10Button = document.createElement('button');
      increment10Button.textContent = '+10';
      increment10Button.classList.add('talent-button', 'increment10');

      const adjustLevel = (nodeElement: HTMLElement, jobTalentGraph: JobTalentGraph, delta: number) => {
        const currentLevel = parseInt(nodeElement.dataset.currentLevel || '0');
        const maxLevel = parseInt(nodeElement.dataset.maxLevel || '0');
        const newLevel = Math.max(0, Math.min(maxLevel, currentLevel + delta));

        if (newLevel > currentLevel) {
          for (let i = currentLevel; i < newLevel; i++) {
            handleLevelUp(nodeElement, jobTalentGraph);
          }
        } else if (newLevel < currentLevel) {
          for (let i = currentLevel; i > newLevel; i--) {
            handleLevelDown(nodeElement, jobTalentGraph);
          }
        }
      };

      addSafeEventListener(decrement10Button, 'click', (event) => {
        const nodeElement = (event.target as HTMLElement).closest('.talent-node')! as HTMLElement;
        adjustLevel(nodeElement, jobTalentGraph, -10);
      });

      addSafeEventListener(decrementButton, 'click', (event) => {
        const nodeElement = (event.target as HTMLElement).closest('.talent-node')! as HTMLElement;
        adjustLevel(nodeElement, jobTalentGraph, -1);
      });

      addSafeEventListener(incrementButton, 'click', (event) => {
        const nodeElement = (event.target as HTMLElement).closest('.talent-node')! as HTMLElement;
        adjustLevel(nodeElement, jobTalentGraph, 1);
      });

      addSafeEventListener(increment10Button, 'click', (event) => {
        const nodeElement = (event.target as HTMLElement).closest('.talent-node')! as HTMLElement;
        adjustLevel(nodeElement, jobTalentGraph, 10);
      });

      levelControl.appendChild(decrement10Button);
      levelControl.appendChild(decrementButton);
      levelControl.appendChild(levelDisplay);
      levelControl.appendChild(incrementButton);
      levelControl.appendChild(increment10Button);

      nodeElement.appendChild(nameElement);
      nodeElement.appendChild(levelControl);

      nodeElement.style.gridColumn = `${columnIndex + 1}`;
      nodeElement.style.gridRow = `${rowIndex}`;

      grid.appendChild(nodeElement);
    });
  });
  return grid;
}

function handleLevelUp(nodeElement: HTMLElement, graph: JobTalentGraph) {
  const currentLevel = parseInt(nodeElement.dataset.currentLevel || '0');
  const maxLevel = parseInt(nodeElement.dataset.maxLevel || '0');
  const treeElement = nodeElement.closest('.talent-grid') as HTMLElement;

  if (treeElement.dataset.treeStatus === TreeStatus.LOCKED) {
    return;
  }

  if (treeElement.dataset.treeStatus === TreeStatus.UNLOCKED) {
    treeElement.dataset.treeStatus = TreeStatus.ACTIVE;
    lockOtherTrees(treeElement);
  }

  if (currentLevel < maxLevel) {
    const newLevel = currentLevel + 1;
    nodeElement.dataset.currentLevel = newLevel.toString();
    nodeElement.querySelector('.level-display')!.textContent = newLevel.toString();

    cascadeLevelUp(nodeElement, graph);

    if (isEndNode(nodeElement)) {
      treeElement.dataset.treeStatus = TreeStatus.COMPLETED;
      unlockNextTrees(treeElement);
    }

    updateURL();
  }
}

function isEndNode(nodeElement: HTMLElement): boolean {
  const nodeId = nodeElement.dataset.nodeId || '';
  const node = findNodeById(nodeId);
  return node?.isEnd || false;
}

function unlockNextTrees(completedTree: HTMLElement) {
  const jobId = completedTree.dataset.jobId;
  const treesAsTheSameJob = document.querySelectorAll<HTMLElement>(`.talent-grid[data-job-id="${jobId}"]`);

  treesAsTheSameJob.forEach((tree) => {
    if (tree.dataset.treeStatus === TreeStatus.LOCKED) {
      tree.dataset.treeStatus = TreeStatus.UNLOCKED;
    }
  });
}

function lockOtherTrees(activeTree: HTMLElement) {
  const jobId = activeTree.dataset.jobId;
  const treesAsTheSameJob = document.querySelectorAll<HTMLElement>(`.talent-grid[data-job-id="${jobId}"]`);

  treesAsTheSameJob.forEach((tree) => {
    if (tree !== activeTree && tree.dataset.treeStatus === TreeStatus.UNLOCKED) {
      tree.dataset.treeStatus = TreeStatus.LOCKED;
    }
  });
}

function cascadeLevelUp(nodeElement: HTMLElement, graph: JobTalentGraph) {
  const nodeId = nodeElement.dataset.nodeId || '';
  const node = findNodeById(nodeId);
  const position = getPositionById(nodeId);
  if (!node || !position) return;

  node.dependsOn.forEach((dependency) => {
    const dependentNodeId = `jobTalentGraph-${graph.id}-${position}-${dependency.nodeId}`;
    const dependentElement = document.querySelector<HTMLElement>(`[data-node-id="${dependentNodeId}"]`);
    if (dependentElement) {
      const currentDependentLevel = parseInt(dependentElement.dataset.currentLevel || '0');

      if (currentDependentLevel < dependency.requiredLevel) {
        dependentElement.dataset.currentLevel = String(dependency.requiredLevel);
        dependentElement.querySelector('.level-display')!.textContent = String(dependency.requiredLevel);

        cascadeLevelUp(dependentElement, graph);
      }
    }
  });
}

function handleLevelDown(nodeElement: HTMLElement, graph: JobTalentGraph) {
  const currentLevel = parseInt(nodeElement.dataset.currentLevel || '0');
  const treeElement = nodeElement.closest('.talent-grid') as HTMLElement;

  if (currentLevel > 0 && canSafelyLevelDownWhenCompleted(treeElement, nodeElement) ) {
    const newLevel = currentLevel - 1;
    nodeElement.dataset.currentLevel = String(newLevel);
    nodeElement.querySelector('.level-display')!.textContent = String(newLevel);

    cascadeLevelDown(nodeElement, graph);

    if (isTreeEmpty(treeElement)) {
      treeElement.dataset.treeStatus = TreeStatus.UNLOCKED;
      unlockOtherTrees(treeElement);
    }

    const position = getPositionById(nodeElement.dataset.nodeId || '') as TalentDirection;
    const endNode = graph.talents[position].find((node) => node.isEnd);
    if(endNode){
      const endNodeId = `jobTalentGraph-${graph.id}-${position}-${endNode.id}`;
      const endNodeElement = treeElement.querySelector<HTMLElement>(`[data-node-id="${endNodeId}"]`);
      if (parseInt(endNodeElement?.dataset.currentLevel || '0', 10) === 0) {
        treeElement.dataset.treeStatus = TreeStatus.ACTIVE;
        lockOtherTrees(treeElement);
      }
    }

    updateURL();
  }
}

function canSafelyLevelDownWhenCompleted(treeElement: HTMLElement, nodeElement: HTMLElement): boolean {
  const currentLevel = parseInt(nodeElement.dataset.currentLevel || '0');
  const requiredLevel = parseInt(nodeElement.dataset.requiredLevel || '0');
  const jobId = treeElement.dataset.jobId;

  const treesAsTheSameJob = document.querySelectorAll<HTMLElement>(`.talent-grid[data-job-id="${jobId}"]`);
  const hasActiveTree = Array.from(treesAsTheSameJob).some(tree => tree.dataset.treeStatus === TreeStatus.ACTIVE);
  const isTreeCompleted = treeElement.dataset.treeStatus === TreeStatus.COMPLETED;

  return !hasActiveTree || !isTreeCompleted || (currentLevel - 1 >= requiredLevel);
}

function isTreeEmpty(treeElement: HTMLElement): boolean {
  const nodes = treeElement.querySelectorAll<HTMLElement>('.talent-node');
  return Array.from(nodes).every((node) => parseInt(node.dataset.currentLevel || '0') === 0);
}

function unlockOtherTrees(currentTree: HTMLElement) {
  const jobId = currentTree.dataset.jobId;
  const treesAsTheSameJob = document.querySelectorAll<HTMLElement>(`.talent-grid[data-job-id="${jobId}"]`);

  treesAsTheSameJob.forEach((tree) => {
    if (tree !== currentTree && tree.dataset.treeStatus === TreeStatus.LOCKED) {
      tree.dataset.treeStatus = TreeStatus.UNLOCKED;
    }
  });
}

function cascadeLevelDown(nodeElement: HTMLElement, graph: JobTalentGraph) {
  const nodeId = nodeElement.dataset.nodeId || '';
  const node = findNodeById(nodeId);
  const position = getPositionById(nodeId);
  if (!node || !position) return;

  const childrenNodes = findChildrenNodes(graph, node.id);

  childrenNodes.forEach((childNode) => {
    const childNodeId = `jobTalentGraph-${graph.id}-${position}-${childNode.id}`;
    const childNodeElement = document.querySelector<HTMLElement>(`[data-node-id="${childNodeId}"]`);
    const requiredLevel = childNode.dependsOn.find((dep)=> dep.nodeId === node.id)?.requiredLevel || 0;
    if (childNodeElement) {
      if (!isChildSatisfied(childNodeElement, graph, requiredLevel)) {
        childNodeElement.dataset.currentLevel = '0';
        childNodeElement.querySelector('.level-display')!.textContent = '0';

        cascadeLevelDown(childNodeElement, graph);
      }
    }
  });
}

function findChildrenNodes(graph: JobTalentGraph, nodeId: number): TalentNode[] {
  return Object.values(graph.talents)
    .flat()
    .filter((node) => node.dependsOn.find((node) => node.nodeId === nodeId));
}

function isChildSatisfied(nodeElement: HTMLElement, graph: JobTalentGraph, requiredLevel: number): boolean {
  const nodeId = nodeElement.dataset.nodeId || '';
  const node = findNodeById(nodeId);
  const position = getPositionById(nodeId);
  if (!node || !position) return true;
  return node.dependsOn.every((parentNode) => {
    const parentNodeId = `jobTalentGraph-${graph.id}-${position}-${parentNode.nodeId}`;
    const parentElement = document.querySelector<HTMLElement>(`[data-node-id="${parentNodeId}"]`);
    return parentElement && parseInt(parentElement.dataset.currentLevel || '0') >= requiredLevel;
  });
}

function getPositionById(nodeId: string): String | undefined {
  const idParts = nodeId.split('-');
  const position = idParts[2] as TalentDirection;

  return position;
}
function findNodeById(nodeId: string): TalentNode | undefined {
  const idParts = nodeId.split('-');
  const jobId = parseInt(idParts[1], 10);
  const position = idParts[2] as TalentDirection;
  const talentNodeId = parseInt(idParts[3], 10);
  return jobTalents.find((jobTalent) => jobTalent.id === jobId)?.talents[position].find((node) => node.id === talentNodeId);
}

function calculateGridRows(groupedNodes: Map<number, TalentNode[]>): number {
  let maxRows = 0;
  groupedNodes.forEach(nodes => {
    maxRows = Math.max(maxRows, nodes.length);
  });
  return maxRows;
}

function calculateNodeDepths(graph: TalentNode[]): NodeDepths {
  const depths: NodeDepths = {};

  function dfs(nodeId: number): number {
    if (nodeId in depths) {
      return depths[nodeId];
    }

    const node = graph.find(n => n.id === nodeId);
    if (!node || node.dependsOn.length === 0) {
      depths[nodeId] = 1;
      return 1;
    }

    const maxChildDepth = Math.max(...node.dependsOn.map(dep => dfs(dep.nodeId)));
    depths[nodeId] = maxChildDepth + 1;
    return depths[nodeId];
  }

  graph.forEach(node => dfs(node.id));
  return depths;
}

function groupNodesByDepth(graph: TalentNode[], depths: NodeDepths): Map<number, TalentNode[]> {
  const grouped = new Map<number, TalentNode[]>();

  const sortedDepths = Array.from(new Set(Object.values(depths))).sort((a, b) => a - b);

  sortedDepths.forEach(depth => {
    const nodesAtDepth = Object.entries(depths)
      .filter(([_, nodeDepth]) => nodeDepth === depth)
      .map(([nodeId]) => graph.find(n => n.id === parseInt(nodeId, 10)))
      .filter((node): node is TalentNode => node !== undefined);

    grouped.set(depth, nodesAtDepth);
  });

  return grouped;
}

function serializeTalentTreeState(): SerializedTalentTree[] {
  const jobTrees: SerializedTalentTree[] = [];

  document.querySelectorAll<HTMLElement>('.talent-grid').forEach(treeElement => {
    const jobId = parseInt(treeElement.dataset.jobId || '0', 10);
    const position = treeElement.dataset.position || 'left';
    const treeStatus = treeElement.dataset.treeStatus || TreeStatus.LOCKED;

    const nodes: SerializedTalentNode[] = [];

    treeElement.querySelectorAll<HTMLElement>('.talent-node').forEach(nodeElement => {
      nodes.push({
        nodeId: nodeElement.dataset.nodeId || '',
        currentLevel: parseInt(nodeElement.dataset.currentLevel || '0', 10),
      });
    });

    jobTrees.push({ jobId, position, treeStatus, nodes });
  });

  return jobTrees;
}


function compressTalentTreeState(): string {
  const jsonData = serializeTalentTreeState();

  const minimizedData = jsonData.map(tree => ({
    j: tree.jobId,
    p: tree.position,
    s: tree.treeStatus,
    n: tree.nodes.map(node => ({
      i: node.nodeId.replace("jobTalentGraph-", ""),
      l: node.currentLevel
    }))
  }));

  const jsonString = JSON.stringify(minimizedData);
  return encodeURIComponent(LZString.compressToEncodedURIComponent(jsonString));
}

function decompressTalentTreeState(compressedData: string): SerializedTalentTree[] {
  const jsonString = LZString.decompressFromEncodedURIComponent(decodeURIComponent(compressedData));

  if (!jsonString) {
    throw new Error("Failed to decompress data.");
  }

  interface MinimizedNode {
    i: string; // compressed nodeId
    l: number; // currentLevel
  }

  interface MinimizedTree {
    j: number; // jobId
    p: string; // position
    s: string; // treeStatus
    n: MinimizedNode[]; // nodes
  }

  const minimizedData: MinimizedTree[] = JSON.parse(jsonString);

  return minimizedData.map((tree): SerializedTalentTree => ({
    jobId: tree.j,
    position: tree.p,
    treeStatus: tree.s,
    nodes: tree.n.map((node): SerializedTalentNode => ({
      nodeId: `jobTalentGraph-${node.i}`,
      currentLevel: node.l
    }))
  }));
}

function updateURL() {
  const params = new URLSearchParams(window.location.search);
  const compressedState = compressTalentTreeState();

  if (compressedState) {
    params.set(QUERY_KEY, compressedState);
  } else {
    params.delete(QUERY_KEY);
  }

  const newPath = params.toString() ? '?' + params.toString() : window.location.pathname;
  history.replaceState(null, '', newPath);
}

function loadTalentTreeStateFromURL() {
  const params = new URLSearchParams(window.location.search);
  const compressedState = params.get(QUERY_KEY);

  if (compressedState) {
    const decompressedData = decompressTalentTreeState(compressedState);
    console.log("Decompressed JSON:", decompressedData);
    restoreTalentTreeState(decompressedData);
  }
}

function restoreTalentTreeState(state: SerializedTalentTree[]) {
  state.forEach((treeData: SerializedTalentTree) => {
    const treeElement = document.querySelector<HTMLElement>(`.talent-grid[data-job-id="${treeData.jobId}"][data-position="${treeData.position}"]`);
    if (treeElement) {
      treeElement.dataset.treeStatus = treeData.treeStatus;

      treeData.nodes.forEach((nodeData: SerializedTalentNode) => {
        const nodeElement = document.querySelector<HTMLElement>(`[data-node-id="${nodeData.nodeId}"]`);
        if (nodeElement) {
          nodeElement.dataset.currentLevel = nodeData.currentLevel.toString();
          nodeElement.querySelector('.level-display')!.textContent = nodeData.currentLevel.toString();
        }
      });
    }
  });
}

export function initBackTalentsUI() {
  renderBackTalents();
  loadTalentTreeStateFromURL();
    const resetBackTalentsBtn = document.getElementById('reset-back-talents-btn') as HTMLButtonElement;
    addSafeEventListener(resetBackTalentsBtn, 'click', () => {
      showResetModal([QUERY_KEY], '背飾り能力');
    });
}
