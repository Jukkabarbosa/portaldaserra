import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, Car, User as UserIcon, LogOut, LayoutDashboard, ShieldCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { to: "/carros", label: "Carros" },
  { to: "/garagens", label: "Garagens" },
  { to: "/simulador", label: "Simulador" },
  { to: "/avaliacao", label: "Avaliar carro" },
  { to: "/alertas", label: "Alertas" },
  { to: "/patrocinadores", label: "Patrocinadores" },
  { to: "/planos", label: "Para garagistas" },
  { to: "/quem-somos", label: "Quem somos" },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const { user, isAdmin, isGaragista, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 glass border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="Portal da Serra" className="h-10 w-10 object-contain" />
          <div className="hidden sm:block leading-tight">
            <div className="font-display font-black tracking-tight">PORTAL DA SERRA</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Marketplace Automotivo</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}
              className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              activeProps={{ className: "bg-accent text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Alternar tema">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[120px] truncate">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><ShieldCheck className="mr-2 h-4 w-4" /> Painel Admin</Link>
                  </DropdownMenuItem>
                )}
                {(isGaragista || isAdmin) && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Meu painel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/garagem"><Car className="mr-2 h-4 w-4" /> Minha garagem</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild><Link to="/auth">Entrar</Link></Button>
              <Button size="sm" asChild className="bg-primary"><Link to="/auth">Anunciar</Link></Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-1 mt-8">
                {NAV.map((n) => (
                  <Link key={n.to} to={n.to} className="px-3 py-3 rounded-lg hover:bg-accent text-base font-medium">{n.label}</Link>
                ))}
                <Link to="/auth" className="px-3 py-3 rounded-lg hover:bg-accent text-base font-medium">Entrar</Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
