# Configuração manual do backend no Render

O FitIA não usa Firebase. A única integração de backend é a API Node hospedada no Render. Perfil, plano de treino e histórico ficam no armazenamento local do navegador deste dispositivo.

## Render (backend e site)

1. Conecte o repositório GitHub ao Render usando o Blueprint `render.yaml`.
2. Preencha `GEMINI_API_KEY` no serviço Render para habilitar a geração de treinos. `GEMINI_MODEL` já tem um valor padrão.
3. Se também hospedar o frontend na Vercel, preencha `CORS_ORIGINS` com a origem pública completa da Vercel, sem barra ao final. Para o deploy atual, use `https://fitai-eight-sigma.vercel.app`. Se houver domínio de produção e Preview, separe as origens por vírgula.
4. O Render compila e serve o site e a API na mesma origem. Não é necessária variável de URL de API nesse caso.

## Vercel (somente frontend opcional)

Configure `VITE_API_BASE_URL` nas **Environment Variables da Vercel** como a URL pública completa do serviço FitIA no Render (por exemplo, `https://fitia.onrender.com`) e faça novo deploy. Essa variável é incorporada durante o build; defini-la somente no Render não altera um frontend já publicado pela Vercel. A Vercel entrega apenas os arquivos estáticos; não existe função de backend na Vercel. `GEMINI_API_KEY` deve existir somente no Render.

## Desenvolvimento local

Copie `.env.example` para `.env`; mantenha a chave Gemini apenas no servidor local. Execute `npm ci`, `npm run build` e `npm start` para servir site e API na porta configurada. Para desenvolvimento com Vite, rode `npm start` em um terminal e `npm run dev` em outro; o proxy local encaminha `/api` para o servidor Node.

Nunca coloque a chave Gemini em código frontend, em variável `VITE_*`, em arquivos versionados ou em commits. A IA exige conexão e chave configurada no backend Render.
