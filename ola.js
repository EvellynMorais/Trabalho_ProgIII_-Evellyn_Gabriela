// ola.js
const hora = new Date().getHours();

let saudacao;
if (hora < 12) {
    saudacao = "Bom dia";
} else if (hora < 18) {
    saudacao = "Boa tarde";
} else {
    saudacao = "Boa noite";
}

console.log(`${saudacao}! São ${hora}h.`);

console.log("Diretório atual:", process.cwd());
console.log("Versão do Node:", process.version);