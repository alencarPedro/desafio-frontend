# 🚗 Planejador de Rotas para Veículos Elétricos

Aplicação web para planejamento de rotas otimizadas para veículos elétricos, com cálculo de estações de recarga, consumo de energia e estimativas de tempo de viagem.

## 🚀 Tecnologias

- **React 19** - Biblioteca UI
- **Vite 7** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **MapLibre GL JS** - Renderização de mapas
- **Zustand** - Gerenciamento de estado
- **GraphQL** - Comunicação com API Chargetrip
- **Shadcn UI** - Componentes UI

## 📋 Pré-requisitos

- **Node.js** >= 20.x
- **npm** ou **yarn**

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd Desafio-Frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto com as credenciais da API Chargetrip:

```env
VITE_CHARGETRIP_CLIENT_ID=seu_client_id_aqui
VITE_CHARGETRIP_APP_ID=seu_app_id_aqui
```

   > **Nota:** Você precisa de uma conta na [Chargetrip](https://chargetrip.com/) para obter essas credenciais.

## 🏃 Como Executar

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta se 5173 estiver ocupada).

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview do Build

```bash
npm run preview
```

Visualiza a versão de produção localmente.

### Linting

```bash
npm run lint
```

Verifica problemas de código com ESLint.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── route/           # Componentes relacionados a rotas
│   │   ├── RoutePlanner.tsx      # Orquestrador principal
│   │   ├── RoutePlannerForm.tsx  # Formulário de planejamento
│   │   ├── RouteOverview.tsx     # Overview da rota calculada
│   │   ├── RouteBreakdown.tsx    # Detalhamento da rota
│   │   └── RouteLoading.tsx      # Estado de carregamento
│   ├── LocationInput.tsx         # Input de localização com autocomplete
│   ├── RouteMap.tsx              # Componente do mapa
│   ├── VehicleSelect.tsx         # Seletor de veículos
│   └── ui/                       # Componentes UI (Shadcn)
├── hooks/               # Custom hooks
│   ├── useMap.ts                 # Hook para gerenciar o mapa
│   ├── useRouteBreakdown.ts      # Hook para calcular breakdown
│   └── useVehicles.ts            # Hook para buscar veículos
├── services/            # Serviços de API
│   ├── geocoder.ts              # Geocodificação (Photon)
│   ├── routes.ts                # Serviço de rotas (Chargetrip)
│   └── vehicles.ts              # Serviço de veículos (Chargetrip)
├── stores/              # Estado global (Zustand)
│   └── routeStore.ts            # Store de rotas
├── utils/               # Funções utilitárias
│   ├── mapHelpers.ts            # Helpers para mapas
│   ├── polyline.ts              # Decodificação de polylines
│   └── routeHelpers.ts          # Helpers para rotas
├── types/               # Definições TypeScript
│   └── route.ts                 # Tipos relacionados a rotas
└── lib/                 # Bibliotecas/configurações
    ├── chargetrip-client.ts     # Cliente GraphQL Chargetrip
    └── utils.ts                 # Utilitários gerais
```

## 🎯 Funcionalidades

- ✅ **Planejamento de Rotas**: Calcula rotas otimizadas para veículos elétricos
- ✅ **Seleção de Veículos**: Lista de veículos elétricos disponíveis
- ✅ **Cálculo de Recarga**: Identifica estações de recarga necessárias
- ✅ **Visualização no Mapa**: Exibe rota, origem, destino e estações no mapa
- ✅ **Detalhamento Completo**: Breakdown da rota com informações de bateria, tempo e distância
- ✅ **Geocodificação**: Busca de endereços com autocomplete
- ✅ **Sistema Métrico**: Todas as medidas em sistema métrico (km, kWh)
- ✅ **Interface em Português**: Interface completamente traduzida

## 🗺️ APIs Utilizadas

- **Chargetrip API**: Dados de veículos elétricos, rotas e estações de recarga
- **Photon Geocoding**: Geocodificação de endereços
- **OpenFreeMap**: Tiles de mapa (estilo dark)

## 🔐 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `VITE_CHARGETRIP_CLIENT_ID` | Client ID da API Chargetrip | Sim |
| `VITE_CHARGETRIP_APP_ID` | App ID da API Chargetrip | Sim |

## 🐛 Troubleshooting

### Erro: "Chargetrip credentials not found"
- Verifique se o arquivo `.env` existe na raiz do projeto
- Confirme que as variáveis estão com o prefixo `VITE_`
- Reinicie o servidor de desenvolvimento após criar/modificar o `.env`

### Mapa não carrega
- Verifique sua conexão com a internet
- O mapa usa tiles do OpenFreeMap que requerem conexão

### Erro de build
- Certifique-se de estar usando Node.js >= 20
- Execute `npm install` novamente
- Limpe o cache: `rm -rf node_modules package-lock.json && npm install`

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Cria build de produção |
| `npm run preview` | Preview do build de produção |
| `npm run lint` | Executa ESLint |

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feat/nova-feature`)
2. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
3. Push para a branch (`git push origin feat/nova-feature`)
4. Abra um Pull Request

## 🎓 Decisões Técnicas

### Arquitetura

A aplicação foi estruturada seguindo o **Princípio de Responsabilidade Única**, separando:

- **Componentes**: Divididos por responsabilidade (formulário, overview, breakdown, loading)
- **Hooks customizados**: Lógica reutilizável isolada (`useRouteBreakdown`, `useMap`, `useVehicles`)
- **Stores (Zustand)**: Estado global centralizado e tipado
- **Services**: Camada de abstração para APIs externas
- **Utils**: Funções puras e helpers sem dependências de React

### Gerenciamento de Estado

- **Zustand**: Escolhido por ser leve, TypeScript-first e sem boilerplate
- Estado global centralizado em `routeStore.ts` para facilitar manutenção
- Separação clara entre estado de UI e estado de domínio

### Mapa

- **MapLibre GL JS**: Escolhido por ser open-source, performático e compatível com OpenStreetMap
- **OpenFreeMap**: Tiles gratuitos sem necessidade de API key
- Hook `useMap` encapsula toda lógica do mapa, facilitando testes e manutenção

### Performance

- **Memoização**: `useMemo` e `useCallback` para evitar re-renders desnecessários
- **Debounce**: Implementado no `LocationInput` (300ms) para reduzir chamadas à API
- **Code splitting**: Vite faz code splitting automático por rota

### UX/UI

- **Shadcn UI**: Componentes acessíveis e customizáveis
- **Tema escuro**: Interface moderna e confortável para uso prolongado
- **Feedback visual**: Estados de loading, erro e sucesso claramente diferenciados
- **Responsivo**: Layout adaptável para diferentes tamanhos de tela

### APIs

- **Photon Geocoding**: Geocodificação gratuita e sem limites para autocomplete
- **Chargetrip GraphQL**: API robusta para dados de veículos elétricos e rotas
- Tratamento de erros em todas as camadas (services, stores, components)

### TypeScript

- Tipagem completa em toda a aplicação
- Interfaces bem definidas para dados da API
- Type safety em funções utilitárias

## 📄 Licença

Este projeto é privado.


