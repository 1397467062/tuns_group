import React from "react";
import { setTitle } from "../../tools/navigate";

class BaseController extends React.Component {
  setTitle = title => {
    setTitle(title);
  };
}

export default BaseController;
