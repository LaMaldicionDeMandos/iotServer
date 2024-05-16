const mailjet = require ('node-mailjet').apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE);

const MAILJET_API_VERSION = {'version': 'v3.1'};
const APP_EMAIL = 'info@medika.com.ar';

createRequest = (templateId, email, subject, variables, name) => {
    return {
        "Messages":[
            {
                "From": {
                    "Email": APP_EMAIL,
                    "Name": "El equipo de IoT Project"
                },
                "To": [
                    {
                        "Email": email,
                        "Name": name
                    }
                ],
                "TemplateID": templateId,
                "TemplateLanguage": true,
                "Subject": subject,
                "Variables": variables || {}
            }
        ]
    };
};

class MailService {
    sendRegistrationValidate(code, email, firstName) {
        const request = createRequest(5884527, email, "Validación de email",
            {"name": firstName, "validation_code": code},
            firstName);
        return mailjet.post("send", MAILJET_API_VERSION)
            .request(request)
            .then((result) => console.log(result.body))
            .catch(e => console.log(JSON.stringify(e)));
    }

    sendPasswordRecoveryCode(code, email, firstName) {
        const request = createRequest(5973974, email, "Validación de email",
          {"name": firstName, "validation_code": code},
          firstName);
        return mailjet.post("send", MAILJET_API_VERSION)
          .request(request)
          .then((result) => console.log(result.body))
          .catch(e => console.log(JSON.stringify(e)));
    }
}

const service = new MailService();

module.exports = service;
