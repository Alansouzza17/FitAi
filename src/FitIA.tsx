import React, { useState, useEffect, useRef } from 'react';
import { 
  Dumbbell, Activity, Calendar, Trophy, User, Settings, Play, CheckCircle2, 
  Flame, ChevronRight, ChevronLeft, Heart, ShieldAlert, Sparkles, Timer, 
  Plus, ArrowUpRight, TrendingUp, Info, Eye, RotateCcw, AlertTriangle, 
  Search, Filter, X, Award, Clock, Save, BarChart3, RefreshCw
} from 'lucide-react';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const STORAGE_KEYS = { profile: 'fitia.profile.v1', workout: 'fitia.workout.v1', history: 'fitia.history.v1' };
function readStoredValue(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
}

// --- EXERCISE DATABASE WITH SVGS ---
const EXERCISE_DATABASE = [
  {
    id: 'bench-press',
    name: 'Supino Reto com Barra',
    category: 'Peitoral',
    secondary: ['Tríceps', 'Deltoide Anterior'],
    equipment: 'Barra e Banco Reto',
    instructions: [
      'Deite-se no banco com os pés firmes no chão.',
      'Segure a barra com pegada um pouco mais larga que os ombros.',
      'Abaixe a barra de forma controlada até tocar suavemente a parte média do peitoral.',
      'Empurre a barra até a extensão quase completa dos cotovelos mantendo as escápulas aduzidas.'
    ],
    commonMistakes: [
      'Empinar os cotovelos a 90 graus (sobrecarrega ombros).',
      'Tirar o quadril do banco durante o movimento.',
      'Bater a barra no peito sem controle.'
    ],
    svgType: 'chest-press'
  },
  {
    id: 'squat',
    name: 'Agachamento Livre com Barra',
    category: 'Quadríceps',
    secondary: ['Glúteos', 'Isquiotibiais', 'Lombar'],
    equipment: 'Barra Olímpica e Racks',
    instructions: [
      'Posicione a barra sobre o trapézio superior (não no pescoço).',
      'Mantenha os pés alinhados com a largura dos ombros, ligeiramente apontados para fora.',
      'Inicie a descida projetando o quadril para trás e dobrando os joelhos.',
      'Desça até passar a linha paralela (joelhos em relação ao quadril) mantendo o tronco ereto.',
      'Empurre o chão com os pés para retornar à posição inicial.'
    ],
    commonMistakes: [
      'Valgo dinâmico (joelhos caindo para dentro na subida).',
      'Curvar a lombar na parte inferior ("butt wink").',
      'Elevar os calcanhares do solo.'
    ],
    svgType: 'squat'
  },
  {
    id: 'deadlift',
    name: 'Levantamento Terra Convenção',
    category: 'Cadeia Posterior',
    secondary: ['Lombar', 'Glúteos', 'Trapézio', 'Antebraço'],
    equipment: 'Barra e Anilhas',
    instructions: [
      'Fique de pé com as canelas a 2-3cm da barra.',
      'Incline-se mantendo a coluna neutra e segure a barra.',
      'Respire fundo, contraia o abdômen (manobra de valsalva) e empurre o chão com os pés.',
      'Mantenha a barra próxima ao corpo durante toda a subida até ficar ereto.',
      'Retorne controladamente.'
    ],
    commonMistakes: [
      'Arredondar a coluna lombar na saída.',
      'Puxar a barra longe do corpo.',
      'Hiperextender demais as costas no final da subida.'
    ],
    svgType: 'deadlift'
  },
  {
    id: 'lat-pulldown',
    name: 'Puxada Alta Frontal',
    category: 'Dorsais',
    secondary: ['Bíceps', 'Deltoide Posterior'],
    equipment: 'Polia com Barra',
    instructions: [
      'Sente-se e apoie as coixas firmemente nos suportes.',
      'Segure a barra com pegada pronada aberta.',
      'Puxe a barra em direção ao peitoral superior trazendo os cotovelos para baixo e para trás.',
      'Retorne estendendo totalmente os braços mantendo o peito aberto.'
    ],
    commonMistakes: [
      'Inclinar o tronco exageradamente para trás.',
      'Puxar a barra atrás do pescoço (risco articular).',
      'Usar impulso em vez da força dorsal.'
    ],
    svgType: 'pulldown'
  },
  {
    id: 'overhead-press',
    name: 'Desenvolvimento de Ombros com Halteres',
    category: 'Deltoides',
    secondary: ['Tríceps', 'Parte superior do Peito'],
    equipment: 'Halteres e Banco 90°',
    instructions: [
      'Sente-se com as costas bem apoiadas.',
      'Segure os halteres na altura das orelhas com cotovelos levemente apontados à frente.',
      'Empurre os halteres para cima até estender quase totalmente os braços.',
      'Desça de forma lenta até a altura do queixo/ombros.'
    ],
    commonMistakes: [
      'Bater os halteres no topo.',
      'Hiperextender a lombar tirando as costas do apoio.',
      'Descer com amplitudes extremamente curtas.'
    ],
    svgType: 'shoulder-press'
  },
  {
    id: 'biceps-curl',
    name: 'Rosca Direta com Barra W',
    category: 'Bíceps',
    secondary: ['Antebraço'],
    equipment: 'Barra W',
    instructions: [
      'Em pé, mantenha os cotovelos colados ao lado do tronco.',
      'Segure a barra nas empunhaduras inclinadas.',
      'Flexione os cotovelos subindo a barra mantendo o braço estável.',
      'Suba até a contração máxima e desça em 2 a 3 segundos.'
    ],
    commonMistakes: [
      'Balançar o corpo (roubar com a lombar).',
      'Mover os cotovelos para frente durante a subida.',
      'Despencar o peso sem controlar a descida.'
    ],
    svgType: 'biceps'
  },
  {
    id: 'triceps-pushdown',
    name: 'Tríceps Pulley na Corda',
    category: 'Tríceps',
    secondary: ['Antebraço'],
    equipment: 'Polia Alta com Corda',
    instructions: [
      'Afaste os pés, joelhos levemente flexionados, tronco inclinado 5° à frente.',
      'Mantenha os cotovelos travados ao lado da cintura.',
      'Estenda os cotovelos empurrando a corda para baixo e afastando as pontas no final.',
      'Retorne flexionando até um ângulo de 90°.'
    ],
    commonMistakes: [
      'Subir demais o cotovelo perdendo a tensão.',
      'Usar os ombros para empurrar a carga.',
      'Fazer o movimento rápido e descontrolado.'
    ],
    svgType: 'triceps'
  },
  {
    id: 'leg-press',
    name: 'Leg Press 45°',
    category: 'Quadríceps',
    secondary: ['Glúteos', 'Panturrilhas'],
    equipment: 'Máquina Leg Press 45',
    instructions: [
      'Posicione os pés no centro da plataforma alinhados aos ombros.',
      'Destrave o aparelho e desça a plataforma até um ângulo de 90° de joelho.',
      'Empurre a plataforma sem travar (hiperestender) os joelhos no topo.'
    ],
    commonMistakes: [
      'Tirar a bacia/sacro do encosto do banco no ponto mais baixo.',
      'Estender totalmente e dar tranco nos joelhos.',
      'Juntar os joelhos para dentro durante o esforço.'
    ],
    svgType: 'legpress'
  }
];

