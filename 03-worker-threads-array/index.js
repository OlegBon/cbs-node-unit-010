import express from "express";
import { Worker } from "worker_threads";
import { SERVER_PORT } from "./config.js";

const app = express();

const processArrayWithWorkers = (array, numWorkers) => {
  const chunkSize = Math.ceil(array.length / numWorkers);
  let results = [];
  let finishedWorkers = 0;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < numWorkers; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, array.length);
      const chunk = array.slice(start, end);

      const worker = new Worker("./worker.js", {
        workerData: { chunk, startIndex: start, workerId: i },
      });

      worker.on("message", (result) => {
        console.log(`Worker ${i} finished processing`);

        // Зберігаємо результати з індексами
        results = results.concat(result);

        finishedWorkers++;
        if (finishedWorkers === numWorkers) {
          // Сортуємо результати за індексами
          results.sort((a, b) => a.index - b.index);
          resolve(results.map((item) => item.value));
        }
      });

      worker.on("error", (error) => {
        reject(error);
      });

      console.log(`Worker ${i} started processing chunk ${start} to ${end}`);
    }
  });
};

app.get("/process-array", async (req, res) => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Приклад масиву
  const numWorkers = 4; // Кількість потоків для використання

  try {
    const result = await processArrayWithWorkers(array, numWorkers);
    res.json(result);
  } catch (error) {
    res.status(500).send(`Error processing array: ${error.message}`);
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is up and running on port ${SERVER_PORT}`);
  console.log(`For test go on http://localhost:${SERVER_PORT}/process-array`);
  console.log("Main process ID", process.pid);
});
