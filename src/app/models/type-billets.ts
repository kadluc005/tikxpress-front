export interface TypeBillets {
    id: number;

    libelle: string;

    prix: number;

    privileges: string;

    quantite: number;

    event: Event;

    is_active: boolean;

    is_visible: boolean;

    created_at: Date;

    updated_at: Date;
}

export interface CreateTypeBilletDto {

    libelle: string;
    prix: number;
    privileges: string;
    quantite: number;
    eventId: number;
}

export interface UpdateTypeBilletDto {
    libelle?: string;
    prix?: number;
    privileges?: string;
    quantite?: number;
    eventId: number;
    updated_at?: Date;
    

}

export interface Billet {
    id: number;
    code: string;
    estUtilise: boolean;
    type: {
        libelle: string;
        prix: number;
    };
}

export interface CreateBilletDto {
    type: number; 
    commande: number;
}

