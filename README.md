# FitIA

Aplicação web mobile-first com PWA e backend Node/Express hospedado exclusivamente no Render. O frontend pode ser servido pelo próprio Render ou hospedado como arquivos estáticos na Vercel, apontando para a API do Render.

## Executar localmente

1. Instale Node.js 20 ou superior.
2. Copie `.env.example` para `.env` e coloque `GEMINI_API_KEY` no ambiente do servidor. Essa chave nunca vai para o bundle do navegador.
3. Execute `npm ci && npm run build && npm start` para servir a aplicação e a API localmente.
4. Para desenvolver com Vite, mantenha `npm start` em um terminal e rode `npm run dev` em outro.

Perfil, plano e histórico são mantidos no `localStorage` do navegador e não são enviados ao backend para armazenamento. A API Render recebe o perfil apenas quando o usuário solicita geração de treino; a chave Gemini fica no servidor.

## Deploy

- **Render (backend e frontend recomendado):** conecte o repositório ao Blueprint `render.yaml`; informe `GEMINI_API_KEY`. O mesmo serviço atende o site e `/api/generate-workout`.
- **Vercel (frontend opcional):** configure `VITE_API_BASE_URL` com a origem pública do serviço Render. Configure `CORS_ORIGINS` no Render com a origem da Vercel. A Vercel não hospeda nenhuma função de backend.

Consulte [`CREDENTIALS.md`](./CREDENTIALS.md) para as variáveis manuais. Nenhuma configuração ou dependência Firebase é necessária.

## PWA

`public/manifest.webmanifest`, os ícones FitIA, `public/service-worker.js` e `public/offline.html` dão suporte à instalação e ao shell estático offline. Chamadas de IA não funcionam offline, e dados pessoais não são armazenados no cache do service worker.

## Biblioteca de exercícios e GIFs

O catálogo de exercícios usa `catalogo.json`; o mapeamento centralizado fica em `exercise-gif-map.json`. GIFs confirmados e prováveis são carregados sob demanda. O build copia para `dist/assets` apenas os arquivos mapeados, mantendo seus nomes originais. Exercícios pendentes ou sem correspondência exibem um estado alternativo e continuam disponíveis.

Para revisar associações, abra `/?exercise-gif-review=1` no site local ou hospedado. A relação detalhada de itens pendentes está em [`exercise-gif-review.md`](./exercise-gif-review.md). A biblioteca fornecida neste checkout contém 1.000 GIFs íntegros; o mapeamento não presume que números de CSV e arquivos sejam iguais.
