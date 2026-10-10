# ⚡ TaskFlow • Gerenciador de Tarefas Inteligente

**TaskFlow** é uma aplicação web moderna, intuitiva e totalmente responsiva para gerenciamento de tarefas diárias (To-Do List). Foi desenvolvida utilizando exclusivamente tecnologias nativas da web (**HTML5, CSS3 e Vanilla JavaScript**), sem a necessidade de Node.js, sistemas de build ou frameworks JavaScript.

![TaskFlow Screenshot](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen?style=for-the-badge)
![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-blue?style=for-the-badge)

---

## ✨ Funcionalidades Principais

- 📝 **Gerenciamento Completo de Tarefas**:
  - Adição de tarefas com título, descrição opcional, categoria e prioridade (*Baixa, Média, Alta*).
  - Data limite para conclusão com indicador automático de **tarefas atrasadas**.
  - Edição completa e remoção de tarefas existentes via modal interativo.

- 🎯 **Filtros e Busca Avançada**:
  - Filtragem por **Status** (*Todas, Pendentes, Concluídas*).
  - Filtragem por **Categoria** (*Trabalho, Estudos, Pessoal, Saúde, Finanças, Outros*).
  - Filtragem por **Nível de Prioridade**.
  - Campo de busca em tempo real por título ou descrição.
  - Ordenação por data de criação, vencimento próximo, prioridade ou ordem alfabética.

- 📊 **Dashboard de Métricas & Progresso**:
  - Contadores em tempo real do total de tarefas, pendentes, concluídas e atrasadas.
  - Barra de progresso percentual calculada automaticamente.

- 🌓 **Alternador de Temas (Dark / Light Mode)**:
  - Suporte nativo a tema escuro (padrão) e claro com salvamento das preferências no navegador.

- 💾 **Persistência de Dados**:
  - Dados salvos localmente utilizando `localStorage` para que nada se perca ao recarregar ou fechar a página.
  - Opção de **Exportar** e **Importar** backups em formato `.JSON`.

- 🎉 **Micro-interações e Feedback Visual**:
  - Efeito de confetes ao concluir tarefas.
  - Notificações rápidas estilo *Toast*.
  - *Empty States* (telas vazias) estilizados quando não há tarefas correspondentes aos filtros.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Semântica e estrutura moderna.
- **CSS3 / Variables**: Design com Glassmorphism, CSS Grid/Flexbox e temas dinâmicos.
- **Vanilla JavaScript (ES6+)**: Manipulação do DOM, controle de estado e integração com `localStorage`.
- **Bootstrap 5.3**: Componentes de layout, modais e formulários responsivos via CDN.
- **Font Awesome 6**: Ícones modernos via CDN.
- **Canvas Confetti**: Efeitos visuais comemorações via CDN.

---

## 🚀 Como Executar o Projeto

Como a aplicação utiliza apenas código web nativo:

1. Clone ou baixe este repositório para o seu computador:
   ```bash
   git clone https://github.com/SeuUsuario/ToDo.git
   ```
2. Abra o diretório do projeto.
3. Dê um duplo clique no arquivo `index.html` ou abra-o em qualquer navegador web moderno (*Chrome, Firefox, Edge, Safari*).

---

## 📁 Estrutura de Arquivos

```
ToDo/
│
├── index.html       # Estrutura HTML da aplicação
├── style.css        # Estilos customizados, variáveis CSS e temas
├── app.js           # Lógica JavaScript nativa (Estado, DOM e LocalStorage)
└── README.md        # Documentação do projeto
```

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE). Sinta-se à vontade para utilizar, estudar ou modificar.