// SVG Renderer Component for Dynamic Diagrams
const ExerciseSVG = ({ type }) => {
  return (
    <div className="w-full h-48 bg-zinc-950 rounded-xl flex items-center justify-center p-4 relative overflow-hidden border border-zinc-800/80 group">
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80 z-10" />
      <svg className="w-full h-full max-h-40 text-lime-400 stroke-current transition-transform duration-500 group-hover:scale-105" viewBox="0 0 200 200" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {type === 'chest-press' && (
          <g>
            <path d="M 30 140 L 170 140" stroke="#52525b" strokeWidth="6" />
            <path d="M 40 140 L 40 170 M 160 140 L 160 170" stroke="#52525b" strokeWidth="4" />
            <circle cx="80" cy="115" r="12" stroke="#84cc16" strokeWidth="3" />
            <path d="M 80 127 L 130 127 L 145 138" stroke="#84cc16" strokeWidth="4" />
            <path d="M 100 127 L 100 95 L 125 90" stroke="#a3e635" strokeWidth="4" />
            <line x1="125" y1="65" x2="125" y2="125" stroke="#ef4444" strokeWidth="6" />
            <rect x="120" y="55" width="10" height="12" fill="#ef4444" rx="2" />
            <rect x="120" y="123" width="10" height="12" fill="#ef4444" rx="2" />
          </g>
        )}
        {type === 'squat' && (
          <g>
            <circle cx="100" cy="45" r="12" stroke="#84cc16" strokeWidth="3" />
            <path d="M 100 57 L 90 105 L 115 145 L 125 170" stroke="#84cc16" strokeWidth="4" />
            <path d="M 90 105 L 75 140 L 65 170" stroke="#84cc16" strokeWidth="4" />
            <line x1="50" y1="60" x2="150" y2="60" stroke="#ef4444" strokeWidth="6" />
            <rect x="42" y="50" width="10" height="20" fill="#ef4444" rx="2" />
            <rect x="148" y="50" width="10" height="20" fill="#ef4444" rx="2" />
            <path d="M 90 60 L 95 85 L 125 70" stroke="#a3e635" strokeWidth="3" />
          </g>
        )}
        {type === 'deadlift' && (
          <g>
            <circle cx="100" cy="55" r="12" stroke="#84cc16" strokeWidth="3" />
            <path d="M 100 67 L 95 110 L 80 170" stroke="#84cc16" strokeWidth="4" />
            <path d="M 95 110 L 110 170" stroke="#84cc16" strokeWidth="4" />
            <path d="M 97 75 L 80 115 L 70 125" stroke="#a3e635" strokeWidth="4" />
            <line x1="40" y1="130" x2="160" y2="130" stroke="#ef4444" strokeWidth="6" />
            <circle cx="40" cy="130" r="18" fill="#18181b" stroke="#ef4444" strokeWidth="4" />
            <circle cx="160" cy="130" r="18" fill="#18181b" stroke="#ef4444" strokeWidth="4" />
          </g>
        )}
        {type === 'pulldown' && (
          <g>
            <path d="M 50 30 L 150 30" stroke="#52525b" strokeWidth="4" />
            <line x1="100" y1="30" x2="100" y2="70" stroke="#71717a" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="60" y1="70" x2="140" y2="70" stroke="#ef4444" strokeWidth="5" />
            <circle cx="100" cy="85" r="12" stroke="#84cc16" strokeWidth="3" />
            <path d="M 100 97 L 100 145 L 85 185" stroke="#84cc16" strokeWidth="4" />
            <path d="M 100 145 L 115 185" stroke="#84cc16" strokeWidth="4" />
            <path d="M 100 105 L 70 73" stroke="#a3e635" strokeWidth="4" />
            <path d="M 100 105 L 130 73" stroke="#a3e635" strokeWidth="4" />
          </g>
        )}
        {type === 'shoulder-press' && (
          <g>
            <rect x="85" y="110" width="30" height="65" fill="#27272a" stroke="#52525b" rx="4" />
            <circle cx="100" cy="65" r="12" stroke="#84cc16" strokeWidth="3" />
            <path d="M 100 77 L 100 130" stroke="#84cc16" strokeWidth="4" />
            <path d="M 100 90 L 70 80 L 65 50" stroke="#a3e635" strokeWidth="4" />
            <path d="M 100 90 L 130 80 L 135 50" stroke="#a3e635" strokeWidth="4" />
            <rect x="55" y="42" width="20" height="10" fill="#ef4444" rx="2" />
            <rect x="125" y="42" width="20" height="10" fill="#ef4444" rx="2" />
          </g>
        )}
        {type === 'biceps' && (
          <g>
            <circle cx="100" cy="50" r="12" stroke="#84cc16" strokeWidth="3" />
            <path d="M 100 62 L 100 130 L 85 175" stroke="#84cc16" strokeWidth="4" />
            <path d="M 100 130 L 115 175" stroke="#84cc16" strokeWidth="4" />
            <path d="M 100 75 L 115 95 L 90 90" stroke="#a3e635" strokeWidth="4" />
            <line x1="75" y1="90" x2="105" y2="90" stroke="#ef4444" strokeWidth="6" />
          </g>
        )}
        {type === 'triceps' && (
          <g>
            <path d="M 100 20 L 100 60" stroke="#52525b" strokeWidth="3" />
            <circle cx="100" cy="75" r="12" stroke="#84cc16" strokeWidth="3" />
            <path d="M 100 87 L 100 140 L 90 180" stroke="#84cc16" strokeWidth="4" />
            <path d="M 100 140 L 110 180" stroke="#84cc16" strokeWidth="4" />
            <path d="M 100 95 L 110 120 L 100 140" stroke="#a3e635" strokeWidth="4" />
          </g>
        )}
        {type === 'legpress' && (
          <g>
            <path d="M 40 160 L 160 40" stroke="#52525b" strokeWidth="6" />
            <rect x="130" y="30" width="40" height="12" fill="#ef4444" rx="2" transform="rotate(-45 150 36)" />
            <circle cx="65" cy="140" r="12" stroke="#84cc16" strokeWidth="3" />
            <path d="M 65 152 L 90 155 L 120 100 L 140 55" stroke="#84cc16" strokeWidth="4" />
          </g>
        )}
      </svg>
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between z-20">
        <span className="text-[10px] uppercase tracking-wider font-bold text-lime-400 bg-lime-950/80 px-2 py-0.5 rounded border border-lime-800/50">
          Ilustração Técnica
        </span>
        <span className="text-[10px] text-zinc-400 bg-zinc-900/90 px-2 py-0.5 rounded">
          Visão Biomecânica
        </span>
      </div>
    </div>
  );
};

