# SATRE

**Sistema de Informação de Saúde em Tempo Real**

Aplicativo mobile que oferece informações transparentes sobre unidades de pronto atendimento (UPAs e hospitais) em Recife, que incluem: lotação, tempo de espera, médicos disponíveis, especialidades e acessibilidade para ajudar cidadãos a tomar decisões mais informadas e reduzir superlotação.

> Projeto em desenvolvimento · API funcional com dados mock · App mobile (Expo) alinhado ao Figma · checklist de demo pronto

---

## O problema

Quem precisa de atendimento de urgência no Recife muitas vezes não sabe:

- qual unidade está menos lotada;
- quanto tempo vai esperar;
- quais especialidades estão disponíveis;
- se a unidade atende necessidades de acessibilidade.

Isso gera filas desbalanceadas, ansiedade e pressão desnecessária sobre o sistema de saúde.

## A solução

O SATRE centraliza dados operacionais das unidades em um app mobile, combinando:

- **Dados oficiais** (integração futura com sistemas hospitalares);
- **Reports de usuários** (crowdsourcing sobre lotação e demora);
- **Algoritmo de estimativa** de tempo de espera.

O piloto inicial usa **dados mock** de 7 unidades de Recife para demonstração e validação com hospitais parceiros (modelo B2B SaaS).

---

## Objetivos

| Meta | Descrição |
|------|-----------|
| **Curto prazo** | MVP funcional com API + app mobile para demo |
| **Médio prazo** | Parceria com 1 hospital particular em Recife |
| **Longo prazo** | Expandir para múltiplas unidades; reduzir superlotação e melhorar eficiência do atendimento |

Alinhado à **ODS 3** — Saúde e bem-estar (Meta 3.8: acesso universal à saúde).

---

## Status do MVP

### API (backend)

| Módulo | Status |
|--------|--------|
| Monorepo + tipos compartilhados | ✅ |
| PostgreSQL + Prisma + seed (7 unidades) | ✅ |
| Estimador de tempo de espera (Vitest) | ✅ |
| MockProvider + UnitsService | ✅ |
| Auth (register, login, refresh, logout) | ✅ |
| Rotas de unidades + nearby (raio 15 km) | ✅ |
| Reports crowdsourcing + anti-spam | ✅ |
| Favoritos + perfil de usuário | ✅ |
| Job de retenção de reports (90 dias) | ✅ |
| Deploy prep (Docker + checklist) | ✅ |

**31 testes automatizados** passando na API.

### App mobile (Expo)

| Tela / recurso | Status |
|----------------|--------|
| Tabs: Início, Hospitais, Mapa, Perfil | ✅ |
| Login / cadastro + LGPD | ✅ |
| Detalhe da unidade (Emergência) | ✅ |
| Modal "Reportar situação" | ✅ |
| Configurações | ✅ |
| Design system Figma (teal) + geodata | ✅ |
| Cache offline + estados de erro | ✅ |
| Pass de acessibilidade | ✅ |

**Demo:** checklist em `docs/demo-checklist.md` · deploy da API em `docs/deploy.md`

## Tecnologias

| Camada | Stack |
|--------|-------|
| **Mobile** | Expo SDK 52 · React Native · Expo Router · TanStack Query |
| **Backend** | Node.js · Fastify · TypeScript |
| **Banco de dados** | PostgreSQL 16 · Prisma ORM |
| **Validação** | Zod |
| **Auth** | JWT (access 15 min) + refresh token opaco (7 dias) |
| **Testes (API)** | Vitest |
| **Mapas** | react-native-maps |
| **Infra local** | Docker Compose |

---

## Estrutura do projeto

