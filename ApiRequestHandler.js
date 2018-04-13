import request from 'request';
import LoginException from './Exceptions/LoginException';

export default class ApiRequestHandler {

    constructor(config) {
        this.accessToken = '';
        this.loginUrl = config.loginUrl;
        this.storeUrl = config.storeUrl;
        this.refreshUrl = config.refreshUrl;
        this.apiEmail = config.apiEmail;
        this.apiPassword = config.apiPassword;
    }

    log(message) {
        console.log(message);
    }

    login(callback) {
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
                let body = JSON.parse(response.body);
                let accessToken = body.access_token;

                if (accessToken !== '' && typeof callback == 'function') {
                    this.accessToken = accessToken;
                    callback();
                }
            } else {
                this._evaluateLoginError(response);
            }
        }.bind(this))
        .on('error', function (error) {
            // TO DO: parse the error
            throw new LoginException('Cannot log in!');
        });
    }

    saveData(data) {
        let formData = data;
        let options = {
            url: this.storeUrl,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            },
            form: formData
        };

        request.post(options, function (error, response, body) {
            if (response && response.statusCode === 200) {
                console.log(response.body);
            } else if (response && response.statusCode === 401) {
                console.log('We have to refresh our token');
                this._refresh();
            } else {
                // TO DO: handle this
                console.log(response.statusCode);
                console.log('Evaluate save data error');
            }
        }.bind(this))
        .on('error', function (error) {
            // TO DO: parse the error
            console.log('Cannot save data!');
        });
    }

    _refresh() {
        console.log('_refresh');

        let options = {
            url: this.refreshUrl,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            }
        };

        request.post(options, function (error, response, body) {
            if (response && response.statusCode === 200) {
                let body = JSON.parse(response.body);
                this.accessToken = body.access_token;
            } else {
                console.log('Evaluate refresh error');
            }
        }.bind(this))
        .on('error', function (error) {
            // TO DO: parse the error
            console.log('Cannot refresh!');
        });
    }

    _evaluateLoginError(response) {
        console.log(response.statusCode);
    }
}
