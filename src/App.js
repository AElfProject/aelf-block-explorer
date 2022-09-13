/**
 * @file App
 * @author huangzongzhe
 */
import React, { Suspense, useCallback, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import BrowserHeader from "./components/Header/Header";
import HeaderBlank from "./components/Header/HeaderBlank";
import BrowserFooter from "./components/Footer/Footer";
import BrowserBreadcrumb from "./components/Breadcrumb/Breadcrumb";
import Container from "./components/Container/Container";
import { PageRouter } from "./routes/routes";
import { useLocation } from "react-use";

import "./App.less";

function App() {
  const { pathname } = useLocation()

  const back2Top = useCallback(() => {
    const app = document.querySelector('#app')
    if (app) {
      app.scrollIntoView({ block: 'start', behavior: 'auto' })
    }
  }, [])

  useEffect(() => {
    back2Top()
  }, [pathname])

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
// if (module.hot) {
//   module.hot.accept();
// }
// export default hot(App);
export default App;
