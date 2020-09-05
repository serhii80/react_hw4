import React from "react";
import { FC } from "react";
import { RouteChildrenProps, Redirect } from "react-router-dom";
import { ROUTES_URLS } from "../App/routes";

interface OAuthProps extends RouteChildrenProps {
    onSetToken: Function;
}

export const OAuth: FC<OAuthProps> = ({ location: { hash }, onSetToken }: OAuthProps) => {
    const token = hash.split('=')[1];
    onSetToken(token);
    return <Redirect to={ROUTES_URLS.DASHBOARD} />
}