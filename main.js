/* Core utilities */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (list) => list[Math.floor(Math.random() * list.length)];
const timestamp = () => new Date().toLocaleTimeString();

const levelRequirement = (level) =>
  Math.floor(Math.min(5000, 50 * Math.pow(level, 1.1)));
const expScale = (base, coeff, growth, level) => base + coeff * Math.pow(growth, level);
const hybridScale = (base, coeff, linearFactor, growth, level) =>
  base + coeff * (linearFactor * level + Math.pow(growth, level));

/* Hero definitions */
const HEROES = [
  {
    id: 'warrior',
    name: '战士',
    summary: '稳健坦克型，普攻为100%物理伤害，拥有蓄力与冲撞。',
    stats: {
      hp: { base: 100, per: 12 },
      attack: { base: 25, per: 2 },
      defense: { base: 25, per: 1.5 },
      resist: { base: 35, per: 1 },
      mana: { base: 50, per: 5 }
    },
    normalAttack: { type: 'physical', hits: [{ ratio: 1 }] },
    skills: [
      {
        id: 'chargeUp',
        name: '蓄力',
        cost: 15,
        description: '攻击力+30%，持续3回合',
        type: 'buff'
      },
      {
        id: 'bullRush',
        name: '冲撞',
        cost: 10,
        description: '150%攻击+15%最大生命的物理伤害，自损5%生命',
        type: 'attack'
      }
    ]
  },
  {
    id: 'assassin',
    name: '刺客',
    summary: '高爆发，普攻为100%物理，技能背刺与迅捷。',
    stats: {
      hp: { base: 60, per: 10 },
      attack: { base: 35, per: 4 },
      defense: { base: 10, per: 1.5 },
      resist: { base: 15, per: 1 },
      mana: { base: 60, per: 5 }
    },
    normalAttack: { type: 'physical', hits: [{ ratio: 1 }] },
    skills: [
      {
        id: 'backstab',
        name: '背刺',
        cost: 15,
        description: '两段85%攻击力的物理伤害',
        type: 'attack'
      },
      {
        id: 'nimble',
        name: '迅捷',
        cost: 10,
        description: '获得70%闪避，持续2回合',
        type: 'buff'
      }
    ]
  },
  {
    id: 'mage',
    name: '法师',
    summary: '法系爆发，普攻为两段55%法术伤害，技能毁灭与源泉。',
    stats: {
      hp: { base: 75, per: 10 },
      attack: { base: 20, per: 3 },
      defense: { base: 10, per: 1.5 },
      resist: { base: 40, per: 1.5 },
      mana: { base: 90, per: 5 }
    },
    normalAttack: {
      type: 'magic',
      hits: [
        { ratio: 0.55 },
        { ratio: 0.55 }
      ]
    },
    skills: [
      {
        id: 'meteor',
        name: '大荒星陨灭',
        cost: 70,
        description: '325%法术伤害，自身眩晕1回合',
        type: 'attack'
      },
      {
        id: 'lifeSpring',
        name: '生命源泉',
        cost: 20,
        description: '回复200%攻击力生命，生成100%攻击力护盾',
        type: 'support'
      }
    ]
  }
];

/* Potions and consumables */
const POTIONS = [
  {
    id: 'smallHealth',
    name: '小型生命药水',
    heal: 50,
    mana: 0,
    price: 25,
    description: '回复50点生命值。'
  },
  {
    id: 'largeHealth',
    name: '大型生命药水',
    heal: 150,
    mana: 0,
    price: 60,
    description: '回复150点生命值。'
  },
  {
    id: 'smallMana',
    name: '小型法力药水',
    heal: 0,
    mana: 30,
    price: 20,
    description: '回复30点蓝量。'
  },
  {
    id: 'largeMana',
    name: '大型法力药水',
    heal: 0,
    mana: 80,
    price: 50,
    description: '回复80点蓝量。'
  },
  {
    id: 'luckyPotion',
    name: '幸运药水',
    heal: 0,
    mana: 0,
    price: 60,
    description: '下一场战斗金币与经验+50%。',
    effect: 'luckyNextBattle'
  },
  {
    id: 'attributeBoost',
    name: '属性增强剂',
    heal: 0,
    mana: 0,
    price: 200,
    description: '永久提升5攻击或10最大生命。',
    effect: 'permanentChoice'
  }
];

/* Relic definitions */
const RELICS = [
  { id: 'warriorBadge', name: '勇士徽章', quality: 'common', description: '攻击力+15%' },
  { id: 'lifeAmulet', name: '生命护符', quality: 'common', description: '最大生命值+18%' },
  { id: 'sapphireRing', name: '蓝宝石戒指', quality: 'common', description: '最大蓝量+20%' },
  { id: 'ironBoots', name: '铁靴', quality: 'common', description: '防御力+15%' },
  { id: 'clothArmor', name: '布甲', quality: 'common', description: '法术抗性+10' },
  { id: 'luckyClover', name: '幸运四叶草', quality: 'common', description: '闪避率+5%' },
  { id: 'whetstone', name: '磨刀石', quality: 'common', description: '对高生命敌人伤害+25%' },
  { id: 'apprenticeNotes', name: '学徒笔记', quality: 'common', description: '经验获取+15%' },
  { id: 'critGloves', name: '暴击手套', quality: 'common', description: '暴击率+10%' },
  { id: 'regenRing', name: '回复戒指', quality: 'common', description: '战斗后回复5%最大生命' },
  { id: 'manaFlow', name: '法力流', quality: 'common', description: '战斗开始回复10点蓝量' },
  { id: 'thickHide', name: '厚皮', quality: 'common', description: '防御+18%，生命+5%' },
  { id: 'razorEdge', name: '锋锐', quality: 'common', description: '攻击+28%，防御-10%' },
  { id: 'explorerMap', name: '探险家地图', quality: 'common', description: '金币获得+10%' },
  {
    id: 'shieldEmitter',
    name: '小护盾发生器',
    quality: 'common',
    description: '战斗开始获得25%生命护盾，持续2回合'
  },
  {
    id: 'dragonScale',
    name: '龙鳞甲片',
    quality: 'rare',
    description: '防御+35，物理伤害无视15点防御'
  },
  {
    id: 'lichPhylactery',
    name: '巫妖的命匣',
    quality: 'rare',
    description: '法抗+15，击杀后回复敌人5%最大生命，并无视5点法抗'
  },
  {
    id: 'agileBoots',
    name: '灵巧靴',
    quality: 'rare',
    description: '闪避+10%，闪避后下次攻击伤害+60%'
  },
  {
    id: 'arcaneCodex',
    name: '奥术法典',
    quality: 'rare',
    description: '技能法术伤害+45%，命中后额外降低敌人10点法抗'
  },
  {
    id: 'berserkerSoul',
    name: '狂战士之魂',
    quality: 'rare',
    description: '每失去10%生命，攻击+8%'
  },
  {
    id: 'eliteHunter',
    name: '精英猎手',
    quality: 'rare',
    description: '对精英+40%伤害，对普通-10%'
  },
  {
    id: 'manaTide',
    name: '法力潮汐护符',
    quality: 'rare',
    description: '每回合回复20点蓝，造成法术伤害立刻回10点'
  },
  {
    id: 'bloodthirstBlade',
    name: '嗜血刀',
    quality: 'rare',
    description: '普通攻击吸血25%'
  },
  {
    id: 'thornArmor',
    name: '荆棘甲',
    quality: 'rare',
    description: '受到伤害反弹15%'
  },
  {
    id: 'wisdomBook',
    name: '智慧之书',
    quality: 'rare',
    description: '经验获取+35%'
  },
  {
    id: 'preemptiveStrike',
    name: '先发制人',
    quality: 'rare',
    description: '战斗开始40%概率眩晕敌人，30%概率使敌人攻击力-50%（2回合）'
  },
  {
    id: 'sourceOfLife',
    name: '生命之源',
    quality: 'rare',
    description: '治疗效果+35%'
  },
  {
    id: 'fortress',
    name: '坚固壁垒',
    quality: 'rare',
    description: '防御+35%，生命+25%，攻击-5%'
  },
  {
    id: 'heartOfRage',
    name: '狂怒之心',
    quality: 'rare',
    description: '攻击+120%，生命+55%，防御与法抗归零'
  },
  {
    id: 'adventureMap',
    name: '冒险者的地图',
    quality: 'rare',
    description: '战斗概率+25%，经验+20%，5%概率提升掉落品质'
  },
  {
    id: 'merchantFriend',
    name: '商人之友',
    quality: 'rare',
    description: '战斗概率-30%，非战斗获得等级×5奖励，商店-25%'
  },
  {
    id: 'energyShield',
    name: '能量护盾',
    quality: 'rare',
    description: '每场战斗获得45%生命护盾，持续3回合'
  },
  {
    id: 'luckyDice',
    name: '幸运骰子',
    quality: 'rare',
    description: '战斗开始随机获得攻击/防御/生命增益'
  },
  {
    id: 'shadowCloak',
    name: '暗影斗篷',
    quality: 'rare',
    description: '闪避+20%，闪避后获得30%生命护盾'
  },
  {
    id: 'revengeSpirit',
    name: '复仇之魂',
    quality: 'rare',
    description: '生命低于30%时攻击+100%，暴击+20%'
  },
  {
    id: 'timeHourglass',
    name: '时间沙漏',
    quality: 'epic',
    description: '死亡时满状态复活一次'
  },
  {
    id: 'immortalWard',
    name: '不朽之守护',
    quality: 'epic',
    description: '首次致命伤害保留1血并获得护盾与攻击增益'
  },
  {
    id: 'elementHeart',
    name: '元素之心',
    quality: 'epic',
    description: '攻击+25%，造成伤害有15%概率附加60%法术伤害，并降低敌人15点法抗、20点攻击'
  },
  {
    id: 'deathEye',
    name: '死神之眼',
    quality: 'epic',
    description: '暴击+15%，暴击伤害+80%'
  },
  {
    id: 'warBanner',
    name: '战争旗帜',
    quality: 'epic',
    description: '攻击+90%，暴击+45%，生命-20%'
  },
  {
    id: 'frostCore',
    name: '冰霜之核',
    quality: 'epic',
    description: '受击时30%概率冰冻敌人'
  },
  {
    id: 'sunEmblem',
    name: '太阳徽章',
    quality: 'epic',
    description: '每回合开始对敌人造成45%攻击力法术伤害'
  },
  {
    id: 'chaosRing',
    name: '混沌戒指',
    quality: 'epic',
    description: '战斗开始降低敌人15%全属性'
  },
  {
    id: 'bloodPrince',
    name: '吸血亲王',
    quality: 'epic',
    description: '所有伤害40%吸血，对精英与Boss减半'
  },
  {
    id: 'destiny',
    name: '天命',
    quality: 'epic',
    description: '暴击+20%，暴击后附带10%当前生命的法术伤害'
  },
  {
    id: 'epiphanyCrystal',
    name: '顿悟结晶',
    quality: 'legendary',
    description: '全属性+10%，立刻升10级，升级经验固定150'
  },
  {
    id: 'ruination',
    name: '破败',
    quality: 'legendary',
    description: '攻击附带8%最大生命的法术伤害，并降低敌人50点防御'
  },
  {
    id: 'genesisStaff',
    name: '创世之杖',
    quality: 'legendary',
    description: '法术伤害+40%，忽视30%法抗，技能20%概率释放两次'
  },
  {
    id: 'greed',
    name: '贪婪',
    quality: 'legendary',
    description: '金币+100%，商店-50%，每100金币攻击+1%（至多600%）'
  },
  {
    id: 'omniRing',
    name: '全能戒指',
    quality: 'legendary',
    description: '所有属性+15%，战斗开始获得随机2个史诗效果'
  },
  {
    id: 'steelResolve',
    name: '钢铁心志',
    quality: 'rare',
    description: '致命伤害时若生命≥40%，保留1点生命并回复20%，冷却4场战斗'
  },
  {
    id: 'eternalEmber',
    name: '永燃余烬',
    quality: 'rare',
    description: '法术或技能命中后回复5%生命，并为下一次受到的伤害提供10%减免，可叠至30%'
  },
  {
    id: 'starlitBastion',
    name: '星辉壁垒',
    quality: 'epic',
    description: '入场获得60%生命护盾，护盾存在时所受暴击被转为普通伤害并额外-15%'
  },
  {
    id: 'destinyAegis',
    name: '命运庇佑',
    quality: 'legendary',
    description: '战斗开始获得3次绝境抵挡，每次将伤害上限限定为当前生命的30%，耗尽后恢复满血并清除一个负面状态'
  },
  {
    id: 'dreamRelic',
    name: '梦奇物',
    quality: 'legendary',
    description: '每回合随机释放一个技能（蓝量消耗减半）'
  },
  {
    id: 'blackTulip',
    name: '黑色郁金香',
    quality: 'epic',
    description: '未释放技能的回合结束后，下一次技能获得+30%攻击（可叠至120%），释放技能时清零并享受加成'
  }
];

