# Controle Financeiro API

Uma aplicação completa para controle de finanças pessoais ou familiar, com backend desenvolvido em **.NET 8** e frontend em **React + TypeScript + Vite**.

## 📋 Sumário

- [Visão Geral](#visão-geral)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Setup Backend (.NET)](#setup-backend-net)
- [Setup Frontend (React)](#setup-frontend-react)
- [Executando o Projeto](#executando-o-projeto)
- [Migrations do Banco de Dados](#migrations-do-banco-de-dados)

---

## 🎯 Visão Geral

O **Controle Financeiro API** é uma aplicação de stack completo que permite:
- Gerenciar transações financeiras
- Acompanhar despesas e receitas
- Visualizar relatórios de gastos
- Interface moderna e responsiva

**Stack Tecnológico:**
- **Backend:** .NET 8, Entity Framework Core, SQLite
- **Frontend:** React 18+, TypeScript, Vite, Shadcn/ui, TailwindCSS
- **Banco de Dados:** SQLite (arquivo `transacoes.db`)

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de que você possui instalado:

### Backend
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Entity Framework Core Tools** (opcional, para CLI de migrations):
  ```powershell
  dotnet tool install --global dotnet-ef
  ```

### Frontend
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **Bun** (opcional, recomendado para gerenciamento de pacotes):
  ```powershell
  npm install -g bun
  ```

---

## 📂 Estrutura do Projeto

```
ControleFinaceiro.API/
├── ControleFinaceiro.API.Server/          # Backend (.NET 8)
│   ├── Program.cs                         # Configuração da aplicação
│   ├── ControleFinaceiro.API.Server.csproj
│   ├── Data/
│   │   └── AppDbContext.cs                # DbContext do Entity Framework
│   ├── Migrations/                         # Histórico de migrations
│   │   ├── 20260328191838_AtualizacaoDeModelos.cs
│   │   └── AppDbContextModelSnapshot.cs
│   ├── appsettings.json                   # Configurações (produção)
│   ├── appsettings.Development.json       # Configurações (desenvolvimento)
│   └── wwwroot/                           # Arquivos estáticos servidos
│
└── controlefinaceiro.api.client/          # Frontend (React + TypeScript)
    ├── src/
    │   ├── components/                    # Componentes React
    │   ├── pages/                         # Páginas da aplicação
    │   ├── App.tsx                        # Componente raiz
    │   └── main.tsx                       # Entrada da aplicação
    ├── package.json                       # Dependências do projeto
    ├── bun.lock                           # Lock file do Bun
    ├── tsconfig.json                      # Configurações TypeScript
    └── vite.config.ts                     # Configurações Vite

```

---

## 🔧 Setup Backend (.NET)

### 1. Navegar para o diretório do backend

```powershell
cd ControleFinaceiro.API.Server
```

### 2. Restaurar dependências

```powershell
dotnet restore
```

### 3. Verificar a string de conexão

Abra o arquivo `appsettings.json` e confirme:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=transacoes.db"
  }
}
```

### 4. Aplicar Migrations (Banco de Dados)

As migrations serão aplicadas automaticamente ao iniciar a aplicação. Porém, se desejar executar manualmente:

```powershell
dotnet ef database update
```

Se você fez alterações no modelo e precisa criar uma nova migration:

```powershell
dotnet ef migrations add NomeDaMigration
dotnet ef database update
```

### 5. Iniciar o Backend

```powershell
dotnet run
```

A API estará disponível em:
- **HTTPS:** `https://localhost:5001`
- **HTTP:** `http://localhost:5000`
- **Swagger UI:** `https://localhost:5001/swagger`

---

## ⚛️ Setup Frontend (React)

### 1. Navegar para o diretório do frontend

```powershell
cd controlefinaceiro.api.client
```

### 2. Instalar dependências

**Usando Bun (recomendado):**
```powershell
bun install
```

**Ou usando npm:**
```powershell
npm install
```

---

## 🚀 Executando o Projeto

### Opção 1: Executar Backend e Frontend Separadamente

#### Terminal 1 - Backend (.NET):
```powershell
cd ControleFinaceiro.API.Server
dotnet run
# Aguarde: "Now listening on: https://localhost:5001"
```

#### Terminal 2 - Frontend (React):
```powershell
cd controlefinaceiro.api.client
bun run dev
# ou: npm run dev
# A saída mostrará: "Local: http://localhost:5173"
```

Abra seu navegador em: **http://localhost:5173**

### Opção 2: Executar via Visual Studio

1. Abra a solução no Visual Studio
2. Defina `ControleFinaceiro.API.Server` como projeto de inicialização
3. Pressione `F5` para executar
4. O Visual Studio pode iniciar automaticamente o Vite dev server

---

## 🗄️ Migrations do Banco de Dados

### Entendendo Migrations

Migrations são scripts que rastreiam e aplicam mudanças no banco de dados. O projeto usa **Entity Framework Core** com **SQLite**.

### Fluxo de Migrations

```
Mudança no Modelo (AppDbContext.cs)
         ↓
dotnet ef migrations add MigrationName
         ↓
Arquivo criado em: Migrations/TIMESTAMP_MigrationName.cs
         ↓
dotnet ef database update
         ↓
Banco de dados atualizado
```

### Comandos Úteis

```powershell
# Ver migrations pendentes
dotnet ef migrations list

# Criar uma nova migration
dotnet ef migrations add NovaFeature

# Aplicar todas as migrations pendentes
dotnet ef database update

# Reverter para uma migration específica
dotnet ef database update NomeDaMigration

# Remover a última migration (se ainda não aplicada ao BD)
dotnet ef migrations remove

# Gerar script SQL (sem aplicar ao BD)
dotnet ef migrations script -o migrations.sql
```

### Estrutura de uma Migration

Cada migration possui dois arquivos:

**Arquivo Forward (AtualizacaoDeModelos.cs):**
```csharp
protected override void Up(MigrationBuilder migrationBuilder)
{
    // Alterações a serem aplicadas
    migrationBuilder.CreateTable(...);
}
```

**Arquivo Reverse (AtualizacaoDeModelos.cs):**
```csharp
protected override void Down(MigrationBuilder migrationBuilder)
{
    // Como desfazer as alterações
    migrationBuilder.DropTable(...);
}
```

---

## 🌐 Variáveis de Ambiente

### Backend (.NET)

No arquivo `appsettings.Development.json`, customize:
```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=transacoes.db"
  }
}
```

### Frontend (React)

Se necessário, crie um arquivo `.env.local`:
```env
VITE_API_URL=https://localhost:5001
```

---

## 🛠️ Scripts Disponíveis

### Backend

```powershell
dotnet run                    # Executar em desenvolvimento
dotnet build                  # Compilar o projeto
dotnet publish -c Release     # Preparar para produção
```

### Frontend

```bash
bun run dev                   # Iniciar dev server (http://localhost:5173)
bun run build                 # Build para produção
bun run preview               # Preview da build de produção
bun run lint                  # Lint do código
bun run test                  # Rodar testes
bun run test:watch            # Rodar testes em watch mode
```

---

## 📝 Configuração do CORS

O backend está configurado para aceitar requisições do frontend em:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:8080` (alternativo)

Se precisar adicionar mais origens, edite `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:5173", "http://seu-dominio.com")
```

---

## 🐛 Troubleshooting

### Erro: "Database is locked"
```powershell
# O banco está em uso por outro processo. Encerre todos os processos do app e tente novamente.
```

### Erro: Migration não encontrada
```powershell
# Garanta que está no diretório correto:
cd ControleFinaceiro.API.Server
dotnet ef database update
```

### Frontend não conecta à API
- Verifique se o backend está rodando em `https://localhost:5001`
- Confirme a configuração de CORS em `Program.cs`
- Abra o DevTools (F12) e verifique erros no console

### Porta 5173 já está em uso
```powershell
# Especifique uma porta diferente:
bun run dev -- --port 5174
```

---

## 📚 Recursos Adicionais

- [Documentação .NET 8](https://learn.microsoft.com/en-us/dotnet/)
- [Entity Framework Core](https://learn.microsoft.com/en-us/ef/core/)
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Shadcn/ui](https://ui.shadcn.com/)

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👤 Autor

Desenvolvido como parte do portfólio.

---

**Última atualização:** Março 2025
