export const setNavigateTitle = (title = "", async = true) => {
  const { _store } = window.g_app;
  const { dispatch } = _store;
  if (async) {
    setTimeout(() => {
      dispatch({
        type: "appSpace/updateNavBarTitle",
        payload: title,
      });
    }, 0);
  } else {
    dispatch({
      type: "appSpace/updateNavBarTitle",
      payload: title,
    });
  }
};

export const setBrowserTitle = (title = "", async = true) => {
  if (async) {
    setTimeout(() => {
      document.title = title;
    }, 0);
  } else {
    document.title = title;
  }
};

export const setTitle = (title = "", async = true) => {
  setNavigateTitle(title, async);
  setBrowserTitle(title, async);
};
