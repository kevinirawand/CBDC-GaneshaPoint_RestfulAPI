import Joi from 'joi';

export const registerSchema = Joi.object({
   nama: Joi.string().required().max(150).messages({
      'string.max': 'Name must be max 150 character',
   }),

   no_hp: Joi.string().required().min(8).max(15).messages({
      'number.min': 'Phone number must be at least 8 number',
      'number.max': 'Phone number must be max 15 number',
   }),

   email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),

   password: Joi.string()
      .required()
      .min(5)
      .max(15)
      .alphanum()
      .label('Password'),

   passwordConfirmation: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .messages({
         'any.only': 'Password Confirmation does not match',
      }),
});

export const loginSchema = Joi.object({
   email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),

   password: Joi.string().required().min(5).max(15).alphanum(),
});
