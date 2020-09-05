import * as React from 'react';
import { setToLocalStorage, getFromLocalStorage } from '../../utils';

const { REACT_APP_API_KEY, REACT_APP_APP_NAME, REACT_APP_REDIRECT_URL, REACT_APP_SCOPE } = process.env;

export class Login extends React.Component {
    render() {
        const requestURL = `https://trello.com/1/authorize?expiration=1day&name=${REACT_APP_APP_NAME}&scope=${REACT_APP_SCOPE}&response_type=token&key=${REACT_APP_API_KEY}&return_url=${REACT_APP_REDIRECT_URL}`;
        return <div>
            <a href={requestURL}>Login with Trello account</a>
            <h2>Please login</h2>
        </div>
    }
}