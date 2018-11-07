import React, {
    Component
} from "react";
import {
    Switch
} from "react-router-dom";

import BrowserHeader from "./components/Header/Header";
import BrowserFooter from "./components/Footer/Footer";
import BrowserBreadcrumb from "./components/Breadcrumb/Breadcrumb";
import Container from "./components/Container/Container";
import AppRoutes from "./routes";

import "./App.less";

class App extends Component {
    componentDidCatch(error) {
        console.log(`component occurred error: ${error}`);
    }

    render() {
        return (
            <div className="App">
                <BrowserHeader />
                <BrowserBreadcrumb />
                <Container>
                <Switch>
                    <AppRoutes />
                </Switch>
                </Container>
                <BrowserFooter />
            </div>
        );
    }
}

export default App;
