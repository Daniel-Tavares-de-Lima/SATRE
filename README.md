# SATRE

**Sistema de Informação de Saúde em Tempo Real**

Aplicativo mobile que oferece informações transparentes sobre unidades de pronto atendimento (UPAs e hospitais) em Recife — lotação, tempo de espera, médicos disponíveis, especialidades e acessibilidade — para ajudar cidadãos a tomar decisões mais informadas e reduzir superlotação.

> Projeto em desenvolvimento · MVP técnico em andamento

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

## Funcionalidades

### Em desenvolvimento (MVP)

- [x] Monorepo com tipos compartilhados
- [x] Banco PostgreSQL + Prisma (schema completo)
- [x] Seed com 7 unidades de Recife (UPAs + hospitais privados)
- [x] Algoritmo de estimativa de tempo de espera (com testes)
- [ ] API REST (auth, unidades, reports, favoritos)
- [ ] App mobile Expo (mapa, lista, detalhe, report)
- [ ] Integração com hospital parceiro

### Planejado (pós-MVP)

- Integração com sistemas hospitalares (Tasy, MV, etc.)
- Painel administrativo para unidades
- Expansão para rede pública (UPAs SUS)
- Notificações push

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| **Mobile** | Expo · React Native · Expo Router |
| **Backend** | Node.js · Fastify · TypeScript |
| **Banco de dados** | PostgreSQL · Prisma ORM |
| **Validação** | Zod |
| **Auth** | JWT (access + refresh token) |
| **Testes (API)** | Vitest |
| **Mapas** | Google Maps API |
| **Infra local** | Docker Compose |

---

## Estrutura do projeto

```
satre/
├── apps/
│   ├── api/          # API REST (Node.js + Fastify + Prisma)
│   └── mobile/       # App mobile (Expo) — em scaffold
├── packages/
│   └── shared-types/ # Tipos TypeScript compartilhados
├── docker-compose.yml
├── .env.example      # Template de variáveis (seguro para GitHub)
└── package.json      # Monorepo npm workspaces
```

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [npm](https://www.npmjs.com/) 10+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (para PostgreSQL local)
- Git

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

# Linux / macOS / Git Bash
cp .env.example .env
cp .env apps/api/.env
```

Edite o `.env` se necessário. Em dev local, os valores padrão funcionam com o Docker Compose.

> **Importante:** nunca commite o arquivo `.env` — ele contém segredos. Apenas `.env.example` vai para o GitHub.

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

## Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run db:up` | Inicia o PostgreSQL (Docker) |
| `npm run db:migrate` | Aplica migrations do Prisma |
| `npm run db:seed` | Popula o banco com unidades mock |
| `npm run db:setup` | Up + migrate + seed (setup completo) |
| `npm run dev:api` | Inicia a API em modo dev |
| `npm run dev:mobile` | Inicia o app mobile (Expo) |
| `npm test` | Roda testes da API (Vitest) |

---

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL |
| `JWT_SECRET` | Segredo para tokens de acesso |
| `JWT_REFRESH_SECRET` | Segredo para refresh tokens |
| `PORT` | Porta da API (padrão: 3000) |
| `DEVICE_HASH_SALT` | Salt para hash anônimo de device nos reports |

Veja `.env.example` para o template completo.

---

## Unidades mock (seed)

| Unidade | Tipo |
|---------|------|
| UPA Caxangá | Pública |
| Pronto Atendimento Caxangá | Pública |
| UPA Torrões | Pública |
| UPA Barra de Jangada | Pública |
| UPA Curado | Pública |
| Hospital Esperança Recife | Privada |
| Hospital Restauração | Privada |

---

## Privacidade (LGPD)

O MVP coleta apenas **dados pessoais mínimos** (nome e e-mail para autenticação). Dados clínicos sensíveis (CNS, histórico de saúde) **não fazem parte do MVP**.

Reports de lotação são anônimos. Texto livre opcional nos reports exige aviso explícito para não incluir informações médicas.

---

## Roadmap

1. **Fase atual** — API REST + app mobile com dados mock
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
