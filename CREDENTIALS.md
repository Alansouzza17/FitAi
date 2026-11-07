# Configuração manual das credenciais

Não coloque chaves secretas no código nem no GitHub. Este repositório já ignora `.env`.

## Valores do Firebase

No Firebase Console, escolha o mesmo projeto nas duas etapas:

1. Em **Configurações do projeto → Seus apps**, copie a configuração do app Web e preencha os seis `VITE_FIREBASE_*` do `.env.example`.
2. Em **Authentication → Sign-in method**, habilite **E-mail/senha**.
3. Em **Contas de serviço**, gere/obtenha a credencial JSON do Firebase Admin e use o JSON completo em `FIREBASE_SERVICE_ACCOUNT`. Para `.env`, serialize o JSON em uma única linha, mantendo `private_key` como sequência JSON com `\n` escapado.
4. Em Firestore, crie o banco e publique as regras deste repositório (`firebase deploy --only firestore:rules`, depois de selecionar o projeto Firebase correto).

O objeto do app Web contém configuração pública usada pelo navegador. O JSON do Admin permite acesso privilegiado e deve ficar somente como variável de servidor.

## Chave Gemini

Crie uma chave Gemini e preencha `GEMINI_API_KEY`. Use `GEMINI_MODEL=gemini-2.5-flash`, ou outro modelo disponível para sua conta. A chave é usada exclusivamente pelo backend; não use o prefixo `VITE_`.

## Local

Copie `.env.example` para `.env`, preencha os valores e mantenha `.env` fora dos commits. `npm run dev` lê os valores `VITE_*` para o frontend. `npm start` carrega `.env` no servidor Node.

## Render

Crie o Blueprint usando `render.yaml`. Cada entrada `sync: false` solicita valor manualmente durante a configuração. Se o serviço já existir, abra **Environment** e crie/atualize as mesmas chaves do `.env.example`; salve e faça um novo deploy. `PORT` é fornecida pelo Render.

## Vercel

Em **Project → Settings → Environment Variables**, adicione as chaves do `.env.example`. Marque `VITE_*` para os ambientes de build desejados (Production e, se necessário, Preview). Adicione `GEMINI_API_KEY`, `GEMINI_MODEL` e `FIREBASE_SERVICE_ACCOUNT` como variáveis server-side. Depois de salvar, faça um novo deploy para aplicar variáveis `VITE_*` ao bundle.

Não adicione credenciais em GitHub Actions, em `render.yaml`, `vercel.json`, issues ou commits. `.env.example` contém apenas os nomes e valores não secretos padrão.
