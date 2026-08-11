// DAO/MusicaDAO.js
const { Musica } = require('./musica');
const { Parte } = require('./parte');

class MusicaDAO {
    constructor() {
        // "banco de dados" em memória — array de objetos Musica
        this.musicas = [];
        this.proximoId = 1;
    }

    // Retorna todas as músicas
    listarTodas() {
        return this.musicas;
    }

    // Busca uma música pelo ID
    buscarPorId(id) {
        return this.musicas.find(m => m.id === id) || null;
    }

    // Insere uma nova música e retorna o objeto criado (com ID)
    inserir(nome, artista) {
        const novaMusica = new Musica(nome, artista);
        novaMusica.id = this.proximoId++;
        this.musicas.push(novaMusica);
        return novaMusica;
    }

    // Adiciona uma Parte a uma música existente
    adicionarPartes(idMusica, parte) {
        if (parte instanceof Parte) {
            const musica = this.buscarPorId(idMusica);
            if (musica != null) {
                musica.addParte(parte);
                return true;
            } else {
                return false;
            }
        } else return false;
    }

    // Atualiza nome e artista de uma música existente
    atualizar(id, nome, artista) {
        const musica = this.buscarPorId(id);
        if (!musica) return null;

        musica.nome = nome;
        musica.artista = artista;
        return musica;
    }

    // Remove uma música pelo ID
    remover(id) {
        const indice = this.musicas.findIndex(m => m.id === id);
        if (indice === -1) return null;

        return this.musicas.splice(indice, 1)[0];
    }
}

// Exporta uma INSTÂNCIA única (Singleton)
module.exports = new MusicaDAO();

constructor()
{
    this.musicas = [];
    this.proximoId = 0;
    this._carregarDadosIniciais();
}

_carregarDadosIniciais()
{
    const Beatriz = this.inserir('Beatriz', '2ZDinizz');
    // Adicione as partes da My Hero usando myHero.addParte(...)
    // (mesmo código que estava no player.js)
    beatriz.addParte(new Parte(intro, 3500, 'Intro'));
    beatriz.addParte(new Parte(refrao1, 14000, 'Refrao1'));
    beatriz.addParte(new Parte(verso1, 21000, 'Verso1'));
    beatriz.addParte(new Parte(verso2, 21000, 'Verso2'));
    beatriz.addParte(new Parte(verso3, 21000, 'Verso3'));
    beatriz.addParte(new Parte(verso4, 21000, 'Verso4'));
    beatriz.addParte(new Parte(ponte1, 12000, 'Ponte1'));
    beatriz.addParte(new Parte(refrao2, 14000, 'Refrao2'));
    beatriz.addParte(new Parte(verso5, 21000, 'Verso5'));
    beatriz.addParte(new Parte(ponte2, 14000, 'Ponte2'));
    beatriz.addParte(new Parte(verso6, 18000, 'Verso6'));
    beatriz.addParte(new Parte(verso7, 18000, 'Verso7'));
    beatriz.addParte(new Parte(refraoFinal, 14000, 'RefraoFinal'));
    beatriz.addParte(new Parte(refraoFinal2, 14000, 'RefraoFinal2'));
    beatriz.addParte(new Parte(final, 24000, 'Final'));
}