import Joi from 'joi';

export const updateProfile = Joi.object({
   nama: Joi.string().max(150).messages({
      'string.max': 'Name must be max 150 character',
   }),

   no_hp: Joi.string().min(8).max(15).messages({
      'number.min': 'Phone number must be at least 8 number',
      'number.max': 'Phone number must be max 15 number',
   }),

   email: Joi.string().email({ tlds: { allow: ['com', 'net'] } }),
   profile_picture: Joi.any(),
});

export const updatePassword = Joi.object({
   oldPassword: Joi.string()
      .required()
      .min(5)
      .max(15)
      .alphanum()
      .label('Password'),

   newPassword: Joi.string()
      .required()
      .min(5)
      .max(15)
      .alphanum()
      .label('Password'),

   newPasswordConfirmation: Joi.any()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
         'any.only': 'New Password Confirmation does not match',
      }),
});
