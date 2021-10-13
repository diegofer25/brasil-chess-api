import { ApiRoute } from "~/types/api.types";
import express, { Express, RequestHandler, Router } from "express";

interface RoutesMapOptions {
  middlewares?: RequestHandler[],
  routes: ApiRoute[],
  subRouters?: Record<string, Router>
}

export function routesMap({ middlewares = [], routes, subRouters = {} }: RoutesMapOptions): Router {
  const router = express.Router();

  middlewares.forEach((middleware) => {
    router.use(middleware);
  });

  Object.entries(subRouters).map(([name, subRouter]) => {
    router.use(`/${name}`, subRouter);
  });

  routes.forEach(({ method, path, middlewares = [], handlerRequest }) =>
    router[method](path, ...middlewares, (req, res, next) => {
      handlerRequest(req).then((data) => res.json(data)).catch(next);
    })
  );

  return router;
}

export function routersMap(app: Express, routers: Record<string, Router>): Express {
  Object.entries(routers).forEach(([name, router]) => {
    app.use(`/${name}`, router);
  });

  return app;
}