/* Relic mechanical effects subset (not every nuance is automated, but core bonuses are captured) */
const RELIC_EFFECTS = {
  warriorBadge: { attackPercent: 0.15 },
  lifeAmulet: { hpPercent: 0.18 },
  sapphireRing: { manaPercent: 0.2 },
  ironBoots: { defensePercent: 0.15 },
  clothArmor: { resistFlat: 10 },
  luckyClover: { dodgeChance: 0.05 },
  whetstone: { highHpBonus: 0.25 },
  apprenticeNotes: { expBonus: 0.15 },
  critGloves: { critChance: 0.1 },
  regenRing: { postBattleHeal: 0.05 },
  manaFlow: { battleStartMana: 10 },
  thickHide: { defensePercent: 0.18, hpPercent: 0.05 },
  razorEdge: { attackPercent: 0.28, defensePercent: -0.1 },
  explorerMap: { goldBonus: 0.1 },
  shieldEmitter: { battleShieldPercent: 0.25, battleShieldDuration: 2 },
  dragonScale: { defenseFlat: 35, armorPen: 15 },
  lichPhylactery: { resistFlat: 15, healOnKill: 0.05, magicPenFlat: 5 },
  agileBoots: { dodgeChance: 0.1, empowerOnDodge: 0.6 },
  arcaneCodex: { skillMagicBonus: 0.45, skillResistShred: 10 },
  berserkerSoul: { berserkerStacks: true },
  eliteHunter: { damageVsElite: 0.4, damageVsNormal: -0.1 },
  manaTide: { manaPerTurn: 20, spellManaRefund: 10 },
  bloodthirstBlade: { basicAttackLeech: 0.25 },
  thornArmor: { thornsPercent: 0.15 },
  wisdomBook: { expBonus: 0.35 },
  preemptiveStrike: { battleStartStunChance: 0.4, preemptiveWeakenChance: 0.3 },
  sourceOfLife: { healingBonus: 0.35 },
  fortress: { defensePercent: 0.35, hpPercent: 0.25, attackPercent: -0.05 },
  heartOfRage: { attackPercent: 1.2, hpPercent: 0.55, nullifyDefense: true },
  adventureMap: { roamBattleDelta: 0.25, battleExpBonus: 0.2, dropUpgradeChance: 0.05 },
  merchantFriend: { roamBattleDelta: -0.3, nonBattleReward: true, shopDiscount: 0.25 },
  energyShield: { battleShieldPercent: 0.45, battleShieldDuration: 3 },
  luckyDice: { randomBattleBuff: true },
  shadowCloak: { dodgeChance: 0.2, shieldOnDodge: 0.3 },
  revengeSpirit: { lowHpBuff: true },
  timeHourglass: { deathSave: 'fullRevive' },
  immortalWard: { deathSave: 'immortalWard' },
  elementHeart: {
    attackPercent: 0.25,
    bonusMagicProc: { chance: 0.15, ratio: 0.6 },
    elementHeartDebuff: true
  },
  deathEye: { critChance: 0.15, critDamage: 0.8 },
  warBanner: { attackPercent: 0.9, critChance: 0.45, hpPercent: -0.2 },
  frostCore: { freezeOnHit: 0.3 },
  sunEmblem: { turnStartMagic: 0.45 },
  chaosRing: { enemyWeakenPercent: 0.15 },
  bloodPrince: { lifeSteal: 0.4 },
  destiny: { critChance: 0.2, destinyProc: true },
  epiphanyCrystal: { allStatsPercent: 0.1, xpFixed: 1500, bonusLevels: 10 },
  ruination: { ruinDamage: 0.08, defenseShred: 50 },
  genesisStaff: { magicDamageBonus: 0.4, magicPenPercent: 0.3, skillDoubleChance: 0.2 },
  greed: { goldBonus: 1.0, shopDiscount: 0.5, greedAttack: true },
  omniRing: { allStatsPercent: 0.15, epicBorrowCount: 2 },
  dreamRelic: { dreamCaster: true },
  blackTulip: { blackTulip: true },
  steelResolve: { steelResolve: true },
  eternalEmber: { eternalEmber: true },
  starlitBastion: { starlitBastion: true },
  destinyAegis: { destinyWard: 3 }
};

/* Enemy pools */
const NORMAL_ENEMIES = [
  {
    id: 'stoneGuardian',
    name: '顽石守卫',
    description: '每回合获得10%生命护盾',
    baseRewards: { exp: { base: 30, per: 6 }, gold: { base: 15, per: 4 } },
    stats: (L) => ({
      hp: Math.floor(30 + 12 * L + 18 * Math.pow(1.06, L)),
      attack: Math.floor(10 + 3.5 * L + 4 * Math.pow(1.07, L)),
      defense: Math.floor(10 + 2.2 * Math.pow(1.04, L)),
      resist: Math.floor(3 + 1.2 * L),
      type: 'physical'
    }),
    onTurnStart: (enemy) => {
      const shieldGain = Math.floor(enemy.maxHp * 0.1);
      enemy.shield = (enemy.shield || 0) + shieldGain;
      pushBattleLog(`顽石守卫硬化皮肤，获得${shieldGain}点护盾。`);
    }
  },
  {
    id: 'shadowBat',
    name: '影蝠',
    description: '普通攻击吸血30%',
    baseRewards: { exp: { base: 28, per: 9 }, gold: { base: 22, per: 6 } },
    stats: (L) => ({
      hp: Math.floor(30 + 10 * L + 16 * Math.pow(1.07, L)),
      attack: Math.floor(14 + 3.2 * L + 5 * Math.pow(1.08, L)),
      defense: Math.floor(2 + 2 * Math.pow(1.04, L)),
      resist: Math.floor(8 + 1.6 * L),
      type: 'magic'
    }),
    lifeSteal: 0.3
  },
  {
    id: 'elementSprite',
    name: '元素精灵',
    description: '施放120%攻击力的法术。',
    baseRewards: { exp: { base: 35, per: 7 }, gold: { base: 20, per: 6 } },
    stats: (L) => ({
      hp: Math.floor(15 + 6 * L + 15 * Math.pow(1.07, L)),
      attack: Math.floor(4 + 2.5 * L + 5 * Math.pow(1.08, L)),
      defense: Math.floor(1 + 1.8 * Math.pow(1.04, L)),
      resist: Math.floor(8 + 3 * L),
      type: 'magic',
      modifier: 1.2
    })
  },
  {
    id: 'caveTroll',
    name: '洞穴巨魔',
    description: '血量低于50%攻击提升。',
    baseRewards: { exp: { base: 45, per: 11 }, gold: { base: 28, per: 8 } },
    stats: (L) => ({
      hp: Math.floor(40 + 10 * L + 30 * Math.pow(1.07, L)),
      attack: Math.floor(10 + 4.2 * L + 7 * Math.pow(1.07, L)),
      defense: Math.floor(5 + 2.4 * Math.pow(1.04, L)),
      resist: Math.floor(1 + 1.1 * L),
      type: 'physical'
    }),
    frenzyThreshold: 0.5,
    frenzyBoost: 0.5
  }
];

const ELITE_ENEMIES = [
  {
    id: 'chestMimic',
    name: '宝箱怪',
    description: '首回合惊喜一击，死亡掉落翻倍金币。',
    baseRewards: { exp: { base: 90, per: 18 }, gold: { base: 90, per: 18 } },
    stats: (L) => ({
      hp: Math.floor(40 + 32 * L + 40 * Math.pow(1.08, L)),
      attack: Math.floor(16 + 3.5 * L + 8 * Math.pow(1.1, L)),
      defense: Math.floor(24 + 2.4 * Math.pow(1.05, L)),
      resist: Math.floor(28 + 2.5 * L),
      type: 'physical'
    }),
    openingStrike: true,
    bonusGold: 1
  },
  {
    id: 'fallenMage',
    name: '堕落法师',
    description: '双段奥术飞弹并有法力护盾。',
    baseRewards: { exp: { base: 110, per: 20 }, gold: { base: 70, per: 14 } },
    stats: (L) => ({
      hp: Math.floor(25 + 28 * L + 32 * Math.pow(1.08, L)),
      attack: Math.floor(12 + 3.5 * L + 9 * Math.pow(1.1, L)),
      defense: Math.floor(30 + 1.8 * Math.pow(1.04, L)),
      resist: Math.floor(45 + 3.2 * L),
      type: 'magic',
      hits: 2,
      modifier: 0.8
    }),
    manaShield: true
  }
];

const TREASURE_GUARD = {
  id: 'treasureGuard',
  name: '宝藏守卫',
  description: '守卫宝藏，防御极高。',
  baseRewards: { exp: { base: 55, per: 14 }, gold: { base: 45, per: 15 } },
  stats: (L) => ({
    hp: 60 + 30 * L,
    attack: 12 + 2 * L,
    defense: 18 + 2 * L,
    resist: 18 + 2 * L,
    type: 'physical'
  })
};

const HEART_DEMON = {
  id: 'heartDemon',
  name: '心魔幻影',
  description: '复制玩家属性的最终考验。',
  baseRewards: { exp: { base: 200, per: 0 }, gold: { base: 200, per: 0 } },
  stats: (player) => {
    const L = player.level;
    return {
      hp: Math.floor(player.stats.maxHp * 1.2 + 0.8 * L),
      attack: Math.floor(player.stats.attack * 1.1 + 0.4 * L),
      defense: Math.floor(player.stats.defense + 0.2 * L),
      resist: Math.floor(player.stats.resist + 0.2 * L),
      type: 'mirror'
    };
  }
};

