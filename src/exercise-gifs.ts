import exerciseGifMap from '../exercise-gif-map.json';

const entries = exerciseGifMap.entries;
const gifByExerciseId = new Map();

for (const entry of entries) {
  gifByExerciseId.set(entry.exercise_id, entry);
  for (const alias of entry.application_aliases || []) {
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
