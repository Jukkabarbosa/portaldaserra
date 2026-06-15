import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { SponsorFooterBlock } from "@/components/site/SponsorStrip";

export function Footer() {
  return (
    <footer className="border-t bg-card mt-24">
      <SponsorFooterBlock />
      <div className="container mx-auto px-4 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="" className="h-10 w-10" />
            <div>
              <div className="font-display font-black">PORTAL DA SERRA</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Marketplace Automotivo · Santa Catarina</div>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            O marketplace mais completo e inteligente de Santa Catarina. Garagens verificadas,
            tecnologia de ponta e suporte humano de verdade.
          </p>
          <a
            href="https://wa.me/5511937321847"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-[var(--gold)] transition-colors"
          >
            <Phone className="h-4 w-4 text-[var(--gold)]" /> (11) 93732-1847
          </a>
        </div>

        <div>
          <h4 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Explorar</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/carros" className="text-muted-foreground hover:text-foreground">Carros</Link></li>
            <li><Link to="/garagens" className="text-muted-foreground hover:text-foreground">Garagens</Link></li>
            <li><Link to="/planos" className="text-muted-foreground hover:text-foreground">Para garagistas</Link></li>
            <li><Link to="/patrocinadores" className="text-muted-foreground hover:text-foreground">Patrocinadores</Link></li>
            <li><Link to="/quem-somos" className="text-muted-foreground hover:text-foreground">Quem somos</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-bold mb-3 text-sm uppercase tracking-wider">Conta</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/auth" className="text-muted-foreground hover:text-foreground">Entrar / Cadastrar</Link></li>
            <li><Link to="/dashboard" className="text-muted-foreground hover:text-foreground">Painel</Link></li>
          </ul>
          <div className="flex gap-3 mt-5">
            <a aria-label="Instagram" href="#" className="p-2 rounded-full border hover:bg-accent"><Instagram className="h-4 w-4" /></a>
            <a aria-label="Facebook" href="#" className="p-2 rounded-full border hover:bg-accent"><Facebook className="h-4 w-4" /></a>
            <a aria-label="Email" href="#" className="p-2 rounded-full border hover:bg-accent"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row justify-between gap-2 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Portal da Serra. Todos os direitos reservados.</span>
          <span>Feito com 💙 em Santa Catarina</span>
        </div>
      </div>
    </footer>
  );
}
