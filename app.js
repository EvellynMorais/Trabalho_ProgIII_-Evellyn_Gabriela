// app.js — Configuração do Express + rotas + middlewares
// As rotas delegam as operações para o musicaDAO.

// 1. Importar o Express e o DAO
const express = require('express');
const musicaDAO = require('./dao/musicaDAO');

// 2. Criar a aplicação
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middlewares
app.use(express.json());
app.use(express.static('public'));

// Rota de teste
app.get('/teste', (req, res) => {
    const html = '<html><body><b>Este é o meu site Express.js.</b></body></html>';
    res.send(html);
});

// =================================================================
// API de músicas — /api/musicas
// =================================================================

// GET /api/musicas — lista todas as músicas
app.get('/api/musicas', async (req, res) => {
    try {
        const musicas = await musicaDAO.listarTodas();

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

    } catch (error) {
        console.error('Erro ao listar músicas:', error.message);
        res.status(500).json({ erro: 'Erro ao listar músicas' });
    }
});

// GET /api/musicas/:id — busca uma música com suas partes
app.get('/api/musicas/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        const musica = await musicaDAO.buscarPorId(id);

        if (!musica) {
            return res.status(404).json({
                erro: `Música com id ${id} não encontrada`
            });
        }

        res.status(200).json(musica);

    } catch (error) {
        console.error('Erro ao buscar música:', error.message);
        res.status(500).json({ erro: 'Erro ao buscar música' });
    }
});

// POST /api/musicas — cadastra uma música
// POST /api/musicas — cadastra música e suas partes
app.post('/api/musicas', async (req, res) => {
    try {
        const { nome, artista, partes = [] } = req.body;

        if (
            typeof nome !== 'string' ||
            typeof artista !== 'string' ||
            !nome.trim() ||
            !artista.trim() ||
            !Array.isArray(partes)
        ) {
            return res.status(400).json({
                erro: 'Nome, artista e partes válidos são obrigatórios'
            });
        }

        const partesValidas = partes.every(p =>
            p &&
            typeof p.letra === 'string' &&
            typeof p.tag === 'string' &&
            Number.isInteger(p.tempoEspera) &&
            p.tempoEspera >= 0
        );

        if (!partesValidas) {
            return res.status(400).json({
                erro: 'Cada parte precisa de letra, tag e tempoEspera válido'
            });
        }

        const novaMusica = await musicaDAO.inserir(
            nome.trim(),
            artista.trim(),
            partes
        );

        res.status(201).json(novaMusica);

    } catch (error) {
        console.error('Erro ao cadastrar música:', error.message);

        res.status(500).json({
            erro: 'Erro ao cadastrar música'
        });
    }
});

// PUT /api/musicas/:id — atualiza uma música
app.put('/api/musicas/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { nome, artista } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        if (
            typeof nome !== 'string' ||
            typeof artista !== 'string' ||
            !nome.trim() ||
            !artista.trim()
        ) {
            return res.status(400).json({
                erro: 'Campos obrigatórios: nome, artista'
            });
        }

        const musicaAtualizada = await musicaDAO.atualizar(
            id,
            nome.trim(),
            artista.trim()
        );

        if (!musicaAtualizada) {
            return res.status(404).json({
                erro: `Música com id ${id} não encontrada`
            });
        }

        res.status(200).json(musicaAtualizada);

    } catch (error) {
        console.error('Erro ao atualizar música:', error.message);
        res.status(500).json({ erro: 'Erro ao atualizar música' });
    }
});

// DELETE /api/musicas/:id — remove uma música
app.delete('/api/musicas/:id', async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({ erro: 'ID inválido' });
        }

        const musicaRemovida = await musicaDAO.remover(id);

        if (!musicaRemovida) {
            return res.status(404).json({
                erro: `Música com id ${id} não encontrada`
            });
        }

        res.status(200).json({
            mensagem: 'Música removida com sucesso',
            musica: musicaRemovida
        });

    } catch (error) {
        console.error('Erro ao remover música:', error.message);
        res.status(500).json({ erro: 'Erro ao remover música' });
    }
});

// =================================================================
// Tratamento de erros
// =================================================================

app.use((err, req, res, next) => {

    // JSON malformado
    if (err.type === 'entity.parse.failed' || err instanceof SyntaxError) {
        console.error('Erro de JSON:', err.message);

        return res.status(400).json({
            erro: 'JSON malformado no corpo da requisição.'
        });
    }

    console.error('Erro no servidor:', err.message);

    res.status(500).json({
        erro: 'Erro interno do servidor'
    });
});

// 4. Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});