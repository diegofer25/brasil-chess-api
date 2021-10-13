import * as functions from "firebase-functions";
import { BulkWriteOperation, crud } from "~/utils/crud.util";
import { PlayerModel } from "~/api/routers/players/models/player.model";
import { RawPlayer } from "~/api/routers/players/types/player.types";
import { firestore } from "~/services/firebase.service";

export async function exportToMongoDb(req: functions.https.Request, resp: functions.Response<any>) {
  resp.json({ processing: true });

  console.log("fetching players from firebase");

  const snapshot = await firestore.collection("players").get();
  const players: RawPlayer[] = snapshot.docs.map((doc) => doc.data() as RawPlayer);
  const { bulkWrite } = crud(PlayerModel);
  const bulkOperations = players.map<BulkWriteOperation<RawPlayer>>((player) =>({
    insertOne: {
      document: player,
    },
  }));

  console.log("saving players in mongodb");

  const results = await bulkWrite(bulkOperations);

  console.log(JSON.stringify(results, null, 2));
}