/* Events */
const EVENT_DEFS = [
  {
    id: 'forkInRoad',
    name: '命运的岔路口',
    description: '左路喧嚣，右路宁静，只出现一次。',
    once: true,
    options: [
      {
        id: 'left',
        label: '走左路（获得冒险者的地图）',
        resolve: (state) => grantRelic(state, 'adventureMap')
      },
      {
        id: 'right',
        label: '走右路（获得商人之友）',
        resolve: (state) => grantRelic(state, 'merchantFriend')
      }
    ]
  },
  {
    id: 'lostMerchant',
    name: '迷路的商人',
    description: '一位商人需要帮助。',
    options: [
      {
        id: 'help',
        label: '帮助修理（-50金币，随机普通藏品）',
        resolve: (state) => {
          if (state.player.gold < 50) {
            pushLog('金币不足，无法帮助。');
            return false;
          }
          state.player.gold -= 50;
          rollRelicDrop(state, 'common');
          return true;
        }
      },
      {
        id: 'rob',
        label: '趁火打劫（进行战斗）',
        resolve: (state) => startBattle(state, spawnEnemyFrom({
          name: '商人的保镖',
          stats: (L) => ({
            hp: 45 + 18 * L,
            attack: 12 + 2 * L,
            defense: 12 + 2 * L,
            resist: 12 + 2 * L,
            type: 'physical'
          }),
          baseRewards: { exp: { base: 40, per: 10 }, gold: { base: 200, per: 0 } }
        }))
      },
      {
        id: 'ignore',
        label: '无视离开',
        resolve: () => true
      }
    ]
  },
  {
    id: 'ancientAltar',
    name: '古代祭坛',
    description: '微光闪烁的祭坛。',
    options: [
      {
        id: 'sacrifice',
        label: '献祭金币（-100）换取随机祝福',
        resolve: (state) => {
          if (state.player.gold < 100) {
            pushLog('金币不足，献祭失败。');
            return false;
          }
          state.player.gold -= 100;
          if (Math.random() < 0.5) {
            addTemporaryBuff(state, { type: 'attack', value: 0.2, duration: 1 });
            pushLog('获得临时攻击加成！');
          } else {
            state.player.permanent.hpFlat += 10;
            pushLog('最大生命永久+10。');
          }
          updatePlayerStats(state);
          return true;
        }
      },
      {
        id: 'drain',
        label: '汲取能量（基于等级判定）',
        resolve: (state) => {
          const success = Math.random() < clamp(state.player.level / 10, 0.2, 0.9);
          if (success) {
            state.player.permanent.manaFlat += 20;
            pushLog('蓝量上限+20。');
            updatePlayerStats(state);
          } else {
            applyDamageToPlayer(state, 50);
            state.player.statuses.push({ type: 'manaDisorder', duration: 3 });
            pushLog('能量反噬，受到伤害并陷入法力紊乱。');
          }
          return true;
        }
      },
      {
        id: 'destroy',
        label: '摧毁祭坛并战斗',
        resolve: (state) =>
          startBattle(state, spawnEnemyFrom({
            name: '祭坛守护者',
            stats: (L) => ({
              hp: 55 + 20 * L,
              attack: 10 + 2 * L,
              defense: 15 + 2 * L,
              resist: 15 + 2 * L,
              type: 'physical'
            }),
            baseRewards: { exp: { base: 70, per: 15 }, gold: { base: 60, per: 15 } },
            guaranteedRelic: 'rare'
          }))
      }
    ]
  },
  {
    id: 'woundedAdventurer',
    name: '受伤的冒险者',
    description: '一位冒险者请求帮助。',
    options: [
      {
        id: 'givePotion',
        label: '给予小型生命药水换取大量奖励',
        resolve: (state) => {
          if (!consumePotion(state, 'smallHealth')) {
            pushLog('没有多余的小型生命药水。');
            return false;
          }
          const reward = 80 + state.player.level * 10;
          gainExperience(state, reward);
          addGold(state, reward);
          pushLog(`获得${reward}经验与金币。`);
          return true;
        }
      },
      {
        id: 'refuse',
        label: '拒绝离开',
        resolve: () => true
      },
      {
        id: 'steal',
        label: '抢夺财物（得普通藏品与金币，但获得debuff）',
        resolve: (state) => {
          rollRelicDrop(state, 'common');
          addGold(state, 60);
          state.player.statuses.push({ type: 'guilt', duration: 3 });
          pushLog('良心不安，接下来三场战斗攻击-10%。');
          return true;
        }
      }
    ]
  },
  {
    id: 'fateFountain',
    name: '命运之泉',
    description: '窥视命运的泉水',
    options: [
      {
        id: 'draw',
        label: '饮下泉水（随机效果）',
        resolve: (state) => {
          const outcomes = [
            () => rollRelicDrop(state, 'rare'),
            () => removeRandomRelic(state),
            () => resetPlayerBonuses(state),
            () => {
              state.player.level += 1;
              pushLog('直接提升一级！');
              onLevelUp(state);
            }
          ];
          randomChoice(outcomes)();
          return true;
        }
      }
    ]
  },
  {
    id: 'cursedChest',
    name: '被诅咒的宝箱',
    description: '刻着警告文字的宝箱。',
    options: [
      {
        id: 'forceOpen',
        label: '强行打开（50%史诗，50%诅咒）',
        resolve: (state) => {
          if (Math.random() < 0.5) {
            rollRelicDrop(state, 'epic');
          } else {
            state.player.statuses.push({ type: 'curse', duration: 3 });
            pushLog('诅咒缠身，三回合内受到伤害+20%。');
          }
          return true;
        }
      },
      {
        id: 'mageOption',
        label: '魔法侦测（法师专属）',
        resolve: (state) => {
          if (state.player.heroId !== 'mage') {
            pushLog('只有法师可以安全侦测。');
            return false;
          }
          rollRelicDrop(state, 'rare');
          return true;
        }
      },
      {
        id: 'assassinOption',
        label: '技巧开锁（刺客专属）',
        resolve: (state) => {
          if (state.player.heroId !== 'assassin') {
            pushLog('只有刺客可以开锁。');
            return false;
          }
          rollRelicDrop(state, 'rare');
          addGold(state, 100);
          return true;
        }
      },
      {
        id: 'leave',
        label: '离开',
        resolve: () => true
      }
    ]
  },
  {
    id: 'timeRift',
    name: '时光裂隙',
    description: '扭曲的时空裂隙。',
    options: [
      {
        id: 'jump',
        label: '跳入裂隙（回溯3场战斗）',
        resolve: (state) => {
          pushLog('时光倒流，部分战利品重置。');
          state.history = state.history.slice(0, Math.max(0, state.history.length - 3));
          return true;
        }
      },
      {
        id: 'absorb',
        label: '汲取能量（大量经验，20%失去藏品）',
        resolve: (state) => {
          gainExperience(state, 150 + state.player.level * 30);
          if (Math.random() < 0.2) {
            removeRandomRelic(state);
          }
          return true;
        }
      },
      {
        id: 'seal',
        label: '封印裂隙并战斗',
        resolve: (state) =>
          startBattle(state, spawnEnemyFrom({
            name: '时空守护者',
            stats: (L) => ({
              hp: 65 + 25 * L,
              attack: 12 + 2 * L,
              defense: 18 + 2 * L,
              resist: 18 + 2 * L,
              type: 'magic'
            }),
            baseRewards: { exp: { base: 120, per: 20 }, gold: { base: 90, per: 18 } },
            guaranteedRelicId: 'timeHourglass'
          }))
      }
    ]
  }
];

/* Game state */
const defaultState = () => ({
  player: null,
  encounter: null,
  log: [],
  history: [],
  flags: {
    firstEventShown: false,
    meditationRisk: false,
    epiphanyGranted: false
  }
});

let gameState = defaultState();

/* UI references */
const heroModal = document.getElementById('hero-modal');
const heroOptionsContainer = document.getElementById('hero-options');
const playerSummary = document.getElementById('player-summary');
const hpBar = document.getElementById('hp-bar');
const hpText = document.getElementById('hp-text');
const mpBar = document.getElementById('mp-bar');
const mpText = document.getElementById('mp-text');
const xpBar = document.getElementById('xp-bar');
const xpText = document.getElementById('xp-text');
const coreStats = document.getElementById('core-stats');
const goldValue = document.getElementById('gold-value');
const relicCount = document.getElementById('relic-count');
const potionCount = document.getElementById('potion-count');
const encounterTitle = document.getElementById('encounter-title');
const encounterContent = document.getElementById('encounter-content');
const logEntries = document.getElementById('log-entries');
const bagPanel = document.getElementById('bag-panel');
const bagPotions = document.getElementById('bag-potions');
const bagRelics = document.getElementById('bag-relics');
const overlayModal = document.getElementById('overlay-modal');
const overlayBody = document.getElementById('overlay-body');
const statusFlags = document.getElementById('status-flags');

/* Initialization */
function init() {
  renderHeroOptions();
  attachHandlers();
  updateUI();
}

function attachHandlers() {
  document.getElementById('reset-btn').addEventListener('click', () => {
    gameState = defaultState();
    heroModal.classList.add('visible');
    closeBag();
    closeOverlay();
    updateUI();
  });

  document.getElementById('bag-btn').addEventListener('click', () => {
    if (!gameState.player) return;
    bagPanel.classList.add('visible');
    renderBag();
  });

  document.getElementById('bag-close').addEventListener('click', closeBag);
  document.getElementById('overlay-close').addEventListener('click', closeOverlay);

  document.getElementById('roam-btn').addEventListener('click', () => {
    if (!ensurePlayer()) return;
    if (gameState.encounter?.type === 'battle') {
      pushLog('战斗中无法游荡。');
      return;
    }
    handleRoam();
  });

  document.getElementById('meditate-btn').addEventListener('click', () => {
    if (!ensurePlayer()) return;
    if (gameState.encounter?.type === 'battle') {
      pushLog('战斗中无法打坐。');
      return;
    }
    handleMeditate();
  });
}

function ensurePlayer() {
  if (!gameState.player) {
    pushLog('请先选择职业。');
    heroModal.classList.add('visible');
    return false;
  }
  return true;
}

function renderHeroOptions() {
  heroOptionsContainer.innerHTML = '';
  HEROES.forEach((hero) => {
    const card = document.createElement('article');
    card.className = 'hero-card';
    card.innerHTML = `
      <h3>${hero.name}</h3>
      <p>${hero.summary}</p>
      <ul>
        <li>生命：${hero.stats.hp.base} + ${hero.stats.hp.per} /级</li>
        <li>攻击：${hero.stats.attack.base} + ${hero.stats.attack.per} /级</li>
        <li>技能一：${hero.skills[0].name}</li>
        <li>技能二：${hero.skills[1].name}</li>
      </ul>
    `;
    const btn = document.createElement('button');
    btn.className = 'primary';
    btn.textContent = `选择${hero.name}`;
    btn.addEventListener('click', () => selectHero(hero.id));
    card.appendChild(btn);
    heroOptionsContainer.appendChild(card);
  });
}

function selectHero(heroId) {
  const hero = HEROES.find((h) => h.id === heroId);
  if (!hero) return;
  const player = {
    heroId,
    heroName: hero.name,
    level: 1,
    xp: 0,
    xpNeeded: levelRequirement(1),
    gold: 120,
    maxLuckyBonus: false,
    permanent: {
      hpFlat: 0,
      attackFlat: 0,
      defenseFlat: 0,
      manaFlat: 0,
      resistFlat: 0
    },
    statuses: [],
    stats: {
      maxHp: 0,
      attack: 0,
      defense: 0,
      resist: 0,
      maxMana: 0,
      critChance: 0.05,
      critDamage: 0.5,
      dodge: 0,
      lifeSteal: 0
    },
    currentHp: 0,
    currentMana: 0,
    shield: 0,
    inventory: {
      potions: {
        smallHealth: 4,
        smallMana: 4
      },
      relics: []
    },
    temporary: {},
    cooldowns: {},
    pendingDamageReduction: 0,
    pendingBuffs: [],
    blackTulipStacks: 0,
    usedManualSkillThisTurn: false,
    usedManualSkillLastTurn: false
  };
  gameState.player = player;
  updatePlayerStats(gameState);
  player.currentHp = player.stats.maxHp;
  player.currentMana = player.stats.maxMana;
  heroModal.classList.remove('visible');
  pushLog(`你以${hero.name}身份踏上旅程。`);
  updateUI();
}