// --- DEFAULT STATE MOCKS & HELPERS ---
const DEFAULT_USER_PROFILE = {
  name: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  targetWeight: '',
  objective: '',
  level: 'iniciante',
  daysAvailable: '3',
  timeAvailable: '45',
  environment: 'academia',
  equipment: [],
  focusMuscles: [],
  avoidExercises: '',
  physicalLimitations: '',
  measurements: {
    armRight: '', armLeft: '', chest: '', waist: '', abdomen: '', hips: '',
    thighRight: '', thighLeft: '', calfRight: '', calfLeft: ''
  }
};
const FOCUS_MUSCLE_OPTIONS = ['Peitoral', 'Costas', 'Ombros', 'Braços', 'Abdômen', 'Glúteos', 'Quadríceps', 'Posteriores de coxa', 'Panturrilhas', 'Corpo inteiro'];

function getProfileValidationErrors(profile) {
  const errors = [];
  const age = Number(profile.age);
  const height = Number(profile.height);
  const weight = Number(profile.weight);
  const minutes = Number(profile.timeAvailable);
  if (!String(profile.name || '').trim()) errors.push('nome');
  if (!Number.isInteger(age) || age < 13 || age > 100) errors.push('idade entre 13 e 100 anos');
  if (!Number.isFinite(height) || height < 100 || height > 250) errors.push('altura entre 100 e 250 cm');
  if (!Number.isFinite(weight) || weight < 30 || weight > 400) errors.push('peso entre 30 e 400 kg');
  if (!String(profile.objective || '').trim()) errors.push('objetivo');
  if (!Number.isInteger(Number(profile.daysAvailable)) || Number(profile.daysAvailable) < 1 || Number(profile.daysAvailable) > 7) errors.push('dias disponíveis');
  if (!Number.isInteger(minutes) || minutes < 15 || minutes > 240) errors.push('tempo de treino entre 15 e 240 minutos');
  return errors;
}

