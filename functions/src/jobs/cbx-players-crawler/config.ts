import { CbxHeader, Header, Ufs } from "./types";

export const UFS: Ufs[] = [
  "AC",
  "AL",
  "AM",
  "AP",
  "AV",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
];

export const cbxHeaders: Record<number, string> = {
  0: "ID CBX",
  1: "Nome",
  2: "Data Nasc.",
  3: "UF",
  4: "ID FIDE",
  5: "Clássico",
  6: "Rápido",
  7: "Blitz",
};

export const headers: Record<CbxHeader, Header> = {
  "ID CBX": "idCbx",
  "Nome": "name",
  "Data Nasc.": "birthday",
  "UF": "uf",
  "ID FIDE": "idFide",
  "Clássico": "classic",
  "Rápido": "rapid",
  "Blitz": "blitz",
};
