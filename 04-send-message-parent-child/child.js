// Обробляємо отримані повідомлення від головного процесу
process.on("message", (msg) => {
  console.log(`Received from main: ${msg.message}`);

  // Відправляємо відповідь назад до головного процесу
  process.send({ message: "Hello from the child process!" });
});
