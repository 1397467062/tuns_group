import { post } from "tuns-fetch-web";

export const getOrders = data => {
  return post("/ins/app/groupQuote/queryQuoteResults", data);
};
