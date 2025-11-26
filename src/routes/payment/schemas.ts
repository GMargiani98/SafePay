export const depositSchema = {
  body: {
    type: 'object',
    required: ['userId', 'amount'],
    properties: {
      userId: { type: 'number' },
      amount: { type: 'string', pattern: '^[0-9]+$' },
    },
  },
};
