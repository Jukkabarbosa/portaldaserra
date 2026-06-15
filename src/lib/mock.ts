// Mock data used while the database is empty so the site looks alive.
// Foco: Lages/SC e Serra Catarinense (São Joaquim, Urubici, Bom Jardim da Serra, Otacílio Costa, Correia Pinto).
export const MOCK_VEHICLES = [
  {
    id: "m1", title: "Porsche 911 Carrera S", brand: "Porsche", model: "911",
    year_made: 2022, year_model: 2023, price: 789000, mileage: 18000,
    transmission: "Automático", fuel: "Gasolina", color: "Cinza Ágata",
    city: "Lages", state: "SC", is_featured: true, status: "ativo",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
    garage_name: "Serra Premium Motors", garage_slug: "serra-premium",
    whatsapp: "5549999990001",
    has_ai: true,
    inspection_approved: true,
    knowledge_base: "Porsche 911 Carrera S 2022/2023. Único dono, sempre revisado na concessionária Porsche. Pacote Sport Chrono, escapamento esportivo, teto solar panorâmico, bancos esportivos em couro Bordeaux, rodas 20\" Carrera S, sistema PASM, PSM. Garantia de fábrica até 06/2026. IPVA 2026 pago. Laudo cautelar aprovado disponível. Aceita troca por SUV premium (Cayenne, Macan, X5). Financia em até 60x com entrada mínima de 30%. Visitas com hora marcada em Lages/SC.",
  },
  {
    id: "m2", title: "BMW M4 Competition", brand: "BMW", model: "M4",
    year_made: 2023, year_model: 2024, price: 695000, mileage: 8500,
    transmission: "Automático", fuel: "Gasolina", color: "Azul São Paulo",
    city: "Lages", state: "SC", is_featured: true, status: "ativo",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
    garage_name: "Hochland Auto", garage_slug: "hochland",
    whatsapp: "5549999990002",
    has_ai: true,
    inspection_approved: true,
    knowledge_base: "BMW M4 Competition 2023/2024, motor 3.0 biturbo 510cv, 0-100 em 3.5s. Cor Azul São Paulo, interior em couro Merino preto com costuras tricolor M. Pacote Carbon Exterior, M Driver's Package, head-up display, Harman Kardon, teto em fibra de carbono, escapamento M Performance titânio. Carro de garagem, sempre revisado na BMW. IPVA 2026 pago. Garantia BMW até 11/2026. Aceita troca por modelos premium. Financiamento com bancos parceiros, entrada a partir de 30%.",
  },
  {
    id: "m3", title: "Range Rover Sport HSE", brand: "Land Rover", model: "Range Rover Sport",
    year_made: 2021, year_model: 2022, price: 549000, mileage: 32000,
    transmission: "Automático", fuel: "Diesel", color: "Preto Santorini",
    city: "São Joaquim", state: "SC", is_featured: true, status: "ativo",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
    garage_name: "Vale Luxury Cars", garage_slug: "vale-luxury",
    whatsapp: "5549999990003",
    has_ai: true,
    knowledge_base: "Range Rover Sport HSE 2021/2022, motor 3.0 diesel mild hybrid 300cv. Cor Preto Santorini, interior em couro Windsor caramelo, teto panorâmico, banco massagem dianteiros, Meridian premium 825W, suspensão pneumática adaptativa. Pneus novos (trocados há 2.000 km). 2º dono, sempre revisado na concessionária. IPVA pago, laudo cautelar aprovado. Aceita troca, financia em até 60x.",
  },
  {
    id: "m4", title: "Mercedes-Benz GLE 400d", brand: "Mercedes-Benz", model: "GLE 400d",
    year_made: 2022, year_model: 2022, price: 489000, mileage: 41000,
    transmission: "Automático", fuel: "Diesel", color: "Branco",
    city: "Urubici", state: "SC", is_featured: false, status: "ativo",
    image: "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1200&q=80",
    garage_name: "Serra Premium Motors", garage_slug: "serra-premium",
    whatsapp: "5549999990001",
    inspection_approved: true,
  },
  {
    id: "m5", title: "Audi RS6 Avant", brand: "Audi", model: "RS6",
    year_made: 2023, year_model: 2023, price: 949000, mileage: 5200,
    transmission: "Automático", fuel: "Gasolina", color: "Cinza Nardo",
    city: "Lages", state: "SC", is_featured: true, status: "ativo",
    image: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=80",
    garage_name: "Hochland Auto", garage_slug: "hochland",
    whatsapp: "5549999990002",
  },
  {
    id: "m6", title: "Toyota Hilux SRX 4x4", brand: "Toyota", model: "Hilux",
    year_made: 2022, year_model: 2023, price: 329000, mileage: 28000,
    transmission: "Automático", fuel: "Diesel", color: "Prata",
    city: "Otacílio Costa", state: "SC", is_featured: false, status: "ativo",
    image: "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1200&q=80",
    garage_name: "Vale Luxury Cars", garage_slug: "vale-luxury",
    whatsapp: "5549999990003",
  },
];

export const MOCK_GARAGES = [
  { id: "g1", slug: "serra-premium", name: "Serra Premium Motors", city: "Lages", state: "SC",
    logo: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=300&q=80",
    cover: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1600&q=80",
    count: 24, whatsapp: "5549999990001", verified: true },
  { id: "g2", slug: "hochland", name: "Hochland Auto", city: "Lages", state: "SC",
    logo: "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=300&q=80",
    cover: "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=1600&q=80",
    count: 41, whatsapp: "5549999990002", verified: true },
  { id: "g3", slug: "vale-luxury", name: "Vale Luxury Cars", city: "São Joaquim", state: "SC",
    logo: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&q=80",
    cover: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600&q=80",
    count: 18, whatsapp: "5549999990003", verified: true },
  { id: "g4", slug: "alpina-cars", name: "Alpina Cars", city: "Bom Jardim da Serra", state: "SC",
    logo: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&q=80",
    cover: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600&q=80",
    count: 12, whatsapp: "5549999990004", verified: false },
];

export const VEHICLE_BRANDS = [
  "Audi","BMW","Chevrolet","Citroën","Fiat","Ford","Honda","Hyundai","Jeep","Kia",
  "Land Rover","Mercedes-Benz","Mitsubishi","Nissan","Peugeot","Porsche","Renault",
  "Toyota","Volkswagen","Volvo",
];

export const VEHICLE_TYPES = ["Sedan","Hatch","SUV","Pickup","Esportivo","Utilitário","Moto"];

export const SERRA_CITIES = [
  "Lages", "São Joaquim", "Urubici", "Bom Jardim da Serra",
  "Otacílio Costa", "Correia Pinto", "Painel", "Urupema",
];
