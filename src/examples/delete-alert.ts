import { DeNotifyClient } from "../denotifyclient.js";

// Simple App to demonstrate deleting an alert
async function main() {
  const api = await DeNotifyClient.create({
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  });

  const alertId = 11;
  await api.deleteAlert(alertId);
}

main();
