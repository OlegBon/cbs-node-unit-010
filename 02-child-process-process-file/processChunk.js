import fs from "fs";

const inputPath = process.argv[2];
const outputPath = process.argv[3];

// Приклад обробки: перетворення вмісту у верхній регістр
fs.readFile(inputPath, "utf8", (err, data) => {
  if (err) throw err;
  const processedData = data.toUpperCase();
  fs.writeFile(outputPath, processedData, (err) => {
    if (err) throw err;
    process.exit(0);
  });
});
