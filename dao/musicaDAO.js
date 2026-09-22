

const { Musica } = require('../musica');
const { Parte } = require('../parte');

class MusicaDAO {
    constructor() {
        // "banco de dados" em memória — array de objetos Musica
        this.musicas = [];
        this.proximoId = 1;
        this._carregarDadosIniciais();
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

    // Adiciona uma Parte a uma música existente (usado só na carga inicial,
    // mas fica disponível caso vocês queiram fazer o desafio extra da Parte 3.5)
    adicionarParte(idMusica, parte) {
        if (!(parte instanceof Parte)) return null;
        const musica = this.buscarPorId(idMusica);
        if (!musica) return null;
        musica.addParte(parte);
        return musica;
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

    // Carga inicial — para o servidor não começar "vazio".
    // Mantivemos a "Beatriz", que já era a música usada no projeto
    // (no lugar da "My Hero" do enunciado original) — é só trocar o
    // texto abaixo se quiserem usar outra música.
    _carregarDadosIniciais() {
        const beatriz = this.inserir('Beatriz', '2ZDinizz');

        const intro = `(Uh, uh, uh-uh-uh, yeah)`;
        const refrao1 = `Tu era tudo, baby (tudo, baby, ó), tudo, baby
E era tudo, baby (oh, yeah)
Mas você não quis (mas agora me diz)
Diz se ainda pensa em nós (pensa em nós)
Eu ainda penso`;
        const verso1 = `Ainda vejo tuas coisa, ainda curto tuas foto (rapaz, hahaha)
Ainda abro o story pra ver se você olha tudo que eu posto (jamais, haha)
Ainda sinto sua falta quando eu vejo cair a chuva, beijo uma boca que não é a sua
E mermo que outras me façam de banco, eu não consigo achar tua substituta`;
        const verso2 = `Filha da, filha da puta (hahaha)
Ainda gelo quando você passa
Será que, se a gente se encontra na rua, teu olhar ainda vai ser minha casa?
Teu abraço ainda vai ser escudo?
Teu sorriso ainda vai ser refúgio?`;
        const verso3 = `Ironia é lutar pelo amor e, depois, esse amor ser motivo de luto
E foi assim, eu cuidei de você, mas tu não cuidava de mim
Eu tentei te dizer que eu não queria ir embora
Lá fora, no jogo do amor, empate sempre é vitória`;
        const verso4 = `E eu aprendi te amar, mas não tinha como isso funcionar
Eu cresci na rua, tu cresceu no lar
Tu é vinho branco, eu sou gole pro santo e mesa de bar
Tu é Bukowski, eu sou Basquiat`;
        const ponte1 = `E, quando eu te olhei nos olhos, pude enxergar
Que o que torna nossa vida ímpar é saber dividir ela com um par
Porque era pra ser
Tu (e era), tu (e era), tu, só tu (fala)`;
        const refrao2 = `Tu era tudo, baby (tudo, baby, ó), tudo, baby
E era tudo, baby (baby)
Mas você não quis (mas agora me diz)
Diz se ainda pensa em nós (ainda pensa em nós)
Eu ainda penso`;
        const verso5 = `Mas você virou uma desconhecida que eu sei o nome, sei das ferida
Sei os defeitos, sei suas manias, sei até qual é tua cor favorita
Sei que ama o Sol, sei que é de libra
Sei seu perfume, sei o que te irrita`;
        const ponte2 = `Só não sei como a gente junto não conseguiu dar certo nessa vida
Mas, Beatriz, ainda penso em tu, me diz se ainda pensa em mim
Eu tentei te dizer que eu não queria ir embora
Lá fora, no jogo do amor, empate sempre é vitória`;
        const verso6 = `Tu me culpa pela gente, eu também quis que fosse diferente
Era bom, pena não ser pra sempre
Tua gargalhada ainda ecoa na mente
Mermo que eu explique, tu não entende`;
        const verso7 = `Então segue tua vida primeiramente
Acabou a conversa, então vai sem pressa
Com uma bunda dessa, eu prefiro até que tu vá na frente
Era pra ser`;
        const refraoFinal = `Tudo, baby (tudo), tudo, baby
E era tudo, baby (baby)
Mas você não quis
Diz se ainda pensa em nós
Eu ainda penso em`;
        const refraoFinal2 = `Tudo, baby (tudo, baby, ó), tudo, baby
E era tudo, baby
Mas você não quis
Diz se ainda pensa em nós
Eu ainda penso`;
        const final = `Admito que eu sinto sua falta, fiz de tudo pra isso funcionar
Eu não te amei, eu fui além, eu quis que nóis fosse singular
Saudade do olhar que diziam palavras
Do sorriso que eu já sei de cor
Do pós-sexo só de risada
Do abraço que quase dá nó
Saudade do toque que eletrocutava, dois corpos bêbados de suor
Você foi a parte mais linda de mim
Não era amor, era bem melhor
Lembra de quando a gente transbordava?
Agora eu me afogo se eu ouço sua voz
Mas, hoje, essa letra fala de você
Pra eu nunca mais ter que falar de nóis, Beatriz`;

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

        // segunda música, só para a listagem não ficar com um item só
        const segunda = this.inserir('Smells Like Teen Spirit', 'Nirvana');
        segunda.addParte(new Parte('Load up on guns, bring your friends', 4000, 'Verso1'));
        segunda.addParte(new Parte('Here we are now, entertain us', 4000, 'Refrao1'));
    }
}

// Exporta uma INSTÂNCIA única (Singleton) — ver pergunta 4 em respostas.md
module.exports = new MusicaDAO();