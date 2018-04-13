import requestPromise from 'request-promise';
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

    login(callback) {
        let formData = {
            'email': this.apiEmail,
            'password': this.apiPassword
        };

        let options = {
            method: 'POST',
            uri: this.loginUrl,
            headers: {
                'Accept': 'application/json'
            },
            form: formData,
            json: true
        };

        requestPromise(options)
            .then(function (body) {
                let accessToken = body.access_token;
                this.accessToken = accessToken;

                if (accessToken !== '' && typeof callback == 'function') {
                    this.accessToken = accessToken;
                    callback();
                }
            }.bind(this))
            .catch(function (error) {
                console.log(error.body);
                throw new LoginException('Cannot log in!');
            });
    }

    saveData(data) {
        let formData = data;
        let options = {
            method: 'POST',
            uri: this.storeUrl,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            },
            form: formData,
            json: true
        };

        requestPromise(options)
            .then(function (body) {
                 console.log(body);
            })
            .catch(function (error) {
                if (error.statusCode === 401) {
                    console.log('We have to refresh our token');
                    this._refresh(options);
                } else {
                    // console.log(Object.keys(error));
                    console.log('Cannot save data!');
                    console.log(error.statusCode);
                }

            }.bind(this));
    }

    _refresh(saveOptions) {
        let options = {
            method: 'POST',
            uri: this.refreshUrl,
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.accessToken
            },
            json: true
        };

        requestPromise(options)
            .then(function (body) {
                this.accessToken = body.access_token;
                this._saveOnRefresh(saveOptions);
            }.bind(this))
            .catch(function (error) {
                console.log('Cannot refresh!');
                console.log(error.body);
            });
    }

    _saveOnRefresh(options) {
        // Frist we update the token and then we save the data
        options.headers.Authorization = 'Bearer ' + this.accessToken;
        requestPromise(options)
            .then(function (body) {
                 console.log(body);
            })
            .catch(function (error) {
                console.log('Cannot save data after refresh!');
                console.log(error.statusCode);
            }.bind(this));
    }
}
