import React from "react";

import "./index.css";
import { Cross, Circle } from "../Shapes";

const CROSS = "x";
const CIRCLE = "o";

const Row = ({ children }) => <div className="Grid Grid-Row">{children}</div>;

const Column = ({ children }) => (
  <div className="Grid Grid-Column">{children}</div>
);

export const Grid = ({ rows, children }) => (
  <div className="Grid">
    {rows.map(columns => (
      <Row>
        {columns.map(column => (
          <Column>{decideColumnContent(column)}</Column>
        ))}
      </Row>
    ))}
  </div>
);

const decideColumnContent = column =>
  column === CROSS ? <Cross /> : column === CIRCLE ? <Circle /> : "";
