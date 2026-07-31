/* Serviço web com o framework Express.js
*  
* Deve servir opcoes para requisições da Musica e partes dela.

**/


// GET musica/letra

// Get musica/parte/:id

const express = require('express');
const app = express();

app.get('/', function (req,res){

    const html = "<html> <body> <b>Hello Turma de Terça!!</b> </body>  </html>";
    res.contentType('text/html');
    res.send(html);
});

app.listen(3001);