/* Player stat calculations */
function updatePlayerStats(state) {
  if (!state.player) return;
  const hero = HEROES.find((h) => h.id === state.player.heroId);
  if (!hero) return;
  const { level } = state.player;
  const derived = {};
  const applyFormula = (stat) =>
    Math.floor(hero.stats[stat].base + hero.stats[stat].per * level);
  derived.maxHp = applyFormula('hp') + state.player.permanent.hpFlat;
  derived.attack = applyFormula('attack') + state.player.permanent.attackFlat;
  derived.defense = applyFormula('defense') + state.player.permanent.defenseFlat;
  derived.resist = applyFormula('resist') + state.player.permanent.resistFlat;
  derived.maxMana = applyFormula('mana') + state.player.permanent.manaFlat;
  derived.critChance = 0.05;
  derived.critDamage = 0.5;
  derived.dodge = 0;
  derived.lifeSteal = 0;

  const relicMods = aggregateRelicBonuses(state.player);
  const statKeys = ['maxHp', 'attack', 'defense', 'resist', 'maxMana'];
  statKeys.forEach((key) => {
    const percentKey = key === 'maxHp' ? 'hpPercent' : key === 'attack' ? 'attackPercent' : key === 'defense' ? 'defensePercent' : key === 'resist' ? 'resistPercent' : 'manaPercent';
    const flatKey = key === 'maxHp' ? 'hpFlat' : key === 'attack' ? 'attackFlat' : key === 'defense' ? 'defenseFlat' : key === 'resist' ? 'resistFlat' : 'manaFlat';
    const percentBonus = relicMods[percentKey] || 0;
    const flatBonus = relicMods[flatKey] || 0;
    derived[key] = Math.floor(derived[key] * (1 + percentBonus) + flatBonus);
  });

  if (relicMods.allStatsPercent) {
    statKeys.forEach((key) => {
      derived[key] = Math.floor(derived[key] * (1 + relicMods.allStatsPercent));
    });
  }

  if (relicMods.nullifyDefense) {
    derived.defense = 0;
    derived.resist = 0;
  }

  if (relicMods.greedyAttackBonus) {
    derived.attack = Math.floor(derived.attack * (1 + relicMods.greedyAttackBonus));
  }

  derived.critChance += relicMods.critChance || 0;
  derived.critDamage += relicMods.critDamage || 0;
  derived.dodge += relicMods.dodgeChance || 0;
  derived.lifeSteal += relicMods.lifeSteal || 0;
  state.player.stats = derived;
  state.player.stats.armorPen = relicMods.armorPen || 0;
  state.player.stats.skillMagicBonus = relicMods.skillMagicBonus || 0;
  state.player.stats.damageVsElite = relicMods.damageVsElite || 0;
  state.player.stats.damageVsNormal = relicMods.damageVsNormal || 0;
  state.player.stats.manaPerTurn = relicMods.manaPerTurn || 0;
  state.player.stats.spellManaRefund = relicMods.spellManaRefund || 0;
  state.player.stats.berserker = relicMods.berserkerStacks || false;
  state.player.stats.healingBonus = relicMods.healingBonus || 0;
  state.player.stats.randomBattleBuff = relicMods.randomBattleBuff || false;
  state.player.stats.empowerOnDodge = relicMods.empowerOnDodge || 0;
  state.player.stats.shieldOnDodge = relicMods.shieldOnDodge || 0;
  state.player.stats.lowHpBuff = relicMods.lowHpBuff || false;
  state.player.stats.turnStartMagic = relicMods.turnStartMagic || 0;
  state.player.stats.freezeOnHit = relicMods.freezeOnHit || 0;
  state.player.stats.destinyProc = relicMods.destinyProc || false;
  state.player.stats.bonusMagicProc = relicMods.bonusMagicProc;
  state.player.stats.skillDoubleChance = relicMods.skillDoubleChance || 0;
  state.player.stats.magicDamageBonus = relicMods.magicDamageBonus || 0;
  state.player.stats.battleShield = {
    percent: relicMods.battleShieldPercent || 0,
    duration: relicMods.battleShieldDuration || 0
  };
  state.player.stats.battleStartMana = relicMods.battleStartMana || 0;
  state.player.stats.battleStartStunChance = relicMods.battleStartStunChance || 0;
  state.player.stats.enemyWeakenPercent = relicMods.enemyWeakenPercent || 0;
  state.player.stats.dropUpgradeChance = relicMods.dropUpgradeChance || 0;
  state.player.stats.battleExpBonus = relicMods.battleExpBonus || 0;
  state.player.stats.roamBattleDelta = relicMods.roamBattleDelta || 0;
  state.player.stats.nonBattleReward = relicMods.nonBattleReward || false;
  state.player.stats.shopDiscount = relicMods.shopDiscount || 0;
  state.player.stats.goldBonus = relicMods.goldBonus || 0;
  state.player.stats.expBonus = relicMods.expBonus || 0;
  state.player.stats.postBattleHeal = relicMods.postBattleHeal || 0;
  state.player.stats.healOnKill = relicMods.healOnKill || 0;
  state.player.stats.basicAttackLeech = relicMods.basicAttackLeech || 0;
  state.player.stats.thornsPercent = relicMods.thornsPercent || 0;
  state.player.stats.highHpBonus = relicMods.highHpBonus || 0;
  state.player.stats.lifeSteal += relicMods.lifeSteal || 0;
  state.player.stats.ruinDamage = relicMods.ruinDamage || 0;
  state.player.stats.epicBorrowCount = relicMods.epicBorrowCount || 0;
  state.player.stats.xpFixed = relicMods.xpFixed || null;
  state.player.stats.magicPenFlat = relicMods.magicPenFlat || 0;
  state.player.stats.magicPenPercent = relicMods.magicPenPercent || 0;
  state.player.stats.skillResistShred = relicMods.skillResistShred || 0;
  state.player.stats.elementHeartDebuff = !!relicMods.elementHeartDebuff;
  state.player.stats.ruinDefenseShred = relicMods.defenseShred || 0;
  state.player.stats.preemptiveWeakenChance = relicMods.preemptiveWeakenChance || 0;
  state.player.stats.dreamRelic = !!relicMods.dreamCaster;
  state.player.stats.blackTulip = !!relicMods.blackTulip;
  state.player.stats.steelResolve = !!relicMods.steelResolve;
  state.player.stats.eternalEmber = !!relicMods.eternalEmber;
  state.player.stats.starlitBastion = !!relicMods.starlitBastion;
  state.player.stats.destinyWard = relicMods.destinyWard || 0;
}

function aggregateRelicBonuses(player) {
  const mods = {};
  let greedyAttackBonus = 0;
  player.inventory.relics.forEach((entry) => {
    const effect = RELIC_EFFECTS[entry.id];
    if (!effect) return;
    Object.entries(effect).forEach(([key, value]) => {
      if (['bonusLevels'].includes(key)) return;
      if (typeof value === 'number') {
        mods[key] = (mods[key] || 0) + value;
      } else if (typeof value === 'object') {
        mods[key] = value;
      } else {
        mods[key] = value;
      }
    });
    if (effect.greedyAttack) {
      const bonus = clamp(Math.floor(player.gold / 100) * 0.01, 0, 0.6);
      greedyAttackBonus = Math.max(greedyAttackBonus, bonus);
    }
  });
  mods.greedyAttackBonus = greedyAttackBonus;
  return mods;
}

/* UI rendering */
function updateUI() {
  renderPlayerPanel();
  renderEncounter();
  renderLog();
  renderBag();
}

function renderPlayerPanel() {
  const player = gameState.player;
  if (!player) {
    playerSummary.textContent = '尚未创建角色';
    hpBar.style.width = '0%';
    hpText.textContent = '0 / 0';
    mpBar.style.width = '0%';
    mpText.textContent = '0 / 0';
    xpBar.style.width = '0%';
    xpText.textContent = '0 / 0';
    coreStats.innerHTML = '';
    goldValue.textContent = '0';
    relicCount.textContent = '0';
    potionCount.textContent = '0';
    statusFlags.textContent = '';
    return;
  }
  const stats = player.stats;
  playerSummary.textContent = `${player.heroName} · 等级${player.level}`;
  hpBar.style.width = `${(player.currentHp / stats.maxHp) * 100}%`;
  hpText.textContent = `${player.currentHp} / ${stats.maxHp}`;
  mpBar.style.width = `${(player.currentMana / stats.maxMana) * 100}%`;
  mpText.textContent = `${player.currentMana} / ${stats.maxMana}`;
  xpBar.style.width = `${(player.xp / player.xpNeeded) * 100}%`;
  xpText.textContent = `${player.xp} / ${player.xpNeeded}`;

  coreStats.innerHTML = `
    <div><span>攻击力</span><strong>${stats.attack}</strong></div>
    <div><span>防御力</span><strong>${stats.defense}</strong></div>
    <div><span>法术抗性</span><strong>${stats.resist}</strong></div>
    <div><span>暴击率</span><strong>${Math.round(stats.critChance * 100)}%</strong></div>
    <div><span>暴击伤害</span><strong>${Math.round((stats.critDamage + 1) * 100)}%</strong></div>
    <div><span>闪避率</span><strong>${Math.round(stats.dodge * 100)}%</strong></div>
  `;

  goldValue.textContent = player.gold;
  relicCount.textContent = player.inventory.relics.length;
  const potionTotal = Object.values(player.inventory.potions).reduce(
    (sum, val) => sum + val,
    0
  );
  potionCount.textContent = potionTotal;
  const activeStatuses = player.statuses
    .filter((s) => s.duration && s.duration > 0)
    .map((s) => s.type);
  statusFlags.textContent = activeStatuses.length
    ? `状态：${activeStatuses.join('、')}`
    : '';
}

function renderEncounter() {
  const encounter = gameState.encounter;
  if (!gameState.player) {
    encounterTitle.textContent = '等待选择职业...';
    encounterContent.innerHTML = '';
    return;
  }
  if (!encounter) {
    encounterTitle.textContent = '平静的营地';
    encounterContent.innerHTML =
      '<p>可以游荡寻找战斗、前往商店、触发事件，或是打坐恢复。</p>';
    return;
  }
  encounterTitle.textContent = encounter.title || '未知遭遇';
  encounterContent.innerHTML = '';
  if (encounter.type === 'battle') {
    renderBattle(encounterContent);
  } else if (encounter.type === 'shop') {
    renderShop(encounterContent, encounter);
  } else if (encounter.type === 'event') {
    renderEvent(encounterContent, encounter);
  } else if (encounter.type === 'chest') {
    renderChest(encounterContent, encounter);
  }
}

function renderBattle(container) {
  const template = document.getElementById('battle-template');
  const node = template.content.cloneNode(true);
  const enemy = gameState.encounter.enemy;
  node.getElementById('enemy-name').textContent = enemy.name;
  const hpRatio = enemy.currentHp / enemy.maxHp;
  node.getElementById('enemy-hp-bar').style.width = `${hpRatio * 100}%`;
  node.getElementById('enemy-hp-text').textContent = `${enemy.currentHp} / ${enemy.maxHp}`;
  node.getElementById('enemy-stats').innerHTML = `
    <li>攻击 ${enemy.attack}</li>
    <li>防御 ${enemy.defense}</li>
    <li>法抗 ${enemy.resist}</li>
  `;
  node.querySelectorAll('.battle-actions button').forEach((btn) => {
    btn.addEventListener('click', () => handleBattleAction(btn.dataset.action));
  });
  container.appendChild(node);
}

function renderShop(container, encounter) {
  const shopDiv = document.createElement('div');
  shopDiv.innerHTML = `<p>欢迎来到流浪商人，这里有药水与稀有藏品。</p>`;
  const list = document.createElement('div');
  list.className = 'shop-list';
  encounter.items.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'relic-card';
    card.innerHTML = `
      <header>
        <span>${item.name}</span>
        <span>${item.price} 金币</span>
      </header>
      <p>${item.description}</p>
      <button ${gameState.player.gold < item.price ? 'disabled' : ''}>购买</button>
    `;
    card.querySelector('button').addEventListener('click', () =>
      purchaseItem(item.id, item.price)
    );
    list.appendChild(card);
  });
  shopDiv.appendChild(list);
  container.appendChild(shopDiv);
}

function renderEvent(container, encounter) {
  const { event } = encounter;
  const div = document.createElement('div');
  div.innerHTML = `<p>${event.description}</p>`;
  const btns = document.createElement('div');
  btns.className = 'panel__body actions';
  event.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      const prevEncounter = gameState.encounter;
      const resolved = opt.resolve(gameState);
      if (gameState.encounter && gameState.encounter.type === 'battle') {
        updateUI();
        return;
      }
      if (resolved !== false) {
        gameState.encounter = null;
      }
      updateUI();
    });
    btns.appendChild(btn);
  });
  div.appendChild(btns);
  container.appendChild(div);
}

function renderChest(container, encounter) {
  const div = document.createElement('div');
  div.innerHTML = `<p>${encounter.description}</p>`;
  const btn = document.createElement('button');
  btn.textContent = '开启宝箱';
  btn.addEventListener('click', () => {
    const gold = randomInt(40, 80);
    addGold(gameState, gold);
    if (Math.random() < 0.3) {
      rollRelicDrop(gameState, 'common');
    }
    pushLog(`获得金币${gold}。`);
    gameState.encounter = null;
    updateUI();
  });
  div.appendChild(btn);
  container.appendChild(div);
}