const DEFAULT_WORKOUT_PLAN = {
  id: 'plan-1',
  createdAt: new Date().toISOString(),
  splitName: 'Upper / Lower Personalizado (4 Dias)',
  summary: 'Plano otimizado focado em hipertrofia de tronco com preservação articular para ombro direito.',
  warmupTips: '5-10 min de cardio leve + mobilidade de ombros com elástico (manguito rotador) e mobilidade de quadril.',
  progressionStrategy: 'Aumentar a carga em 2-5% quando atingir o teto de repetições estipulado com forma impecável.',
  days: [
    {
      dayTitle: 'Treino A — Superior (Foco Peitoral & Costas)',
      targetMuscles: ['Peitoral', 'Dorsais', 'Ombros', 'Bíceps', 'Tríceps'],
      estimatedMinutes: 55,
      exercises: [
        { id: 'bench-press', name: 'Supino Reto com Barra', sets: 4, reps: '8-10', rest: '90s', notes: 'Manter escápulas retraídas.' },
        { id: 'lat-pulldown', name: 'Puxada Alta Frontal', sets: 4, reps: '10-12', rest: '75s', notes: 'Foco na contração dos dorsais.' },
        { id: 'overhead-press', name: 'Desenvolvimento de Ombros com Halteres', sets: 3, reps: '10-12', rest: '60s', notes: 'Manter cotovelos 30° à frente.' },
        { id: 'biceps-curl', name: 'Rosca Direta com Barra W', sets: 3, reps: '12-15', rest: '60s', notes: 'Sem balanço do tronco.' },
        { id: 'triceps-pushdown', name: 'Tríceps Pulley na Corda', sets: 3, reps: '12-15', rest: '60s', notes: 'Pico de contração de 1 seg embaixo.' }
      ]
    },
    {
      dayTitle: 'Treino B — Inferior (Foco Quadríceps & Posterior)',
      targetMuscles: ['Quadríceps', 'Isquiotibiais', 'Glúteos', 'Panturrilhas'],
      estimatedMinutes: 60,
      exercises: [
        { id: 'leg-press', name: 'Leg Press 45°', sets: 4, reps: '10-12', rest: '90s', notes: 'Pés alinhados no centro da plataforma.' },
        { id: 'deadlift', name: 'Levantamento Terra Convenção', sets: 3, reps: '6-8', rest: '120s', notes: 'Manter coluna 100% neutra.' },
        { id: 'squat', name: 'Agachamento Livre com Barra', sets: 3, reps: '8-10', rest: '90s', notes: 'Controlar a descida.' }
      ]
    }
  ]
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState(() => readStoredValue(STORAGE_KEYS.profile, DEFAULT_USER_PROFILE));
  const [workoutPlan, setWorkoutPlan] = useState(() => readStoredValue(STORAGE_KEYS.workout, null));

  // Active workout execution state
  const [activeWorkoutDay, setActiveWorkoutDay] = useState(null);
  const [workoutLogs, setWorkoutLogs] = useState({});
  const [activeTimer, setActiveTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [selectedExerciseForModal, setSelectedExerciseForModal] = useState(null);

  // AI Loading & Error State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiError, setAiError] = useState('');
  const [isOnline, setIsOnline] = useState(() => typeof navigator === 'undefined' ? true : navigator.onLine);

  // Evolution History Logs
  const [historyLogs, setHistoryLogs] = useState(() => readStoredValue(STORAGE_KEYS.history, []));
  const profileValidationErrors = getProfileValidationErrors(userProfile);

  // Keep offline state visible; AI generation remains online-only.
  useEffect(() => {
    const update = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('/service-worker.js').catch(() => {});
    document.title = 'FitIA — Seu Personal Trainer Inteligente';
    const meta = document.querySelector('meta[name="viewport"]') || document.createElement('meta');
    meta.setAttribute('name', 'viewport'); meta.setAttribute('content', 'width=device-width, initial-scale=1, viewport-fit=cover');
    if (!meta.parentNode) document.head.appendChild(meta);
    return () => { window.removeEventListener('online', update); window.removeEventListener('offline', update); };
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(userProfile)); } catch {}
  }, [userProfile]);
  useEffect(() => {
    try { if (workoutPlan) localStorage.setItem(STORAGE_KEYS.workout, JSON.stringify(workoutPlan)); else localStorage.removeItem(STORAGE_KEYS.workout); } catch {}
  }, [workoutPlan]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(historyLogs)); } catch {}
  }, [historyLogs]);

  // Rest Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && activeTimer > 0) {
      interval = setInterval(() => {
        setActiveTimer((prev) => prev - 1);
      }, 1000);
    } else if (activeTimer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, activeTimer]);

  const startRestTimer = (seconds = 60) => {
    setActiveTimer(seconds);
    setIsTimerRunning(true);
  };

  // Gemini API Workout Generator Call
  const handleGenerateAIWorkout = async () => {
    if (profileValidationErrors.length) {
      setAiError(`Complete a avaliação antes de gerar: ${profileValidationErrors.join(', ')}.`);
      setActiveTab('profile');
      return;
    }
    if (!navigator.onLine) { setAiError('A geração de treinos com IA precisa de conexão com a internet. Reconecte-se e tente novamente.'); return; }
    setIsGeneratingAI(true);
    setAiError('');

    try {
      if (!API_BASE_URL && location.hostname.endsWith('vercel.app')) {
        throw new Error('Configure VITE_API_BASE_URL na Vercel com a URL do backend Render e publique novamente.');
      }
      const response = await fetch(`${API_BASE_URL}/api/generate-workout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: userProfile })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Não foi possível gerar o treino.');
      const generatedPlan = result.workout;
      generatedPlan.id = `plan-${Date.now()}`;
      generatedPlan.createdAt = new Date().toISOString();

      setWorkoutPlan(generatedPlan);

      setActiveTab('workout');
    } catch (err) {
      console.error("AI Generation Error:", err);
      setAiError(err?.message || "Ocorreu um erro ao gerar seu treino. Tente novamente.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const saveProfileData = async (updated) => {
    setUserProfile(updated);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col md:flex-row antialiased selection:bg-lime-500 selection:text-zinc-950">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-zinc-900 border-r border-zinc-800/80 p-5 justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 flex items-center justify-center text-zinc-950 font-black shadow-lg shadow-lime-500/20">
              <Dumbbell className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Fit<span className="text-lime-400">IA</span>
              </span>
              <p className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase">Inteligência Fitness</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <NavButton id="dashboard" icon={Activity} label="Painel Inicial" active={activeTab} onClick={setActiveTab} />
            <NavButton id="workout" icon={Dumbbell} label="Meu Treino" active={activeTab} onClick={setActiveTab} />
            <NavButton id="generator" icon={Sparkles} label="Gerar com IA" active={activeTab} onClick={setActiveTab} highlight />
            <NavButton id="exercises" icon={Eye} label="Exercícios & Técnica" active={activeTab} onClick={setActiveTab} />
            <NavButton id="evolution" icon={TrendingUp} label="Evolução Física" active={activeTab} onClick={setActiveTab} />
            <NavButton id="profile" icon={User} label="Perfil & Medidas" active={activeTab} onClick={setActiveTab} />
          </nav>
        </div>

        {/* User Card */}
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-lime-400/10 border border-lime-500/30 flex items-center justify-center text-lime-400 font-bold text-sm">
            {userProfile.name ? userProfile.name.charAt(0) : 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-zinc-200 truncate">{userProfile.name}</p>
            <p className="text-[10px] text-lime-400 capitalize flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              {userProfile.level}
            </p>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className={`mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 px-2 pt-2 flex items-center justify-around ${activeTab === 'active-workout' ? 'is-workout-hidden' : ''}`} aria-label="Navegação principal">
        <MobileNavButton id="dashboard" icon={Activity} label="Início" active={activeTab} onClick={setActiveTab} />
        <MobileNavButton id="workout" icon={Dumbbell} label="Treino" active={activeTab} onClick={setActiveTab} />
        <MobileNavButton id="generator" icon={Sparkles} label="IA" active={activeTab} onClick={setActiveTab} highlight />
        <MobileNavButton id="exercises" icon={Eye} label="Catálogo" active={activeTab} onClick={setActiveTab} />
        <MobileNavButton id="profile" icon={User} label="Perfil" active={activeTab} onClick={setActiveTab} />
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className={`app-main flex-1 overflow-y-auto pb-24 md:pb-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full ${activeTab === 'active-workout' ? 'is-workout-main' : ''}`}>
        
        {!isOnline && <div role="status" className="mb-4 rounded-xl border border-amber-700/60 bg-amber-950/50 px-4 py-3 text-sm text-amber-200">Você está offline. Recursos online e a geração de treinos por IA não estão disponíveis.</div>}
        {!isOnline && <div role="status" className="mb-4 rounded-xl border border-amber-700/60 bg-amber-950/50 px-4 py-3 text-sm text-amber-200">Sem conexão. Seus dados permanecem neste dispositivo; a geração de treinos precisa de internet.</div>}

        {/* TOP HEALTH DISCLAIMER BANNER */}
        <div className="mb-6 p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl flex items-start gap-3 text-amber-200/90 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <span className="font-semibold text-amber-300">Aviso de Segurança:</span> O FitIA é uma ferramenta de auxílio baseada em inteligência artificial. Consulte um profissional de educação física e médico antes de iniciar novos treinos. Não treine sentindo dores articulares.
          </p>
        </div>

        {/* VIEW 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <DashboardView 
            userProfile={userProfile} 
            workoutPlan={workoutPlan} 
            historyLogs={historyLogs}
            onStartWorkout={(day) => {
              setActiveWorkoutDay(day);
              setActiveTab('active-workout');
            }}
            onNavigate={setActiveTab}
          />
        )}

        {/* VIEW 2: PROFILE & PHYSICAL ASSESSMENT FORM */}
        {activeTab === 'profile' && (
          <ProfileAssessmentView 
            userProfile={userProfile} 
            onSave={saveProfileData} 
            onGenerateRequest={(profile) => {
              const errors = getProfileValidationErrors(profile);
              if (errors.length) {
                setAiError(`Complete a avaliação antes de gerar: ${errors.join(', ')}.`);
                return;
              }
              setAiError('');
              setActiveTab('generator');
            }}
          />
        )}

        {/* VIEW 3: AI WORKOUT GENERATOR */}
        {activeTab === 'generator' && (
          <AIGeneratorView 
            userProfile={userProfile}
            isGenerating={isGeneratingAI}
            profileComplete={profileValidationErrors.length === 0}
            profileErrors={profileValidationErrors}
            onCompleteProfile={() => setActiveTab('profile')}
            error={aiError}
            onGenerate={handleGenerateAIWorkout}
          />
        )}

        {/* VIEW 4: MY WORKOUT PLAN */}
        {activeTab === 'workout' && (
          <WorkoutPlanView 
            workoutPlan={workoutPlan}
            onStartDay={(day) => {
              setActiveWorkoutDay(day);
              setActiveTab('active-workout');
            }}
            onOpenExerciseModal={(ex) => setSelectedExerciseForModal(ex)}
          />
        )}

        {/* VIEW 5: ACTIVE WORKOUT EXECUTION SESSION */}
        {activeTab === 'active-workout' && (
          <ActiveWorkoutView 
            day={activeWorkoutDay}
            timer={activeTimer}
            isTimerRunning={isTimerRunning}
            onStartTimer={startRestTimer}
            onFinishWorkout={async (session) => {
              if (session) setHistoryLogs((current) => [{ type: 'workout', dayTitle: activeWorkoutDay?.dayTitle || '', completedSets: session.completedSets, weights: session.weights, completedAt: new Date().toISOString(), date: new Date().toISOString() }, ...current]);
              setActiveTab('dashboard');
            }}
          />
        )}

        {/* VIEW 6: EXERCISES CATALOGUE */}
        {activeTab === 'exercises' && (
          <ExerciseCatalogView 
            exercises={EXERCISE_DATABASE}
            onSelectExercise={(ex) => setSelectedExerciseForModal(ex)}
          />
        )}

        {/* VIEW 7: PHYSICAL EVOLUTION */}
        {activeTab === 'evolution' && (
          <EvolutionView 
            historyLogs={historyLogs}
            userProfile={userProfile}
            onAddLog={async (newLog) => {
              setHistoryLogs((current) => [{ ...newLog, date: newLog.date || new Date().toISOString() }, ...current]);
            }}
          />
        )}
      </main>

      {/* EXERCISE DETAIL MODAL */}
      {selectedExerciseForModal && (
        <ExerciseDetailModal 
          exercise={selectedExerciseForModal} 
          onClose={() => setSelectedExerciseForModal(null)}
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS & VIEWS ---

function NavButton({ id, icon: Icon, label, active, onClick, highlight }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-lime-400 text-zinc-950 font-bold shadow-md shadow-lime-500/10' 
          : highlight 
            ? 'bg-zinc-800/80 text-lime-400 border border-lime-500/30 hover:bg-zinc-800' 
            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-950' : highlight ? 'text-lime-400' : 'text-zinc-400'}`} />
      <span>{label}</span>
      {highlight && !isActive && (
        <span className="ml-auto w-2 h-2 rounded-full bg-lime-400 animate-ping" />
      )}
    </button>
  );
}

