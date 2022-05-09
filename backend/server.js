const http = require('http');
const app = require('./app');

const server = http.createServer(app);

// port normalization
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) return val
    if (port >= 0) return port
    return false
}
/**
 * Erreur son bind est lié au port
 * Lecture son bind est lié a l'adresse
 * */
function onError(error) {
    if (error.syscall !== 'listen') throw error

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // error code gestion (EACCES,EADDRINUSE)
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE': // port deja utiliser
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`server running at ${bind}`)
}

// process.env.PORT : peut attribution dynamiquement de port exemple heroku 
const port = normalizePort(process.env.PORT || 3000)
app.set("port", port)

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);