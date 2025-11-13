export const HEROES = [
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
      { id: 'chargeUp', name: '蓄力', cost: 15, description: '攻击力+30%，持续3回合', type: 'buff' },
      { id: 'bullRush', name: '冲撞', cost: 10, description: '150%攻击+15%最大生命的物理伤害，自损5%生命', type: 'attack' }
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
      { id: 'backstab', name: '背刺', cost: 15, description: '两段85%攻击力的物理伤害', type: 'attack' },
      { id: 'nimble', name: '迅捷', cost: 40, description: '获得40%闪避，持续3回合', type: 'buff' }
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
    normalAttack: { type: 'magic', hits: [{ ratio: 0.55 }, { ratio: 0.55 }] },
    skills: [
      { id: 'meteor', name: '大荒星陨灭', cost: 70, description: '325%法术伤害，自身眩晕1回合', type: 'attack' },
      { id: 'lifeSpring', name: '生命源泉', cost: 20, description: '回复200%攻击力生命，生成100%攻击力护盾', type: 'support' }
    ]
  }
];

