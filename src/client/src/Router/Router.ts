import { Route, IRoute, RouteEnum } from "./Route";
import { observable } from "mobx";
import { isString } from "util";

import Home from '../Pages/Home/Home'
import GameLobby from '../Pages/GameLobby/GameLobby'
import Game from "../Pages/Game/Game";

export type RouteDescriptor = RouteEnum | string

export class Router {
    public routes: Route[]
    @observable public currentRoute: Route;
    @observable public history: any

    constructor(){
        let routeDefs: IRoute[] = [
            {
                path: '/',
                component: Home,
                type: RouteEnum.Home
            },
            {
                path: '/limitelimite_lobby',
                component: GameLobby,
                type: RouteEnum.GameLobby
            },
            {
                path: '/game',
                component: Game,
                type: RouteEnum.Game
            }
        ]
        this.routes = routeDefs.map(iRoute => new Route(iRoute))
        this.switchRoute(this.routes[0].type)
        // this.switchRoute('/?test=ab')
        // console.log('getAllParams', this.getAllParams())
    }

    switchRoute(routeInfo: RouteDescriptor){
        let route = this.routes.find(r => isString(routeInfo) ? r.path === routeInfo : r.type === routeInfo)
        this.currentRoute = route
        this.updateWindowHistory()
    }

    updateWindowHistory(){
        window.history.pushState({}, "page 2", this.currentRoute.path);
    }

    getAllParams(){
        let path = window.location.pathname
        return path.split('/')
    }

}