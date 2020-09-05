import * as React from 'react';
import { RouteChildrenProps, Link } from 'react-router-dom';
import { getFromLocalStorage } from '../../utils';
import { History, Location } from 'history';
import { ROUTES_URLS } from '../App/routes';

// interface DashboardsData extends RouteChildrenProps {
//     boards: Array<Board>;
// }
// interface Board {
//     id: string;
//     name: string;
//     pinned: boolean;
//     desc?: string;
// }


// export class Dashboard extends React.Component<DashboardsData> {


//     public render() {
//         console.log('из дашборда борды', this.props.boards);
//         return (
//             <div>
//                 <h2>Hello from dashboard</h2 >
//                 <h1>{this.props.boards.length > 0 ? 'YES!!!!' : 'NO'}</h1>
//             </div>
//         )
//     }
// }

const { REACT_APP_API_KEY } = process.env;

interface UserID {
    id: string
}


interface CustomToken {
    token: string,
    expireIn: number
}

export class Dashboard extends React.Component<RouteChildrenProps> {
    public state = {
        boards: []
    }

    componentDidMount() {
        this.getBoards();
    }

    private async getBoards() {
        const id = getFromLocalStorage<UserID>('MY_ID');
        const { token } = getFromLocalStorage<CustomToken>('TOKEN')
        if (id) {
            const url = `https://api.trello.com/1/members/${id}/boards?key=${REACT_APP_API_KEY}&token=${token}`
            const response = await fetch(url);
            if (response.ok === true && response.status === 200) {
                const boards = await response.json();
                this.setBoards(boards);
                return boards;
            }
        } return this.props.history.push(ROUTES_URLS.LOGIN);
    }

    private setBoards(boards: any) {
        this.setState({ boards })
    }

    private onClickDiv(e: any) {
        window.location.href = e;
    }

    private renderOneBoard(boards: any[]) {
        return (
            boards.map((board, i) => {
                const divStyle = {
                    width: '195px',
                    height: '100px',
                    color: 'white',
                    backgroundImage: 'url(' + board.prefs.backgroundImage + ')',
                    backgroundColor: board.prefs.backgroundColor,
                    backgroundSize: 'cover'
                };
                return (
                    <div key={i} style={divStyle} onClick={(e) => this.onClickDiv(board.url)}>{board.name}</div>
                )
            })
        )
    }

    public render() {
        const boards: any[] = this.state.boards;
        return (
            <div>
                <h2>Доски</h2>
                <div>{this.renderOneBoard(boards)}</div>
            </div >
        )
    }
}