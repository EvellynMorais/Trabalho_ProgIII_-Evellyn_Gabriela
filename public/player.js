
 // player.js — o cérebro do player no navegador

// --- Referências aos elementos da página ---
const listaEl = document.getElementById('listaMusicas');
const nomeEl = document.getElementById('nomeMusica');
const artistaEl = document.getElementById('artista');
const tagEl = document.getElementById('tag');
const letraEl = document.getElementById('letra');
const contadorEl = document.getElementById('contador');
const btnTocar = document.getElementById('btnTocar');

// --- Estado do player ---
let musicaAtual = null;
let tokenReproducao = 0;

// Função de espera
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Passo 2 — Carregar playlist
async function carregarPlaylist() {
    try {
        const resposta = await fetch('/api/musicas');

        if (!resposta.ok) {
            throw new Error('Falha ao carregar músicas');
        }

        const musicas = await resposta.json();

        listaEl.innerHTML = '';

        musicas.forEach((musica) => {
            const item = document.createElement('li');
            item.textContent = `${musica.nome} — ${musica.artista}`;

            item.addEventListener('click', () => escolherMusica(musica.id));

            listaEl.appendChild(item);
        });

    } catch (erro) {
        console.error('Erro ao carregar a playlist:', erro);
    }
}

// Passo 3 — Escolher música
async function escolherMusica(id) {
    // Interrompe logicamente uma reprodução anterior
    tokenReproducao++;
    btnTocar.disabled = false;

    try {
        const resposta = await fetch(`/api/musicas/${id}`);

        if (!resposta.ok) {
            throw new Error('Falha ao buscar música');
        }

        musicaAtual = await resposta.json();

        nomeEl.textContent = musicaAtual.nome;
        artistaEl.textContent = musicaAtual.artista;

        tagEl.textContent = '';
        letraEl.textContent = '';
        contadorEl.textContent = '';

        btnTocar.disabled = false;

    } catch (erro) {
        console.error('Erro ao buscar detalhes da música:', erro);
    }
}

// Passo 4 — Tocar música
async function tocar() {
    if (!musicaAtual || !musicaAtual.partes || musicaAtual.partes.length === 0) {
        return;
    }

    btnTocar.disabled = true;

    // Identifica esta reprodução
    const meuToken = ++tokenReproducao;

    try {
        const totalPartes = musicaAtual.partes.length;

        for (let i = 0; i < totalPartes; i++) {

            // Se outra música foi selecionada, interrompe
            if (meuToken !== tokenReproducao) {
                return;
            }

            const parte = musicaAtual.partes[i];

            tagEl.textContent = parte.tag ? `[${parte.tag}]` : '';
            letraEl.textContent = parte.letra;
            contadorEl.textContent = `parte ${i + 1} de ${totalPartes}`;

            // tempoEspera armazenado em segundos
            await sleep(Number(parte.tempoEspera));
        }

        // Mensagem de encerramento
        if (meuToken === tokenReproducao) {
            tagEl.textContent = '';
            letraEl.textContent = 'Fim da música!';
            contadorEl.textContent = '';
        }

    } catch (erro) {
        console.error('Erro durante a reprodução:', erro);

    } finally {
        // Reabilita somente se esta reprodução ainda for a atual
        if (meuToken === tokenReproducao) {
            btnTocar.disabled = false;
        }
    }
}

// Evento do botão
btnTocar.addEventListener('click', tocar);

// Ponto de partida
carregarPlaylist();