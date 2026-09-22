// app.js — Configuração do Express + rotas + middlewares
// A partir desta versão, as rotas não manipulam mais um array de músicas
// diretamente: elas delegam tudo para o musicaDAO (padrão DAO).

// 1. Importar o Express e o DAO (instância única / Singleton)
const express = require('express');
const musicaDAO = require('./dao/musicaDAO');

// 2. Criar a aplicação
const app = express();
const PORT = 3000;

// 3. Middlewares
app.use(express.json());          // interpreta body com Content-Type: application/json
app.use(express.static('public')); // serve public/index.html, estilo.css, player.js


app.get('/teste', (req, res) => {
    const html = '<html><body><b>Este é o meu site Express.js.</b></body></html>';
    res.send(html); // Content-Type vira text/html automaticamente
});

// =================================================================
// API de músicas — /api/musicas
// =================================================================

// GET /api/musicas — lista todas (resumo, sem as partes)
app.get('/api/musicas', (req, res) => {
    const musicas = musicaDAO.listarTodas();

    // Retorna sem as partes para não sobrecarregar a listagem
    const resumo = [];
    for (let i = 0; i < musicas.length; i++) {
        const m = musicas[i];
        resumo.push({
            id: m.id,
            nome: m.nome,
            artista: m.artista,
            totalPartes: m.partes.length
        });
    }

    res.status(200).json(resumo);
});

// GET /api/musicas/:id — retorna uma música específica com as partes
app.get('/api/musicas/:id', (req, res) => {
    const id = Number(req.params.id);
    const musica = musicaDAO.buscarPorId(id);

    if (!musica) {
        return res.status(404).json({ erro: `Música com id ${id} não encontrada` });
    }

    res.status(200).json(musica);
});

// POST /api/musicas — cria uma nova música
app.post('/api/musicas', (req, res) => {
    const { nome, artista } = req.body;

    if (!nome || !artista) {
        return res.status(400).json({ erro: 'Campos obrigatórios: nome, artista' });
    }

    const novaMusica = musicaDAO.inserir(nome, artista);
    res.status(201).json(novaMusica);
});

// PUT /api/musicas/:id — atualiza nome e artista de uma música existente
app.put('/api/musicas/:id', (req, res) => {
    const id = Number(req.params.id);
    const { nome, artista } = req.body;

    if (!nome || !artista) {
        return res.status(400).json({ erro: 'Campos obrigatórios: nome, artista' });
    }

    const musicaAtualizada = musicaDAO.atualizar(id, nome, artista);

    if (!musicaAtualizada) {
        return res.status(404).json({ erro: `Música com id ${id} não encontrada` });
    }

    res.status(200).json(musicaAtualizada);
});

// DELETE /api/musicas/:id — remove uma música
app.delete('/api/musicas/:id', (req, res) => {
    const id = Number(req.params.id);
    const musicaRemovida = musicaDAO.remover(id);

    if (!musicaRemovida) {
        return res.status(404).json({ erro: `Música com id ${id} não encontrada` });
    }

    res.status(200).json({ mensagem: 'Música removida com sucesso', musica: musicaRemovida });
});


app.use((err, req, res, next) => {
    // JSON mal-formado enviado pelo cliente (ex: texto puro sem { })
    if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
        console.error('Erro: JSON mal-formado no corpo da requisição:', err.message);
        return res.status(400).json({ erro: 'JSON mal-formado no corpo da requisição.' });
    }

    // Qualquer outro erro não tratado dentro de uma rota
    console.error('Erro no servidor:', err.message);
    res.status(500).json({ erro: 'Erro interno do servidor' });
});

// 4. Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
