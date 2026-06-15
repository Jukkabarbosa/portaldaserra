## Visão geral

4 frentes, executadas nesta ordem para você ver valor a cada etapa:

1. Reposicionamento do "Quem Somos" (rápido, sem backend)
2. Visibilidade real para patrocinadores (frontend)
3. Redução de preços dos planos (dados)
4. Pagamentos Stripe + Painel Financeiro completo (backend pesado)

---

## 1. Quem Somos — nova narrativa (route `/quem-somos`)

Substituir a timeline "2021/2022/2023" por uma narrativa honesta e forte:

- **Bloco hero reescrito**: "O marketplace automotivo mais completo e inteligente de **Santa Catarina**. Mais de 1 ano em desenvolvimento, agora no ar."
- **Nova timeline (4 marcos reais):**
  - *2024 — A ideia* — identificamos a lacuna no mercado catarinense
  - *2024/2025 — Construção* — 1 ano desenvolvendo a plataforma com tecnologia de ponta
  - *2025 — Inteligência embarcada* — Camila IA, avaliação automática, simulador, alertas
  - *2026 — Lançamento oficial* — operação 100% focada em SC
- **Novo bloco "Por que somos o mais completo"** com 6 cards:
  IA Camila 24/7 · Avaliação por IA · Simulador de financiamento · Alertas inteligentes · Selo de inspeção · Bot multicanal (WhatsApp/Instagram)
- **Novo bloco "Suporte humano de verdade"**: operadores seg–sex, painel interno onde qualquer erro é corrigido em tempo real, monitoramento ativo.
- **Novo bloco "Exclusivamente Santa Catarina"**: foco regional, garagens verificadas na Serra, Vale, Litoral e Oeste catarinense.
- **Bloco de contato direto**: WhatsApp **(11) 93732-1847** com botão CTA grande.

Sem alteração de schema. Só edição em `src/routes/quem-somos.tsx`.

---

## 2. Visibilidade real dos patrocinadores

Hoje patrocinador "paga e não aparece". Vou criar slots visíveis em alto tráfego:

- **Faixa de patrocinadores no topo da Home** (logos rotativos, tier Diamante/Platina/Ouro)
- **Card de patrocinador destacado** na listagem `/carros` (a cada 6 veículos)
- **Bloco "Apoiadores oficiais"** no rodapé global (em todas as páginas)
- **Banner do patrocinador** na página de detalhes do veículo (`/carros/$id`)
- **Página `/patrocinadores`** revitalizada com hero + grid por tier

Cada exibição registra `impressions_count`; cada clique registra `clicks_count` (já existem na tabela `sponsors`).

---

## 3. Novos preços (mais realistas para SC)

**Garagistas** (tabela `plans`):
- Start — R$ 89/mês (até 5 veículos)
- Pro — R$ 189/mês (até 15 veículos + IA Camila básica)
- Premium — R$ 349/mês (até 40 veículos + destaques + métricas)
- Elite — R$ 599/mês (ilimitado + IA white-label + suporte prioritário)

**Patrocinadores** (`sponsor-utils.ts`):
- Bronze R$ 149 · Prata R$ 349 · Ouro R$ 690 · Platina R$ 1.290 · Diamante R$ 2.490

Ajusto via migração de dados (`UPDATE plans`) + edição do `sponsor-utils.ts`.

---

## 4. Pagamentos + Painel Financeiro

### 4.1 Stripe integrado
Vou rodar `recommend_payment_provider` e depois `enable_stripe_payments`. Depois disso crio:
- Página `/checkout/$planSlug` — cliente escolhe plano e paga com cartão
- Webhook `/api/public/stripe-webhook` — ativa assinatura ao confirmar pagamento
- Página `/garagista/financeiro` — garagista vê suas faturas e plano

### 4.2 Novas tabelas no banco
- `payments` — log de toda transação (id Stripe, cliente, plano, valor, método, status, admin que confirmou se manual)
- `invoices` — faturas geradas (número, vencimento, status, link PDF)
- `coupons` — cupons de desconto
- `financial_logs` — histórico de toda ação financeira (auditoria)
- `site_access_logs` — registro de acessos (rota, user, ip, timestamp)
- Ampliar `subscriptions` com: `plan_type` (garagista/patrocinador/particular), `payment_method`, `amount`, `discount_applied`, `notes`

### 4.3 Painel `/admin/financeiro` (admin only)
Estrutura em abas, seguindo o padrão visual já existente (dark + dourado):

- **Dashboard** — cards (Receita mês, MRR, ARR estimada, líquida, pendentes, inadimplentes, assinaturas ativas/canceladas, ticket médio, total de destaques) + gráficos (receita/mês, por tipo de cliente, por plano, novas assinaturas, cancelamentos, inadimplência, planos mais vendidos)
- **Assinaturas** — tabela completa com filtros, ações (suspender/reativar/marcar pago)
- **Pagamentos** — log com filtros por período/método/status, exportação CSV
- **Inadimplência** — clientes em atraso com régua (alerta → pausa em 7d → bloqueio em 15d)
- **Planos** — CRUD dos planos
- **Faturas** — geração e envio
- **Cupons** — CRUD de cupons (% ou R$ fixo, validade, limite de uso)
- **Relatórios** — exportação financeira mensal/anual
- **Logs de acesso** — quem acessou o quê e quando

### 4.4 Painel reduzido por papel
- **Garagista** (`/garagista/financeiro`): vê só os próprios pagamentos/faturas/plano
- **Particular**: vê só pagamento do próprio anúncio (quando implementarmos)

---

## Detalhes técnicos

- Stack: TanStack Start + Supabase (Lovable Cloud), seguindo padrões do projeto
- Toda lógica de pagamento via `createServerFn` + Stripe SDK
- RLS em todas as novas tabelas (admin total · garagista vê só o próprio)
- Gráficos com Recharts (já no projeto via shadcn)
- Webhook Stripe com verificação de assinatura HMAC
- Régua de inadimplência via cron diário (pg_cron) — ou job manual no início

---

## Ordem de execução proposta (3 mensagens)

**Esta mensagem (1ª):** Itens 1, 2, 3 — Quem Somos novo, slots de patrocinador no site, redução de preços. Resultado: você já vê os patrocinadores ganhando espaço e a página institucional reposicionada.

**2ª mensagem:** Habilitar Stripe + criar schema financeiro (payments, invoices, coupons, logs) + checkout funcional.

**3ª mensagem:** Painel `/admin/financeiro` completo com todas as abas + painel do garagista.

Quebrar assim evita uma única entrega gigante onde algo trava no meio. Se preferir tudo de uma vez só, eu faço, mas vai ser um turno bem longo.

---

Confirma essa ordem? Se quiser ajustar algum preço, mudar a régua de inadimplência (7d/15d) ou trocar o foco regional ("SC inteiro" vs "Serra Catarinense + SC"), me diz agora antes de eu começar.