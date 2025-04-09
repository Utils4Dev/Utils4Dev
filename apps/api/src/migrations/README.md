# Migrações

Este diretório contém arquivos de migração para o banco de dados.

## Como usar as migrações

### Gerar uma nova migração automaticamente

```bash
npm run migration:generate -- src/migrations/NomeDaMigracao
```

### Criar um arquivo de migração vazio

```bash
npm run migration:create -- src/migrations/NomeDaMigracao
```

### Executar migrações pendentes

```bash
npm run migration:run
```

### Reverter a última migração

```bash
npm run migration:revert
```

## Boas práticas

1. Sempre gere migrações para mudanças no esquema em vez de confiar no `synchronize: true`
2. Verifique o conteúdo das migrações geradas antes de executá-las
3. Em ambientes de produção, use sempre migrações e nunca a sincronização automática
4. Inclua migrações no controle de versão
