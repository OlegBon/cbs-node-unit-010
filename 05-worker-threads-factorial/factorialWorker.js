import { parentPort, workerData } from "worker_threads";

// Функція для обчислення факторіалу
const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
};

const number = workerData.number;
const result = factorial(number);

// Відправляємо результат назад до головного процесу
parentPort.postMessage({ factorial: result });