function renderBag() {
  if (!gameState.player) {
    bagPotions.innerHTML = '';
    bagRelics.innerHTML = '';
    return;
  }
  bagPotions.innerHTML = '';
  Object.entries(gameState.player.inventory.potions).forEach(([id, count]) => {
    const potion = POTIONS.find((p) => p.id === id);
    if (!potion) return;
    const row = document.createElement('div');
    row.className = 'potion-row';
    row.innerHTML = `
      <header>
        <span>${potion.name}</span>
        <span>×${count}</span>
      </header>
      <p>${potion.description}</p>
    `;
    const btn = document.createElement('button');
    btn.textContent = '使用';
    btn.disabled = count === 0;
    btn.addEventListener('click', () => {
      if (usePotion(id)) {
        renderBag();
      }
    });
    row.appendChild(btn);
    bagPotions.appendChild(row);
  });

  bagRelics.innerHTML = '';
  if (gameState.player.inventory.relics.length === 0) {
    bagRelics.innerHTML = '<p>暂无藏品</p>';
  } else {
    gameState.player.inventory.relics.forEach((entry) => {
      const data = RELICS.find((r) => r.id === entry.id);
      if (!data) return;
      const card = document.createElement('div');
      card.className = 'relic-card';
      card.innerHTML = `
        <header>
          <span>${data.name}</span>
          <span class="badge ${data.quality}">${data.quality}</span>
        </header>
        <p>${data.description}</p>
      `;
      bagRelics.appendChild(card);
    });
  }
}

function closeBag() {
  bagPanel.classList.remove('visible');
}

function closeOverlay() {
  overlayModal.classList.remove('visible');
}

/* Logging */
function pushLog(message) {
  gameState.log.unshift({ message, time: timestamp() });
  if (gameState.log.length > 100) {
    gameState.log.length = 100;
  }
  renderLog();
}

function pushBattleLog(message) {
  if (gameState.encounter?.type === 'battle') {
    gameState.encounter.battleLog = gameState.encounter.battleLog || [];
    gameState.encounter.battleLog.push(message);
  }
  pushLog(message);
}

function renderLog() {
  logEntries.innerHTML = '';
  gameState.log.slice(0, 40).forEach((entry) => {
    const div = document.createElement('div');
    div.className = 'log-entry';
    div.innerHTML = `<div class="time">${entry.time}</div><div>${entry.message}</div>`;
    logEntries.appendChild(div);
  });
}

/* Core loop actions */
function handleRoam() {
  const player = gameState.player;
  const baseChances = {
    battle: 0.6,
    shop: 0.15,
    chest: 0.15,
    event: 0.1
  };
  let battleChance = baseChances.battle + (player.stats.roamBattleDelta || 0);
  battleChance = clamp(battleChance, 0.2, 0.85);
  const remaining = 1 - battleChance;
  const ratio = (1 - baseChances.battle) / remaining;
  const shopChance = baseChances.shop / (1 - baseChances.battle) * remaining;
  const chestChance = baseChances.chest / (1 - baseChances.battle) * remaining;
  const eventChance = baseChances.event / (1 - baseChances.battle) * remaining;
  const roll = Math.random();
  if (roll < battleChance) {
    triggerBattleEncounter();
  } else if (roll < battleChance + shopChance) {
    openShop();
  } else if (roll < battleChance + shopChance + chestChance) {
    openChest();
  } else {
    triggerEvent();
  }
  updateUI();
}

function triggerBattleEncounter() {
  const typeRoll = Math.random();
  const encounterType =
    typeRoll < 0.7 ? 'normal' : typeRoll < 0.95 ? 'elite' : 'treasure';
  if (encounterType === 'treasure') {
    startBattle(gameState, spawnEnemyFrom(TREASURE_GUARD));
  } else if (encounterType === 'elite') {
    startBattle(gameState, spawnEnemyFrom(randomChoice(ELITE_ENEMIES)));
  } else {
    startBattle(gameState, spawnEnemyFrom(randomChoice(NORMAL_ENEMIES)));
  }
}

function openShop() {
  const items = [];
  POTIONS.forEach((p) => {
    items.push({
      id: `potion:${p.id}`,
      name: p.name,
      description: p.description,
      price: computeShopPrice(gameState, p.price)
    });
  });
  if (Math.random() < 0.3) {
    const rarityRoll = Math.random();
    const rarity =
      rarityRoll < 0.7
        ? 'common'
        : rarityRoll < 0.95
        ? 'rare'
        : rarityRoll < 0.995
        ? 'epic'
        : 'legendary';
    const pool = RELICS.filter((r) => r.quality === rarity);
    const relic = randomChoice(pool);
    items.push({
      id: `relic:${relic.id}`,
      name: relic.name,
      description: relic.description,
      price: computeShopPrice(
        gameState,
        rarity === 'common' ? 400 : rarity === 'rare' ? 700 : rarity === 'epic' ? 1500 : 4000
      )
    });
  }
  addGoldAndExpForNonBattle(gameState);
  gameState.encounter = {
    type: 'shop',
    title: '流浪商人',
    items
  };
}

function openChest() {
  addGoldAndExpForNonBattle(gameState);
  gameState.encounter = {
    type: 'chest',
    title: '闪烁的宝箱',
    description: '宝箱里可能藏有金币或藏品。'
  };
}

function triggerEvent() {
  let event;
  if (!gameState.flags.firstEventShown) {
    event = EVENT_DEFS.find((e) => e.id === 'forkInRoad');
    gameState.flags.firstEventShown = true;
  } else {
    const pool = EVENT_DEFS.filter((e) => !e.once || (e.once && !e.triggered));
    event = randomChoice(pool);
  }
  if (!event) return;
  event.triggered = true;
  addGoldAndExpForNonBattle(gameState);
  gameState.encounter = {
    type: 'event',
    title: event.name,
    event
  };
}

function triggerAscensionEvent() {
  const event = {
    id: 'ascensionTrial',
    name: '飞升幻境',
    description: '心魔低语，你可选择醒来或迎战。',
    options: [
      {
        id: 'wake',
        label: '醒来（离开幻境）',
        resolve: (state) => {
          pushLog('你选择醒来，心魔的声音渐渐远去。');
          return true;
        }
      },
      {
        id: 'battle',
        label: '迎战心魔',
        resolve: (state) => {
          startBattle(state, spawnHeartDemon());
          return false;
        }
      }
    ]
  };
  gameState.encounter = {
    type: 'event',
    title: event.name,
    event
  };
  updateUI();
}

function handleMeditate() {
  const player = gameState.player;
  const xpCost = 200;
  if (!spendExperience(gameState, xpCost)) {
    pushLog('经验不足，无法打坐。');
    return;
  }
  player.currentHp = player.stats.maxHp;
  player.currentMana = player.stats.maxMana;
  pushLog('通过打坐回复了全部生命和蓝量。');
  if (Math.random() < 0.2) {
    pushLog('心魔侵袭！精英战斗来临。');
    startBattle(gameState, spawnEnemyFrom(randomChoice(ELITE_ENEMIES)));
  } else if (Math.random() < 0.15) {
    triggerAscensionEvent();
    return;
  } else {
    gameState.encounter = null;
  }
  updateUI();
}

/* Shop purchase */
function purchaseItem(id, price) {
  const player = gameState.player;
  if (player.gold < price) {
    pushLog('金币不足，无法购买。');
    return;
  }
  player.gold -= price;
  if (id.startsWith('potion:')) {
    const potionId = id.split(':')[1];
    const potion = POTIONS.find((p) => p.id === potionId);
    if (potionId === 'attributeBoost') {
      delete player.inventory.potions[potionId];
      applyAttributeBoost(gameState, 'shop');
    } else {
      player.inventory.potions[potionId] = (player.inventory.potions[potionId] || 0) + 1;
      pushLog(`购买了${potion?.name ?? '未知药剂'}`);
    }
  } else if (id.startsWith('relic:')) {
    const relicId = id.split(':')[1];
    grantRelic(gameState, relicId);
  }
  updatePlayerStats(gameState);
  updateUI();
}

/* Battle system */
function spawnEnemyFrom(template) {
  const player = gameState.player;
  const level = player.level;
  let info;
  if (template === HEART_DEMON) {
    const stats = template.stats(player);
    info = { ...stats };
  } else {
    const stats = template.stats(level);
    info = { ...stats };
  }
  const enemy = {
    id: template.id || template.name,
    name: template.name,
    description: template.description,
    maxHp: Math.floor(info.hp),
    currentHp: Math.floor(info.hp),
    attack: Math.floor(info.attack),
    defense: Math.floor(info.defense),
    resist: Math.floor(info.resist),
    type: info.type || 'physical',
    modifier: info.modifier || 1,
    hits: info.hits || 1,
    tier: template.baseRewards
      ? template === TREASURE_GUARD
        ? 'elite'
        : template === HEART_DEMON
        ? 'boss'
        : template.baseRewards.exp.base > 40
        ? 'elite'
        : 'normal'
      : 'normal',
    baseRewards: template.baseRewards,
    lifeSteal: template.lifeSteal || 0,
    frenzyThreshold: template.frenzyThreshold,
    frenzyBoost: template.frenzyBoost,
    manaShield: template.manaShield,
    openingStrike: template.openingStrike,
    bonusGold: template.bonusGold || 0,
    guaranteedRelic: template.guaranteedRelic,
    guaranteedRelicId: template.guaranteedRelicId
  };
  enemy.shield = 0;
  enemy.isHeartDemon = template === HEART_DEMON;
  return enemy;
}

function spawnHeartDemon() {
  return spawnEnemyFrom(HEART_DEMON);
}

function startBattle(state, enemy) {
  if (!enemy) return;
  state.encounter = {
    type: 'battle',
    title: '战斗',
    enemy,
    turn: 'player',
    battleLog: [],
    playerBuffs: [],
    enemyBuffs: [],
    playerShieldDuration: 0,
    openingStrike: !!enemy.openingStrike
  };
  state.player.usedManualSkillThisTurn = false;
  state.player.usedManualSkillLastTurn = false;
  state.player.blackTulipStacks = state.player.blackTulipStacks || 0;
  setupBattleBonuses(state);
  pushLog(`遭遇 ${enemy.name}！`);
  updateUI();
}

function setupBattleBonuses(state) {
  const battle = state.encounter;
  const player = state.player;
  player.shield = 0;
  player.pendingDamageReduction = 0;
  player.cooldowns = player.cooldowns || {};
  battle.playerBuffs = battle.playerBuffs || [];
  if (player.pendingBuffs?.length) {
    battle.playerBuffs.push(...player.pendingBuffs);
    player.pendingBuffs = [];
    pushBattleLog('携带的临时祝福激活。');
  }
  applyPersistentStatuses(player, battle);
  if (player.stats.battleShield.percent > 0) {
    const value = Math.floor(player.stats.maxHp * player.stats.battleShield.percent);
    player.shield = value;
    battle.playerShieldDuration = player.stats.battleShield.duration;
    pushBattleLog(`获得${value}点护盾。`);
  }
  if (player.stats.starlitBastion) {
    const extraShield = Math.floor(player.stats.maxHp * 0.6);
    player.shield = (player.shield || 0) + extraShield;
    pushBattleLog(`星辉壁垒生成${extraShield}点护盾。`);
  }
  if (player.stats.battleStartMana) {
    player.currentMana = clamp(
      player.currentMana + player.stats.battleStartMana,
      0,
      player.stats.maxMana
    );
    pushBattleLog('法力流淌，蓝量回复。');
  }
  if (player.stats.randomBattleBuff) {
    const buff = randomChoice([
      { field: 'attack', value: 0.5, label: '攻击' },
      { field: 'dodge', value: 0.2, label: '闪避' },
      { field: 'crit', value: 0.15, label: '暴击' }
    ]);
    battle.playerBuffs.push({ type: buff.field, value: buff.value, duration: Infinity });
    pushBattleLog(`幸运骰子给予${buff.label}增益。`);
  }
  if (player.stats.battleStartStunChance > 0) {
    if (Math.random() < player.stats.battleStartStunChance) {
      battle.enemyStunned = 1;
      pushBattleLog('先发制人，敌人被眩晕一回合！');
    }
  }
  if (player.stats.enemyWeakenPercent > 0) {
    const debuff = player.stats.enemyWeakenPercent;
    const enemy = battle.enemy;
    enemy.attack = Math.floor(enemy.attack * (1 - debuff));
    enemy.defense = Math.floor(enemy.defense * (1 - debuff));
    enemy.resist = Math.floor(enemy.resist * (1 - debuff));
    enemy.maxHp = Math.floor(enemy.maxHp * (1 - debuff));
    enemy.currentHp = Math.min(enemy.currentHp, enemy.maxHp);
    pushBattleLog('混沌戒指削弱了敌人。');
  }
  if (player.stats.preemptiveWeakenChance && Math.random() < player.stats.preemptiveWeakenChance) {
    battle.enemyAttackPenalty = { turns: 2, multiplier: 0.5 };
    pushBattleLog('先发制人压制敌人，攻击力骤降。');
  }
  if (player.stats.epicBorrowCount > 0) {
    const epicRelics = RELICS.filter((r) => r.quality === 'epic');
    state.encounter.tempRelics = [];
    for (let i = 0; i < player.stats.epicBorrowCount; i++) {
      const pick = randomChoice(epicRelics);
      state.encounter.tempRelics.push(pick.id);
      pushBattleLog(`全能戒指赋予【${pick.name}】效果。`);
    }
  }
  battle.destinyWardStacks = player.stats.destinyWard || 0;
  if (battle.destinyWardStacks > 0) {
    pushBattleLog('命运庇佑赐下绝境抵挡。');
  }
}

