import request from 'request';
import LoginException from './Exceptions/LoginException';

export default class ApiRequestHandler {

    constructor(config) {
        // this.request = new request;
        this.loginUrl = config.loginUrl;
        this.apiEmail = config.apiEmail;
        this.apiPassword = config.apiPassword;
    }

    log(message) {
        console.log(message);
    }

    login() {
        let formData = {
            'email': this.apiEmail,
            'password': this.apiPassword
        };

        let options = {
            url: this.loginUrl,
            headers: {
                'Accept': 'application/json'
            },
            form: formData
        };

        request.post(options, function (error, response, body) {
            if (response && response.statusCode === 200) {
                console.log(response.body);
                console.log('statusCode:', response.statusCode);
            } else {
                this._evaluateLoginError(response);
            }
        }.bind(this))
        .on('error', function (error) {
            console.log('cant login');
            // parse the error
            // throw an exception with the message
        });
    }

    _evaluateLoginError(response) {
        console.log(response.statusCode);
    }
}
