import exerciseGifMap from '../exercise-gif-map.json';

const entries = exerciseGifMap.entries;
const gifByExerciseId = new Map();

for (const entry of entries) {
  gifByExerciseId.set(entry.exercise_id, entry);
  const aliases = Array.isArray(entry.application_aliases)
    ? entry.application_aliases
    : entry.application_aliases
      ? [entry.application_aliases]
      : [];
  for (const alias of aliases) {
    gifByExerciseId.set(alias, entry);
  }
}

export const EXERCISE_GIF_MAP = exerciseGifMap;

export function resolveExerciseGif(exerciseId) {
  const entry = gifByExerciseId.get(exerciseId);
  return entry && ['confirmed', 'probable'].includes(entry.status) && entry.path
    ? entry
    : null;
}
