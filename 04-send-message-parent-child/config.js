import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

// const CLIENT_PORT = process.env.CLIENT_PORT || 3000;
const SERVER_PORT = process.env.SERVER_PORT || 5000;

// if (!CLIENT_PORT || !SERVER_PORT) {
//   throw new Error("Missing env");
// }

// export { CLIENT_PORT, SERVER_PORT };
export { SERVER_PORT };
