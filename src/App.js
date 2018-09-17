import "./App.less";

import React, { Component } from "react";
import { Switch } from "react-router-dom";
import { Layout } from "antd";

import BrowserHeader from "./components/Header";
import BrowserFooter from "./components/Footer";
import Container from "./components/Container";
import AppRoutes from "./routes";

class App extends Component {
  render() {
    return (
      <Layout className="App">
        <BrowserHeader />
        <Container>
          <Switch>
            <AppRoutes />
          </Switch>
        </Container>
        <BrowserFooter />
      </Layout>
    );
  }
}

export default App;
