# ExtratoIQ

Projeto Angular estruturado seguindo as melhores práticas, baseado na arquitetura do projeto FeriasWeb.

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/                    # Funcionalidades centrais da aplicação
│   │   ├── auth/               # Componente de autenticação
│   │   ├── footer/             # Componente de rodapé
│   │   ├── guards/             # Guards de rota
│   │   │   ├── auth.guard.ts
│   │   │   ├── guest.guard.ts
│   │   │   └── unsaved-changes.guard.ts
│   │   ├── header/             # Componente de cabeçalho
│   │   ├── interceptors/       # Interceptors HTTP
│   │   │   ├── globalhttpinterceptor.service.ts
│   │   │   ├── jwt-auth.interceptor.ts
│   │   │   └── loading.interceptor.ts
│   │   ├── models/             # Modelos de dados do core
│   │   ├── nav/                # Componente de navegação
│   │   ├── not-found/          # Componente 404
│   │   ├── ops/                # Páginas de operações/erros
│   │   ├── services/           # Serviços centrais
│   │   │   ├── auth.service.ts
│   │   │   ├── base-api.service.ts
│   │   │   ├── loading.service.ts
│   │   │   └── ui.service.ts
│   │   ├── session-expired/    # Componente de sessão expirada
│   │   └── unauthorized/      # Componente de acesso negado
│   ├── directive/              # Diretivas customizadas
│   ├── models/                # Modelos globais
│   │   ├── consts.ts
│   │   └── key-value-pair.ts
│   ├── shared/                 # Componentes e utilitários compartilhados
│   │   ├── base/              # Classes base
│   │   │   ├── base-paged-list.model.ts
│   │   │   └── component-base.ts
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── directives/        # Diretivas compartilhadas
│   │   ├── pipes/             # Pipes customizados
│   │   └── util/              # Utilitários
│   └── views/                 # Páginas/views da aplicação
│       └── home/              # Página inicial
├── assets/                    # Arquivos estáticos
├── environments/             # Configurações de ambiente
│   ├── environment.ts
│   └── environment.prod.ts
├── index.html
├── main.ts
└── styles.scss
```

## Características

### Arquitetura

- **Standalone Components**: Todos os componentes são standalone
- **Lazy Loading**: Rotas configuradas para carregamento sob demanda
- **Path Aliases**: Imports usando aliases (`@app/*`, `@environments/*`, etc)
- **Separação de Responsabilidades**: Core, Shared e Views bem definidos

### Serviços Base

- **BaseApiService**: Serviço base para chamadas HTTP
- **ComponentBase**: Classe base para componentes com tratamento de erros
- **UiService**: Serviço para diálogos, toasts e loading
- **LoadingService**: Gerenciamento de estado de carregamento
- **AuthService**: Gerenciamento de autenticação

### Guards

- **authGuard**: Protege rotas que requerem autenticação
- **guestGuard**: Protege rotas para usuários não autenticados
- **unsavedChangesGuard**: Previne navegação com alterações não salvas

### Interceptors

- **jwtAuthInterceptor**: Adiciona token JWT nas requisições
- **loadingInterceptor**: Gerencia estado de loading global
- **globalHttpInterceptor**: Tratamento global de erros HTTP

## Scripts Disponíveis

```bash
# Desenvolvimento
npm start

# Build
npm run build
npm run build:prod

# Testes
npm test

# Lint
npm run lint

# Formatação
npm run format
npm run format:check
```

## Path Aliases

O projeto utiliza path aliases para facilitar os imports:

- `@app/*` → `src/app/*`
- `@environments/*` → `src/environments/*`
- `@app-shared/*` → `src/app/shared/*`
- `@models/*` → `src/app/core/models/*`
- `@services/*` → `src/app/core/services/*`
- `@components/*` → `src/app/shared/components/*`
- `@guards/*` → `src/app/core/guards/*`

## Configuração de Ambiente

Edite os arquivos em `src/environments/` para configurar as URLs da API:

- `environment.ts`: Desenvolvimento
- `environment.prod.ts`: Produção

## Boas Práticas

1. **Componentes**: Use `ComponentBase` como base para componentes que precisam de tratamento de erros
2. **Serviços**: Estenda `BaseApiService` para serviços de API
3. **Models**: Mantenha modelos específicos em `core/models` e modelos globais em `app/models`
4. **Views**: Organize páginas da aplicação em `views/`
5. **Shared**: Componentes reutilizáveis devem ficar em `shared/components`

## Tecnologias

- Angular 21
- TypeScript 5.9
- RxJS 7.8
- SCSS
- ESLint + Prettier

## Desenvolvimento

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Execute o projeto: `npm start`
4. Acesse: `http://localhost:4200`

## Licença

Este projeto é privado.
