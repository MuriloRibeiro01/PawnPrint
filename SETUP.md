# Guia de Configuração — PawnPrint

Este documento explica como preparar o ambiente, instalar dependências e executar o aplicativo PawnPrint utilizando **Expo**.

---

## 1. Pré-requisitos

Instale os softwares abaixo antes de continuar:

1. **Git** – necessário para clonar o repositório.  
   [Download](https://git-scm.com/downloads)
2. **Node.js 18 LTS ou superior** – inclui o `npm`, usado para instalar dependências.  
   [Download](https://nodejs.org/en/download)
3. **Expo Go (Android/iOS)** – aplicativo opcional para testar no dispositivo físico.  
   [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) · [iOS](https://apps.apple.com/app/expo-go/id982107779)
4. **Android Studio** *(opcional)* – apenas se desejar emular o app Android no computador.  
   Durante a instalação selecione o **Android Virtual Device (AVD)**.

> 💡 Se você for utilizar um dispositivo físico, basta ter o Expo Go instalado e estar na mesma rede Wi-Fi do computador.

---

## 2. Obter o código

Abra um terminal, escolha a pasta onde deseja guardar o projeto e execute:

```bash
git clone https://github.com/seu-usuario/pawn-print.git
cd pawn-print
```

Substitua a URL pelo endereço real do seu repositório remoto.

---

## 3. Instalar dependências

Com o terminal na raiz do projeto, rode:

```bash
npm install
```

Esse comando instala todas as bibliotecas definidas no `package.json`.

---

## 4. Variáveis de ambiente

Expo expõe variáveis somente se elas começarem com `EXPO_PUBLIC_`. Crie um arquivo `.env` na raiz do projeto (ou copie o modelo caso exista) e defina os valores necessários:

```bash
cp .env.example .env # caso exista o arquivo de exemplo
```

Edite o `.env` e ajuste os valores:

```env
EXPO_PUBLIC_API_BASE_URL="http://localhost:3000"
EXPO_PUBLIC_SUPABASE_URL="https://sua-instancia.supabase.co"
EXPO_PUBLIC_SUPABASE_KEY="sua-chave"
```

Adapte as variáveis aos serviços que estiver utilizando.

---

## 5. Executar o app

Inicie o servidor de desenvolvimento do Expo com:

```bash
npm start
```

O Expo abrirá o **Expo Dev Tools** no navegador ou exibirá um QR Code no terminal. Você pode:

- Pressionar **`w`** para abrir a versão web.  
- Pressionar **`a`** para iniciar/usar um emulador Android configurado.  
- Pressionar **`i`** para iniciar um simulador iOS (em macOS).  
- Escanear o QR Code com o **Expo Go** para testar no dispositivo físico.

> Caso utilize um emulador Android, verifique se o AVD está iniciado antes de pressionar `a`.

---

## 6. Scripts úteis

```bash
npm run lint   # executa o ESLint
npm run android # build nativo/rodar no Android (requer ambiente nativo configurado)
npm run ios     # build nativo/rodar no iOS (requer Xcode)
npx expo export # gera build web estático
```

---

## 7. Estrutura do projeto

O código-fonte principal está em `src/`:

- `src/app` – ponto de entrada do aplicativo.  
- `src/components` – componentes reutilizáveis de UI.  
- `src/hooks` – hooks específicos do domínio (ex.: telemetria).  
- `src/services` – clientes HTTP e integrações externas.  
- `src/store` – gerenciamento de estado global com Zustand.  
- `src/styles` – estilos globais.

Os protótipos de hardware estão em `hardware/prototypes/`.

---

## 8. Solução de problemas

| Sintoma | Possível causa | Ação recomendada |
|--------|----------------|------------------|
| `npm` não é reconhecido | Node.js não instalado ou não está no PATH | Reinstale o Node.js e reinicie o terminal |
| O Expo Dev Tools não abre | Porta ocupada ou firewall bloqueando | Informe `E` e escolha outra porta, ou libere a porta 8081 |
| Erro ao iniciar no Android | Emulador não iniciado | Abra o AVD no Android Studio antes de pressionar `a` |
| Variáveis `EXPO_PUBLIC_*` vazias | `.env` ausente ou variáveis com prefixo incorreto | Crie/edite o `.env` garantindo o prefixo `EXPO_PUBLIC_` |

Seguindo essas etapas, o ambiente ficará pronto para desenvolver e testar o PawnPrint.