function getBuffValue(list, type) {
  if (!list) return 0;
  return list
    .filter((buff) => buff.type === type)
    .reduce((sum, buff) => sum + buff.value, 0);
}

function applyPersistentStatuses(player, battle) {
  (player.statuses || []).forEach((status) => {
    if (status.type === 'guilt') {
      battle.playerBuffs.push({ type: 'attack', value: -0.1, duration: Infinity });
      pushBattleLog('罪恶感让攻击力下降。');
    } else if (status.type === 'curse') {
      battle.curseDamage = Math.max(battle.curseDamage || 0, 0.2);
      pushBattleLog('诅咒生效，你将承受更多伤害。');
    } else if (status.type === 'manaDisorder') {
      pushBattleLog('法力紊乱，技能耗蓝将提高。');
    }
  });
}

function tickPersistentStatuses(player) {
  if (!player.statuses || player.statuses.length === 0) return;
  player.statuses = player.statuses
    .map((status) => ({ ...status, duration: status.duration - 1 }))
    .filter((status) => status.duration > 0);
}

function getPlayerStatus(player, type) {
  return (player.statuses || []).find((status) => status.type === type);
}

function handleBattleAction(action) {
  const battle = gameState.encounter;
  if (battle.turn !== 'player') {
    pushBattleLog('尚未轮到你行动。');
    return;
  }
  if (gameState.player.stunned) {
    pushBattleLog('你被眩晕，错失机会。');
    gameState.player.stunned -= 1;
    endPlayerTurn();
    return;
  }
  if (action === 'attack') {
    performNormalAttack();
  } else if (action === 'skill1') {
    useSkill(0);
  } else if (action === 'skill2') {
    useSkill(1);
  } else if (action === 'item') {
    bagPanel.classList.add('visible');
    renderBag();
    pushBattleLog('请选择药水，使用后本回合结束。');
    battle.awaitingItem = true;
    return;
  } else if (action === 'run') {
    attemptEscape();
    return;
  }
  if (action !== 'item') {
    endPlayerTurn();
  }
}

function performNormalAttack() {
  const player = gameState.player;
  const hero = HEROES.find((h) => h.id === player.heroId);
  resolveAttackPattern(hero.normalAttack, false);
}

function resolveAttackPattern(pattern, isSkill, options = {}) {
  const player = gameState.player;
  const enemy = gameState.encounter.enemy;
  const stats = player.stats;
  const attackType = pattern.type || 'physical';
  const hits = pattern.hits || [{ ratio: pattern.multiplier || 1 }];
  const attackBuff = getBuffValue(gameState.encounter.playerBuffs, 'attack');
  const critBuff = getBuffValue(gameState.encounter.playerBuffs, 'crit');
  const lowHpActive =
    stats.lowHpBuff && player.currentHp / player.stats.maxHp < 0.3 ? 1 : 0;
  const berserkBonus = stats.berserker
    ? clamp(Math.floor((1 - player.currentHp / player.stats.maxHp) / 0.1) * 0.08, 0, 0.8)
    : 0;
  const blackTulipBonus = options.blackTulipBonus || 0;
  const attackMultiplier = 1 + blackTulipBonus;
  const attackPower =
    stats.attack *
    (1 + attackBuff + (player.tempEmpower || 0) + lowHpActive + berserkBonus) *
    attackMultiplier;
  let totalDamage = 0;
  let manaRefund = 0;
  hits.forEach((hit) => {
    const ratio = hit.ratio;
    const type = attackType;
    let baseDamage = attackPower * ratio;
    if (pattern.flatBonus) {
      baseDamage += pattern.flatBonus;
    }
    if (type === 'magic') {
      const pen = {
        percent: stats.magicPenPercent || 0,
        flat: stats.magicPenFlat || 0
      };
      baseDamage = applyMagicDamage(baseDamage, enemy.resist, pen);
      baseDamage *= 1 + (stats.magicDamageBonus || 0);
      if (isSkill) {
        baseDamage *= 1 + (stats.skillMagicBonus || 0);
      }
      if (stats.spellManaRefund) {
        manaRefund += stats.spellManaRefund;
      }
    } else {
      let effectiveDamage = baseDamage + (options.extraDamage || 0);
      if (enemy.currentHp / enemy.maxHp > 0.8 && stats.highHpBonus) {
        effectiveDamage *= 1 + stats.highHpBonus;
      }
      if (enemy.frenzyThreshold && enemy.currentHp / enemy.maxHp < enemy.frenzyThreshold) {
        enemy.attack = Math.floor(enemy.attack * (1 + enemy.frenzyBoost));
      }
      effectiveDamage = applyPhysicalDamage(
        effectiveDamage,
        enemy.defense - (stats.armorPen || 0)
      );
      baseDamage = effectiveDamage;
    }
    baseDamage = applyBattleMultipliers(baseDamage, enemy.tier);
    const critChance = stats.critChance + critBuff + (lowHpActive ? 0.2 : 0);
    const crit = checkCrit(critChance);
    if (crit) {
      baseDamage = Math.floor(baseDamage * (1 + stats.critDamage));
      if (stats.destinyProc) {
        const extra = Math.floor(enemy.currentHp * 0.1);
        enemy.currentHp = Math.max(0, enemy.currentHp - extra);
        pushBattleLog(`天命触发，额外造成${extra}点法术伤害。`);
      }
    }
    if (stats.bonusMagicProc && Math.random() < stats.bonusMagicProc.chance) {
      const extra = Math.floor(stats.attack * stats.bonusMagicProc.ratio);
      enemy.currentHp = Math.max(0, enemy.currentHp - extra);
      pushBattleLog(`元素之心共鸣，附加${extra}点法术伤害。`);
    }
    if (stats.ruinDamage) {
      const extra = Math.floor(player.stats.maxHp * stats.ruinDamage);
      enemy.currentHp = Math.max(0, enemy.currentHp - extra);
      pushBattleLog(`破败侵蚀，附加${extra}点法术伤害。`);
    }
    baseDamage = dealDamageToEnemy(baseDamage);
    totalDamage += baseDamage;
    if (stats.lifeSteal > 0) {
      const eliteFactor = enemy.tier === 'elite' || enemy.tier === 'boss' ? 0.5 : 1;
      const healAmount = Math.floor(baseDamage * stats.lifeSteal * eliteFactor);
      healPlayer(healAmount);
    } else if (stats.basicAttackLeech && !isSkill) {
      const healAmount = Math.floor(baseDamage * stats.basicAttackLeech);
      healPlayer(healAmount);
    }
    applyOnHitDebuffs(enemy, {
      elementHeart: stats.elementHeartDebuff,
      ruinDefenseShred: stats.ruinDefenseShred,
      skillResistShred: options.skillResistShred,
      damageDealt: baseDamage,
      attackType
    });
  });
  pushBattleLog(`造成${totalDamage}点伤害。`);
  if (manaRefund > 0) {
    gameState.player.currentMana = clamp(
      gameState.player.currentMana + manaRefund,
      0,
      gameState.player.stats.maxMana
    );
    pushBattleLog(`法力潮汐护符回流${manaRefund}点蓝量。`);
  }
  if (player.tempEmpower) {
    player.tempEmpower = 0;
  }
  if (totalDamage > 0 && stats.eternalEmber && (isSkill || attackType === 'magic')) {
    const emberHeal = Math.floor(player.stats.maxHp * 0.05);
    healPlayer(emberHeal);
    player.pendingDamageReduction = clamp(
      (player.pendingDamageReduction || 0) + 0.1,
      0,
      0.3
    );
    pushBattleLog('永燃余烬点燃，下一次受到的伤害将被削减。');
  }
  if (gameState.encounter.enemy.currentHp <= 0) {
    concludeBattle(true);
  }
}

function applyOnHitDebuffs(enemy, context) {
  if (!enemy || enemy.currentHp <= 0) return;
  const logs = [];
  if (context.elementHeart) {
    const prevResist = enemy.resist;
    const prevAttack = enemy.attack;
    enemy.resist = Math.max(0, enemy.resist - 15);
    enemy.attack = Math.max(0, enemy.attack - 20);
    if (enemy.resist !== prevResist || enemy.attack !== prevAttack) {
      logs.push('元素之心蚕食敌人（法抗-15，攻击-20）');
    }
  }
  if (context.ruinDefenseShred) {
    const prevDefense = enemy.defense;
    enemy.defense = Math.max(0, enemy.defense - context.ruinDefenseShred);
    if (enemy.defense !== prevDefense) {
      logs.push(`破败侵蚀，敌人防御-${context.ruinDefenseShred}`);
    }
  }
  if (context.skillResistShred) {
    const prevResist = enemy.resist;
    enemy.resist = Math.max(0, enemy.resist - context.skillResistShred);
    if (enemy.resist !== prevResist) {
      logs.push(`奥术法典削弱敌人法抗${context.skillResistShred}点`);
    }
  }
  logs.forEach((msg) => pushBattleLog(msg));
}

function handleBlackTulipStart(player) {
  if (!player.stats.blackTulip) return;
  const prev = player.blackTulipStacks || 0;
  if (!player.usedManualSkillLastTurn) {
    player.blackTulipStacks = clamp(prev + 0.3, 0, 1.2);
    if (player.blackTulipStacks !== prev && player.blackTulipStacks > 0) {
      pushBattleLog(`黑色郁金香增益累积至${Math.round(player.blackTulipStacks * 100)}%。`);
    }
  }
  player.usedManualSkillLastTurn = false;
  player.usedManualSkillThisTurn = false;
}

function applyBattleMultipliers(baseDamage, tier) {
  const stats = gameState.player.stats;
  let damage = baseDamage;
  if (tier === 'elite') {
    damage *= 1 + (stats.damageVsElite || 0);
  } else if (tier === 'normal') {
    damage *= 1 + (stats.damageVsNormal || 0);
  }
  if (gameState.encounter?.tempRelics) {
    gameState.encounter.tempRelics.forEach((id) => {
      if (id === 'deathEye') {
        damage *= 1.1;
      } else if (id === 'elementHeart') {
        damage *= 1.1;
      }
    });
  }
  return Math.floor(damage);
}

function applyPhysicalDamage(baseDamage, defense) {
  const reduced = baseDamage - defense;
  return Math.max(Math.floor(reduced), Math.floor(baseDamage * 0.05));
}

function applyMagicDamage(base, resist, penetration) {
  let effectiveResist = resist;
  if (penetration) {
    if (penetration.percent) {
      effectiveResist = Math.max(0, Math.floor(effectiveResist * (1 - penetration.percent)));
    }
    if (penetration.flat) {
      effectiveResist = Math.max(0, effectiveResist - penetration.flat);
    }
  }
  const multiplier = Math.max(1 - effectiveResist / 100, 0.05);
  return Math.floor(base * multiplier);
}

function dealDamageToEnemy(amount) {
  const enemy = gameState.encounter.enemy;
  let damage = amount;
  if (enemy.shield > 0) {
    const shieldAbsorb = Math.min(enemy.shield, damage);
    enemy.shield -= shieldAbsorb;
    damage -= shieldAbsorb;
  }
  if (enemy.manaShield && enemy.currentHp - damage <= 0) {
    enemy.manaShield = false;
    enemy.currentHp = Math.floor(enemy.maxHp * 0.2);
    pushBattleLog(`${enemy.name}的法力护盾抵消了致命伤害！`);
    return amount;
  }
  enemy.currentHp = Math.max(0, enemy.currentHp - damage);
  return amount;
}

