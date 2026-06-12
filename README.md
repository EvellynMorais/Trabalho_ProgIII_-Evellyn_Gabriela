# Atividade: Karaokê no Terminal — Node.js

**Disciplina:** Programação III  
**Curso:** Ensino Médio Integrado — Técnico em Informática  
**Unidade:** 2 — Programação de Back-end  
**Professor:** Elder Francisco Fontana Bernardi  
**Modalidade:** Dupla  
**Valor:** 2 pontos  
**Prazo:** 17/06

## Contexto

Nesta atividade, você vai completar um **Karaokê de Terminal** — um programa Node.js que exibe a letra da música "My Hero" (Foo Fighters) sincronizada com o tempo.

O projeto já tem a estrutura pronta com classes (`Musica` e `Parte`), uma função `sleep()` para pausas e um player que reproduz as partes na ordem. Porém, **o player está incompleto**: apenas duas partes da música foram adicionadas. Seu trabalho é continuar a partir desse ponto.

## O que você vai praticar

- Trabalhar com um projeto Node.js existente
- Instalar dependências com `npm install`
- Importar módulos locais com `require()`
- Entender classes e objetos (construtor, métodos, atributos)
- Instanciar objetos com `new`
- Usar `async/await` para controlar tempo de execução
- Usar `try/catch` para tratamento de erros
- Instalar e usar um pacote externo (`chalk`)

## Estrutura do projeto

```text
aula-nodejs-1/
├── package.json          ← configuração do projeto (você vai editar)
├── .gitignore            ← ignora node_modules/ (já pronto)
├── index.js              ← exemplo da aula (não precisa alterar)
├── calc.js               ← exemplo da aula (não precisa alterar)
├── ola.js                ← exemplo da aula (não precisa alterar)
└── karaoke/
    ├── musica.js          ← Classe Musica (pronto — NÃO ALTERAR)
    ├── parte.js           ← Classe Parte  (pronto — NÃO ALTERAR)
    ├── utils.js           ← Função sleep  (pronto — NÃO ALTERAR)
    └── player.js          ← VOCÊ COMPLETA ESTE ARQUIVO
```

## Instruções

### 1. Fazer fork e clonar o repositório

#### a) Fork no GitHub

1. Acesse o repositório original no GitHub (link fornecido pelo professor)
2. Clique no botão **Fork** no canto superior direito
3. Confirme para criar uma cópia na sua conta

#### b) Clonar pelo VS Code

1. Abra o **VS Code**
2. Pressione `Ctrl + Shift + P` para abrir a Paleta de Comandos
3. Digite **Git: Clone** e selecione a opção
4. Cole a URL do **seu fork** (ex: `https://github.com/SEU-USUARIO/karaoke-myhero.git`)
5. Escolha a pasta onde deseja salvar o projeto
6. Quando o VS Code perguntar se deseja abrir o repositório, clique em **Abrir**

> O repositório clonado aparece no painel **Source Control** (ícone de ramificação na barra lateral esquerda).

### 2. Instalar dependências e criar o script de execução

Abra o terminal integrado do VS Code (`Ctrl + '`) e instale as dependências:

```bash
npm install
```

Agora, abra o arquivo `package.json` na **raiz** do projeto e adicione um script para executar o player do karaokê. Localize a seção `"scripts"` e adicione a linha `"karaoke"`:

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node karaoke/player.js"
}
```

Com essa configuração, você pode rodar o karaokê com:

```bash
npm start
```

> O script `start` é especial no npm — é o único que não precisa de `run` (outros scripts usam `npm run nome`).

### 3. Explorar os arquivos

Antes de programar, **leia os arquivos** para entender como o projeto funciona:

#### `parte.js` — Classe Parte

```javascript
class Parte {
    constructor(letra, tempoEspera, tag) {
        this.letra = letra;         // texto da parte
        this.tempoEspera = tempoEspera; // tempo em milissegundos
        this.tag = tag;             // identificador (ex: 'verso1', 'refrao')
    }
}
```

Cada parte da música tem três propriedades: a **letra**, o **tempo de espera** (em milissegundos) antes da próxima parte, e uma **tag** que identifica a seção.

#### `musica.js` — Classe Musica

```javascript
class Musica {
    constructor(nome, artista) {
        this.nome = nome;
        this.artista = artista;
        this.partes = [];   // array de objetos Parte
    }

