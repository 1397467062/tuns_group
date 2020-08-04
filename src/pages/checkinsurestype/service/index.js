import { post } from "tuns-fetch-web";

export const getQueryIns = data => {
  return post("/ins/app/group/queryInsTwo", data);
};
