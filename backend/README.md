<h1 align="center">
    <img alt="Ecoleta" title="#delicinha" src="../.github/logo.svg" width="250px" />
</h1>

<p align="center">
  <a href="#rocket-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#zap-rodando-o-projeto">Rodando o Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#notebook-enpoints">Endpoints</a>
</p>

<h2>
<strong>Backend</strong> da aplicação Ecoleta.
</h2>

## :rocket: Tecnologias

### **Ferramentas usadas**

- Express
- Knex + SQLite3

### 1. Visualizar de casos

## :zap: Rodando o projeto

1 - Em um terminal, entrar na raiz do projeto **/backend** e rodar o comando:

```
$ yarn install
```

2 - Ainda na raiz do projeto, rodar o comando:

```
$ yarn dev:server
```

Feito isso, acessar o endereço http://localhost:3333

Se desejar, pode rodar o projeto em modo debug, usando o seguinte comando:

```
$ yarn dubug
```

### Migrations

Para a criar o banco de dados, é disponibilizado **migrations** dentro do diretório **/src/database**, rodar o seguinte comando na raiz do projeto:

```
$ yarn knex:migrate
```

### Migrations

Para popular o banco de dados, é disponibilizado **seeds** dentro do diretório **/src/database**, rodar o seguinte comando na raiz do projeto:

```
$ yarn knex:seed
```

## :notebook: Endpoints

Você pode executar online ou fazer o download dos endpoints e executar diretamente no Insomnia:

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=&uri=https%3A%2F%2Fraw.githubusercontent.com%2FWallysonGalvao%2Frocketseat-omnistack-semana11%2Fmaster%2Fbackend%2Fendpoints.json)
