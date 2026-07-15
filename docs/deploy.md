# SATRE — Deploy Guide (API)

Preparação para hospedar a API em **Railway** ou **Render**. O app mobile continua via Expo Go / build local; aponte `EXPO_PUBLIC_API_URL` para a URL pública da API.

## Pré-requisitos

- Conta Railway ou Render
- PostgreSQL gerenciado no mesmo provedor (recomendado)
- Segredos fortes (`openssl rand -base64 32`)

## Variáveis de ambiente (API)

| Variável | Exemplo / nota |
|----------|----------------|
| `DATABASE_URL` | Connection string do Postgres do provedor |
| `JWT_SECRET` | ≥ 32 caracteres |
| `JWT_REFRESH_SECRET` | ≥ 32 caracteres (opcional mas recomendado) |
| `DEVICE_HASH_SALT` | Salt único para hash de device nos reports |
| `PORT` | O provedor costuma injetar; Fastify escuta em `0.0.0.0` |

## Opção A — Docker (Railway / Render / qualquer host)

Imagem: `Dockerfile` na raiz do monorepo.

1. Build: contexto = raiz do repo
2. Start: `prisma migrate deploy` + `tsx src/index.ts` (já no `CMD`)
3. Após o primeiro deploy saudável, rode o seed **uma vez**:

```bash
# Via shell do provedor, a partir de apps/api
npx prisma db seed
# ou sync de geodata
npx tsx src/scripts/sync-unit-geodata.ts
```

## Opção B — Render (Web Service + Postgres)

1. Crie um **PostgreSQL** e copie a Internal Database URL.
2. Crie um **Web Service** a partir deste repositório.
3. Configuração sugerida:
   - **Root Directory:** (raiz do monorepo)
   - **Runtime:** Docker *(use o Dockerfile)*  
     **ou** Native:
     - Build: `npm ci && npm run db:generate -w @satre/api`
     - Start: `npm run db:migrate:deploy -w @satre/api && npm run start -w @satre/api`
4. Cole as env vars da tabela acima.
5. Health check path: `/health`
6. Seed uma vez após o primeiro deploy.

## Opção C — Railway

1. New Project → Deploy from GitHub.
2. Add **Postgres** plugin; use a `DATABASE_URL` gerada.
3. Service settings:
   - Dockerfile path: `Dockerfile`
   - Ou start command: `npm run db:migrate:deploy -w @satre/api && npm run start -w @satre/api`
4. Env vars da tabela acima.
5. Seed uma vez após o primeiro deploy.

## Mobile — apontar para a API em produção

Em `apps/mobile/.env`:

```env
EXPO_PUBLIC_API_URL=https://SUA-API.onrender.com
```

(ou URL Railway). Reinicie o Metro (`npx expo start -c`).

Para demos locais continue com `http://localhost:3000` (web) ou `http://SEU_IP:3000` (Expo Go).

## Checklist pós-deploy

- [ ] `GET /health` → `{"status":"ok",...}`
- [ ] `GET /units` → 7 unidades
- [ ] `POST /auth/register` com consentimento LGPD
- [ ] Mobile abre Início com dados da API remota
- [ ] CORS: app Expo consegue chamar a API (já liberado no Fastify)

## Fora do escopo desta task

- Conta do provedor e billing
- Domínio customizado / TLS (coberto pelo provedor)
- EAS Build / store listing
- Política de Privacidade e Termos finais (pré-lançamento público)
