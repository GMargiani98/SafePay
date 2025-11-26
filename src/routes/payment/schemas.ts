export const depositSchema = {
  body: {
    type: 'object',
    required: ['amount'],
    properties: {
      amount: { type: 'string', pattern: '^[0-9]+$' },
    },
  },
};

export const transferSchema = {
  headers: {
    type: 'object',
    properties: {
      'x-idempotency-key': { type: 'string' },
    },
  },
  body: {
    type: 'object',
    required: ['toUserId', 'amount'],
    properties: {
      toUserId: { type: 'number' },
      amount: { type: 'string', pattern: '^[0-9]+$' },
    },
  },
};
