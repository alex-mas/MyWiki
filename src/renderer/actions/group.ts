import { ActionWithPayload, ACreator } from "../../utils/typeUtils";
import { WikiMetadata } from "../store/reducers/wikis";

export const LOAD_GROUP = 'LOAD_GROUP';
export const DELETE_GROUP = 'DELETE_GROUP';
export const SAVE_GROUP = 'SAVE_GROUP';
export const CREATE_GROUP = 'CREATE_GROUP';
export const SET_GROUP_METADATA = 'SET_GROUP_METADATA';




export interface Group {
    name: string,
    tags: string[]
}



export type GroupAction = ActionWithPayload<{
    group: Group,
    wiki: WikiMetadata
}>

export type GroupACreator = ACreator<[Group, WikiMetadata],GroupAction>;

