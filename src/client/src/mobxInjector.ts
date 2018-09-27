import { Socket } from "socket.io";
import { UIStore } from "./Stores/UIStore";
import { Store } from "./Stores/Store";

// import {Store} from '../modules/Store'
// import { UIStore } from "../modules/Stores/UIStore";
// import { Socket } from '../../../node_modules/@types/socket.io';
// import {History} from '../modules/History'

export interface InjectedStores {
    store: Store,
}

export interface DefaultProps  {
    socket?: Socket,
    ui?: UIStore
}

export const injector = (injectContent: InjectedStores) : DefaultProps => ({
    ui: injectContent.store.uiStore as UIStore,
})