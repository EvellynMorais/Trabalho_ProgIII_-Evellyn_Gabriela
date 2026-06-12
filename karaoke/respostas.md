1. Qual a diferença entre require('./musica') e require('chalk')?
    require('./musica') importa um módulo local criado dentro do próprio projeto. O `./` indica que o arquivo está em uma pasta próxima ao arquivo atual.
    Já require('chalk') importa uma biblioteca externa instalada pelo npm e armazenada na pasta `node_modules`.

2. O que acontece se você tentar adicionar uma parte sem a propriedade tag? Por quê?
    A parte não será adicionada corretamente e poderá ocorrer um erro, pois o método addParte() valida se a parte possui todas as propriedades necessárias (letra, tempoEspera e tag). A tag é utilizada para identificar o tipo da parte da música, como verso, refrão ou ponte.

3. Por que a função play() precisa da palavra async antes de function?
    A palavra async permite o uso do comando await dentro da função. Como a função play() utiliza await sleep() para controlar o tempo entre as partes da música, ela precisa ser declarada como assíncrona.

4. O que acontece se você esquecer o await antes de sleep()?
    O programa não irá esperar o tempo definido. As letras serão exibidas muito rapidamente, pois a execução continuará sem aguardar a conclusão da função sleep().

5. Explique a diferença entre console.log() e process.stdout.write().
    console.log() exibe uma mensagem e automaticamente pula para a próxima linha.

    Exemplo:
    js
    console.log("Olá");
    console.log("Mundo");

    Saída:
    Olá
    Mundo
    
    process.stdout.write() exibe o texto sem quebrar a linha automaticamente.

    Exemplo:
    js
    process.stdout.write("Olá ");
    process.stdout.write("Mundo");

    Saída:
    Olá Mundo

    Por isso, `process.stdout.write()` é mais adequado para o karaokê, pois permite mostrar as palavras uma a uma na mesma linha.