function MobileNavButton({ id, icon: Icon, label, active, onClick, highlight }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg text-[11px] font-medium transition-all ${
        isActive ? 'text-lime-400 font-bold' : highlight ? 'text-lime-400' : 'text-zinc-400'
      }`}
    >
      <div className={`p-1 rounded-md ${isActive ? 'bg-lime-400/10 text-lime-400' : ''}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span>{label}</span>
    </button>
  );
}

// --- DASHBOARD VIEW ---
function DashboardView({ userProfile, workoutPlan, historyLogs, onStartWorkout, onNavigate }) {
  const nextWorkoutDay = workoutPlan?.days?.[0] || null;
  const currentWeight = userProfile.weight || '76.5';
  const lastLog = historyLogs[0] || {};

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 p-6 md:p-8 border border-zinc-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-500/20 text-lime-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Foco Atual: {userProfile.objective?.toUpperCase()}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pronto para evoluir, <span className="text-lime-400">{userProfile.name}</span>?
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl">
              Seu plano personalizado de treino com apoio de inteligência artificial está atualizado. Acompanhe suas métricas e inicie sua sessão diária.
            </p>
          </div>

          {nextWorkoutDay && (
            <button
              onClick={() => onStartWorkout(nextWorkoutDay)}
              className="bg-lime-400 hover:bg-lime-300 text-zinc-950 font-extrabold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Iniciar Treino de Hoje</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Peso Atual" value={`${currentWeight} kg`} change="-0.7 kg no mês" icon={Flame} color="text-lime-400" />
        <MetricCard title="Braço Direito" value={`${userProfile.measurements?.armRight || '37.5'} cm`} change="+0.4 cm" icon={Trophy} color="text-amber-400" />
        <MetricCard title="Cintura" value={`${userProfile.measurements?.waist || '81.0'} cm`} change="-1.0 cm" icon={Activity} color="text-sky-400" />
        <MetricCard title="Treinos no Mês" value="14 Sessões" change="Meta: 16" icon={CheckCircle2} color="text-emerald-400" />
      </div>

      {/* Next Workout & Workout Plan Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Workout Card */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-lime-400" />
              <h2 className="text-lg font-bold text-white">Próxima Sessão Agendada</h2>
            </div>
            <button 
              onClick={() => onNavigate('workout')} 
              className="text-xs text-lime-400 hover:underline flex items-center gap-1 font-medium"
            >
              Ver divisão completa <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextWorkoutDay ? (
            <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
                <div>
                  <h3 className="font-bold text-base text-zinc-100">{nextWorkoutDay.dayTitle}</h3>
                  <p className="text-xs text-zinc-400">Duração média: ~{nextWorkoutDay.estimatedMinutes} min</p>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {nextWorkoutDay.targetMuscles?.map((m, i) => (
                    <span key={i} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exercise Summary Preview */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Exercícios Previstos:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {nextWorkoutDay.exercises?.slice(0, 4).map((ex, idx) => (
                    <div key={idx} className="bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/50 flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-200 truncate">{ex.name}</span>
                      <span className="text-lime-400 font-bold text-end shrink-0 ml-2">{ex.sets}x {ex.reps}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStartWorkout(nextWorkoutDay)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 text-lime-400 fill-current" />
                Iniciar Este Treino Agora
              </button>
            </div>
          ) : (
            <p className="text-sm text-zinc-400">Nenhum treino gerado ainda. Clique no menu "Gerar com IA".</p>
          )}
        </div>

        {/* AI Plan Summary */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-lime-400" />
              <h2 className="text-lg font-bold text-white">Sua Divisão IA</h2>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80">
              <p className="text-xs font-bold text-lime-400">{workoutPlan?.splitName || 'Plano Personalizado FitIA'}</p>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {workoutPlan?.summary || 'Treino configurado para equilibrar hipertrofia e recuperação muscular.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('generator')}
            className="w-full mt-4 bg-lime-400/10 border border-lime-500/30 text-lime-400 hover:bg-lime-400/20 text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Regerar Treino com IA
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon, color }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between text-zinc-400">
        <span className="text-xs font-medium">{title}</span>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div className="text-xl font-black text-white">{value}</div>
      <p className="text-[11px] text-zinc-400 font-medium">{change}</p>
    </div>
  );
}

// --- PROFILE & PHYSICAL ASSESSMENT VIEW ---
function ProfileAssessmentView({ userProfile, onSave, onGenerateRequest }) {
  const [form, setForm] = useState(userProfile);
  const [step, setStep] = useState(1);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setValidationMessage('');
  };

  const handleMeasurementChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      measurements: { ...prev.measurements, [field]: value }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const goToNextStep = () => {
    if (step === 1) {
      const missing = [];
      if (!String(form.name || '').trim()) missing.push('nome');
      const age = Number(form.age), height = Number(form.height), weight = Number(form.weight);
      if (!Number.isInteger(age) || age < 13 || age > 100) missing.push('idade entre 13 e 100 anos');
      if (!Number.isFinite(height) || height < 100 || height > 250) missing.push('altura entre 100 e 250 cm');
      if (!Number.isFinite(weight) || weight < 30 || weight > 400) missing.push('peso entre 30 e 400 kg');
      if (!String(form.objective || '').trim()) missing.push('objetivo');
      if (missing.length) { setValidationMessage(`Preencha os dados obrigatórios para continuar: ${missing.join(', ')}.`); return; }
    }
    setValidationMessage('');
    setStep(step + 1);
  };

  const requestWorkout = () => {
    const errors = getProfileValidationErrors(form);
    if (errors.length) {
      setValidationMessage(`Antes de gerar, corrija: ${errors.join(', ')}.`);
      if (errors.some(error => ['nome', 'idade entre 13 e 100 anos', 'altura entre 100 e 250 cm', 'peso entre 30 e 400 kg', 'objetivo'].includes(error))) setStep(1);
      return;
    }
    setValidationMessage('');
    onSave(form);
    onGenerateRequest(form);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Avaliação Física & Perfil</h1>
          <p className="text-xs text-zinc-400">Complete os dados obrigatórios antes de solicitar um treino personalizado.</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-lime-400 bg-lime-950/60 px-3 py-1.5 rounded-lg border border-lime-800/40">
          Etapa {step} de 3
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Perfil atualizado neste dispositivo.
        </div>
      )}
      {validationMessage && <div role="alert" className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 text-sm rounded-xl">{validationMessage}</div>}

      {/* Wizard Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-6">
        
        {/* STEP 1: DADOS PESSOAIS E OBJETIVO */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-lime-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
              1. Dados Pessoais e Objetivos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Idade</label>
                <input
                  type="number"
                  min="13"
                  max="100"
                  inputMode="numeric"
                  value={form.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  min="100"
                  max="250"
                  inputMode="numeric"
                  value={form.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Peso Atual (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  min="30"
                  max="400"
                  inputMode="decimal"
                  value={form.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Objetivo Principal</label>
              <select
                value={form.objective}
                onChange={(e) => handleInputChange('objective', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
                required
              >
                <option value="" disabled>Selecione seu objetivo</option>
                <option value="hipertrofia">Hipertrofia Muscular (Ganho de Massa)</option>
                <option value="emagrecimento">Emagrecimento / Perda de Gordura</option>
                <option value="definicao">Definição Muscular</option>
                <option value="forca">Ganho de Força Bruta</option>
                <option value="condicionamento">Condicionamento Físico Geral</option>
                <option value="recomposicao">Recomposição Corporal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Como você se identifica? (opcional)</label>
              <select
                value={form.gender || ''}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
              >
                <option value="">Prefiro não informar</option>
                <option value="mulher">Mulher</option>
                <option value="homem">Homem</option>
                <option value="nao-binario">Não binário / outra identidade</option>
              </select>
              <p className="mt-1 text-[11px] text-zinc-500">Esse dado é opcional e não determina seus objetivos ou exercícios.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Nível de Experiência</label>
              <div className="grid grid-cols-3 gap-2">
                {['iniciante', 'intermediario', 'avancado'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleInputChange('level', lvl)}
                    className={`py-2 px-3 text-xs rounded-lg font-bold capitalize border ${
                      form.level === lvl 
                        ? 'bg-lime-400 text-zinc-950 border-lime-400' 
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: MEDIDAS CORPORAIS (OPCIONAIS) */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-lime-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
              2. Medidas Corporais (em centímetros - Opcionais)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <MeasurementInput label="Braço Dir." field="armRight" val={form.measurements.armRight} onChange={handleMeasurementChange} />
              <MeasurementInput label="Braço Esq." field="armLeft" val={form.measurements.armLeft} onChange={handleMeasurementChange} />
              <MeasurementInput label="Peitoral" field="chest" val={form.measurements.chest} onChange={handleMeasurementChange} />
              <MeasurementInput label="Cintura" field="waist" val={form.measurements.waist} onChange={handleMeasurementChange} />
              <MeasurementInput label="Abdômen" field="abdomen" val={form.measurements.abdomen} onChange={handleMeasurementChange} />
              <MeasurementInput label="Quadril" field="hips" val={form.measurements.hips} onChange={handleMeasurementChange} />
              <MeasurementInput label="Coxa Dir." field="thighRight" val={form.measurements.thighRight} onChange={handleMeasurementChange} />
              <MeasurementInput label="Coxa Esq." field="thighLeft" val={form.measurements.thighLeft} onChange={handleMeasurementChange} />
              <MeasurementInput label="Panturrilha Dir." field="calfRight" val={form.measurements.calfRight} onChange={handleMeasurementChange} />
            </div>
          </div>
        )}

        {/* STEP 3: DISPONIBILIDADE E LIMITAÇÕES */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-sm font-bold text-lime-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
              3. Rotina, Equipamentos e Limitações
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Dias Disponíveis na Semana</label>
                <select
                  value={form.daysAvailable}
                  onChange={(e) => handleInputChange('daysAvailable', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
                  required
                >
                  <option value="2">2 dias por semana</option>
                  <option value="3">3 dias por semana</option>
                  <option value="4">4 dias por semana</option>
                  <option value="5">5 dias por semana</option>
                  <option value="6">6 dias por semana</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Tempo Disponível por Treino (min)</label>
                <input
                  type="number"
                  min="15"
                  max="240"
                  inputMode="numeric"
                  value={form.timeAvailable}
                  onChange={(e) => handleInputChange('timeAvailable', e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Exercícios que deseja EVITAR</label>
              <input
                type="text"
                placeholder="Ex: Agachamento livre, Supino inclinado..."
                value={form.avoidExercises}
                onChange={(e) => handleInputChange('avoidExercises', e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
              />
            </div>

            <fieldset>
              <legend className="block text-xs font-semibold text-zinc-300 mb-2">Grupos musculares prioritários (opcional)</legend>
              <div className="flex flex-wrap gap-2">
                {FOCUS_MUSCLE_OPTIONS.map((muscle) => {
                  const selected = (form.focusMuscles || []).includes(muscle);
                  return <button key={muscle} type="button" aria-pressed={selected} onClick={() => handleInputChange('focusMuscles', selected ? form.focusMuscles.filter(item => item !== muscle) : [...(form.focusMuscles || []), muscle])} className={`min-h-10 rounded-full border px-3 text-xs font-semibold ${selected ? 'border-lime-400 bg-lime-400 text-zinc-950' : 'border-zinc-700 bg-zinc-950 text-zinc-300'}`}>{muscle}</button>;
                })}
              </div>
              <p className="mt-2 text-[11px] text-zinc-500">Escolha os focos que correspondem ao seu objetivo, independentemente do gênero.</p>
            </fieldset>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Restrições Físicas ou Lesões Previas</label>
              <textarea
                placeholder="Ex: Hernia de disco L5-S1, dores no ombro direito..."
                value={form.physicalLimitations}
                onChange={(e) => handleInputChange('physicalLimitations', e.target.value)}
                rows="3"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
              />
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-zinc-800 text-zinc-200 px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-700"
            >
              Voltar Etapa
            </button>
          ) : <div />}

          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-zinc-800 text-zinc-100 px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-700 border border-zinc-700"
            >
              Salvar Alterações
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="bg-lime-400 text-zinc-950 px-5 py-2 rounded-lg text-xs font-extrabold hover:bg-lime-300"
              >
                Próxima Etapa
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  requestWorkout();
                }}
                className="bg-lime-400 text-zinc-950 px-5 py-2 rounded-lg text-xs font-extrabold hover:bg-lime-300 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Gerar Treino com IA
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

function MeasurementInput({ label, field, val, onChange }) {
  return (
    <div>
      <label className="block text-[11px] font-medium text-zinc-400 mb-1">{label}</label>
      <input
        type="number"
        step="0.1"
        value={val}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
      />
    </div>
  );
}

// --- AI GENERATOR VIEW ---
function AIGeneratorView({ userProfile, isGenerating, error, onGenerate, profileComplete, profileErrors, onCompleteProfile }) {
  const [backendStatus, setBackendStatus] = useState('checking');
  useEffect(() => {
    if (!API_BASE_URL && location.hostname.endsWith('vercel.app')) {
      setBackendStatus('missing-url');
      return;
    }
    fetch(`${API_BASE_URL}/api/health`)
      .then(async response => {
        if (!response.headers.get('content-type')?.includes('application/json')) { setBackendStatus('not-api'); return; }
        const status = await response.json();
        if (!response.ok || status.service !== 'fitia-api') setBackendStatus('unreachable');
        else setBackendStatus(status.aiConfigured ? 'ready' : 'missing-key');
      })
      .catch(() => setBackendStatus('unreachable'));
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-lime-400/10 border border-lime-500/30 text-lime-400 rounded-2xl flex items-center justify-center mx-auto">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h1 className="text-2xl font-black text-white">Gerador de Treinos com Inteligência Artificial</h1>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          A IA FitIA analisará suas limitações articulares, tempo disponível, metas de hipertrofia e equipamentos para estruturar a divisão perfeita.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/80 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!profileComplete && (
        <div role="status" className="p-4 bg-amber-950/70 border border-amber-800 text-amber-200 text-sm rounded-xl space-y-3">
          <p>Complete a avaliação antes de gerar: {profileErrors.join(', ')}.</p>
          <button type="button" onClick={onCompleteProfile} className="min-h-11 px-4 rounded-lg bg-amber-300 text-zinc-950 font-bold">Preencher meus dados</button>
        </div>
      )}

      {backendStatus === 'missing-url' && <div role="alert" className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 text-sm rounded-xl">A URL da API Render não está neste build da Vercel. Configure VITE_API_BASE_URL nas variáveis da Vercel e faça um novo deploy.</div>}
      {backendStatus === 'not-api' && <div role="alert" className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 text-sm rounded-xl">Este site não está encontrando a API Render. Confira VITE_API_BASE_URL e publique o frontend novamente.</div>}
      {backendStatus === 'unreachable' && <div role="alert" className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 text-sm rounded-xl">Não foi possível acessar a API Render. Verifique se o serviço está ativo e se CORS_ORIGINS no Render inclui o domínio deste site.</div>}
      {backendStatus === 'missing-key' && <div role="alert" className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 text-sm rounded-xl">GEMINI_API_KEY não está configurada no serviço Render.</div>}

      {/* Summary Review Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-lime-400">Resumo dos Dados enviados para a IA:</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block">Aluno:</span>
            <span className="font-bold text-zinc-200">{userProfile.name} ({userProfile.age} anos)</span>
          </div>
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block">Objetivo:</span>
            <span className="font-bold text-lime-400 capitalize">{userProfile.objective}</span>
          </div>
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block">Disponibilidade:</span>
            <span className="font-bold text-zinc-200">{userProfile.daysAvailable} dias / sem</span>
          </div>
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block">Nível:</span>
            <span className="font-bold text-zinc-200 capitalize">{userProfile.level}</span>
          </div>
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block">Identidade (opcional):</span>
            <span className="font-bold text-zinc-200 capitalize">{userProfile.gender || 'Não informada'}</span>
          </div>
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block">Foco muscular:</span>
            <span className="font-bold text-zinc-200">{userProfile.focusMuscles?.length ? userProfile.focusMuscles.join(', ') : 'Sem preferência específica'}</span>
          </div>
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block">Restrições Informadas:</span>
            <span className="font-medium text-amber-400 truncate block">{userProfile.physicalLimitations || 'Nenhuma'}</span>
          </div>
          <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
            <span className="text-zinc-500 block">Tempo por Treino:</span>
            <span className="font-bold text-zinc-200">{userProfile.timeAvailable} min</span>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !profileComplete}
          className="w-full bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black py-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processando Biomecânica via IA Gemini...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-current" />
              <span>Gerar Meu Plano Personalizado Agora</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// --- MY WORKOUT PLAN VIEW ---
function WorkoutPlanView({ workoutPlan, onStartDay, onOpenExerciseModal }) {
  if (!workoutPlan || !workoutPlan.days) {
    return (
      <div className="text-center py-12 space-y-4">
        <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Nenhum plano ativo encontrado.</h2>
        <p className="text-xs text-zinc-400">Gere seu treino inteligente primeiro na aba de Inteligência Artificial.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Plan Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-lime-400 bg-lime-950/80 px-3 py-1 rounded-full border border-lime-800/50 uppercase">
            {workoutPlan.splitName}
          </span>
          <span className="text-[11px] text-zinc-500">Criado em: {new Date(workoutPlan.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
        <h1 className="text-2xl font-black text-white">Sua Divisão de Treino Prescrita</h1>
        <p className="text-xs text-zinc-300 leading-relaxed">{workoutPlan.summary}</p>

        {workoutPlan.progressionStrategy && (
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/80 text-xs space-y-1">
            <span className="font-bold text-lime-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Diretriz de Progressão de Carga:
            </span>
            <p className="text-zinc-400">{workoutPlan.progressionStrategy}</p>
          </div>
        )}
      </div>

      {/* Days Accordion / List */}
      <div className="space-y-6">
        {workoutPlan.days.map((day, idx) => (
          <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4 bg-zinc-900/80">
              <div>
                <h3 className="text-base font-extrabold text-white">{day.dayTitle}</h3>
                <div className="flex gap-2 mt-1">
                  {day.targetMuscles?.map((m, mi) => (
                    <span key={mi} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onStartDay(day)}
                className="bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-lime-500/10"
              >
                <Play className="w-4 h-4 fill-current" /> Iniciar Esta Sessão
              </button>
            </div>

            {/* Exercise List */}
            <div className="p-4 space-y-3">
              {day.exercises?.map((ex, eIdx) => {
                const dbEx = EXERCISE_DATABASE.find(item => item.id === ex.id) || EXERCISE_DATABASE[0];
                return (
                  <div key={eIdx} className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-zinc-900 rounded-lg overflow-hidden shrink-0 border border-zinc-800 flex items-center justify-center text-lime-400">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                          {ex.name}
                          <button 
                            onClick={() => onOpenExerciseModal(dbEx)} 
                            className="text-zinc-500 hover:text-lime-400"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{ex.notes}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-zinc-500 block text-[10px]">SÉRIES</span>
                        <span className="font-black text-lime-400 text-sm">{ex.sets}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 block text-[10px]">REPETIÇÕES</span>
                        <span className="font-bold text-zinc-200">{ex.reps}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-500 block text-[10px]">DESCANSO</span>
                        <span className="font-bold text-zinc-400">{ex.rest}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ACTIVE WORKOUT EXECUTION SESSION ---
function ActiveWorkoutView({ day, timer, isTimerRunning, onStartTimer, onFinishWorkout }) {
  if (!day) return null;

  const [completedSets, setCompletedSets] = useState({});
  const [weights, setWeights] = useState({});

  const toggleSet = (exId, setIndex) => {
    const key = `${exId}-${setIndex}`;
    setCompletedSets(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (next[key]) {
        onStartTimer(60); // Start 60s rest timer on set completion
      }
      return next;
    });
  };

  const handleWeightChange = (exId, setIndex, val) => {
    setWeights(prev => ({ ...prev, [`${exId}-${setIndex}`]: val }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Session Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between sticky top-0 z-40 shadow-xl backdrop-blur-md">
        <div>
          <span className="text-[10px] font-bold text-lime-400 uppercase tracking-wider">Sessão em Andamento</span>
          <h1 className="text-lg font-black text-white">{day.dayTitle}</h1>
        </div>

        {/* Rest Timer Badge */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono text-sm font-bold ${
            isTimerRunning ? 'bg-lime-400/10 border-lime-500/40 text-lime-400 animate-pulse' : 'bg-zinc-950 border-zinc-800 text-zinc-400'
          }`}>
            <Timer className="w-4 h-4" />
            <span>{timer}s</span>
          </div>

          <button
            onClick={() => onFinishWorkout({ completedSets, weights })}
            className="bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black px-4 py-2 rounded-xl text-xs"
          >
            Concluir
          </button>
        </div>
      </div>

      {/* Exercise Cards */}
      <div className="space-y-4">
        {day.exercises?.map((ex, eIdx) => {
          const dbEx = EXERCISE_DATABASE.find(item => item.id === ex.id) || EXERCISE_DATABASE[0];
          return (
            <div key={eIdx} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center text-lime-400 shrink-0"><ExerciseSVG type={dbEx.svgType} /></div>
                <div>
                  <h3 className="font-extrabold text-base text-white">{ex.name}</h3>
                  <p className="text-xs text-zinc-400">Meta: {ex.sets} séries x {ex.reps} reps | Descanso: {ex.rest}</p>
                </div>
              </div>

              {/* Set Tracker Table */}
              <div className="space-y-2">
                {Array.from({ length: ex.sets }).map((_, sIdx) => {
                  const setKey = `${ex.id}-${sIdx}`;
                  const isDone = !!completedSets[setKey];
                  return (
                    <div key={sIdx} className={`workout-set-row p-3 rounded-xl border flex items-center justify-between text-sm transition-colors ${
                      isDone ? 'bg-lime-950/30 border-lime-500/30 text-lime-300' : 'bg-zinc-950 border-zinc-800 text-zinc-300'
                    }`}>
                      <span className="font-bold text-zinc-400 w-16">Série {sIdx + 1}</span>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] text-zinc-500">Carga (kg):</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={weights[setKey] || ''}
                          onChange={(e) => handleWeightChange(ex.id, sIdx, e.target.value)}
                          className="workout-weight w-16 min-h-11 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-2 text-base text-center text-white focus:outline-none focus:border-lime-500"
                        />
                      </div>

                      <button
                        onClick={() => toggleSet(ex.id, sIdx)}
                        className={`min-h-11 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-all ${
                          isDone ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Concluída' : 'Marcar'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- EXERCISE CATALOGUE VIEW ---
function ExerciseCatalogView({ exercises, onSelectExercise }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const categories = ['Todos', 'Peitoral', 'Quadríceps', 'Cadeia Posterior', 'Dorsais', 'Deltoides', 'Bíceps', 'Tríceps'];

  const filtered = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || ex.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white">Catálogo de Exercícios & Biomecânica</h1>
        <p className="text-xs text-zinc-400">Guia técnico completo com execuções biomecânicas corretas e ilustrações.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar exercício por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap border ${
                selectedCategory === cat 
                  ? 'bg-lime-400 text-zinc-950 border-lime-400' 
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ex) => (
          <div 
            key={ex.id}
            onClick={() => onSelectExercise(ex)}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-lime-500/50 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <ExerciseSVG type={ex.svgType} />
              <div className="p-4 space-y-2">
                <span className="text-[10px] uppercase font-bold text-lime-400 bg-lime-950/60 px-2.5 py-0.5 rounded border border-lime-800/40">
                  {ex.category}
                </span>
                <h3 className="font-extrabold text-base text-white group-hover:text-lime-400 transition-colors">
                  {ex.name}
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-2">{ex.instructions[0]}</p>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-400 mt-2">
              <span>Equipamento: {ex.equipment}</span>
              <ChevronRight className="w-4 h-4 text-lime-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- PHYSICAL EVOLUTION VIEW ---
function EvolutionView({ historyLogs, userProfile, onAddLog }) {
  const [newWeight, setNewWeight] = useState('');
  const [newArm, setNewArm] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newWeight) return;
    onAddLog({
      date: new Date().toISOString().split('T')[0],
      weight: newWeight,
      arm: newArm || userProfile.measurements?.armRight || '0'
    });
    setNewWeight('');
    setNewArm('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-black text-white">Evolução Corporal & Medidas</h1>
        <p className="text-xs text-zinc-400">Acompanhe seu progresso de peso e perímetros musculares ao longo do tempo.</p>
      </div>

      {/* Record New Measurement Widget */}
      <form onSubmit={handleAdd} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-end gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Registrar Novo Peso (kg)</label>
          <input
            type="number"
            step="0.1"
            placeholder="Ex: 77.0"
            value={newWeight}
            onChange={(e) => setNewWeight(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs font-semibold text-zinc-300 mb-1">Medida do Braço (cm - Opcional)</label>
          <input
            type="number"
            step="0.1"
            placeholder="Ex: 38.0"
            value={newArm}
            onChange={(e) => setNewArm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-lime-500"
          />
        </div>

        <button
          type="submit"
          className="bg-lime-400 hover:bg-lime-300 text-zinc-950 font-bold px-5 py-2.5 rounded-lg text-xs shrink-0"
        >
          Salvar Medição
        </button>
      </form>

      {/* History Log Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 font-bold text-sm text-white">
          Histórico de Avaliações Registradas
        </div>
        <div className="divide-y divide-zinc-800 text-xs">
          {historyLogs.map((log, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between text-zinc-300">
              <span className="font-mono text-zinc-500">{log.date}</span>
              <span className="font-bold text-white">{log.weight} kg</span>
              <span className="text-lime-400 font-semibold">Braço: {log.arm} cm</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- EXERCISE DETAIL MODAL ---
function ExerciseDetailModal({ exercise, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <ExerciseSVG type={exercise.svgType} />

        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-lime-400 bg-lime-950/60 px-2.5 py-0.5 rounded border border-lime-800/40">
              {exercise.category}
            </span>
            <h2 className="text-xl font-black text-white mt-1">{exercise.name}</h2>
            <p className="text-xs text-zinc-400">Equipamento: {exercise.equipment}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-lime-400 uppercase tracking-wider">Passo a Passo de Execução:</h3>
            <ol className="list-decimal list-inside space-y-1 text-xs text-zinc-300">
              {exercise.instructions.map((inst, i) => (
                <li key={i} className="leading-relaxed">{inst}</li>
              ))}
            </ol>
          </div>

          <div className="space-y-2 bg-red-950/30 border border-red-900/40 p-3.5 rounded-xl">
            <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Erros Comuns a Evitar:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400">
              {exercise.commonMistakes.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
