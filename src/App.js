/**
 * @file App
 * @author huangzongzhe
 */
import React, { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import BrowserHeader from "./components/Header/Header";
import HeaderBlank from "./components/Header/HeaderBlank";
import BrowserFooter from "./components/Footer/Footer";
import BrowserBreadcrumb from "./components/Breadcrumb/Breadcrumb";
import Container from "./components/Container/Container";
import { PageRouter } from "./routes/routes";

import "./App.less";

function App() {
  return (
    <Suspense fallback={null}>
      <div className='App'>
        <BrowserRouter>
          <BrowserHeader />
          <HeaderBlank />
          <BrowserBreadcrumb />
          <Container>
            <PageRouter />
          </Container>
          <BrowserFooter />
        </BrowserRouter>
      </div>
    </Suspense>
  );
}

export default App;
