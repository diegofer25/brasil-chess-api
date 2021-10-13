import { IPlayer } from "~api/routers/players/types/player.types";
import { Model, Schema, model } from "mongoose";


const PlayerSchema = new Schema<IPlayer, Model<IPlayer>, IPlayer>({
  idCbx: { type: Number, required: true },
  name: { type: String, required: true },
  uf: { type: String, required: true },
  birthday: { type: String, required: false },
  idFide: { type: Number, required: false },
  classic: { type: Number, required: false },
  rapid: { type: Number, required: false },
  blitz: { type: Number, required: false },
}, {
  timestamps: true,
  versionKey: false,
}).index({ name: "text" });


export const PlayerModel = model("player", PlayerSchema);
