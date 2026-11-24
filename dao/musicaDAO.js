const supabase = require('../supabaseClient');
const { Musica } = require('../musica');
const { Parte } = require('../parte');

class MusicaDAO {

    // Lista músicas e seus artistas
    async listarTodas() {
        const { data, error } = await supabase
            .from('musicas')
            .select('id, nome, artistas(nome), partes(id)')
            .order('id');

        if (error) throw error;

        return data.map(m => {
            const musica = new Musica(m.nome, m.artistas.nome);
            musica.id = m.id;
            musica.partes = m.partes || [];
            return musica;
        });
    }

    // Busca uma música pelo ID
    async buscarPorId(id) {
        const { data, error } = await supabase
            .from('musicas')
            .select(`
                id,
                nome,
                artistas(nome),
                partes(id, ordem, letra, tempo_espera, tag)
            `)
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        if (!data) return null;

        const musica = new Musica(data.nome, data.artistas.nome);
        musica.id = data.id;

        musica.partes = (data.partes || [])
            .sort((a, b) => a.ordem - b.ordem)
            .map(p => new Parte(
                p.letra,
                p.tempo_espera,
                p.tag
            ));

        return musica;
    }

    // Insere ou localiza o artista e cadastra a música
    async inserir(nome, artista, partes = []) {
    // 1. Buscar o artista
    const { data: artistaExistente, error: erroBusca } =
        await supabase
            .from('artistas')
            .select('id')
            .eq('nome', artista)
            .maybeSingle();

    if (erroBusca) throw erroBusca;

    let artistaId;

    // 2. Criar artista, se necessário
    if (artistaExistente) {
        artistaId = artistaExistente.id;
    } else {
        const { data: novoArtista, error: erroArtista } =
            await supabase
                .from('artistas')
                .insert({ nome: artista })
                .select('id')
                .single();

        if (erroArtista) throw erroArtista;
        artistaId = novoArtista.id;
    }

    // 3. Inserir música
    const { data, error } = await supabase
        .from('musicas')
        .insert({
            nome: nome,
            artista_id: artistaId
        })
        .select('id')
        .single();

    if (error) throw error;

    // 4. Inserir partes, caso existam
    if (partes.length > 0) {
        const registrosPartes = partes.map((parte, index) => ({
            musica_id: data.id,
            ordem: index + 1,
            letra: parte.letra,
            tempo_espera: parte.tempoEspera,
            tag: parte.tag
        }));

        const { error: erroPartes } = await supabase
            .from('partes')
            .insert(registrosPartes);

        if (erroPartes) throw erroPartes;
    }

    // 5. Retornar a música
    const musica = new Musica(nome, artista);
    musica.id = data.id;
    musica.partes = partes;

    return musica;
}

    // Atualiza uma música
    async atualizar(id, nome, artista) {
        const musicaExistente = await this.buscarPorId(id);

        if (!musicaExistente) return null;

        const { data: artistaExistente, error: erroBusca } = await supabase
            .from('artistas')
            .select('id')
            .eq('nome', artista)
            .maybeSingle();

        if (erroBusca) throw erroBusca;

        let artistaId;

        if (artistaExistente) {
            artistaId = artistaExistente.id;
        } else {
            const { data: novoArtista, error: erroArtista } = await supabase
                .from('artistas')
                .insert({ nome: artista })
                .select('id')
                .single();

            if (erroArtista) throw erroArtista;
            artistaId = novoArtista.id;
        }

        const { error } = await supabase
            .from('musicas')
            .update({
                nome: nome,
                artista_id: artistaId
            })
            .eq('id', id);

        if (error) throw error;

        return this.buscarPorId(id);
    }

    // Exclui uma música
    async remover(id) {
        const musica = await this.buscarPorId(id);

        if (!musica) return null;

        const { error } = await supabase
            .from('musicas')
            .delete()
            .eq('id', id);

        if (error) throw error;

        return musica;
    }
}

module.exports = new MusicaDAO();