const userAuthSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
};

export const registerSchema = { body: userAuthSchema };
export const loginSchema = { body: userAuthSchema };
