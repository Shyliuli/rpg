// BattleEngine encapsulates common battle-time mutations and debuffs
export class BattleEngine {
  applyOnHitDebuffs(enemy, context, logger = (msg) => {}) {
    if (!enemy || enemy.currentHp <= 0) return;
    const logs = [];
    if (context.elementHeart) {
      const prevResist = enemy.resist;
      const prevAttack = enemy.attack;
      enemy.resist = Math.max(0, enemy.resist - 15);
      enemy.attack = Math.max(0, enemy.attack - 5);
      if (enemy.resist !== prevResist || enemy.attack !== prevAttack) {
        logs.push('元素之心蚕食敌人（法抗-15，攻击-5）');
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
    if (context.resistFlatShredOnHit && context.resistFlatShredOnHit > 0) {
      const prevResist = enemy.resist;
      enemy.resist = Math.max(0, enemy.resist - context.resistFlatShredOnHit);
      if (enemy.resist !== prevResist) {
        logs.push(`法术崩坏者蚕食敌法抗（-${context.resistFlatShredOnHit}）`);
      }
    }
    logs.forEach((msg) => logger(msg));
  }
}

