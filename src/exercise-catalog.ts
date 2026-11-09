import exerciseCatalog from '../catalogo.json';

function getFallbackIllustration(group = '') {
  const value = group.toLocaleLowerCase('pt-BR');
  if (/peito|chest/.test(value)) return 'chest-press';
  if (/quadr|coxa|perna|posterior/.test(value)) return 'legpress';
  if (/ombro|delto/.test(value)) return 'lateral-raise';
  if (/b[ií]ceps/.test(value)) return 'biceps';
  if (/tr[ií]ceps/.test(value)) return 'triceps';
  if (/panturr|calf/.test(value)) return 'calf-raise';
  if (/gl[uú]te|hip/.test(value)) return 'hip-thrust';
  if (/cost|dors|back/.test(value)) return 'row';
  return 'squat';
}

export const EXERCISE_CATALOG_DATABASE = exerciseCatalog.map((exercise) => ({
  id: exercise.id,
  name: exercise.nome_pt,
  nameEn: exercise.nome_en,
  category: exercise.grupo_muscular,
  equipment: exercise.equipamento,
  instructions: exercise.instrucoes_execucao || [],
  commonMistakes: exercise.erros_comuns || [],
  primaryMuscles: exercise.musculos_primarios || [],
  secondaryMuscles: exercise.musculos_secundarios || [],
  svgType: getFallbackIllustration(exercise.grupo_muscular),
}));
