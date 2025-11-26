const USER_ID = 1;
const AMOUNT = '100';
const REQUESTS = 50;

async function attack() {
  console.log(`😈 STARTING ATTACK: Sending ${REQUESTS} requests at once...`);

  const requests = [];
  for (let i = 0; i < REQUESTS; i++) {
    requests.push(
      fetch('http://localhost:3000/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: USER_ID, amount: AMOUNT }),
      })
    );
  }

  await Promise.all(requests);

  console.log(`✅ ATTACK FINISHED.`);
  console.log(
    `Check your database balance. It SHOULD be +${REQUESTS * 100} cents more.`
  );
}

attack();
