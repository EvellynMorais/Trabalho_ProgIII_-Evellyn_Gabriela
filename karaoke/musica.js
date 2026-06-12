
class Musica {

    constructor(nome, artista) {
        //atributos com this.atrib
        this.nome = nome;
        this.artista = artista;
        this.partes = []; // associacao com Parte
    }

    //metodos
    addParte(parte) { //parte é objeto de Parte
        try {
            // valida parte
            if( !parte.letra || !parte.tempoEspera || !parte.tag ){
                // parte tem problema
                throw new Error("Parte da Musica com problema!");
                
            }
            // armazena parte em partes
            this.partes.push(parte);

        } catch (error) {
            console.log("Erro ao addParte: " + error.message);
        }
    }

    getLetraInteira(){
        // this.partes -->todas as partes

        let letra = "";

        this.partes.forEach((parte) => {
            letra += parte.letra;
        });
        return letra;
    }
}

module.exports = {Musica};