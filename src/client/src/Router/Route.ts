import * as React from 'react'

export enum RouteEnum {
    Connexion,
    Home,
    GameLobby,
    LimiteLimite,
    TarotCongolais,
    GifDefinitor
}

export interface IRoute {
    path: string
    name: string
    component: React.ComponentClass
}

export class Route {

    public path: string;
    public component: React.ComponentClass
    public name: string

    constructor(route: IRoute){
        this.path = route.path
        this.component = route.component
        this.name = route.name
    }
}