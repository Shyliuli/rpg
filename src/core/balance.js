import { clamp } from './utils.js';
import { SEGMENT_MULTIPLIERS } from './constants.js';

export function pwLinear(level, base, perArray) {
  const spans = [10, 20, 30, 40, 50, Infinity];
  let L = Math.max(0, Math.floor(level));
  let total = base;
  for (let i = 0; i < 6 && L > 0; i++) {
    const take = Math.min(L, spans[i] === Infinity ? L : spans[i]);
    const perLevel = (perArray[i] || 0) * (SEGMENT_MULTIPLIERS[i] || 1);
    total += take * perLevel;
    L -= take;
  }
  let result = Math.floor(total);
  // 150级后额外指数增益：按 1.010^(L-150) 平滑增强
  const extraLevels = Math.max(0, Math.floor(level - 150));
  if (extraLevels > 0) {
    const exponentialBoost = Math.pow(1.010, extraLevels);
    result = Math.floor(result * exponentialBoost);
  }
  return result;
}

export function difficultyMultiplier(difficultyLevel) {
  const d = difficultyLevel;
  if (d <= 9) {
    return 0.45 + (d * (0.55 / 9));
  }
  if (d <= 12) {
    return 1 + 0.15 * (d - 9);
  }
  return 1.45 + 0.3 * (d - 12);
}

export function scaleStatsByDifficulty(stats, difficultyLevel) {
  const mult = difficultyMultiplier(difficultyLevel);
  return {
    hp: Math.max(1, Math.floor(stats.hp * mult)),
    attack: Math.max(1, Math.floor(stats.attack * mult)),
    defense: Math.max(0, Math.floor(stats.defense * mult)),
    resist: Math.max(0, Math.floor(stats.resist * mult))
  };
}

export function applyHighDifficultyStatGrowth(stats, level, difficultyLevel, baselineStats) {
  if (!stats) return stats;
  if (difficultyLevel < 9 || level <= 30) return stats;
  const hpMultiplier = difficultyLevel >= 12 ? 3 : 1.5;
  const attackMultiplier = difficultyLevel >= 12 ? 1.35 : 1;
  const amplifyDelta = (key, multiplier, min) => {
    if (typeof stats[key] !== 'number' || multiplier === 1) return;
    const baseline = baselineStats && typeof baselineStats[key] === 'number' ? baselineStats[key] : null;
    if (baseline !== null) {
      const delta = stats[key] - baseline;
      if (delta > 0) {
        stats[key] = Math.max(min, Math.floor(baseline + delta * multiplier));
        return;
      }
    }
    stats[key] = Math.max(min, Math.floor(stats[key] * multiplier));
  };
  amplifyDelta('hp', hpMultiplier, 1);
  amplifyDelta('attack', attackMultiplier, 1);
  return stats;
}

export function applyPhysicalDamage(baseDamage, defense) {
  const reduced = baseDamage - defense;
  return Math.max(Math.floor(reduced), Math.floor(baseDamage * 0.05));
}

export function applyMagicDamage(base, resist, penetration) {
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

export function applyBattleMultipliers(state, baseDamage, tier) {
  const stats = state.player.stats;
  let damage = baseDamage;
  if (tier === 'elite') {
    damage *= 1 + (stats.damageVsElite || 0);
  } else if (tier === 'normal') {
    damage *= 1 + (stats.damageVsNormal || 0);
  }
  if (state.encounter?.tempRelics) {
    state.encounter.tempRelics.forEach((id) => {
      if (id === 'deathEye') {
        damage *= 1.1;
      } else if (id === 'elementHeart') {
        damage *= 1.1;
      }
    });
  }
  return Math.floor(damage);
}

export function checkCrit(chance) {
  return Math.random() < clamp(chance, 0, 0.95);
}

