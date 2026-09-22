# Respostas — Evoluindo a API do Karaokê

## Parte 1 — Revisão Técnica do Servidor

### 1.1 Status Codes HTTP

Analisando o `app.js` antigo (antes desta atividade):

| Situação | Código esperado | O nosso servidor usava? |
|---|---|---|
| Recurso retornado com sucesso | 200 OK | Não explicitamente — o Express manda 200 por padrão quando chamamos `res.send()`/`res.json()` sem definir status, então "funcionava por acaso", mas não estava escrito no código. |
| Recurso criado (POST) | 201 Created | Sim, em `POST /musica/:id/parte` já usávamos `res.status(201)`. |
| Dados inválidos no body | 400 Bad Request | Sim, no mesmo POST, dentro do `catch`, usávamos `res.statusCode = 400`. |
| Recurso não encontrado | 404 Not Found | **Estava incorreto.** Em `GET /musica/:id` o código chamava `res.status(404)` e `res.send(...)`, mas **não dava `return`** depois — a função continuava executando e enviava a música normalmente em seguida (duas respostas tentando ser enviadas, o que gera erro `ERR_HTTP_HEADERS_SENT`). Corrigimos isso nas novas rotas usando `return res.status(404).json(...)`.
| Erro interno do servidor | 500 Internal Server Error | **Estava faltando.** Não existia nenhum middleware de erro genérico. Se uma rota lançasse uma exceção não tratada, o Express respondia com uma página de erro HTML padrão (stack trace), não um JSON útil para quem está consumindo a API. Adicionamos o middleware de erro no final do `app.js` para resolver isso.

### 1.2 Content-Type

- **O que é o `Content-Type`?** É um cabeçalho HTTP que informa ao cliente qual é o formato dos dados no corpo da resposta (ou requisição) — por exemplo `application/json`, `text/html`, `text/plain`, `image/png`. É relevante porque é assim que o navegador (ou qualquer cliente) sabe *como interpretar* os bytes recebidos: sem ele, o cliente teria que adivinhar se está lendo HTML, JSON ou outra coisa.
- **`res.send()` com string HTML:** testamos a rota `GET /teste` pelo REST Client e o cabeçalho de resposta veio como `Content-Type: text/html; charset=utf-8`. O Express detecta que a string passada parece HTML e define o cabeçalho automaticamente.
- **`res.json()` vs `res.send()`:** `res.json(objeto)` sempre serializa o valor para JSON e define `Content-Type: application/json`, não importa o que você passe. `res.send(valor)` é mais "esperto/genérico": se você mandar uma string que pareça HTML, ele usa `text/html`; se mandar um objeto ou array, ele internamente chama `res.json()` por baixo dos panos; se mandar um Buffer, usa `application/octet-stream`. Ou seja, `res.json()` é explícito e previsível; `res.send()` tenta adivinhar o formato a partir do tipo do dado.

### 1.3 Tratamento de Erros

- **Body que não é JSON válido:** sem tratamento, o `express.json()` lança uma `SyntaxError` internamente ao tentar fazer o parse. Se não existisse um middleware de erro, o cliente receberia uma página de erro HTML do Express (com stack trace) e status 400, o que não é útil para uma API que deveria sempre responder em JSON.
- **Exceção não tratada dentro de uma rota:** sem middleware de erro, o Express usa seu handler de erro padrão, que devolve uma resposta HTML (não JSON) com status 500 — inconsistente com o resto da API, que fala em JSON.
- **Tarefa prática:** implementamos o middleware de erro genérico no final do `app.js`. Ele primeiro verifica se o erro é de JSON mal-formado (`err.type === 'entity.parse.failed'` ou `err instanceof SyntaxError`) e responde `400` com uma mensagem clara; qualquer outro erro cai no `500` genérico. Testamos enviando texto puro (sem `{}`) no body do `POST /api/musicas` (teste 12 do `testes_musicas.http`) e a resposta veio `400 { "erro": "JSON mal-formado no corpo da requisição." }`, em vez da página de erro HTML padrão do Express.

## Parte 4.2 — Testes com o debugger

Testamos com breakpoints em duas rotas:

