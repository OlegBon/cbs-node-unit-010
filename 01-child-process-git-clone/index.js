import express from "express";
import { spawn } from "child_process";
import { SERVER_PORT } from "./config.js";

const app = express();

app.get("/", async (req, res) => {
  // Запускаємо команду `git clone`
  const gitClone = spawn("git", [
    "clone",
    "https://github.com/OlegBon/testRepo.git",
  ]);

  // Буфер для зберігання виведення
  let output = "";

  // Обробляємо виведення даних з командного рядка
  gitClone.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);
    output += data.toString();
  });

  // Обробляємо помилки з командного рядка
  gitClone.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    output += data.toString();
  });

  // Обробляємо завершення процесу
  gitClone.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
    res.send(`Process exited with code ${code}\n${output}`);
  });
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is up and running on port ${SERVER_PORT}`);
  console.log("Main process ID", process.pid);
});
