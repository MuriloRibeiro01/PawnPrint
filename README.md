# 🐾 PawnPrint — Smart Pet Collar App

Aplicativo web/mobile em **React** para monitoramento de pets usando uma coleira inteligente equipada com sensores de **saúde** (batimentos cardíacos e temperatura) e **GPS**.  
O objetivo é fornecer uma experiência clara, intuitiva e rápida para tutores de animais, permitindo monitoramento em tempo real, relatórios, histórico e gerenciamento completo do pet.

Este README consolida toda a análise, o design do Figma e a arquitetura necessária para iniciar imediatamente o desenvolvimento do MVP.

---

## ✨ Visão Geral do Produto

- **Monitoramento em tempo real** dos sinais vitais (FC/Temperatura).
- **Localização por GPS** atualizada continuamente no mapa.
- **Geofence (cerca virtual)** com alertas imediatos.
- **Histórico e relatórios** de saúde e localização.
- **Perfil do pet e do tutor** com edição.
- **Design em tons quentes** (amarelo → laranja → vermelho) conforme o protótipo Figma.
- **Layout mobile-first**, fluído e moderno.
- **Arquitetura React + Vite** de alta performance.

---

## 🎨 Identidade Visual (Figma)

A interface segue a paleta definida no Figma:

- Amarelo → Laranja → Vermelho  
- Gradientes quentes — energia, cuidado e atenção  
- Cards arredondados  
- UI minimalista, clara e leve  
- Ícones e espaçamentos consistentes  
- Layout mobile-first com responsividade fluída  

**Referência do Design:**  
https://www.figma.com/make/wtfJEiOlvbbzujuF7UGWdw/PetCare

---

## 🧩 Funcionalidades do MVP

### ✅ Cadastro e Autenticação
- Login e cadastro (Firebase/Supabase Auth)
- Recuperação de senha

### ✅ Pets
- Cadastro de pet (nome, espécie, idade, peso, foto)
- Exibição do perfil do pet
- Suporte a múltiplos pets

### ✅ Monitoramento (Tempo real)
- Frequência cardíaca
- Temperatura corporal
- Status geral (normal/alerta/perigo)

### ✅ Geolocalização (GPS)
- Mapa em tempo real (Leaflet/Mapbox)
- Criação de geofence
- Alertas de “saiu da área segura”

### ✅ Histórico e Relatórios
- Gráficos das últimas 24h
- Histórico semanal
- Lista de alertas e eventos

### ✅ Perfil
- Dados do tutor
- Dados do pet
- Configurações gerais

---

## 🏛 Arquitetura Recomendada (React)

### **Stack Principal**
| Função | Tecnologia |
|-------|------------|
| Build Tool | **Vite** |
| Framework | **React 18** |
| Linguagem | **TypeScript** |
| UI | **TailwindCSS** + Radix UI |
| Mapas | React Leaflet / Mapbox |
| Gráficos | Recharts / Nivo |
| Estado | Zustand / Redux Toolkit |
| Backend | Supabase / Firebase |
| Deploy | Vercel / Netlify |

---

## 📁 Estrutura de Pastas

pawnprint/
├─ src/
│ ├─ assets/
│ ├─ components/
│ ├─ hooks/
│ ├─ layouts/
│ ├─ pages/
│ │ ├─ Dashboard/
│ │ ├─ Map/
│ │ ├─ Health/
│ │ ├─ Profile/
│ │ └─ Auth/
│ ├─ store/
│ ├─ services/
│ │ ├─ auth.service.ts
│ │ ├─ pets.service.ts
│ │ ├─ vitals.service.ts
│ │ ├─ location.service.ts
│ │ └─ geofence.service.ts
│ ├─ types/
│ ├─ utils/
│ ├─ App.tsx
│ └─ main.tsx
├─ public/
├─ index.html
└─ package.json

## 🧾 Modelos de Dados (TypeScript)

```ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  age: number;
  weight: number;
  photoURL?: string;
}

export interface VitalSigns {
  id: string;
  petId: string;
  timestamp: string;
  heartRate: number;
  temperature: number;
}

export interface LocationPoint {
  id: string;
  petId: string;
  timestamp: string;
  latitude: number;
  longitude: number;
}

export interface Geofence {
  id: string;
  petId: string;
  centerLat: number;
  centerLon: number;
  radius: number;
}
```

## 🛠 Tecnologias e Bibliotecas

### UI
- TailwindCSS  
- Radix UI  
- Lucide Icons  
- Framer Motion  

### Estado
- Zustand  
ou  
- Redux Toolkit  

### Mapa
- React Leaflet  
ou  
- Mapbox GL JS  

### Realtime
- Supabase Realtime  
ou  
- Firebase Listener  

### Charts
- Recharts  
ou  
- Nivo  

### Utilidades
- Axios  
- Zod  
- date-fns  

---

## 🚀 Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/pawnprint.git
cd pawnprint
```

### 2. Instale dependências
```bash
npm install
```

### 3. Configure variáveis de ambiente (.env)
Supabase:

```env
Copiar código
VITE_SUPABASE_URL=
VITE_SUPABASE_KEY=
Firebase:
```

```env
Copiar código
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
```

### 4. Execute o projeto
```bash
Copiar código
npm run dev
```

### 5. Build para produção
```bash
Copiar código
npm run build
🧪 Simulando dados do hardware (MVP)
ts
Copiar código
setInterval(() => {
  const heartRate = Math.floor(70 + Math.random() * 90);
  const temperature = 36 + Math.random() * 3;

  saveVitalData({ heartRate, temperature });
}, 5000);
```

### 🤝 Contribuindo
Crie uma branch:

```bash
Copiar código
git checkout -b feature/nova-feature
```
Commit:

```bash
Copiar código
git commit -m "Adiciona nova feature"
```
Submeta um Pull Request.
