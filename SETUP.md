# Guia de Execução do App PawnPrint

Este guia explica em detalhes tudo o que você precisa para instalar as dependências, configurar o ambiente e executar o aplicativo PawnPrint em modo de desenvolvimento. Siga todas as etapas na ordem em que aparecem.

---

## 1. Requisitos de Software

Antes de começar, instale os seguintes programas no seu computador:

1. **Git** — controle de versão usado para clonar o repositório.
   - [Download](https://git-scm.com/downloads)
2. **Node.js 18 LTS ou superior** — contém o interpretador JavaScript e o gerenciador de pacotes `npm`.
   - [Download](https://nodejs.org/en/download)
3. **Editor de código** (opcional, mas recomendado)
   - [Visual Studio Code](https://code.visualstudio.com/) ou outro de sua preferência.
4. **Android Studio (opcional)** — apenas se desejar testar a versão web em um dispositivo Android virtual usando o emulador integrado.
   - [Download](https://developer.android.com/studio)
   - Durante a instalação, marque a opção para instalar o **Android Virtual Device (AVD Manager)**.

> 💡 Se você pretende somente executar a versão web no navegador do seu computador, o Android Studio não é obrigatório.

---

## 2. Preparar o Ambiente

### 2.1 Verificar Node.js e npm

Após a instalação do Node.js, confirme que tudo está funcionando abrindo um terminal e executando:

```bash
node -v
npm -v
```

Os comandos devem exibir as versões instaladas (por exemplo, `v18.x.x` para Node e `8.x.x` para npm).

### 2.2 Configurar o Android Studio (opcional)

Caso queira testar em um emulador Android:

1. Abra o **Android Studio**.
2. Vá em **More Actions → Virtual Device Manager**.
3. Clique em **Create Device** e escolha um dispositivo (por exemplo, Pixel 5).
4. Baixe uma imagem do sistema (API 33 ou superior) e conclua a criação do emulador.
5. Deixe o emulador pronto, mas não é necessário iniciá-lo agora.

---

## 3. Obter o Código-Fonte

No terminal, escolha uma pasta onde deseja guardar o projeto e execute:

```bash
git clone https://github.com/seu-usuario/pawnprint.git
cd pawnprint
```

Substitua `seu-usuario` pelo nome do usuário real caso esteja clonando de outro local.

---

## 4. Instalar Dependências do Projeto

Com o terminal aberto na pasta do projeto, execute:

```bash
npm install
```

Esse comando baixa todas as bibliotecas necessárias definidas no `package.json`.

---

## 5. Configurar Variáveis de Ambiente

O app espera variáveis de ambiente (por exemplo, chaves do Supabase ou Firebase). Crie um arquivo `.env` na raiz do projeto com os valores apropriados:

```bash
cp .env.example .env # se existir o arquivo de exemplo
```

Edite o arquivo `.env` e preencha com suas chaves:

```env
VITE_SUPABASE_URL="https://sua-instancia.supabase.co"
VITE_SUPABASE_KEY="sua-chave"
VITE_FIREBASE_API_KEY="sua-chave"
VITE_FIREBASE_AUTH_DOMAIN="seu-projeto.firebaseapp.com"
```

> ✅ Ajuste os nomes das variáveis conforme os serviços que você realmente utiliza. Se algum serviço ainda não estiver configurado, deixe a variável vazia temporariamente, mas lembre-se de preenchê-la antes de usar funcionalidades dependentes dele.

---

## 6. Executar o Servidor de Desenvolvimento

Inicie o ambiente de desenvolvimento Vite com:

```bash
npm run dev
```

O terminal exibirá uma URL semelhante a `http://localhost:5173/`. Acesse esse endereço no navegador para abrir o app.

### 6.1 Usando o Android Studio para Testar no Emulador (opcional)

1. Com o comando `npm run dev` ativo, copie a URL `http://localhost:5173/`.
2. Inicie o emulador Android pelo Android Studio (AVD Manager).
3. No emulador, abra o Chrome e navegue até a URL copiada. Se estiver executando no mesmo computador, use `http://10.0.2.2:5173/` (endereço padrão de loopback do emulador).
4. O app web será carregado dentro do dispositivo virtual, permitindo validar o layout mobile.

---

## 7. Comandos Úteis Adicionais

- **Executar lint/testes** (caso configurados):
  ```bash
  npm run lint
  npm test
  ```
- **Gerar build de produção:**
  ```bash
  npm run build
  ```
- **Pré-visualizar o build:**
  ```bash
  npm run preview
  ```

---

## 8. Solução de Problemas

| Sintoma | Possível causa | Ação recomendada |
|--------|----------------|------------------|
| `npm` não é reconhecido | Node.js não instalado ou não adicionado ao PATH | Reinstale o Node.js e reinicie o terminal |
| Erro ao instalar dependências | Cache corrompido do npm | Execute `npm cache clean --force` e depois `npm install` novamente |
| App não abre no emulador Android | URL incorreta | Use `http://10.0.2.2:5173/` no navegador do emulador |
| Variáveis `VITE_*` indefinidas | `.env` ausente ou incompleto | Verifique se o arquivo `.env` existe e está preenchido |

---

## 9. Próximos Passos

- Ajustar as configurações do Firebase ou Supabase conforme os serviços que você habilitar.
- Configurar deploy (Vercel/Netlify) após validar o build com `npm run build`.
- Documentar credenciais e processos internos para a equipe.

Seguindo esse passo a passo, você terá o ambiente pronto para desenvolver e testar o PawnPrint tanto no navegador quanto em um dispositivo Android virtual.
