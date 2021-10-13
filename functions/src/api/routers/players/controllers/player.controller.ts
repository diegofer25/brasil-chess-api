import { FilterQuery, ListQueryOptions, Projection, crud } from "~/utils/crud.util";
import { HandlerRequest } from "~/types/api.types";
import { IPlayer } from "~api/routers/players/types/player.types";
import { PlayerModel } from "~/api/routers/players/models/player.model";

export function playerController() {
  const { readList } = crud(PlayerModel);
  const getPlayers: HandlerRequest<IPlayer[]> = ({ query }) => {
    const filter: FilterQuery<IPlayer> = {};
    const projection: Projection<IPlayer> = {};
    const options: ListQueryOptions<IPlayer> = {
      skip: Number(query.skip) || 0,
      limit: Number(query.limit) || 10,
      sort: {},
    };
    const sortDirection = query.sort === "desc" ? -1 : 1;

    if (typeof query.search === "string") {
      filter.$text = { $search: query.search };
      options.sort?.score ? options.sort.score = { $meta: "textScore" } : null;
    } else {
      options.sort?.name ? options.sort.name = sortDirection : null;
    }

    return readList(filter, projection, options);
  };

  return {
    getPlayers,
  };
}
