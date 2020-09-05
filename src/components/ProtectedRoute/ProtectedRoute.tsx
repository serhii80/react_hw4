import { FC } from "react";
import React from "react";
import { Route, Redirect, RouteProps, RouteComponentProps } from "react-router-dom";
import { ROUTES_URLS } from "../App/routes";

interface ProtectedRouteProps extends RouteProps {
    isLogin: boolean;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ render, isLogin, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(routeCompProps: RouteComponentProps) =>
                isLogin ? (
                    render!(routeCompProps)
                ) : (
                        <Redirect
                            to={{
                                pathname: ROUTES_URLS.LOGIN,
                                state: { from: routeCompProps.location }
                            }}
                        />
                    )
            }
        />
    );
}

export { ProtectedRoute };