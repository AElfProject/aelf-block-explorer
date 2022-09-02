/**
 * @file App
 * @author huangzongzhe
*/
import React, {
    Component
} from 'react';
import {
    Switch
} from 'react-router-dom';

import BrowserHeader from './components/Header/Header';
import HeaderBlank from './components/Header/HeaderBlank';
import BrowserFooter from './components/Footer/Footer';
import BrowserBreadcrumb from './components/Breadcrumb/Breadcrumb';
import Container from './components/Container/Container';
import AppRoutes from './routes';

import './App.less';

export default class App extends Component {
    componentDidCatch(error) {
        console.log(`component occurred error: ${error}`);
    }
    componentDidUpdate(preProps, preState) {
        this.back2Top()
    }

    back2Top = () => {
        const app = document.querySelector('#app')
        if (app) {
            app.scrollIntoView({ block: 'start', behavior: 'auto' })
        }
    }

    render() {
        return (
            <div className='App'>
                <BrowserHeader />
                <HeaderBlank />
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
