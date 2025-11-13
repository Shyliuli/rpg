export const POTIONS = [
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

