import * as routers from "~api/routers";
import { errorHandler, mongodbConnect } from "~api/middlewares";
import { routersMap } from "~/utils/api.util";
import { startMongodbService } from "~/services/mongodb.service";
import cors from "cors";
import express from "express";
import helmet from "helmet";

startMongodbService();

const api = express();

// config middlewares
api.use(cors());
api.use(helmet());
api.use(express.json());
api.use(mongodbConnect);
// api status response
api.get("/", (req, res) => res.send(`Brasil Chess API 1.0 - STATUS: ONLINE - ${process.env.NODE_ENV}`));

// routes middlewares
routersMap(api, routers).use(errorHandler);

export { api };
