//script principal

const { sleep } = require('./utils');
const { Musica } = require('./musica');
const { Parte } = require('./parte');
const chalk = require('chalk');

const beatriz = new Musica('Beatriz', '2ZDinizz');
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


//começa a adicionar as partes da música, com letra, tempo e tag1 
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

async function play() {
    try {
        // para cada parte da música, deve imprimir qual parte é, letra e pausar o tempo necessário
        //ex.:
        console.log(chalk.yellow('\n🎤 Abra a música e prepare-se!\n'));
        for (let i = 0; i >= 1; i--) {
        console.log(chalk.cyan(`♫ ${i}...`));
        await sleep(100);
        }
        console.log();
                for (const parte of beatriz.partes) {
                    //imprime parte e letra
                    console.log(parte.tag);
                    //agurda o tempo para a letra
                    const palavras = parte.letra.split(' ');
                    const tempoPorPalavra =
                        parte.tempoEspera / palavras.length;
                    for (const palavra of palavras) {
                        const limpa = palavra
                            .toLowerCase()
                            .replace(/[.,!?;:()]/g, '');
                        if (limpa === 'beatriz') {
                            process.stdout.write(
                                chalk.hex('#AB0202').bold(palavra + ' ')
                            );
                        } else if (
                            parte.tag === 'Intro' ||
                            parte.tag === 'Final'
                        ) {
                            process.stdout.write(
                                chalk.hex('#6797ff').bold(palavra + ' ')
                            );
                        } else if (
                            parte.tag.includes('Refrao')
                        ) {

                            process.stdout.write(
                                chalk.hex('#fceda6').bold(palavra + ' ')
                            );
                        } else {
                            process.stdout.write(
                                chalk.hex('#ffa2e3').bold(palavra + ' ')
                            );
                        }
                        await sleep(tempoPorPalavra);
                    }

        console.log('\n');
                }
            } catch (error) {
                console.log("Erro ao tocar música: " + error.message);
            }
}

play();