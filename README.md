# Venda Web - Sistema de E-commerce

Sistema web de vendas desenvolvido para oferecer uma experiência completa de loja virtual e gerenciamento administrativo. O projeto permite que clientes naveguem por produtos e realizem compras, enquanto administradores possuem um painel dedicado para gestão de produtos e pedidos.

## 🚀 Funcionalidades

### Área do Cliente (StoreFront)
- **Catálogo de Produtos:** Visualização dinâmica de produtos por loja (identificada via slug na URL).
- **Carrinho de Compras:** Gerenciamento de itens selecionados para compra.
- **Checkout:** Processo simplificado para finalização de pedidos.
- **Perfil do Cliente:** Visualização e edição de informações do usuário.

### Painel Administrativo
- **Proteção de Rotas:** Acesso restrito a usuários autenticados.
- **Gestão de Produtos:** Listagem, cadastro e edição de produtos.
- **Gestão de Pedidos:** Acompanhamento de pedidos recebidos.
- **Configurações:** Ajustes gerais da loja e do sistema.

### Funcionalidades Gerais
- **Tema Dinâmico:** Suporte a alteração de temas (Dark/Light mode).
- **Responsividade:** Interface adaptável para dispositivos móveis e desktop.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando uma stack moderna e performática:

- **Core:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Roteamento:** [React Router DOM v7](https://reactrouter.com/)
- **Requisições HTTP:** [Axios](https://axios-http.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Qualidade de Código:** ESLint

## 📂 Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizáveis
│   ├── admin/       # Componentes específicos do painel admin
│   ├── NavBar.jsx   # Barra de navegação
│   ├── Product*.jsx # Componentes relacionados a produtos
├── context/         # Gerenciamento de estado global (Carrinho, Tema)
├── pages/           # Páginas principais da aplicação
│   ├── AdminPanel.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   └── StoreFront.jsx
└── services/        # Configuração de serviços externos (API)
```

## 📦 Como Rodar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse a aplicação:**
   O terminal exibirá a URL local (geralmente `http://localhost:5173`).

   - **Loja:** `http://localhost:5173/nome-da-loja`
   - **Login:** `http://localhost:5173/login`
   - **Admin:** `http://localhost:5173/admin/nome-da-loja`

## 📝 Scripts Disponíveis

- `npm run dev`: Inicia o ambiente de desenvolvimento.
- `npm run build`: Cria a build de produção.
- `npm run preview`: Visualiza a build de produção localmente.
- `npm run lint`: Executa a verificação de código com ESLint.
