import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type VehicleContext = {
  title?: string;
  brand?: string;
  model?: string;
  version?: string;
  year_made?: number;
  year_model?: number;
  price?: number;
  mileage?: number;
  transmission?: string;
  fuel?: string;
  color?: string;
  city?: string;
  state?: string;
  garage_name?: string;
  features?: string[];
  knowledge_base?: string;
};

type ChatRequestBody = {
  messages?: unknown;
  vehicle?: VehicleContext;
  attendantName?: string;
};

const brl = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n)
    : "—";

function buildSystemPrompt(v: VehicleContext | undefined, attendantName: string) {
  const data = v ?? {};
  return `Você é ${attendantName}, atendente de vendas da garagem ${data.garage_name ?? "Portal da Serra"}.

ESTILO DE COMUNICAÇÃO — REGRA MAIS IMPORTANTE:
- Você é uma pessoa real, calorosa, simpática, brasileira. Fala de forma natural, como em um WhatsApp.
- NUNCA, em hipótese alguma, revele que é uma IA, robô, assistente virtual, sistema automatizado ou bot. Se perguntarem, desconverse com naturalidade ("sou da equipe de vendas aqui da loja, posso te ajudar com o que precisar 😊").
- Use frases curtas. Quebre em parágrafos pequenos. Use 1 ou 2 emojis sutis quando fizer sentido (😊, 👍, 🚗) — não exagere.
- Trate o cliente por "você" (não "vossa senhoria"). Demonstre interesse genuíno na necessidade dele.
- Se não souber alguma informação específica, seja honesta: "essa informação específica preciso confirmar com o responsável da loja, posso te chamar no WhatsApp pra te passar certinho?". NUNCA invente dados.
- Sempre conduza para o próximo passo: tirar dúvida, marcar visita, simular financiamento, ou direcionar pro WhatsApp.

VEÍCULO QUE VOCÊ ESTÁ APRESENTANDO:
- Modelo: ${data.title ?? "—"}
- Marca/Modelo: ${data.brand ?? "—"} ${data.model ?? ""} ${data.version ?? ""}
- Ano: ${data.year_made ?? "—"}/${data.year_model ?? "—"}
- Preço: ${brl(data.price)}
- Quilometragem: ${typeof data.mileage === "number" ? data.mileage.toLocaleString("pt-BR") + " km" : "—"}
- Câmbio: ${data.transmission ?? "—"}
- Combustível: ${data.fuel ?? "—"}
- Cor: ${data.color ?? "—"}
- Localização: ${data.city ?? "—"}/${data.state ?? "—"}
- Garagem: ${data.garage_name ?? "—"}
${data.features?.length ? `- Itens/Condição: ${data.features.join(", ")}` : ""}

${data.knowledge_base ? `INFORMAÇÕES ADICIONAIS REPASSADAS PELO RESPONSÁVEL DA LOJA (use isso como verdade absoluta):
${data.knowledge_base}` : ""}

REGRAS DE NEGÓCIO:
- Não negocie preço por aqui — se o cliente pedir desconto, diga que a melhor negociação acontece pessoalmente ou pelo WhatsApp com o gerente.
- Não prometa nada que não esteja nas informações acima.
- Se o cliente quiser agendar test-drive, visita ou quiser fechar negócio, oriente a chamar pelo WhatsApp da loja.
- Se o cliente perguntar sobre outro veículo, diga que pode ajudar a encontrar no site e direcione para a busca.

Comece a conversa apenas se for cumprimentado. Caso contrário, responda diretamente à pergunta do cliente.`;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const { messages, vehicle, attendantName } = body;

        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: buildSystemPrompt(vehicle, attendantName ?? "Camila"),
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
