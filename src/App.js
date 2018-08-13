import React, { Component } from "react";

import { Grid } from "./components/Grid";

const rows = [[null, null, null], [null, null, null], [null, null, null]];

class App extends Component {
  render() {
    return (
      <div className="App">
        <Grid rows={rows} />
      </div>
    );
  }
}

export default App;
