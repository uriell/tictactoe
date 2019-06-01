import React from "react";
import PropTypes from "prop-types";

import { Cross, Circle } from "./";
import styles from "./Grid.module.css";

const Grid = ({ rows, onCellClick }) => {
  if (!Array.isArray(rows)) throw new Error("`rows` prop should be an Array!");
  if (rows.filter(c => typeof c !== "object").length)
    throw new Error("Items of the array `rows` should be of type Object!");
  if (rows.filter(c => !Array.isArray(c.columns)).length)
    throw new Error("`columns` prop of `rows` items should be of type Array!");

  return (
    <div className={styles.Grid}>
      {rows.map((row, x) => (
        <div className={styles.GridRow} key={x}>
          {row.columns.map((column, y) => (
            <div
              className={styles.GridColumn}
              key={y}
              onClick={() => onCellClick(x, y)}
            >
              {column === "x" ? <Cross /> : column === "o" ? <Circle /> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

Grid.propTypes = {
  onCellClick: PropTypes.func.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      columns: PropTypes.arrayOf(PropTypes.oneOf([null, "x", "o"])).isRequired
    })
  ).isRequired
};

export default Grid;
