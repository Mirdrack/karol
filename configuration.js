import dotenv from 'dotenv'
dotenv.config()

export default function () {
    const result = dotenv.config()

    if (result.error) {
      throw result.error
    }

    const configuration = {};
    configuration.interval = process.env.INTERVAL || 5000;
    configuration.loginUrl = process.env.LOGIN_URL || '';
    configuration.apiEmail = process.env.API_EMAIL || '';
    configuration.apiPassword = process.env.API_PASSWORD || '';
    return configuration;
}