    addParte(parte) { /* valida e adiciona */ }
    getLetraInteira() { /* retorna toda a letra concatenada */ }
}
```

A classe `Musica` armazena o nome, artista e um array de partes. O método `addParte()` valida se a parte tem `letra`, `tempoEspera` e `tag` antes de adicionar.

#### `utils.js` — Função sleep

```javascript
const { sleep } = require('./utils');
await sleep(1000);   // espera 1 segundo (1000 ms)
await sleep(500);    // espera meio segundo (500 ms)
```

#### `player.js` — O que já existe

O player já tem:
- Os imports de `Musica`, `Parte` e `sleep`
- O objeto `myHero` criado
- Variáveis com trechos da letra já declarados
- **Apenas 2 partes adicionadas** (verso1 e verso2)
- A função `play()` que percorre todas as partes e exibe com timing

### 4. Completar o `player.js`

Seu trabalho começa no comentário `//segue adicionando as partes`. Você deve:

#### a) Adicionar as partes faltantes

Existem variáveis de letra já declaradas que **não foram usadas**. Use `addParte()` para cada uma, escolhendo um tempo de espera e uma tag adequados:

```javascript
myHero.addParte(
    new Parte(thereGoes, 5000, 'refrao1')
);
```

#### b) Pesquisar e criar partes extras

A letra no player **não está completa**. Pesquise a letra de "My Hero" do Foo Fighters e crie novas variáveis para as partes que faltam. Adicione-as com `addParte()`.

> Você pode escolher **outra música** se preferir. Nesse caso, crie um novo objeto `Musica` e adapte o `play()` para usar ele.

#### c) Instalar e usar o `chalk` para colorir a saída

O projeto já tem o `chalk` como dependência no `package.json`, então ele foi instalado no passo 2. Se por algum motivo não estiver, instale manualmente:

```bash
npm install chalk@4
```

> Usamos a **versão 4** porque a versão 5+ usa ESM e não funciona com `require()`.

Depois, importe e use no `player.js` para colorir a saída:

```javascript
const chalk = require('chalk');

// Exemplos de uso:
console.log(chalk.green('texto verde'));
console.log(chalk.cyan.bold('texto ciano negrito'));
console.log(chalk.bgBlue.white('fundo azul, texto branco'));
console.log(chalk.hex('#FF6600')('texto laranja'));
```

Aplique cores diferentes para cada tipo de parte (versos, refrão, ponte, etc.).

#### d) Impressão proporcional ao tempo (diferencial)

A função `play()` atual imprime toda a letra de uma parte de uma vez. Para um karaokê mais realista, implemente uma versão que **imprima cada palavra separadamente**, distribuindo o tempo de espera proporcionalmente:

```javascript
// Exemplo: se a parte tem 5000ms e 10 palavras,
// cada palavra aparece a cada 500ms
const palavras = parte.letra.split(' ');
const tempoPorPalavra = parte.tempoEspera / palavras.length;

for (const palavra of palavras) {
    process.stdout.write(palavra + ' ');  // imprime sem pular linha
    await sleep(tempoPorPalavra);
}
console.log();  // pula linha no final da parte
```

> `process.stdout.write()` imprime sem quebrar linha, diferente de `console.log()`.

#### e) Sincronizar com a música real

O karaokê deve funcionar **junto com a música de verdade** tocando no YouTube (ou Spotify, etc.). Para isso, adicione um **timer de espera** no início da função `play()`, antes da letra começar. Esse tempo serve para você dar play na música e ela sincronizar com o terminal:

```javascript
async function play() {
    console.log('\n  ♫  Abra a música no YouTube e prepare-se...\n');
    console.log('  Pressione ENTER e dê play na música!');

    // Espera 5 segundos para dar tempo de iniciar a música
    for (let i = 5; i >= 1; i--) {
        console.log('  ♪  ' + i + '...');
        await sleep(1000);
    }

    console.log('  ♫  Tocando!\n');

    // Agora começa a exibir a letra sincronizada
    // ...
}
```

Ajuste os valores de `tempoEspera` de cada parte até que a letra no terminal acompanhe a música que está tocando. Teste várias vezes.

#### Caracteres musicais no código

