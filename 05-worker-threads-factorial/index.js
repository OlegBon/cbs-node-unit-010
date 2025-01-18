import express from "express";
import { Worker } from "worker_threads";
import { SERVER_PORT } from "./config.js";

const app = express();

app.get("/factorial/:number", (req, res) => {
  const number = parseInt(req.params.number);

  if (isNaN(number)) {
    return res.status(400).send("Invalid number");
  }

  // Створюємо worker thread для обчислення факторіалу
  const worker = new Worker("./factorialWorker.js", { workerData: { number } });

  // Отримуємо відповідь від worker thread
  worker.on("message", (result) => {
    console.log(`Factorial of ${number} is ${result.factorial}`);
    res.send(`Factorial of ${number} is ${result.factorial}`);
  });

  // Обробляємо помилки worker thread
  worker.on("error", (error) => {
    console.error(`Error from worker: ${error.message}`);
    res.status(500).send(`Error from worker: ${error.message}`);
  });

  // Логування завершення worker thread
  worker.on("exit", (code) => {
    if (code !== 0) {
      console.log(`Worker stopped with exit code ${code}`);
    }
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is up and running on port ${SERVER_PORT}`);
  console.log(`For test go on http://localhost:${SERVER_PORT}/factorial/5`); // Заміни число на потрібне для тестування
  console.log("Main process ID", process.pid);
});
