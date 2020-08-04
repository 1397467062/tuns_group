import { router } from "yeo-router";
import { setBrowserTitle } from "../tools/navigate";
import { containerAction } from "../utils";

const goBack = () => {
  const { _history } = window.g_app;
  const { location } = _history;
  const { query } = location;
  if (query.fromnative === "1") {
    containerAction("TunsCallBack");
  }
  router.goBack();
};

export default {
  namespace: "appSpace",
  state: {
    navBarLeftClick: goBack,
    navBarLeftIcon: "iconjt",
    navBarRightIcons: [],
    navBarTitle: "团险",
    hiddenNavBar: false,
    fullContent: false,
  },
  effects: {
    *changeNavBarTitle({ payload }, { put }) {
      // 更新导航栏
      yield put({ type: "updateNavBarTitle", payload });
      // 更新浏览器导航栏
      setBrowserTitle(payload);
    },
  },
  reducers: {
    updateNavBarLeftClick: (state, { payload }) => ({
      ...state,
      navBarLeftClick: payload || goBack,
    }),
    updateNavBarLeftIcon: (state, { payload }) => ({
      ...state,
      navBarLeftIcon: payload || "iconjt",
    }),
    updateNavBarRightIcons: (state, { payload }) => ({
      ...state,
      navBarRightIcons: payload || [],
    }),
    updateNavBarTitle: (state, { payload }) => ({
      ...state,
      navBarTitle: payload,
    }),
    updateHiddenNavBar: (state, { payload }) => ({
      ...state,
      hiddenNavBar: payload,
    }),
    updateFullContent: (state, { payload }) => ({
      ...state,
      fullContent: payload,
    }),
  },
};
