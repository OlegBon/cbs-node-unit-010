import express from "express";
import { fork } from "child_process";
import { SERVER_PORT } from "./config.js";

const app = express();

app.get("/send-message", (req, res) => {
  // Створюємо дочірній процес
  const child = fork("./child.js");

  // Надсилаємо повідомлення до дочірнього процесу
  child.send({ message: "Hello from the main process!" });

  // Отримуємо відповідь від дочірнього процесу
  child.on("message", (response) => {
    console.log(`Received from child: ${response.message}`);
    res.send(`Received from child: ${response.message}`);
  });

  // Обробляємо помилки дочірнього процесу
  child.on("error", (error) => {
    console.error(`Error from child process: ${error.message}`);
    res.status(500).send(`Error from child process: ${error.message}`);
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is up and running on port ${SERVER_PORT}`);
  console.log(`For test go on http://localhost:${SERVER_PORT}/send-message`);
  console.log("Main process ID", process.pid);
});
