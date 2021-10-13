import { Document } from "mongoose";

export interface RawPlayer {
  idCbx: number
  name: string
  uf: string
  birthday?: string
  idFide?: number
  classic?: number
  rapid?: number
  blitz?: number
}

export interface IPlayer extends RawPlayer, Document<string> {
  createdAt: Date
  updatedAt: Date
}
