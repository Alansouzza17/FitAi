const { z } = require('zod');

const profileSchema = z.object({
  name: z.string().max(100).optional().default(''), age: z.coerce.number().int().min(13).max(100),
  gender: z.string().max(40).optional().default(''), height: z.coerce.number().min(100).max(250),
  weight: z.coerce.number().min(30).max(400), objective: z.string().min(2).max(100),
  level: z.string().max(40).optional().default('iniciante'), daysAvailable: z.coerce.number().int().min(1).max(7),
  timeAvailable: z.coerce.number().int().min(15).max(240), environment: z.string().max(100).optional().default('academia'),
  equipment: z.array(z.string().max(60)).max(30).optional().default([]), focusMuscles: z.array(z.string().max(60)).max(15).optional().default([]),
  avoidExercises: z.string().max(500).optional().default(''), physicalLimitations: z.string().max(500).optional().default(''),
  measurements: z.object({ armRight: z.coerce.number().optional(), chest: z.coerce.number().optional(), waist: z.coerce.number().optional() }).optional().default({})
});
const exerciseSchema = z.object({ id: z.enum(['bench-press','squat','deadlift','lat-pulldown','overhead-press','biceps-curl','triceps-pushdown','leg-press']), name: z.string().min(2).max(120), sets: z.number().int().min(1).max(8), reps: z.string().min(1).max(30), rest: z.string().min(1).max(20), notes: z.string().max(500).default('') });
const workoutSchema = z.object({ splitName: z.string().min(2).max(100), summary: z.string().min(5).max(1200), warmupTips: z.string().max(1000).default(''), progressionStrategy: z.string().max(1000).default(''), days: z.array(z.object({ dayTitle: z.string().min(2).max(100), targetMuscles: z.array(z.string().max(60)).max(12), estimatedMinutes: z.number().int().min(15).max(240), exercises: z.array(exerciseSchema).min(1).max(12) })).min(1).max(7) });
function send(res, status, payload) { return res.status(status).json(payload); }
async function handleGenerateWorkout(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Método não permitido.' });
  try {
    const profile = profileSchema.parse(req.body?.profile);
    if (!process.env.GEMINI_API_KEY) return send(res, 503, { error: 'A geração por IA não está configurada no servidor.' });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const prompt = `Crie um plano de musculação seguro e personalizado. Use apenas exercícios do catálogo: bench-press, squat, deadlift, lat-pulldown, overhead-press, biceps-curl, triceps-pushdown, leg-press. Respeite restrições, experiência, equipamentos e duração solicitada. Não diagnostique nem invente garantias. Retorne exclusivamente JSON no formato {"splitName":"...","summary":"...","warmupTips":"...","progressionStrategy":"...","days":[{"dayTitle":"...","targetMuscles":["..."],"estimatedMinutes":50,"exercises":[{"id":"bench-press","name":"...","sets":3,"reps":"8-12","rest":"60s","notes":"..."}]}]}. Perfil do aluno: ${JSON.stringify(profile)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);
    let response;
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
        method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.4 } })
      });
    } finally { clearTimeout(timeout); }
    if (!response.ok) return send(res, 502, { error: 'O serviço de IA está indisponível. Tente novamente.' });
    const result = await response.json();
    const raw = result.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('');
    if (!raw) return send(res, 502, { error: 'A IA não retornou um treino válido. Tente novamente.' });
    const workout = workoutSchema.parse(JSON.parse(raw));
    workout.id = `plan-${Date.now()}`;
    workout.createdAt = new Date().toISOString();
    return send(res, 200, { workout });
  } catch (error) {
    if (error?.name === 'ZodError' || error instanceof SyntaxError) return send(res, 400, { error: 'Dados do perfil ou resposta de treino inválidos.' });
    if (error?.name === 'AbortError') return send(res, 504, { error: 'A geração demorou demais. Tente novamente.' });
    console.error('Generate workout error:', error.message);
    return send(res, 500, { error: 'Não foi possível gerar o treino agora.' });
  }
}
module.exports = { handleGenerateWorkout };
