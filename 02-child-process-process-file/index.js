import fs from "fs";
import { spawn } from "child_process";
import { SERVER_PORT } from "./config.js";
import express from "express";

const app = express();

const splitFile = (filePath, chunkSize, outputPath) => {
  return new Promise((resolve, reject) => {
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const numChunks = Math.ceil(fileSize / chunkSize);

    let completedChunks = 0;

    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);

      for (let i = 0; i < numChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min((i + 1) * chunkSize, fileSize);
        const chunk = data.slice(start, end);

        fs.writeFile(`${outputPath}.${i}`, chunk, (err) => {
          if (err) reject(err);
          completedChunks++;
          if (completedChunks === numChunks) {
            console.log(`File split into ${numChunks} chunks.`);
            resolve();
          }
        });
      }
    });
  });
};

const processChunks = (numChunks, inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    let completedProcesses = 0;

    for (let i = 0; i < numChunks; i++) {
      const process = spawn("node", [
        "processChunk.js",
        `${inputPath}.${i}`,
        `${outputPath}.${i}`,
      ]);

      process.on("close", (code) => {
        if (code === 0) {
          completedProcesses++;
          if (completedProcesses === numChunks) {
            console.log(`All ${numChunks} chunks processed.`);
            resolve();
          }
        } else {
          reject(new Error(`Process ${i} exited with code ${code}`));
        }
      });
    }
  });
};

const mergeChunks = (numChunks, outputPath, finalPath) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(finalPath);
    let completedReads = 0;

    const checkAndResolve = () => {
      if (completedReads === numChunks) {
        writeStream.end();
        console.log(`All ${numChunks} chunks merged into final file.`);
        resolve();
      }
    };

    for (let i = 0; i < numChunks; i++) {
      const readStream = fs.createReadStream(`${outputPath}.${i}`);

      readStream.pipe(writeStream, { end: false });
      readStream.on("end", () => {
        completedReads++;
        checkAndResolve();
      });

      readStream.on("error", (err) => {
        reject(err);
      });
    }
  });
};

app.get("/process-file", async (req, res) => {
  const filePath = "largefile.txt";
  const chunkSize = 1024 * 1024; // 1MB
  const outputPath = "chunk";
  const finalPath = "processedfile.txt";

  try {
    await splitFile(filePath, chunkSize, outputPath);
    const numChunks = fs
      .readdirSync(".")
      .filter((file) => file.startsWith(outputPath)).length;
    await processChunks(numChunks, outputPath, "processedchunk");
    await mergeChunks(numChunks, "processedchunk", finalPath);

    res.send("File processed successfully");
  } catch (error) {
    res.status(500).send(`Error processing file: ${error.message}`);
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Server is up and running on port ${SERVER_PORT}`);
  console.log(`For test go on http://localhost:${SERVER_PORT}/process-file`);
  console.log("Main process ID", process.pid);
});
