class AuthenticationService {
    login = (user, password) => {
        return Promise.resolve("ACCESS_TOKEN_FROM_SERVICE");
    }
}

const service = new AuthenticationService();

module.exports = service;
