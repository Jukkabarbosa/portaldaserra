import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { VehicleCard } from "@/components/site/VehicleCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Filter, Search } from "lucide-react";
import { MOCK_VEHICLES, VEHICLE_BRANDS } from "@/lib/mock";
import { SponsorInlineCard } from "@/components/site/SponsorStrip";

export const Route = createFileRoute("/carros")({ component: Listing });

function Filters({ brand, setBrand }: any) {
  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Marca</label>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Todas as marcas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {VEHICLE_BRANDS.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Preço</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Input placeholder="Mín" />
          <Input placeholder="Máx" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ano</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <Input placeholder="De" />
          <Input placeholder="Até" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Cidade</label>
        <Input placeholder="Ex.: Lages" className="mt-1" />
      </div>
      <Button className="w-full">Aplicar filtros</Button>
    </div>
  );
}

function Listing() {
  const [brand, setBrand] = React.useState("all");
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState("recent");

  const list = React.useMemo(() => {
    let l = [...MOCK_VEHICLES];
    if (brand !== "all") l = l.filter(v => v.brand === brand);
    if (q) l = l.filter(v => v.title.toLowerCase().includes(q.toLowerCase()));
    if (sort === "price_asc") l.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") l.sort((a, b) => b.price - a.price);
    if (sort === "km_asc") l.sort((a, b) => a.mileage - b.mileage);
    return l;
  }, [brand, q, sort]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="font-display font-black text-3xl md:text-4xl">Veículos anunciados</h1>
            <p className="text-muted-foreground text-sm mt-1">{list.length} resultados encontrados</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais recentes</SelectItem>
                <SelectItem value="price_asc">Menor preço</SelectItem>
                <SelectItem value="price_desc">Maior preço</SelectItem>
                <SelectItem value="km_asc">Menor km</SelectItem>
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden"><Filter className="h-4 w-4" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetTitle className="mb-4">Filtros</SheetTitle>
                <Filters brand={brand} setBrand={setBrand} />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="hidden lg:block sticky top-20 self-start rounded-2xl border p-5 bg-card">
            <h3 className="font-display font-bold mb-4">Filtros</h3>
            <Filters brand={brand} setBrand={setBrand} />
          </aside>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {list.map((v, idx) => (
              <React.Fragment key={v.id}>
                <VehicleCard v={v} />
                {(idx + 1) % 6 === 0 && idx !== list.length - 1 && <SponsorInlineCard />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
