import { Route, IRoute } from "./Route";
import { observable } from "mobx";

import Home from '../Pages/Home'
import { RouteEnum } from "../../../../common/LimiteLimite";
import { isString } from "util";

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
        let match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);

        let urlParams = {};
        while (match = search.exec(query)){
            urlParams[decode(match[1])] = decode(match[2]);
        }
        return urlParams
    }

}