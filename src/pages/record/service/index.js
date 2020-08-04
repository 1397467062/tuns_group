import { post } from "tuns-fetch-web";

export const helpMeRecord = data => post("/ins/app/group/helpMeRecord", data);