Para deixar a saída com visual de karaokê, use estes caracteres Unicode diretamente no código JavaScript:

```javascript
// Copie e cole direto no código — funciona no terminal
console.log('♫');   // notas duplas
console.log('♪');   // nota simples
console.log('♬');   // par de semicolcheias
console.log('🎵');  // emoji nota musical
console.log('🎶');  // emoji notas musicais
console.log('🎤');  // emoji microfone
```

> No Windows, se algum caractere não aparecer, use o atalho `Win + .` para abrir o painel de emojis e inserir direto no código.

### 5. Testar com a música

Na raiz do projeto, rode:

```bash
npm start
```

O programa vai mostrar uma contagem regressiva — use esse tempo para **abrir a música "My Hero" no YouTube** e dar play. A letra no terminal deve acompanhar o áudio.

**Checklist de teste:**

- [ ] A contagem regressiva dá tempo suficiente para iniciar a música
- [ ] A letra aparece sincronizada com o áudio
- [ ] Todas as partes aparecem na ordem correta da música
- [ ] Existe pausa visível entre as partes
- [ ] As cores do chalk estão aplicadas
- [ ] A impressão proporcional funciona (se implementada)

> Teste várias vezes e ajuste os tempos até ficar sincronizado. É normal precisar de vários ajustes.

### 6. Entregar

Inclua um arquivo `respostas.md` na raiz do projeto com as respostas das perguntas abaixo.

Depois, faça commit e push pelo VS Code:

1. Abra o painel **Source Control** (ícone de ramificação na barra lateral, ou `Ctrl + Shift + G`)
2. Você verá todos os arquivos modificados listados em **Changes**
3. Clique no ícone **+** ao lado de cada arquivo (ou no **+** do grupo) para adicioná-los à área de staging (**Staged Changes**)
4. No campo de texto acima dos arquivos, digite a mensagem de commit, por exemplo: `Completa o player do karaokê`
5. Clique no botão **Commit** (ícone ✓)
6. Clique em **Sync Changes** (ou no ícone de nuvem com seta) para enviar ao GitHub

> Se o VS Code pedir para autenticar no GitHub, siga as instruções na tela para fazer login.

## Critérios de avaliação

### Funcionamento (40%)

- O programa executa com `npm start` sem erros
- O script `start` está configurado no `package.json`
- Todas as partes declaradas foram adicionadas com `addParte()`
- Partes extras da letra foram pesquisadas e adicionadas
- Existe pausa visível entre as partes

### Uso do chalk (20%)

- O pacote `chalk@4` foi instalado corretamente
- Cores diferentes são usadas para tipos de parte distintos (verso, refrão, etc.)
- A saída visual é agradável e organizada

### Impressão proporcional (15%)

- As palavras aparecem uma a uma com timing distribuído
- O tempo total da parte é respeitado

### Organização (15%)

- O código usa `require` para importar módulos
- Tags descritivas para cada parte
- Tempos de espera razoáveis para o ritmo da música

### Perguntas (10%)

- Respostas corretas e completas no `respostas.md`

## Perguntas para responder

Crie um arquivo `respostas.md` na raiz do projeto:

1. Qual a diferença entre `require('./musica')` e `require('chalk')`?
2. O que acontece se você tentar adicionar uma parte sem a propriedade `tag`? Por quê?
3. Por que a função `play()` precisa da palavra `async` antes de `function`?
4. O que acontece se você esquecer o `await` antes de `sleep()`?
5. Explique a diferença entre `console.log()` e `process.stdout.write()`.

## Desafio extra

- Implemente uma **contagem regressiva** antes da música começar (3, 2, 1...).
- Permita escolher a velocidade de reprodução via argumento de linha de comando:
  ```bash
  npm start -- 2        # velocidade 2x (metade do tempo)
  npm start -- 0.5      # velocidade 0.5x (dobro do tempo)
  ```
- Crie um segundo arquivo `player2.js` com outra música usando as mesmas classes.

## Observação final

Este projeto exercita os conceitos fundamentais do Node.js: módulos, classes, objetos e controle de fluxo assíncrono. A mesma estrutura de "importar classe → instanciar → operar" aparecerá quando vocês construírem APIs REST, onde Models representam entidades do banco de dados e Controllers sequenciam operações.
