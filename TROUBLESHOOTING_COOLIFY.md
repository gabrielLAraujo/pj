# 🔧 Troubleshooting - Deploy no Coolify

Este guia ajuda a resolver problemas comuns durante o deploy no Coolify.

## ❌ Erro: "Remote branch main not found in upstream origin"

### Problema
```
fatal: Remote branch main not found in upstream origin
fatal: not a git repository (or any of the parent directories): .git
```

### Causa
O projeto não estava inicializado como repositório Git ou não tinha a branch `main`.

### ✅ Solução Aplicada

1. **Inicializado repositório Git:**
   ```bash
   git init
   ```

2. **Renomeado branch para 'main':**
   ```bash
   git branch -m main
   ```

3. **Removido repositório Git aninhado:**
   ```bash
   rm -rf api/.git
   ```

4. **Adicionado arquivos e feito commit:**
   ```bash
   git add .
   git commit -m "Initial commit: Freelance Manager with Coolify deploy configuration"
   ```

## ❌ Erro: "No url found for submodule path 'api' in .gitmodules"

### Problema
```
sed: /artifacts/xxx/.gitmodules: No such file or directory
fatal: No url found for submodule path 'api' in .gitmodules
```

### Causa
A pasta `api` foi registrada como submódulo Git (modo 160000) mas não há arquivo `.gitmodules` configurado.

### ✅ Solução Aplicada

1. **Removido referência ao submódulo:**
   ```bash
   git rm --cached api
   ```

2. **Adicionado arquivos da API como parte do projeto:**
   ```bash
   git add api/
   ```

3. **Commitado a correção:**
   ```bash
   git commit -m "Fix: Remove api submodule reference and add api files directly"
   ```

4. **Enviado para repositório remoto:**
   ```bash
   git push origin main
   ```

### 📋 Próximos Passos para Deploy

1. **Criar repositório no GitHub/GitLab:**
   - Acesse GitHub ou GitLab
   - Crie um novo repositório
   - **NÃO** inicialize com README, .gitignore ou licença

2. **Conectar repositório local ao remoto:**
   ```bash
   git remote add origin https://github.com/seu-usuario/seu-repositorio.git
   git push -u origin main
   ```

3. **Configurar no Coolify:**
   - Use a URL do repositório: `https://github.com/seu-usuario/seu-repositorio.git`
   - Branch: `main`
   - Tipo: `Docker Compose`

## 🐳 Outros Problemas Comuns

### Problema: Variáveis de ambiente não configuradas
**Solução:** Configure todas as variáveis do arquivo `.env.coolify.example`

### Problema: Portas não expostas
**Solução:** Verifique se as portas estão corretas no `docker-compose.yml`:
- Frontend: 3003
- Backend: 3000
- PostgreSQL: 5432

### Problema: Build falha por falta de memória
**Solução:** 
- Use multi-stage builds (já implementado)
- Aumente recursos do servidor Coolify
- Use `.dockerignore` para reduzir contexto

### Problema: Banco de dados não conecta
**Solução:**
1. Verifique `DATABASE_URL` nas variáveis de ambiente
2. Certifique-se que PostgreSQL está rodando
3. Execute migrações após deploy:
   ```bash
   docker-compose exec api npx prisma migrate deploy
   ```

### Problema: Frontend não carrega
**Solução:**
1. Verifique `REACT_APP_API_URL`
2. Configure CORS no backend
3. Verifique se Nginx está servindo arquivos estáticos

## 📞 Comandos Úteis para Debug

```bash
# Ver logs dos containers
docker-compose logs -f

# Ver logs específicos
docker-compose logs api
docker-compose logs frontend
docker-compose logs postgres

# Executar comandos no container
docker-compose exec api bash
docker-compose exec api npx prisma migrate status

# Reiniciar serviços
docker-compose restart
docker-compose down && docker-compose up -d
```

## 🔍 Verificação de Saúde

### Backend Health Check
```bash
curl http://localhost:3000/health
```

### Frontend Health Check
```bash
curl http://localhost:3003/health
```

### Banco de Dados
```bash
docker-compose exec postgres psql -U freelance_user -d freelance_manager -c "SELECT 1;"
```

## 📚 Recursos Adicionais

- [Documentação Coolify](https://coolify.io/docs)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Troubleshooting Docker](https://docs.docker.com/config/troubleshooting/)

---

**💡 Dica:** Sempre verifique os logs primeiro quando algo não funcionar. A maioria dos problemas pode ser identificada através dos logs dos containers.