```
satre/
├── apps/
│   ├── api/
│   │   ├── prisma/           # Schema, migrations, seed
│   │   └── src/
│   │       ├── routes/       # auth, health, units, reports
│   │       ├── services/     # auth, units, reports, estimator
│   │       ├── providers/    # MockProvider (dados mock)
│   │       ├── plugins/      # Auth (Bearer JWT)
│   │       └── schemas/      # Validação Zod
│   └── mobile/
│       ├── app/              # Expo Router (tabs + rotas)
│       ├── components/
│       └── lib/              # api.ts, location.ts
├── packages/
│   └── shared-types/         # Tipos TypeScript compartilhados
├── docker-compose.yml
├── .env.example
└── package.json              # Monorepo npm workspaces
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [npm](https://www.npmjs.com/) 10+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (PostgreSQL local)
- Git
- [Expo Go](https://expo.dev/go) no celular (opcional, para testar o app)

---

## Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/Daniel-Tavares-de-Lima/SATRE.git
cd SATRE
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
# Windows (PowerShell / CMD)
copy .env.example .env
copy .env apps\api\.env
copy apps\mobile\.env.example apps\mobile\.env

# Linux / macOS / Git Bash
cp .env.example .env
cp .env apps/api/.env
cp apps/mobile/.env.example apps/mobile/.env
```

Edite o `.env` se necessário. Em dev local, os valores padrão funcionam com o Docker Compose.

> **Importante:** nunca commite o arquivo `.env` — ele contém segredos. Apenas `.env.example` vai para o GitHub.

**Mobile em celular físico:** altere `EXPO_PUBLIC_API_URL` em `apps/mobile/.env` para o IP da sua máquina na rede local (ex.: `http://192.168.0.9:3000`).

### 4. Subir o banco e popular dados

Certifique-se de que o **Docker Desktop** está rodando, depois:

```bash
npm run db:setup
```

Isso executa:

1. `docker compose up -d` — PostgreSQL na porta 5432
2. `prisma migrate dev` — cria as tabelas
3. `prisma db seed` — insere as 7 unidades mock de Recife

---

## Executar em desenvolvimento

Abra **3 terminais**:

```bash
# Terminal 1 — banco (se ainda não estiver rodando)
docker compose up -d

# Terminal 2 — API
npm run dev:api
# → http://localhost:3000/health
# → http://localhost:3000/units

# Terminal 3 — mobile
npm run dev:mobile
# Escaneie o QR code com Expo Go ou pressione w para web
```

**Android emulador:** use `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000` em `apps/mobile/.env`.

---

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run db:up` | Inicia o PostgreSQL (Docker) |
| `npm run db:migrate` | Aplica migrations do Prisma |
| `npm run db:seed` | Popula o banco com unidades mock |
| `npm run db:setup` | Up + migrate + seed (setup completo) |
| `npm run dev:api` | Inicia a API em modo dev (porta 3000) |
| `npm run dev:mobile` | Inicia o app mobile (Expo) |
| `npm test` | Roda todos os testes da API (Vitest) |
| `npm run smoke:units -w @satre/api` | Smoke test: lista unidades no terminal |

---

## API — Endpoints

Base URL: `http://localhost:3000`

### Health

```
GET /health
```

### Autenticação

```
POST /auth/register   # { name, email, password, acceptTerms, acceptPrivacy }
POST /auth/login      # { email, password }
POST /auth/refresh    # { refreshToken }
POST /auth/logout     # { refreshToken }
```

Resposta de register/login: `{ user: { id, name, email }, accessToken, refreshToken }`.

### Unidades

```
GET /units                              # Filtros: type, maxWait, minDoctors, accessible, specialty, q
GET /units/nearby?lat=&lng=&radius=     # radius em km (padrão: 15)
GET /units/:id                          # Detalhe completo
GET /units/:id/wait-time                # Estimativa + confidence
```

### Reports (crowdsourcing)

```
POST /units/:id/reports
Headers: X-Device-Id (obrigatório), Authorization (opcional)
Body:   { occupancyLevel, waitLevel, note? }
```