function checkCrit(chance) {
  return Math.random() < clamp(chance, 0, 0.95);
}

function endPlayerTurn() {
  if (!gameState.encounter || gameState.encounter.type !== 'battle') {
    updateUI();
    return;
  }
  const battle = gameState.encounter;
  gameState.player.usedManualSkillLastTurn = gameState.player.usedManualSkillThisTurn;
  gameState.player.usedManualSkillThisTurn = false;
  applyTurnStartEffects('enemy');
  if (!gameState.encounter || gameState.encounter.type !== 'battle') {
    return;
  }
  battle.turn = 'enemy';
  enemyTurn();
}

function enemyTurn() {
  const battle = gameState.encounter;
  const enemy = battle.enemy;
  if (enemy.currentHp <= 0) return;
  if (typeof enemy.onTurnStart === 'function') {
    enemy.onTurnStart(enemy);
  }
  if (battle.enemyStunned) {
    pushBattleLog(`${enemy.name}眩晕中，无法行动。`);
    battle.enemyStunned -= 1;
  } else {
    if (battle.openingStrike && enemy.openingStrike) {
      performOpeningStrike(enemy);
      battle.openingStrike = false;
    } else {
      executeEnemyAttack();
    }
  }
  if (!gameState.encounter || gameState.encounter.type !== 'battle') {
    return;
  }
  applyTurnStartEffects('player');
  battle.turn = 'player';
  updateUI();
}

function executeEnemyAttack() {
  const player = gameState.player;
  const enemy = gameState.encounter.enemy;
  const hits = enemy.hits || 1;
  const penalty = gameState.encounter.enemyAttackPenalty;
  const dodgeBuff = getBuffValue(gameState.encounter.playerBuffs, 'dodge');
  let total = 0;
  for (let i = 0; i < hits; i++) {
    let damageValue;
    if (enemy.type === 'magic') {
      const base = enemy.attack * (enemy.modifier || 1);
      damageValue = applyMagicDamage(base, player.stats.resist);
    } else {
      const base = enemy.attack * (enemy.modifier || 1);
      damageValue = applyPhysicalDamage(base, player.stats.defense);
    }
    if (penalty?.turns > 0) {
      damageValue = Math.floor(damageValue * penalty.multiplier);
    }
    const dodgeChance = clamp(player.stats.dodge + dodgeBuff, 0, 0.9);
    if (Math.random() < dodgeChance) {
      pushBattleLog('成功闪避攻击！');
      player.tempEmpower = (player.tempEmpower || 0) + (player.stats.empowerOnDodge || 0);
      if (player.stats.shieldOnDodge) {
        const shield = Math.floor(player.stats.maxHp * player.stats.shieldOnDodge);
        player.shield = (player.shield || 0) + shield;
        pushBattleLog(`暗影斗篷护佑，获得${shield}护盾。`);
      }
      continue;
    }
    total += damageValue;
    applyDamageToPlayer(gameState, damageValue);
    if (player.stats.thornsPercent) {
      const reflect = Math.floor(damageValue * player.stats.thornsPercent);
      dealDamageToEnemy(reflect);
      pushBattleLog(`荆棘甲反弹${reflect}伤害。`);
    }
    if (player.stats.freezeOnHit && Math.random() < player.stats.freezeOnHit) {
      gameState.encounter.enemyStunned = 1;
      pushBattleLog('冰霜之核冻结敌人一回合。');
    }
    if (enemy.lifeSteal) {
      const heal = Math.floor(damageValue * enemy.lifeSteal);
      enemy.currentHp = Math.min(enemy.maxHp, enemy.currentHp + heal);
    }
  }
  pushBattleLog(`${enemy.name}造成${total}点伤害。`);
  if (penalty?.turns > 0) {
    penalty.turns -= 1;
    if (penalty.turns <= 0) {
      delete gameState.encounter.enemyAttackPenalty;
    }
  }
  if (player.currentHp <= 0) {
    concludeBattle(false);
  }
}

function performOpeningStrike(enemy) {
  const base = enemy.attack * 2;
  const damage =
    enemy.type === 'magic'
      ? applyMagicDamage(base, gameState.player.stats.resist)
      : applyPhysicalDamage(base, gameState.player.stats.defense);
  applyDamageToPlayer(gameState, damage);
  pushBattleLog(`${enemy.name}发动惊喜一击，造成${damage}点伤害！`);
}

function applyDamageToPlayer(state, damage) {
  const player = state.player;
  player.cooldowns = player.cooldowns || {};
  const battle = state.encounter?.type === 'battle' ? state.encounter : null;
  let remaining = damage;
  if (player.pendingDamageReduction) {
    remaining = Math.floor(remaining * (1 - player.pendingDamageReduction));
    player.pendingDamageReduction = 0;
  }
  if (player.stats.starlitBastion && player.shield > 0) {
    remaining = Math.floor(remaining * 0.85);
  }
  if (player.shield > 0) {
    const absorbed = Math.min(player.shield, remaining);
    player.shield -= absorbed;
    remaining -= absorbed;
  }
  const curse = state.encounter?.curseDamage || 0;
  if (curse > 0 && remaining > 0) {
    remaining = Math.floor(remaining * (1 + curse));
  }
  let destinyFinalHeal = false;
  if (battle?.destinyWardStacks > 0 && remaining > 0) {
    const cap = Math.max(1, Math.floor(player.currentHp * 0.3));
    if (remaining > cap) {
      remaining = cap;
    }
    battle.destinyWardStacks -= 1;
    pushBattleLog('命运庇佑守护你，将伤害限制在安全范围内。');
    if (battle.destinyWardStacks === 0) {
      destinyFinalHeal = true;
    }
  }
  if (
    player.stats.steelResolve &&
    (player.cooldowns?.steelResolve || 0) === 0 &&
    player.currentHp > 0 &&
    player.currentHp / player.stats.maxHp >= 0.4 &&
    remaining >= player.currentHp
  ) {
    player.currentHp = Math.max(1, Math.floor(player.stats.maxHp * 0.2));
    player.cooldowns.steelResolve = 5;
    pushBattleLog('钢铁心志发动，你在致命伤害中挺住了。');
    return;
  }
  player.currentHp = Math.max(0, player.currentHp - remaining);
  if (destinyFinalHeal) {
    player.currentHp = player.stats.maxHp;
    if (player.statuses?.length) {
      player.statuses.shift();
    }
    pushBattleLog('命运庇佑耗尽，你被完全治愈并净化一项负面效果。');
  }
}

function healPlayer(amount) {
  if (amount <= 0) return;
  const player = gameState.player;
  const bonus = player.stats.healingBonus || 0;
  const total = Math.floor(amount * (1 + bonus));
  player.currentHp = Math.min(player.stats.maxHp, player.currentHp + total);
  pushBattleLog(`回复${total}点生命。`);
}

function useSkill(index) {
  const hero = HEROES.find((h) => h.id === gameState.player.heroId);
  const skill = hero.skills[index];
  if (!skill) return;
  const player = gameState.player;
  const manaStatus = getPlayerStatus(player, 'manaDisorder');
  const manaCost = skill.cost + (manaStatus ? 10 : 0);
  if (player.currentMana < manaCost) {
    pushBattleLog('蓝量不足。');
    return;
  }
  let blackTulipBonus = 0;
  if (player.stats.blackTulip && player.blackTulipStacks) {
    blackTulipBonus = player.blackTulipStacks;
    player.blackTulipStacks = 0;
    pushBattleLog(`黑色郁金香绽放，技能增益+${Math.round(blackTulipBonus * 100)}%。`);
  }
  player.usedManualSkillThisTurn = true;
  player.currentMana -= manaCost;
  const extra = {
    markManual: true,
    blackTulipBonus,
    skillResistShred: player.stats.skillResistShred || 0
  };
  executeSkillEffect(skill, false, extra);
  if (!gameState.encounter || gameState.encounter.type !== 'battle') {
    return;
  }
  const doubleChance = player.stats.skillDoubleChance || 0;
  if (doubleChance > 0 && Math.random() < doubleChance) {
    pushBattleLog('创世之杖共鸣，技能再次发动！');
    executeSkillEffect(skill, true, extra);
  }
}

function executeSkillEffect(skill, isEcho = false, extra = {}) {
  const attackOptions = {
    isSkill: true,
    blackTulipBonus: extra.blackTulipBonus || 0,
    skillResistShred: extra.skillResistShred || 0
  };
  if (extra.markManual && !isEcho) {
    gameState.player.usedManualSkillThisTurn = true;
  }
  if (skill.id === 'chargeUp') {
    addTemporaryBuff(gameState, { type: 'attack', value: 0.3, duration: 3 });
    gameState.player.pendingDamageReduction = clamp(
      (gameState.player.pendingDamageReduction || 0) + 0.15,
      0,
      0.45
    );
    healPlayer(Math.floor(gameState.player.stats.maxHp * 0.05));
    pushBattleLog('进入蓄力状态，攻防双栖，回复少量生命。');
  } else if (skill.id === 'bullRush') {
    const extra = Math.floor(gameState.player.stats.maxHp * 0.15);
    resolveAttackPattern(
      { type: 'physical', hits: [{ ratio: 1.5 }], flatBonus: extra },
      true,
      attackOptions
    );
    applyDamageToPlayer(gameState, Math.floor(gameState.player.stats.maxHp * 0.05));
  } else if (skill.id === 'backstab') {
    resolveAttackPattern(
      { type: 'physical', hits: [{ ratio: 0.85 }, { ratio: 0.85 }] },
      true,
      attackOptions
    );
  } else if (skill.id === 'nimble') {
    addTemporaryBuff(gameState, { type: 'dodge', value: 0.7, duration: 2 });
    pushBattleLog('疾速如风，闪避大幅提升。');
  } else if (skill.id === 'meteor') {
    resolveAttackPattern({ type: 'magic', hits: [{ ratio: 3.25 }] }, true, attackOptions);
    if (!isEcho) {
      gameState.player.stunned = 1;
      pushBattleLog('魔力反噬，下一回合无法行动。');
    }
  } else if (skill.id === 'lifeSpring') {
    const healValue = Math.floor(gameState.player.stats.attack * 2);
    healPlayer(healValue);
    const shield = Math.floor(gameState.player.stats.attack);
    gameState.player.shield = (gameState.player.shield || 0) + shield;
    pushBattleLog(`获得${shield}点护盾。`);
  }
}

function addTemporaryBuff(state, buff) {
  if (state.encounter?.type === 'battle') {
    state.encounter.playerBuffs = state.encounter.playerBuffs || [];
    state.encounter.playerBuffs.push(buff);
  } else {
    state.player.pendingBuffs = state.player.pendingBuffs || [];
    state.player.pendingBuffs.push(buff);
  }
}

function applyTurnStartEffects(actor) {
  if (!gameState.encounter || gameState.encounter.type !== 'battle') return;
  const player = gameState.player;
  let battle = gameState.encounter;
  if (actor === 'player') {
    handleBlackTulipStart(player);
    if (player.stats.manaPerTurn) {
      player.currentMana = clamp(
        player.currentMana + player.stats.manaPerTurn,
        0,
        player.stats.maxMana
      );
    }
    if (player.stats.turnStartMagic && battle.enemy.currentHp > 0) {
      const damage = Math.floor(player.stats.attack * player.stats.turnStartMagic);
      dealDamageToEnemy(damage);
      pushBattleLog(`太阳徽章灼烧敌人，造成${damage}法术伤害。`);
      if (battle.enemy.currentHp <= 0) {
        concludeBattle(true);
        return;
      }
      if (!gameState.encounter || gameState.encounter.type !== 'battle') return;
      battle = gameState.encounter;
    }
    if (player.stats.dreamRelic) {
      triggerDreamRelicSkill();
      if (!gameState.encounter || gameState.encounter.type !== 'battle') return;
      battle = gameState.encounter;
    }
  }
  battle = gameState.encounter;
  if (!battle || battle.type !== 'battle') return;
  // handle buff durations
  ['playerBuffs', 'enemyBuffs'].forEach((key) => {
    const list = battle[key];
    if (!list) return;
    battle[key] = list
      .map((buff) => ({ ...buff, duration: buff.duration === Infinity ? Infinity : buff.duration - 1 }))
      .filter((buff) => buff.duration > 0 || buff.duration === Infinity);
  });
  if (battle.playerShieldDuration > 0) {
    battle.playerShieldDuration -= 1;
    if (battle.playerShieldDuration <= 0) {
      player.shield = 0;
    }
  }
}

