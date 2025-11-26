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

export const transferSchema = {
  body: {
    type: 'object',
    required: ['fromUserId', 'toUserId', 'amount'],
    properties: {
      fromUserId: { type: 'number' },
      toUserId: { type: 'number' },
      amount: { type: 'string', pattern: '^[0-9]+$' },
    },
  },
};
