# Linkki

**Conecte tudo que é seu.**

Protótipo funcional de uma plataforma de páginas de links personalizáveis, com editor visual, criação de conta, páginas do usuário, comunidade de modelos e suporte.

## Como executar localmente

Você precisa ter o [Node.js](https://nodejs.org/) instalado.

```bash
npm run dev
```

Depois, acesse:

```text
http://127.0.0.1:4173
```

Não é necessário instalar dependências: o servidor local usa apenas recursos nativos do Node.js.

## Estrutura do projeto

```text
linkki/
├── .openai/
│   └── hosting.json
├── dist/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .gitignore
├── package.json
├── README.md
└── serve.mjs
```

## Estado atual

- Interface construída em HTML, CSS e JavaScript puro.
- Dados salvos localmente no navegador com `localStorage`.
- O fluxo de confirmação de e-mail é uma simulação e usa o código `123456`.
- Ainda não há backend, banco de dados, autenticação real ou envio real de e-mails.
- A pasta publicada como site estático é a `dist/`.

## Próximas etapas recomendadas

1. Criar a API e o banco de dados.
2. Implementar autenticação e confirmação real por e-mail.
3. Salvar páginas, modelos, curtidas e aplicações no servidor.
4. Adicionar armazenamento seguro para imagens e fontes enviadas pelos usuários.

## Publicar no GitHub

Crie um repositório vazio no GitHub e envie o conteúdo desta pasta. Exemplo:

```bash
git init
git add .
git commit -m "Versão inicial do Linkki"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

