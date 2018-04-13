import LoginException from './Exceptions/LoginException';
import ApiRequestHandler from './ApiRequestHandler';
import configuration from './configuration';

const config = configuration();
let apiRequestHandler = new ApiRequestHandler(config);
let cont = 1;

run();



function run() {
    apiRequestHandler.login(monitor);
}

function monitor() {
    setInterval(pooling, config.interval);
}

function pooling() {
    console.log('polling...');
    let data = {
        'data_1': cont + Math.random(),
        'data_2': cont + Math.random()
    };
    cont++;
    apiRequestHandler.saveData(data);
}