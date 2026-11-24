const supabase = require('./supabaseClient');
const { musicas } = require('./dao/musicaDAO_inicial');

async function migrarDados() {
    for (const musica of musicas) {

        // 1. Verificar se o artista existe
        let { data: artista } = await supabase
            .from('artistas')
            .select('*')
            .eq('nome', musica.artista)
            .single();

        // 2. Se não existir, cadastrar o artista
        if (!artista) {
            const { data, error } = await supabase
                .from('artistas')
                .insert({ nome: musica.artista })
                .select()
                .single();

            if (error) {
                console.error('Erro ao cadastrar artista:', error);
                continue;
            }

            artista = data;
        }

        // 3. Verificar se a música existe
        let { data: musicaBanco } = await supabase
            .from('musicas')
            .select('*')
            .eq('nome', musica.nome)
            .eq('artista_id', artista.id)
            .single();

        // 4. Se não existir, cadastrar a música
        if (!musicaBanco) {
            const { data, error } = await supabase
                .from('musicas')
                .insert({
                    nome: musica.nome,
                    artista_id: artista.id
                })
                .select()
                .single();

            if (error) {
                console.error('Erro ao cadastrar música:', error);
                continue;
            }

            musicaBanco = data;
        }

        // 5. Excluir as partes antigas da música
        const { error: erroExcluir } = await supabase
            .from('partes')
            .delete()
            .eq('musica_id', musicaBanco.id);

        if (erroExcluir) {
            console.error('Erro ao excluir partes antigas:', erroExcluir);
            continue;
        }

        // 6. Inserir novamente as partes atualizadas
        const partes = musica.partes.map((parte, index) => ({
            musica_id: musicaBanco.id,
            ordem: index + 1,
            letra: parte.letra,
            tempo_espera: parte.tempoEspera,
            tag: parte.tag
        }));

        if (partes.length > 0) {
            const { error: erroInserir } = await supabase
                .from('partes')
                .insert(partes);

            if (erroInserir) {
                console.error('Erro ao inserir partes:', erroInserir);
                continue;
            }
        }

        console.log(`Música "${musica.nome}" atualizada!`);
    }

    console.log('Migração concluída!');
}

migrarDados();