import { headers } from "./config";

export type Ufs =
"AC"|
"AL"|
"AM"|
"AP"|
"AV"|
"BA"|
"CE"|
"DF"|
"ES"|
"GO"|
"MA"|
"MG"|
"MS"|
"MT"|
"PA"|
"PB"|
"PE"|
"PI"|
"PR"|
"RJ"|
"RN"|
"RO"|
"RR"|
"RS"|
"SC"|
"SE"|
"SP"|
"TO"

export type CbxHeader = "ID CBX" | "Nome" | "Data Nasc." | "UF" | "ID FIDE" | "Clássico" | "Rápido" | "Blitz"

export type Header = "idCbx" | "name" | "birthday" | "uf" | "idFide" | "classic" | "rapid" | "blitz"

export type Player = Record<Header, string | number | null>

export function isCbxHeader(header: string): header is CbxHeader {
  return !!headers[header as CbxHeader];
}
