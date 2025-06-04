import { Billet } from "./type-billets";

export interface Commandes {
    id?: number;
    date: Date;
    prix_total: number;
    billets: Billet[];
}


export interface UserCommands {
    id: number;
    date: Date;
    prix_total: number;
    utilisateur: {
        id: number,
        email: string,
        nom: string,
        prenom: string,
        nomEntreprise?: string,
        tel: string,
    }
    billets: Billet[],
}