function attemptEscape() {
  if (Math.random() < 0.4) {
    pushBattleLog('成功逃离战斗。');
    gameState.encounter = null;
  } else {
    pushBattleLog('逃跑失败，敌人进攻。');
    endPlayerTurn();
  }
}

function concludeBattle(victory) {
  if (victory) {
    const enemy = gameState.encounter.enemy;
    const rewards = enemy.baseRewards;
    let expGain =
      Math.floor(rewards.exp.base + rewards.exp.per * gameState.player.level) *
      (1 + (gameState.player.stats.battleExpBonus || 0));
    let goldGain =
      Math.floor(rewards.gold.base + rewards.gold.per * gameState.player.level) *
      (1 + (gameState.player.stats.goldBonus || 0));
    if (enemy.bonusGold) {
      goldGain *= 1 + enemy.bonusGold;
    }
    gainExperience(gameState, expGain);
    addGold(gameState, goldGain);
    pushBattleLog(`战斗胜利，获得 ${expGain} 经验与 ${goldGain} 金币。`);
    if (gameState.player.stats.postBattleHeal) {
      healPlayer(Math.floor(gameState.player.stats.maxHp * gameState.player.stats.postBattleHeal));
    }
    if (gameState.player.stats.healOnKill) {
      healPlayer(Math.floor(enemy.maxHp * gameState.player.stats.healOnKill));
    }
    rollBattleDrops(enemy);
    if (isHeartDemon(enemy)) {
      if (!gameState.flags.epiphanyGranted) {
        grantRelic(gameState, 'epiphanyCrystal');
      }
      grantUniqueRareRelic(gameState);
      pushBattleLog('心魔幻影的残影崩解，掉落奖励。');
    }
    gameState.encounter = null;
    tickPersistentStatuses(gameState.player);
  } else {
    if (!handleDeathSave()) {
      pushBattleLog('你倒下了，旅程结束。');
      gameState.encounter = null;
      tickPersistentStatuses(gameState.player);
    }
  }
  gameState.player.stunned = 0;
  gameState.player.pendingDamageReduction = 0;
  gameState.player.tempEmpower = 0;
  tickBattleCooldowns(gameState.player);
  updateUI();
}

function rollBattleDrops(enemy) {
  const tier = enemy.tier || 'normal';
  let quality;
  const roll = Math.random() * 100;
  if (tier === 'normal') {
    if (roll < 40) quality = 'common';
    else if (roll < 50) quality = 'rare';
  } else if (tier === 'elite') {
    if (roll < 20) quality = 'common';
    else if (roll < 60) quality = 'rare';
    else if (roll < 70) quality = 'epic';
    else if (roll < 71) quality = 'legendary';
  }
  if (enemy.guaranteedRelicId) {
    grantRelic(gameState, enemy.guaranteedRelicId);
    return;
  }
  if (quality) {
    if (gameState.player.stats.dropUpgradeChance && Math.random() < gameState.player.stats.dropUpgradeChance) {
      if (quality === 'common') quality = 'rare';
      else if (quality === 'rare') quality = 'epic';
    }
    rollRelicDrop(gameState, quality);
  }
}

function handleDeathSave() {
  const player = gameState.player;
  const hasHourglass = hasRelic('timeHourglass');
  const hasWard = hasRelic('immortalWard');
  if (hasHourglass) {
    player.currentHp = player.stats.maxHp;
    player.currentMana = player.stats.maxMana;
    player.inventory.relics = player.inventory.relics.filter((r) => r.id !== 'timeHourglass');
    pushLog('时间沙漏破碎，你满状态复活。');
    return true;
  }
  if (hasWard && !player.flags?.immortalUsed) {
    player.flags = player.flags || {};
    player.flags.immortalUsed = true;
    player.currentHp = 1;
    player.shield = Math.floor(player.stats.maxHp * 0.6);
    addTemporaryBuff(gameState, { type: 'attack', value: 0.45, duration: 3 });
    pushLog('不朽之守护拯救了你。');
    return true;
  }
  return false;
}

function hasRelic(id) {
  return gameState.player.inventory.relics.some((r) => r.id === id);
}

/* Inventory interactions */
function usePotion(id) {
  const player = gameState.player;
  if (!player.inventory.potions[id]) {
    pushLog('没有对应药水。');
    return false;
  }
  const potion = POTIONS.find((p) => p.id === id);
  if (!potion) return false;
  player.inventory.potions[id] -= 1;
  if (player.inventory.potions[id] <= 0) {
    delete player.inventory.potions[id];
  }
  if (potion.heal) {
    healPlayer(potion.heal);
  }
  if (potion.mana) {
    player.currentMana = clamp(player.currentMana + potion.mana, 0, player.stats.maxMana);
  }
  if (potion.effect === 'luckyNextBattle') {
    player.tempLucky = { xp: true, gold: true };
  } else if (potion.effect === 'permanentChoice') {
    applyAttributeBoost(gameState, 'potion');
  }
  pushLog(`使用了${potion.name}`);
  if (gameState.encounter?.type === 'battle') {
    endPlayerTurn();
  } else {
    updateUI();
  }
  return true;
}

function consumePotion(state, id) {
  if (state.player.inventory.potions[id] > 0) {
    state.player.inventory.potions[id] -= 1;
    return true;
  }
  return false;
}

/* Rewards */
function gainExperience(state, amount) {
  const bonus = state.player.stats.expBonus || 0;
  let gain = Math.floor(amount * (1 + bonus));
  if (state.player.tempLucky?.xp) {
    gain = Math.floor(gain * 1.5);
    state.player.tempLucky.xp = false;
    if (!state.player.tempLucky.gold) {
      state.player.tempLucky = null;
    }
  }
  state.player.xp += gain;
  while (state.player.xp >= state.player.xpNeeded) {
    state.player.xp -= state.player.xpNeeded;
    state.player.level += 1;
    onLevelUp(state);
  }
  updatePlayerStats(state);
}

function onLevelUp(state) {
  const player = state.player;
  player.xpNeeded = player.stats.xpFixed || levelRequirement(player.level);
  updatePlayerStats(state);
  player.currentHp = player.stats.maxHp;
  player.currentMana = player.stats.maxMana;
  pushLog(`升到${player.level}级，属性提升。`);
}

function addGold(state, amount) {
  let gain = amount * (1 + (state.player.stats.goldBonus || 0));
  if (state.player.tempLucky?.gold) {
    gain *= 1.5;
    state.player.tempLucky.gold = false;
    if (!state.player.tempLucky.xp) {
      state.player.tempLucky = null;
    }
  }
  state.player.gold += Math.floor(gain);
  updatePlayerStats(state);
}

function grantRelic(state, id) {
  const relic = RELICS.find((r) => r.id === id);
  if (!relic) return;
  const inventory = state.player.inventory.relics;
  if (['rare', 'epic'].includes(relic.quality)) {
    if (inventory.some((item) => item.id === relic.id)) {
      pushLog(`已经拥有${relic.name}，无法重复。`);
      return;
    }
  }
  inventory.push({ id: relic.id, quality: relic.quality });
  pushLog(`获得藏品【${relic.name}】`);
  if (relic.id === 'epiphanyCrystal') {
    state.flags = state.flags || {};
    state.flags.epiphanyGranted = true;
    for (let i = 0; i < 10; i++) {
      state.player.level += 1;
      onLevelUp(state);
    }
  }
  updatePlayerStats(state);
}

function rollRelicDrop(state, quality) {
  const pool = RELICS.filter((r) => r.quality === quality);
  const relic = randomChoice(pool);
  grantRelic(state, relic.id);
}

function removeRandomRelic(state) {
  if (state.player.inventory.relics.length === 0) return;
  const removed = state.player.inventory.relics.splice(
    Math.floor(Math.random() * state.player.inventory.relics.length),
    1
  );
  if (removed[0]) {
    pushLog(`失去了${RELICS.find((r) => r.id === removed[0].id).name}`);
    updatePlayerStats(state);
  }
}

function resetPlayerBonuses(state) {
  state.player.permanent = { hpFlat: 0, attackFlat: 0, defenseFlat: 0, manaFlat: 0, resistFlat: 0 };
  pushLog('命运之泉重置了所有永久属性。');
  updatePlayerStats(state);
}

function addGoldAndExpForNonBattle(state) {
  if (!state.player.stats.nonBattleReward) return;
  const reward = state.player.level * 5;
  addGold(state, reward);
  gainExperience(state, reward);
  pushLog('商人之友提供额外奖励。');
}

function triggerDreamRelicSkill() {
  if (!gameState.encounter || gameState.encounter.type !== 'battle') return;
  const player = gameState.player;
  const hero = HEROES.find((h) => h.id === player.heroId);
  if (!hero) return;
  const skill = randomChoice(hero.skills);
  const manaCost = Math.max(0, Math.ceil((skill.cost || 0) / 2));
  if (player.currentMana < manaCost) return;
  player.currentMana -= manaCost;
  pushBattleLog(`梦奇物溢出能量，自动施放【${skill.name}】。`);
  const extra = {
    skillResistShred: player.stats.skillResistShred || 0
  };
  executeSkillEffect(skill, false, extra);
  if (!gameState.encounter || gameState.encounter.type !== 'battle') {
    return;
  }
  const doubleChance = player.stats.skillDoubleChance || 0;
  if (doubleChance > 0 && Math.random() < doubleChance) {
    pushBattleLog('创世之杖共鸣，技能再次发动！');
    executeSkillEffect(skill, true, extra);
  }
}

function spendExperience(state, amount) {
  const player = state.player;
  let remaining = amount;
  let success = true;
  while (remaining > 0) {
    if (player.xp >= remaining) {
      player.xp -= remaining;
      remaining = 0;
      break;
    }
    remaining -= player.xp;
    player.xp = 0;
    if (player.level === 1) {
      success = false;
      break;
    }
    player.level -= 1;
    const req = player.stats.xpFixed || levelRequirement(player.level);
    player.xpNeeded = req;
    player.xp = req;
  }
  updatePlayerStats(state);
  return success && remaining === 0;
}

function computeShopPrice(state, basePrice) {
  const level = state.player.level;
  const baseWithLevel = Math.max(1, basePrice + 2 * level);
  const scaled = Math.floor(baseWithLevel * (1 + 0.02 * level));
  const discountFactor = clamp(1 - (state.player.stats.shopDiscount || 0), 0.05, 1);
  return Math.max(1, Math.floor(scaled * discountFactor));
}

function applyAttributeBoost(state, source = 'shop') {
  const rollAttack = Math.random() < 0.5;
  let effectText;
  if (rollAttack) {
    state.player.permanent.attackFlat += 5;
    effectText = '攻击+5';
  } else {
    state.player.permanent.hpFlat += 10;
    effectText = '最大生命+10';
  }
  updatePlayerStats(state);
  const msg =
    source === 'potion'
      ? `属性增强剂在体内生效，${effectText}。`
      : `属性增强剂立即生效，${effectText}。`;
  pushLog(msg);
}

function grantUniqueRareRelic(state) {
  const rarePool = RELICS.filter((r) => r.quality === 'rare');
  const owned = new Set(state.player.inventory.relics.map((r) => r.id));
  let candidates = rarePool.filter((r) => !owned.has(r.id));
  if (candidates.length === 0) {
    const compensation = 500;
    addGold(state, compensation);
    pushLog(`你已拥有全部稀有藏品，奖励转换为${compensation}金币。`);
    return;
  }
  const relic = randomChoice(candidates);
  grantRelic(state, relic.id);
}

function tickBattleCooldowns(player) {
  if (!player.cooldowns) return;
  Object.keys(player.cooldowns).forEach((key) => {
    if (player.cooldowns[key] > 0) {
      player.cooldowns[key] = Math.max(0, player.cooldowns[key] - 1);
    }
  });
}

function isHeartDemon(enemy) {
  return !!(enemy && (enemy.isHeartDemon || enemy.id === 'heartDemon' || enemy.name === '心魔幻影'));
}

function startGame() {
  init();
}

document.addEventListener('DOMContentLoaded', init);
