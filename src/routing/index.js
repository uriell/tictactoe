import React from "react";
import { Route, Redirect } from "react-router-dom";

import * as firebase from "../firebase";

export const Private = ({
  children,
  component: Component,
  redirect,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !firebase.auth().currentUser ? (
        <Redirect to={redirect} />
      ) : Component ? (
        <Component {...props} />
      ) : (
        children
      )
    }
  />
);

export const Public = ({
  children,
  component: Component,
  redirect,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      firebase.auth().currentUser ? (
        <Redirect to={redirect} />
      ) : Component ? (
        <Component {...props} />
      ) : (
        children
      )
    }
  />
);
