import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const EvaluationInput = z.object({
  brand: z.string().min(1).max(60),
  model: z.string().min(1).max(80),
  year_model: z.number().int().min(1980).max(2030),
  mileage: z.number().int().min(0).max(2_000_000),
  condition: z.enum(["excelente", "bom", "regular", "ruim"]),
  city: z.string().max(80).optional(),
  options: z.string().max(500).optional(),
});

const Schema = z.object({
  estimated_min: z.number().describe("Valor mínimo provável em BRL"),
  estimated_avg: z.number().describe("Valor médio de mercado em BRL"),
  estimated_max: z.number().describe("Valor máximo provável em BRL"),
  rationale: z.string().describe("Justificativa curta (2-4 frases) explicando os fatores que influenciaram o preço"),
  tips: z.array(z.string()).max(4).describe("Até 4 dicas curtas para valorizar o veículo na venda"),
});

export const evaluateVehicle = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EvaluationInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) {
      return { ok: false as const, error: "AI gateway não configurado." };
    }
    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `Você é Camila, especialista em precificação de veículos usados no mercado brasileiro, com foco na região da Serra Catarinense (Lages e cidades vizinhas).

Avalie o veículo abaixo e retorne valores estimados em REAIS (BRL):
- Marca: ${data.brand}
- Modelo: ${data.model}
- Ano modelo: ${data.year_model}
- Quilometragem: ${data.mileage.toLocaleString("pt-BR")} km
- Estado de conservação: ${data.condition}
- Cidade: ${data.city ?? "Lages/SC"}
- Itens/Observações: ${data.options ?? "não informado"}

Base sua estimativa na tabela FIPE de referência, na desvalorização típica por idade/km e em variação regional (Sul do país). Seja conservador. Retorne uma faixa realista (mín–máx) e um valor médio. Dê 2 a 4 dicas curtas e práticas para valorizar a venda.`;

    try {
      const { experimental_output } = await generateText({
        model: gateway("google/gemini-2.5-flash"),
        prompt,
        experimental_output: Output.object({ schema: Schema }),
      });
      return { ok: true as const, data: experimental_output };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      const isRate = msg.includes("429");
      const isCredits = msg.includes("402");
      return {
        ok: false as const,
        error: isRate
          ? "Muitas avaliações em sequência. Tente novamente em 1 minuto."
          : isCredits
            ? "Créditos de IA esgotados. Avise o administrador."
            : "Não foi possível avaliar agora. Tente novamente.",
      };
    }
  });
