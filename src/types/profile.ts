export type ProfileCargo = "admin" | "vendedor";

export interface ProfileInfo {
  nome: string;
  email: string;
  cargo: ProfileCargo;
}