- `occupancyLevel` / `waitLevel`: `low` | `medium` | `high`
- `note`: opcional, máx. 200 caracteres (sem e-mail ou CPF)
- Anti-spam: 1 report por device/usuário por unidade a cada 30 min
- Rate limit: 10 requisições/min por IP

### Em breve (Tasks 8–9)

```
POST   /units/:id/favorites
DELETE /units/:id/favorites
GET    /users/me/favorites
GET    /users/me
PATCH  /users/me
DELETE /users/me
```

---

## Exemplos rápidos (curl)

```bash
# Listar unidades
curl http://localhost:3000/units

# Unidades perto de Caxangá (UPA Caxangá deve aparecer primeiro)
curl "http://localhost:3000/units/nearby?lat=-8.0476&lng=-34.9510"

# Registrar usuário
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Teste\",\"email\":\"teste@satre.app\",\"password\":\"senha1234\",\"acceptTerms\":true,\"acceptPrivacy\":true}"

# Reportar lotação
curl -X POST http://localhost:3000/units/UNIT_ID/reports \
  -H "Content-Type: application/json" \
  -H "X-Device-Id: 11111111-2222-3333-4444-555555555555" \
  -d "{\"occupancyLevel\":\"medium\",\"waitLevel\":\"high\",\"note\":\"Fila na recepção\"}"
```

Substitua `UNIT_ID` pelo `id` retornado em `GET /units`.

---

## Variáveis de ambiente

| Variável | Onde | Descrição |
|----------|------|-----------|
| `DATABASE_URL` | `.env` / `apps/api/.env` | Connection string PostgreSQL |
| `JWT_SECRET` | `.env` / `apps/api/.env` | Segredo JWT (mín. 32 caracteres) |
| `JWT_REFRESH_SECRET` | `.env` | Reservado para uso futuro |
| `PORT` | `.env` | Porta da API (padrão: 3000) |
| `DEVICE_HASH_SALT` | `.env` | Salt para hash anônimo de device nos reports |
| `EXPO_PUBLIC_API_URL` | `apps/mobile/.env` | URL da API para o app mobile |

Veja `.env.example` e `apps/mobile/.env.example` para templates completos.

---

## Unidades mock (seed)

| Unidade | Tipo | Espera (seed) |
|---------|------|---------------|
| UPA Caxangá | UPA | 25 min |
| Pronto Atendimento Caxangá | UPA | 5 min |
| UPA Torrões | UPA | 13 min |
| UPA Barra de Jangada | UPA | 22 min |
| UPA Curado | UPA | 19 min |
| Hospital Esperança Recife | Privado | 5 min |
| Hospital Restauração | Privado | 7 min |

---

## Privacidade (LGPD)

O MVP coleta apenas **dados pessoais mínimos** (`name`, `email`, `password_hash`) para autenticação. Dados clínicos sensíveis (CNS, histórico de saúde) **não fazem parte do MVP**.

- Registro exige aceite de Termos e Política de Privacidade (`terms_accepted_at`, `privacy_accepted_at`).
- Reports são **anônimos por padrão** (`device_hash`); `user_id` é opcional se logado.
- Campo `note` nos reports: máx. 200 chars, validação server-side contra e-mail/CPF; copy no app deve avisar *"Não inclua informações médicas ou pessoais."*
- Retenção de reports: **90 dias** (job previsto na Task 9).

---

## Roadmap

1. **Fase atual** — Completar API (favoritos, perfil, retenção) + telas mobile restantes
2. **Demo B2B** — pitch para hospital particular em Recife
3. **Integração real** — conectar ao sistema do hospital parceiro
4. **Escala** — mais unidades privadas → UPAs públicas

---

## Contribuição

Projeto em fase inicial de desenvolvimento. Contribuições serão bem-vindas após estabilização do MVP.

---

## Licença

Projeto privado — todos os direitos reservados.

---

## Autor

**Daniel Tavares de Lima Marcelino**  
[GitHub](https://github.com/Daniel-Tavares-de-Lima)
