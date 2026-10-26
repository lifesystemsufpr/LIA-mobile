# LIA Mobile — Plataforma de Avaliação Motora e Funcional

O **LIA Mobile** é um aplicativo móvel desenvolvido para profissionais de saúde, fisioterapeutas e pesquisadores realizarem avaliações motoras e funcionais em pessoas idosas. O aplicativo integra o ecossistema **LIA** (desenvolvido no âmbito do **TecnoAging Lab**), sendo responsável pela interface de campo, instrução assistida, coleta dos sinais inerciais do smartphone e armazenamento local com sincronização em nuvem para posterior processamento algorítmico na plataforma **LIA Web**.

---

## 1. Principais Funcionalidades

- **Autenticação e Sessão Profissional:** Identificação do avaliador com categoria profissional e registro de classe (ex: CREFITO).
- **Dashboard com Métricas Clínicas:** KPIs instantâneos de avaliações, participantes e sincronizações, além de gráficos analíticos por gênero, protocolo e evolução mensal.
- **Gestão de Participantes:** Cadastro completo (nome, data de nascimento com cálculo dinâmico de idade, CPF, dados sociodemográficos, antropométricos e observações clínicas) e busca instantânea.
- **Catálogo de Protocolos Clínicos:** Suporte a testes padronizados:
  - **30sSTS:** Teste de sentar e levantar em 30 segundos;
  - **5TSTS:** Cinco repetições de sentar e levantar;
  - **2MST:** Marcha estacionária de 2 minutos;
  - **UTT:** Elevação na ponta dos pés / controle postural de tronco;
  - **TUG:** Timed Up and Go (agilidade e mobilidade).
- **Guia Instrucional Assistido:** Vídeo demonstrativo, linha do tempo passo a passo, checklist operacional e guia gráfico de posicionamento do smartphone no esterno.
- **Contagem Regressiva e Orientação por Voz (TTS):** Síntese de voz suave em português brasileiro (pt-BR) para guiar o participante sem gerar sobressaltos.
- **Coleta de Sensores em Foco Total (Modo Escuro):** Cronômetro regressivo gigante, contador automático de repetições, monitoramento das fases de movimento e gravação de acelerômetro e giroscópio a 60 Hz.
- **Resumo e Ficha Pós-Coleta:** Revisão imediata dos resultados antes de qualquer transmissão.
- **Sincronização Offline-First:** Persistência obrigatória local pré-envio, fila de sincronização e indicador visual de status (*Sincronizado* vs *Pendente*).
- **Histórico e Auditoria:** Consulta cronológica com filtros combinados por data, protocolo e status de conectividade.
- **Configurações e Armazenamento Local:** Monitoramento de espaço em MB ocupado e número de avaliações salvas offline.

---

## 2. Stack Tecnológica

| Tecnologia | Responsabilidade |
|---|---|
| **React Native (0.86.3)** | Framework base de interface nativa |
| **Expo (57.0.30)** | Runtime, ferramental e módulos nativos |
| **TypeScript (Strict)** | Tipagem estática rigorosa sem uso de `any` |
| **React Navigation (v7)** | Navegação nativa por pilhas e abas |
| **Zustand** | Gerenciamento de estado global leve e reativo |
| **AsyncStorage** | Armazenamento de chave-valor local e offline |
| **Expo Sensors** | Coleta de acelerômetro e giroscópio (60 Hz) |
| **Expo Speech** | Síntese de voz para contagem regressiva em pt-BR |
| **Lucide React Native** | Iconografia consistente e tátil |

---

## 3. Arquitetura Feature-Sliced Design (FSD)

O projeto é organizado em cinco camadas estritamente desacopladas sob `src/app/`:

```text
src/app/
├── features/               # Módulos de negócio independentes
│   ├── auth/               # Autenticação e sessão profissional
│   ├── dashboard/          # Painel inicial e métricas analíticas
│   ├── participants/       # Gestão, cadastro e perfil de participantes
│   ├── protocols/          # Catálogo clínico de protocolos motores
│   ├── test-guide/         # Instruções, checklist e posicionamento
│   ├── assessment/         # Orquestração do fluxo de avaliação
│   ├── sensor-collection/  # Contagem regressiva (TTS) e coleta inercial (60Hz)
│   ├── assessment-summary/ # Resumo pós-coleta e confirmação
│   ├── sync/               # Adaptador e fluxo de sincronização offline-first
│   ├── history/            # Histórico cronológico e detalhes da avaliação
│   ├── settings/           # Perfil profissional e armazenamento local
│   └── onboarding/         # Apresentação e primeiros passos
│
├── network/                # Infraestrutura genérica e agnóstica de rede
│   ├── client/             # HttpClient, FetchHttpClient, MockHttpClient
│   ├── connectivity/       # NetworkStatusService, useNetworkStatus
│   ├── config/             # networkConfig (timeouts, headers, retries)
│   ├── errors/             # NetworkError, HttpErrorMapper
│   ├── interceptors/       # RequestInterceptor, ResponseInterceptor
│   └── types/              # HttpRequest, HttpResponse, NetworkStatus
│
├── navigation/             # Infraestrutura genérica e agnóstica de navegação
│   ├── core/               # NavigationTypes, NavigationOptions, NavigationGuards
│   ├── components/         # AppTabBar, NavigationHeader
│   └── hooks/              # useAppNavigation
│
├── composition/            # Composição da aplicação e injeção de dependências
│   ├── AppRouteTypes.ts    # Centralização tipada de rotas e parâmetros
│   ├── AppNavigationRegistry.tsx # Metadados das rotas
│   ├── MainTabNavigator.tsx# Navegação de 5 abas principais
│   ├── RootNavigator.tsx   # Alternância entre Auth e App com modais
│   └── AppBootstrap.tsx    # Inicialização, injeção e NavigationContainer
│
└── shared/                 # Kernel compartilhado genuíno
    ├── theme/              # Cores, tipografia, espaçamento e raios
    ├── types/              # Modelos de domínio (Professional, Participant, etc.)
    ├── utils/              # Formatadores (CPF, data, idade) e idGenerator
    ├── services/           # Storage, Sensores e Speech
    ├── store/              # sessionStore (Zustand)
    └── components/         # Button, TopAppBar, StatusChip, MetricCard, etc.
```

---

## 4. Independência de `network` e `navigation`

- **Módulo `network`:** Não conhece nenhuma entidade de domínio (`Participant`, `Assessment`, etc.) e não define endpoints específicos. Fornece clientes HTTP baseados em contratos genéricos.
- **Módulo `navigation`:** Não importa telas, stores ou serviços de negócio. Fornece opções de tela, guardas de rota e componentes de UI genéricos (como `AppTabBar`), recebendo destinos através da camada de **composição**.

---

## 5. Estratégia Offline-First e Armazenamento

1. **Persistência Pré-Envio:** Toda avaliação é obrigatoriamente persistida no repositório local com o estado `pending` antes de qualquer tentativa de envio remoto.
2. **Ciclo de Estados:**
   - `pending`: Coleta finalizada e salva apenas no dispositivo;
   - `syncing`: Pacote em trânsito com o adaptador;
   - `synced`: Confirmação real recebida do servidor remoto;
   - `failed`: Falha de conexão; permanece íntegro para retentativa manual.
3. **Sensores:** Amostras de acelerômetro e giroscópio são estruturadas no contrato `SensorSample` com timestamps precisos para exportação.

---

## 6. Como Instalar e Executar

### Pré-requisitos
- Node.js >= 20.x
- Gerenciador de pacotes npm
- Expo Go instalado no smartphone Android (ou emulador Android)

### Instalação
```bash
cd lia-mobile
npm install
```

### Execução
```bash
# Iniciar o servidor de desenvolvimento Expo
npm start

# Abrir diretamente no Android
npm run android

# Abrir no navegador (Web)
npm run web
```

### Verificação de Tipos
```bash
npx tsc --noEmit
```

---

## 7. Estado Atual e Próximos Passos

- **Base Arquitetural Concluída:** Toda a fundação modular, contratos, injeção de dependências, navegação de ponta a ponta e persistência offline-first estão funcionais e validadas por TypeScript rigoroso.
- **Próximos Passos:**
  1. Integração com a API real da plataforma LIA Web quando os endpoints estiverem disponíveis;
  2. Implementação dos algoritmos específicos de processamento de sinais biomotores (classificação de fases por IA/DSP);
  3. Adição de persistência nativa SQLite com migrações caso o volume de amostras offline ultrapasse a capacidade recomendada do AsyncStorage.