- **`GET /api/musicas/:id`:** colocamos o breakpoint na linha do `const musica = musicaDAO.buscarPorId(id)`. Ao inspecionar `req.params`, vimos que `req.params.id` chega como **string** (ex: `"1"`), por isso o `Number(req.params.id)` antes de chamar o DAO é necessário — sem ele, a comparação `m.id === id` dentro do `buscarPorId` falharia, porque `1 === "1"` é `false` em JavaScript (comparação estrita).
- **`POST /api/musicas`:** colocamos o breakpoint logo no início da rota. Ao inspecionar `req.body` com a requisição de sucesso, ele já chegou pronto como objeto JavaScript (`{ nome: "...", artista: "..." }"`) — o `express.json()` já tinha feito o parse antes da rota ser executada. Ao repetir o teste com o body inválido (sem `artista`), vimos `req.body.artista` como `undefined`, confirmando por que o `if (!nome || !artista)` funciona como validação.

## Parte 5 — Perguntas

**1. Status Codes:** os 5 mais comuns em APIs REST:
- `200 OK` — requisição bem-sucedida, ex: `GET /api/musicas` retornando a lista.
- `201 Created` — um novo recurso foi criado, ex: `POST /api/musicas` criando uma música nova.
- `400 Bad Request` — o cliente enviou dados inválidos ou incompletos, ex: `POST /api/musicas` sem o campo `artista`.
- `404 Not Found` — o recurso pedido não existe, ex: `GET /api/musicas/999` quando não há música com esse id.
- `500 Internal Server Error` — algo deu errado no servidor, não é culpa do cliente, ex: uma exceção não tratada dentro de uma rota.

**2. Content-Type:** `application/json` diz ao cliente que o corpo da resposta é um objeto/array JSON, que deve ser interpretado com `JSON.parse` (ou `resposta.json()` no `fetch`). `text/html` diz que o corpo é uma página HTML, para ser renderizada visualmente pelo navegador. O cliente precisa dessa informação porque, sem ela, não saberia se deve exibir o conteúdo como texto/página, tentar fazer o parse como JSON (o que quebraria se o conteúdo for HTML), ou tratar como outro tipo de arquivo — o `Content-Type` é o que permite ao cliente escolher o comportamento certo automaticamente.

**3. DAO e Persistência:** o padrão DAO (Data Access Object) cria uma camada intermediária entre as rotas e a forma como os dados são armazenados. Em vez de as rotas manipularem diretamente um array (`push`, `splice`, índice), elas chamam métodos do DAO (`listarTodas`, `inserir`, `atualizar`, `remover`), e é o DAO que sabe *onde* e *como* os dados realmente estão guardados. Isso resolve o problema de acoplamento: se trocarmos a forma de persistência (de um array em memória para um banco de dados, por exemplo), só o código dentro do DAO precisa mudar — as rotas continuam chamando os mesmos métodos, com os mesmos parâmetros e retornos. Atualmente, como os dados ficam só em um array na memória do processo Node, **eles são perdidos toda vez que o servidor é reiniciado** (o array volta a ser recriado do zero, com só a carga inicial do `_carregarDadosIniciais()`). Para os dados sobreviverem a uma reinicialização, precisaríamos trocar o array interno do DAO por alguma forma de persistência real — escrever/ler de um arquivo (JSON, por exemplo) ou, como será feito na Unidade 3, fazer o DAO conversar com um banco de dados (Supabase/PostgreSQL) em vez do array.

**4. Singleton:** se exportássemos a classe `MusicaDAO` em vez de uma instância, cada arquivo que fizesse `require('./dao/musicaDAO')` e depois `new MusicaDAO()` criaria seu **próprio** array `musicas`, independente dos outros. Isso quebraria a aplicação: por exemplo, uma música criada pela rota `POST /api/musicas` ficaria guardada na instância usada por aquele arquivo, mas a rota `GET /api/musicas` (se usasse outra instância) nunca a encontraria, porque estaria olhando para um array `musicas` completamente diferente e vazio. Exportar `new MusicaDAO()` garante que **todo mundo que importa o DAO está enxergando o mesmo array**, na memória do processo.

**5. PUT vs POST:** `POST` é usado para **criar** um novo recurso — cada chamada tende a criar algo novo (não é idempotente: chamar duas vezes cria dois recursos). `PUT` é usado para **substituir por completo** um recurso existente em uma URL já conhecida — é idempotente (chamar duas vezes com o mesmo body produz o mesmo resultado final), e por isso o `PUT /api/musicas/:id` no nosso projeto exige que `nome` e `artista` sejam enviados juntos, mesmo que só um deles tenha mudado. Se quiséssemos alterar **apenas** o artista, sem reenviar o nome, o verbo mais adequado seria o `PATCH`, que serve justamente para atualizações **parciais** de um recurso — o cliente envia só os campos que quer alterar, e o servidor mantém os demais como estavam.
