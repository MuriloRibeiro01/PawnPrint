# 🐾 PawnPrint — Smart Pet Collar App

Aplicativo mobile em **React Native (Expo)** para monitoramento de pets usando uma coleira inteligente equipada com sensores de **saúde** (batimentos cardíacos e temperatura) e **GPS**.
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
- **Arquitetura Expo + React Native** otimizada para iOS, Android e Web.

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

## 🏛 Arquitetura do App (Expo)

### **Stack Principal**
| Função | Tecnologia |
|-------|------------|
| Build Tool | **Expo** |
| Framework | **React Native 0.74** |
| Linguagem | **TypeScript** |
| UI | Componentes nativos + `lucide-react-native` + `expo-linear-gradient` |
| Gráficos | `react-native-svg` (custom) |
| Estado | Zustand |
| Backend | Supabase / Firebase |
| Deploy | Expo (EAS) |

---

## 📁 Estrutura de Pastas

pawn-print/
├─ App.tsx
├─ components/
├─ hooks/
├─ services/
├─ store/
├─ app.json
├─ package.json
├─ tsconfig.json
└─ babel.config.js

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
- React Native Primitives
- `lucide-react-native`
- `expo-linear-gradient`

### Estado
- Zustand

### Mapa
- Integração com APIs externas (Mapbox / Google) — a implementar

### Realtime
- Supabase Realtime
ou
- Firebase Listener

### Charts
- `react-native-svg`

### Utilidades
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

Utilize variáveis iniciadas com `EXPO_PUBLIC_` para expor URLs ou chaves necessárias.

### 4. Execute o projeto
```bash
npm start
```

### 5. Build para produção
```bash
npx expo export
```
### 🤝 Contribuindo
Crie uma branch:

```bash
git checkout -b feature/nova-feature
```
Commit:

```bash
git commit -m "Adiciona nova feature"
```
Submeta um Pull Request.
