import { Auth } from "./user";

export interface Event {

    id: number;
    
    nom: string;

    description: string;

    type: string;

    date_debut: Date;

    date_fin: Date;

    lieu: string;

    latitude: number;
    
    longitude: number;

    image_url: string;

    // organisateur: Auth;

    is_active: boolean;

    is_visible: boolean;
    
    created_at: Date;

    updated_at: Date;

}

export interface CreateEventDto {
    nom: string;

    description: string;

    type: string;

    date_debut: Date;

    date_fin: Date;

    lieu: string;

    latitude: number;
    
    longitude: number;

    image_url: string;
}

export interface UpdateEventDto {
    nom?: string;
    description?: string;
    type?: string;
    date_debut?: Date;
    date_fin?: Date;
    lieu?: string;
    image_url?: string;
    updated_at?: Date;
}
