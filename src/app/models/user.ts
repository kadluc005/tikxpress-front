export interface User {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: Auth;
}

export interface RegisterDto {
  email: string;
  nom: string;
  prenom: string;
  nomEntreprise?: string;
  tel: string;
  password: string;
}

export interface Auth {
  id: number;

  email: string;

  nom: string;

  prenom: string;

  tel: string;

  nomEntreprise?: string;

  password?: string;

  type?: string;

  is_active?: boolean;

  is_visible?: boolean;

  created_at?: Date;

  updated_at?: Date;
}
