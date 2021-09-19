const port = process.env.PORT || 5000;
const server = require('./route.js');
server.listen(port, ()=>{
    console.log('Serveur en exécution sur http://' + port + '/');
});