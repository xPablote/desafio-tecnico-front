
export interface Address {
  calle: string;
  comuna: string;
  region: string;
}

export interface Person {
  rut: string;
  nombre: string;
  apellido: string;
  fechaNacimiento: string; // Formato: "dd-MM-yyyy"
  direccion: Address;
}