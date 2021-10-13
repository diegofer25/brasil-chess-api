import * as functions from "firebase-functions";
import { BigBatchManager, waitFor } from "./utils";
import {JSDOM} from "jsdom";
import {Player, Ufs, isCbxHeader} from "./types";
import {UFS, cbxHeaders, headers} from "./config";
import {firestore} from "../../services/firebase.service";
import FormData from "form-data";
import axios from "axios";

let currentPage = 0;
let lastTask = "";

export async function cbxPlayersCrawler(req: functions.https.Request, resp: functions.Response<any>) {
  function response(data: Record<string, unknown>) {
    resp.json(data);
  }

  function responseError(message: string) {
    response({ error: true, message });
  }

  const token = req.query.token;

  if (typeof token !== "string") {
    return responseError("The token was not provided");
  }

  await firestore.collection("tokens").doc(token).get().then((doc) => {
    if (!doc.exists) {
      return responseError("The token provided is invalid");
    }

    const data = doc.data();

    if (!data?.auth) {
      return responseError("The token provided is not authorized");
    }
  });

  response({ processing: true });

  try {
    for (const uf of UFS) {
      currentPage = 0;
      setLastTask(`Start fetching ${uf} players`);

      const formData = await getSearchPageFormData();
      const players = await getAllUfPlayers(uf, formData);

      setLastTask(`Saving ${uf} players in to database`);
      await savePlayers(players);
    }

    setLastTask("Job done with success");
  } catch (err) {
    const message = (err as Error).message;

    console.log("ERROR: ", JSON.stringify({
      message,
      lastTask,
    }, null, 2));
  }
}

async function savePlayers(players: Player[]) {
  const batchManager = new BigBatchManager();
  const playersCollectionRef = firestore.collection("players");

  for (const player of players) {
    await batchManager.addOperationToBatchQueue({
      ref: playersCollectionRef.doc(String(player.idCbx)),
      data: player,
    });
  }

  return batchManager.commit();
}

async function getAllUfPlayers(uf: Ufs, pageFormData: FormData): Promise<Player[]> {
  currentPage++;
  pageFormData.append("ctl00$ContentPlaceHolder1$cboUF", uf);
  await waitFor(1000);
  setLastTask(`Fetching uf: ${uf} - currentPage: ${currentPage}`);

  const {data} = await axios({
    url: "http://www.cbx.org.br/rating",
    method: "POST",
    data: pageFormData,
    headers: pageFormData.getHeaders(),
  });
  const pageData = extractPageData(data);

  if (pageData.nextPageFormData) {
    return [...pageData.players, ...(await getAllUfPlayers(uf, pageData.nextPageFormData))];
  }

  return pageData.players;
}

async function getSearchPageFormData(): Promise<FormData> {
  const response = await axios.get("http://www.cbx.org.br/rating");

  return getPageFormData(response.data);
}

function getPageFormData(pageText: string): FormData {
  const dom = new JSDOM(pageText);
  const formData = new FormData();

  dom.window.document.querySelectorAll("input[type=\"hidden\"]").forEach((e) => {
    const name = e.getAttribute("name");
    const value = e.getAttribute("value");

    if (name && value) {
      formData.append(name, value);
    }
  });

  return formData;
}

function extractPageData(pageText: string) {
  const dom = new JSDOM(pageText);
  const tableRows = dom.window.document.querySelectorAll("table#ContentPlaceHolder1_gdvMain tbody tr");
  const players: Player[] = [];
  const pages: number = extractPagesNumberInfo(dom);
  let nextPage = 1;

  tableRows.forEach((tableRow, index) => {
    if (index > 0 && index < tableRows.length - 2) {
      const player: Player = {
        idCbx: "",
        name: "",
        birthday: "",
        uf: "",
        idFide: null,
        classic: null,
        rapid: null,
        blitz: null,
      };

      tableRow.querySelectorAll("td").forEach((data, index) => {
        const idElement = data.querySelector("a");

        if (idElement) {
          player.idCbx = idElement.textContent ? Number(idElement.textContent) : null;
        } else {
          const value = data.textContent;

          if (value) {
            const cbxHeader = cbxHeaders[index];

            if (isCbxHeader(cbxHeader)) {
              const header = headers[cbxHeader];

              player[header] = Number.isNaN(Number(value)) ? value : Number(value) === 0 ? null : Number(value);
            }
          }
        }
      });
      players.push(player);
    } else {
      tableRow.querySelectorAll("td").forEach((pageElement) => {
        const currentPageSpan = pageElement.querySelector("span");

        if (currentPageSpan) {
          nextPage = Number(currentPageSpan.textContent) + 1;
        }
      });
    }
  });

  let nextPageFormData: FormData | null = null;

  if (nextPage <= pages) {
    nextPageFormData = getPageFormData(pageText);
    nextPageFormData.append("__EVENTTARGET", "ctl00$ContentPlaceHolder1$gdvMain");
    nextPageFormData.append("__EVENTARGUMENT", `Page$${nextPage}`);
  }

  return {
    players,
    nextPageFormData,
  };
}


function extractPagesNumberInfo(dom: JSDOM) {
  const captionElement = dom.window.document.querySelector("table#ContentPlaceHolder1_gdvMain > caption");

  if (!captionElement) {
    return 0;
  }

  const text = captionElement.textContent;

  if (text) {
    const totalPlayers = Number(text.replace("Total de Jogadores: ", "").replace(".", ""));

    return Math.ceil(totalPlayers / 50);
  }

  return 0;
}


function setLastTask(task: string) {
  lastTask = task;
  console.log(lastTask);
}
