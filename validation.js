const Joi = require('@hapi/joi')

//Validate Person
const PersonValidate = (data) => {
    const schema = Joi.object({
        name : Joi.string().min(6).required(),
        age : Joi.number().required()
    });
    return schema.validate(data);
}

const UserValidate = (data) => {
    const schema = Joi.object({
        email : Joi.string().min(6).email().required(),
        password : Joi.string().min(6).required()
    });
    return schema.validate(data);
}


module.exports.PersonValidate = PersonValidate
module.exports.UserValidate = UserValidate