import { ApiRoute } from "~/types/api.types";
import { playerController } from "~api/routers/players/controllers/player.controller";
import { routesMap } from "~/utils/api.util";

const { getPlayers } = playerController();
const routes: ApiRoute[] = [{
  method: "get",
  path: "/",
  handlerRequest: getPlayers,
}];

/**
 * BASE PATH /players
 */
export default routesMap({ routes });
