import { parentPort, workerData } from "worker_threads";

const { chunk, startIndex, workerId } = workerData;
console.log(
  `Worker ${workerId} received chunk ${chunk} starting from index ${startIndex}`
);

const result = chunk.map((number, index) => ({
  index: startIndex + index,
  value: number * 2, // Приклад обробки: множимо числа на 2
}));

parentPort.postMessage(result);
