import { Route, IRoute, RouteEnum } from "./Route";
import { observable } from "mobx";

import Home from '../Pages/Home/Home'
import GameLobby from '../Pages/Lobby/Lobby'

export class Router {
    public routes: Route[]
    @observable public currentRoute: Route;
    @observable public history: any

    constructor(games?: any[]){
        let routeDefs: IRoute[] = [
            {
                path: '/',
                name: 'home',
                component: Home,
            },
            {
                path: '/lobby',
                name: 'lobby',
                component: GameLobby,
            }
        ]
        this.routes = [].concat(routeDefs, games).map(iRoute => new Route(iRoute))
        this.switchRoute(this.routes[0].name)
        // this.switchRoute('/?test=ab')
        // console.log('getAllParams', this.getAllParams())
    }

    switchRoute(gameIdentifier: string){
        let route = this.routes.find(r => r.name === gameIdentifier)
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