import { post,get } from "tuns-fetch-web";

export const getQueryIns = data => {
  return post("/ins/app/group/queryInsTwo", data);
};

export const mockdata = data => {
    return get("/api/mockdata", data);
  };
