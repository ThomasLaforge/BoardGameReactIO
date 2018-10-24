import { Route, IRoute, RouteEnum } from "./Route";
import { observable } from "mobx";
import { isString } from "util";

import Home from '../Pages/Home/Home'
import GameLobby from '../Pages/Lobby/Lobby'
import LimiteLimiteGame from "../Pages/LimiteLimite/Game";
import TarotCongolaisGame from '../Pages/TarotCongolais/Game'
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
                path: '/lobby',
                component: GameLobby,
                type: RouteEnum.GameLobby
            },
            {
                path: '/limitelimite',
                component: LimiteLimiteGame,
                type: RouteEnum.LimiteLimite
            },
            {
                path: '/tarotcongolais',
                component: TarotCongolaisGame,
                type: RouteEnum.TarotCongolais
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