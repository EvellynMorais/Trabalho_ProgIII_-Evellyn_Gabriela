//este é meu arquivo principal

const calc = require('./calc'); //importacao do modulo
const chalk = require('chalk');


console.log(chalk.redBright('Este é o meu primeiro programa Node.js'));

const resSoma= calc.soma(2,2);
const resSub= calc.sub(10,2);


console.log(chalk.green( `O resultado da soma é ${resSoma}`) );
console.log(chalk.blue.bgRed.bold(`O resultado da subtração é ${resSub}`) );  
