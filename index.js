import LoginException from './Exceptions/LoginException';
import ApiRequestHandler from './ApiRequestHandler';
import configuration from './configuration';

const config = configuration();
let apiRequestHandler = new ApiRequestHandler(config);

var cont = 1;
apiRequestHandler.login(); 
setInterval(monitor, config.interval);

function monitor() {
	console.log('Interval: ' + cont);
	apiRequestHandler.log(cont);
	cont++;
}