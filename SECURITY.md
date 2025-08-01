# Guia de Segurança - Freelance Manager

## ⚠️ IMPORTANTE: Secrets Removidos do Repositório

Este repositório teve secrets sensíveis removidos do histórico. Se você clonou o repositório antes da correção, recomendamos:

1. **Fazer um novo clone do repositório**
2. **Regenerar todos os secrets comprometidos**
3. **Seguir as práticas de segurança abaixo**

## 🔐 Gerenciamento de Secrets

### Arquivos de Ambiente

- ✅ **NUNCA** commite arquivos `.env` com dados reais
- ✅ Use sempre `.env.example` como template
- ✅ Mantenha o `.env` no `.gitignore`
- ✅ Use valores de exemplo nos arquivos `.env.example`

### Secrets que Devem Ser Regenerados

Se você estava usando este projeto antes da correção, **REGENERE IMEDIATAMENTE**:

1. **JWT_SECRET**: Gere uma nova chave secreta
2. **GITHUB_CLIENT_SECRET**: Regenere no GitHub OAuth Apps
3. **GOOGLE_CLIENT_SECRET**: Regenere no Google Cloud Console
4. **DATABASE_URL**: Altere a senha do banco de dados

### Como Gerar Secrets Seguros

#### JWT Secret
```bash
# Gerar uma chave JWT segura
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### GitHub OAuth
1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Vá para sua OAuth App
3. Clique em "Generate a new client secret"
4. **Revogue o secret antigo**

#### Google OAuth
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para "APIs & Services" > "Credentials"
3. Edite seu OAuth 2.0 Client
4. Gere um novo client secret
5. **Revogue o secret antigo**

## 🛡️ Práticas de Segurança

### Para Desenvolvimento

1. **Copie o arquivo de exemplo**:
   ```bash
   cp api/.env.example api/.env
   ```

2. **Configure suas próprias credenciais**:
   - Crie suas próprias OAuth Apps
   - Use um banco de dados local ou de desenvolvimento
   - Gere um JWT secret único

3. **Nunca compartilhe o arquivo `.env`**

### Para Produção

1. **Use variáveis de ambiente do sistema**
2. **Configure secrets no seu provedor de cloud**
3. **Use serviços de gerenciamento de secrets** (AWS Secrets Manager, Azure Key Vault, etc.)
4. **Monitore acessos e rotacione secrets regularmente**

### Para Deploy no Coolify

1. **Configure as variáveis de ambiente na interface do Coolify**
2. **Não inclua secrets nos arquivos Docker**
3. **Use o arquivo `.env.coolify.example` como referência**

## 🚨 Em Caso de Vazamento

1. **Revogue imediatamente** todos os secrets comprometidos
2. **Gere novos secrets**
3. **Atualize todas as aplicações** que usam esses secrets
4. **Monitore** por uso não autorizado
5. **Documente o incidente** para aprendizado

## 📋 Checklist de Segurança

- [ ] Arquivo `.env` está no `.gitignore`
- [ ] Não há secrets reais em arquivos `.env.example`
- [ ] Todos os secrets de produção foram regenerados
- [ ] OAuth Apps foram reconfiguradas com novos secrets
- [ ] Banco de dados tem senha forte e única
- [ ] JWT secret é único e seguro (64+ caracteres)
- [ ] Variáveis de ambiente estão configuradas no ambiente de produção
- [ ] Acesso aos secrets é limitado apenas ao necessário

## 📚 Recursos Adicionais

- [OWASP Secrets Management](https://owasp.org/www-community/vulnerabilities/Secrets_Management)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [12 Factor App - Config](https://12factor.net/config)

---

**Lembre-se**: A segurança é responsabilidade de todos. Sempre questione se uma informação deve ser commitada no repositório.