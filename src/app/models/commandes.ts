import { Billet } from "./type-billets";

export interface Commandes {
    id?: number;
    date: Date;
    prix_total: number;
    billets: Billet[];
}


