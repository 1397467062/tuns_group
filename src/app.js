import { storage } from "tuns-utils";

export function onRouteChange({ location }) {
  const { query } = location;

  // 业务员
  if (query.salesman_id || query.salesman) {
    const localSalesmanId = query.salesman_id || query.salesman || "";
    storage.set("salesmanid", localSalesmanId);
  }
  // 令牌
  if (query.token) {
    storage.set("token", query.token);
  }
}
