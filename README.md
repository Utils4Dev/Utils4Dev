# Utils4Dev

![Utils4Dev Logo](https://github.com/Utils4Dev.png "Utils4Dev ")

## 📝 Sobre o Projeto

Utils4Dev é uma plataforma onde desenvolvedores podem guardar, organizar e compartilhar códigos utilitários. Funciona como uma "pasta utils" pública para que todos possam ver, contribuir e facilitar seu dia a dia de programação.

## 🚀 Características

- **Armazenamento de Códigos** - Guarde seus snippets de código úteis em um só lugar
- **Compartilhamento** - Compartilhe seus utilitários com a comunidade de desenvolvedores
- **Busca Inteligente** - Encontre rapidamente o código que você precisa
- **Suporte a Múltiplas Linguagens** - Armazene códigos em diversas linguagens de programação
- **Interface Amigável** - Design intuitivo para facilitar a navegação e uso

## 🛠️ Tecnologias Utilizadas

O projeto é estruturado como um monorepo contendo:

### Backend (API)

- [Node.js](https://nodejs.org/)
- [NestJS](https://nestjs.com/) - Framework para construção de aplicações server-side
- [TypeORM](https://typeorm.io/) - ORM para gerenciamento de banco de dados
- [Passport.js](http://www.passportjs.org/) - Autenticação (GitHub e JWT)

### Frontend (Web)

- [React](https://reactjs.org/) - Biblioteca para construção de interfaces
- [Vite](https://vitejs.dev/) - Build tool
- [React Router](https://reactrouter.com/) - Roteamento
- [React Query](https://tanstack.com/query/) - Gerenciamento de estado e requisições

### DevOps

- [Docker](https://www.docker.com/) - Containerização
- [Nginx](https://nginx.org/) - Servidor web/proxy
- [Turborepo](https://turbo.build/repo) - Gerenciamento de monorepo

## 🔧 Instalação & Configuração

### Pré-requisitos

- Docker e Docker Compose
- Node.js (versão 18 ou superior)

### Instalando dependências

```bash
npm install
```

### Ambiente de desenvolvimento

```bash
docker-compose -f docker-compose.dev.yml up
```

### Ambiente de produção

```bash
docker-compose up -d
```

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

- [ ] 🐛 Bugs e Sugestões

Encontrou algum bug ou tem sugestões de novas funcionalidades? Por favor, abra uma nova issue em:
[https://github.com/Utils4Dev/Utils4Dev/issues/new](https://github.com/Utils4Dev/Utils4Dev/issues/new)

## 📚 Estrutura do Projeto

```
utils4dev-monorepo/
├── apps/
│   ├── api/       # Backend NestJS
│   └── web/       # Frontend React
├── docker-compose.dev.yml
├── docker-compose.yml
├── package.json
└── turbo.json
```

## 📄 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- [Pedro Henrique](https://github.com/PedrosoDev)
- [Gabriel Heiwa](https://github.com/GabrielHeiwa)

---

Feito com ❤️ para a comunidade de desenvolvedores.
