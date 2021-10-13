import dotenv from "dotenv";
import moduleAlias from "module-alias";
import path from "path";

const env = process.env.FUNCTIONS_EMULATOR === "true" ? "development" : "production";
const dotEnvFilePath = path.resolve(__dirname, `../.env.${env}`);

dotenv.config({ path: dotEnvFilePath });

moduleAlias.addAliases({
  "~": path.resolve(__dirname),
  "~api": path.resolve(__dirname, "api"),
});

import * as functions from "firebase-functions";
import { api } from "./api";
// import { cbxPlayersCrawler } from "./jobs/cbx-players-crawler";
// import { exportToMongoDb } from "./jobs/export-to-mongodb";

exports.api = functions.https.onRequest(api);

// exports.cbxPlayersCrawler = functions.https.onRequest(cbxPlayersCrawler);

// exports.exportToMongodb = functions.https.onRequest(exportToMongoDb);
