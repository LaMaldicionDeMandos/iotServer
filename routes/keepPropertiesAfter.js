const partialResponse = require('express-partial-response');

const keepPropertiesAfter = (props) => {
    return (req, res, next) => {
        req.query['fields'] = props;
        partialResponse()(req, res, next);
    };
};

const keepPropertiesAfterIf = (propsClosure) => {
    return (req, res, next) => {
        const props = propsClosure(req);
        req.query['fields'] = props;
        partialResponse()(req, res, next);
    };
};

const myModule = module.exports = keepPropertiesAfter;

myModule.keepPropertiesAfter = keepPropertiesAfter;
myModule.keepPropertiesAfterIf = keepPropertiesAfterIf;
