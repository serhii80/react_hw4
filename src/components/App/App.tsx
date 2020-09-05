import * as React from 'react'
import { Route, Link, RouteComponentProps, Redirect, Switch, RouteChildrenProps, withRouter } from 'react-router-dom';
import { setToLocalStorage, getFromLocalStorage } from "../../utils";
import { Dashboard } from '../Dashboard';
import { Login } from '../Login';
import { routes, AppRoute, ROUTES_URLS } from './routes';
import { OAuth } from '../OAuth';
import { ProtectedRoute } from '../ProtectedRoute'


const TOKEN_STORAGE_KEY = 'TOKEN';
const USER_ID = 'MY_ID';
const { REACT_APP_API_KEY } = process.env;

interface Board {
    id: string;
    name: string;
    pinned: boolean;
    desc?: string;
}

interface UserProfile {
    id: string;
    username: string;
}

interface AppState {
    token: string;
    boards: Array<Board>;
    userProfile: UserProfile;
}

interface AppProps extends RouteComponentProps { };

interface CustomToken {
    token: string,
    expireIn: number
}

const INITIAL_STATE = {
    token: '',
    userProfile: {
        id: '',
        username: ''
    },
    boards: [],
};

class App extends React.Component<AppProps, AppState> {

    public state = INITIAL_STATE;

    componentDidMount() {
        this.getToken();
    }

    private async getToken() {
        if (this.state.token) {
            return;
        }
        const { token } = getFromLocalStorage<CustomToken>(TOKEN_STORAGE_KEY);
        if (!token) {
            return this.navigateToLogin();
        }
        const url = `https://api.trello.com/1/members/me?key=${REACT_APP_API_KEY}&token=${token}`;
        const response = await fetch(url);
        if (response.ok === true && response.status === 200) {
            const userProfile = await response.json();
            this.setProfile(userProfile);
            setToLocalStorage(USER_ID, userProfile.id);
            this.setToken(token);
            return;
            // return this.getBoards();
        }
        return this.navigateToLogin();
    }

    private navigateToDashboard() {
        this.props.history.push(ROUTES_URLS.DASHBOARD);
    }

    private navigateToLogin() {
        this.props.history.push(ROUTES_URLS.LOGIN);
    }

    private setProfile(data: UserProfile) {
        this.setState({
            userProfile: {
                id: data.id ? data.id : '',
                username: data.username ? data.username : ""
            }
        })
    }

    private setToken = (token: string) => {
        setToLocalStorage<CustomToken>(TOKEN_STORAGE_KEY, { token, expireIn: Date.now() });
        return this.setState({ token });
    }

    private get isLoggedIn() {
        return !!this.state.token
    }

    private renderHeader() {
        return (<header>
            {routes.map((route: AppRoute, i: number) =>
                route.isHidden ?
                    null :
                    < Link key={i} to={route.path} > {route.title}</Link>)}
            <button onClick={this.logOut}>Log out</button>
        </header>)
    }

    private logOut = () => {
        this.setState(INITIAL_STATE);
        this.navigateToLogin();
    }

    private renderContent() {
        if (this.state.userProfile.id) {
        }
        return (<main>
            <Switch>
                {routes.map(this.renderRoute)}
                {/* <Route
                    path={ROUTES_URLS.DASHBOARD}
                    render={(props: RouteChildrenProps) => <Dashboard {...props} boards={this.state.boards} />}
                    title={'Dashboard'}
                    isProtected={true}
                    exact={true}
                /> */}
                <Route
                    path={ROUTES_URLS.OAUTH}
                    render={(props: RouteChildrenProps) => <OAuth {...props} onSetToken={this.setToken} />}
                />
                <Redirect to={ROUTES_URLS.NONE} />
            </Switch>
        </main>)
    }

    private renderRoute = (route: AppRoute, i: number) => {
        if (route.isProtected) {
            return (<ProtectedRoute
                exact={route.exact}
                key={i}
                path={route.path}
                render={route.render}
                isLogin={this.isLoggedIn} />)
        } else {
            return (<Route
                key={i}
                exact={route.exact}
                path={route.path}
                render={(props) => route.render({ ...props })}
            />)
        }
    }

    // private async getBoards() {
    //     const id = this.state.userProfile.id;
    //     if (id) {
    //         const url = `https://api.trello.com/1/members/${id}/boards?key=${REACT_APP_API_KEY}&token=${this.state.token}`
    //         const response = await fetch(url);
    //         if (response.ok === true && response.status === 200) {
    //             const boards = await response.json();
    //             this.setBoards(boards);
    //             return this.navigateToDashboard();
    //         }
    //     }
    // }

    public render() {
        return (<div>
            {this.renderHeader()}
            {this.renderContent()}
        </div>)
    }
}

const AppWithRouter = withRouter(App);

export { AppWithRouter as App };