import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { Send, Sparkles, MessageCircle, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type VehicleContext = {
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

type Props = {
  vehicle: VehicleContext;
  attendantName?: string;
};

const SUGGESTIONS = [
  "Esse carro ainda está disponível?",
  "Aceita troca?",
  "Tem laudo cautelar?",
  "Como funciona o financiamento?",
];

function renderMessageText(m: UIMessage) {
  return m.parts.map((p, i) => (p.type === "text" ? <span key={i}>{p.text}</span> : null));
}

export function VirtualAttendant({ vehicle, attendantName = "Camila" }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const greeting: UIMessage = {
    id: "greet",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: `Oi! Eu sou a ${attendantName} 😊 Vi que você está olhando o ${vehicle.title}. Posso te ajudar com alguma dúvida?`,
      },
    ],
  };

  const { messages, sendMessage, status, error } = useChat({
    id: `vehicle-${vehicle.title}`,
    messages: [greeting],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { vehicle, attendantName },
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, messages.length]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  };

  const handleSuggestion = async (text: string) => {
    if (isLoading) return;
    await sendMessage({ text });
  };

  return (
    <>
      {/* Trigger button (floating, bottom-right) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 pl-3 pr-5 py-3 rounded-full bg-[oklch(0.14_0.025_260)] text-white border border-white/10 shadow-2xl hover:shadow-[0_20px_50px_-10px_oklch(0.78_0.13_78/0.5)] transition-all hover:-translate-y-0.5"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[oklch(0.65_0.15_60)] text-[oklch(0.14_0.025_260)]">
            <MessageCircle className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-[oklch(0.14_0.025_260)]" />
            </span>
          </span>
          <span className="text-left">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-[var(--gold)]">Atendente online</span>
            <span className="block text-sm font-semibold">Fale com a {attendantName}</span>
          </span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[420px] h-[640px] max-h-[calc(100vh-3rem)] rounded-3xl bg-[oklch(0.14_0.025_260)] border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="relative p-5 bg-gradient-to-br from-[oklch(0.22_0.06_260)] to-[oklch(0.16_0.03_260)] border-b border-white/5">
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[var(--gold)]/15 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-[var(--gold)] to-[oklch(0.65_0.15_60)] grid place-items-center text-[oklch(0.14_0.025_260)] font-display font-extrabold text-lg">
                  {attendantName.charAt(0)}
                  <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-[oklch(0.22_0.06_260)]" />
                </div>
                <div className="text-white">
                  <div className="font-display font-bold text-base leading-tight">{attendantName}</div>
                  <div className="text-[11px] text-white/50 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Online agora · {vehicle.garage_name ?? "Portal da Serra"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 grid place-items-center text-white/60 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 text-[10px] font-bold uppercase tracking-widest text-[var(--gold)]">
              <Sparkles className="h-3 w-3" /> Especialista no veículo
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" ? (
                  <div className="max-w-[85%]">
                    <div className="text-white/90 text-[14px] leading-relaxed whitespace-pre-wrap">
                      {renderMessageText(m)}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-[var(--gold)] text-[oklch(0.14_0.025_260)] text-[14px] leading-relaxed whitespace-pre-wrap font-medium">
                    {renderMessageText(m)}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="text-white/40 text-sm inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> digitando…
                </div>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                Tive um probleminha pra responder agora. Tenta de novo em instantes.
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && !isLoading && (
            <div className="px-5 pb-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSuggestion(s)}
                  className="text-[12px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Composer */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-[oklch(0.16_0.03_260)]">
            <div className="flex items-end gap-2 bg-white/[0.04] border border-white/10 rounded-2xl p-2 focus-within:border-[var(--gold)]/40 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                rows={1}
                placeholder="Digite sua mensagem…"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none resize-none max-h-32 py-2 px-2"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="h-9 w-9 shrink-0 rounded-xl bg-[var(--gold)] text-[oklch(0.14_0.025_260)] hover:bg-[var(--gold)]/90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-[10px] text-white/30 text-center">
              Atendimento exclusivo · garagens Premium
            </div>
          </form>
        </div>
      )}
    </>
  );
}
