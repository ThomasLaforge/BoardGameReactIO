// import {Store} from '../modules/Store'
// import { UIStore } from "../modules/Stores/UIStore";
// import { Socket } from '../../../node_modules/@types/socket.io';
// import {History} from '../modules/History'

export interface InjectedStores {
    // store?: Store
}

export interface DefaultProps {
    // socket: Socket
    // store?: Store
}

export const injector = (injectContent: InjectedStores) : DefaultProps => ({
    // solo: injectContent.store.solo as SoloGame,
    // map: injectContent.store.map as WelcomeMap
    // store: injectContent.store
})