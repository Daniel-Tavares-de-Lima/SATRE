# SATRE Demo Checklist

Use antes de uma demo / pitch. Ambiente local: Docker + `npm run db:setup` + `npm run dev:api` + `npm run dev:mobile`.

API remota (quando publicada): ver `docs/deploy.md`.

## Ambiente

- [ ] Docker Desktop ligado (`npm run db:up`)
- [ ] API em `/health` responde ok
- [ ] App no Expo Go ou web (`http://localhost:8081`)
- [ ] `EXPO_PUBLIC_API_URL` aponta para a API correta

## Conta e perfil

- [ ] Register new user (name/email only + consentimento LGPD)
- [ ] Login com o usuário criado
- [ ] Perfil edita o nome
- [ ] Campos clínicos mostram **Em breve** (CNS, DOB, histórico)
- [ ] Configurações: Sobre / Termos / Fórum **"Em breve"**
- [ ] Sair da conta funciona
- [ ] Delete account works (conta some; login volta a falhar)

## Início

- [ ] Início shows units sorted by GPS (ou fallback Recife)
- [ ] Cards Figma: espera, médicos, favorito
- [ ] Search + chips de ordenação
- [ ] Banner “Complete seu cadastro” para visitante
- [ ] Com API offline: banner **Dados podem estar desatualizados** (após cache)

## Mapa

- [ ] Mapa pins + bottom sheet + Rotas
- [ ] Rotas abrem Google Maps no endereço correto (testar ≥ 3 unidades)
- [ ] Salvar favorito no sheet (auth required)

## Hospitais

- [ ] Hospitais filter by UPA/Privada
- [ ] Filtros: acessível, tempo máximo
- [ ] Abrir detalhe a partir do card

## Detalhe (Emergência)

- [ ] Detalhe shows specialties + accessibility
- [ ] Mini-mapa / endereço tappable → rotas
- [ ] Favorito no hero funciona

## Report crowdsourcing

- [ ] Report modal copy includes medical/privacy disclaimer
- [ ] Enviar report com lotação + tempo
- [ ] Duplicate report blocked (HTTP 429 / mensagem de aguardo)

## Favoritos

- [ ] Favorite save/remove na lista e no mapa
- [ ] Lista atualiza após toggle

## Acessibilidade (amostra)

- [ ] TalkBack/VoiceOver: login (campos + Entrar)
- [ ] TalkBack/VoiceOver: report (segmentos + Enviar)
- [ ] OccupancyBadge: texto + ícone (não só cor)

## Geodata (sanity)

- [ ] UPA Caxangá → pin/rota no local esperado
- [ ] Pronto Atendimento Caxangá → Av. Prof. Moraes Rego
- [ ] Hospital Esperança → Ilha do Leite

## Pré-lançamento público (não código)

- [ ] Política de Privacidade escrita
- [ ] Termos de Uso escritos
- [ ] Contato/DPO definido
- [ ] Google Maps API key para build nativo de produção
