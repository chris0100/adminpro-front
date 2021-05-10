export class Usuario {

  constructor(
    public id: string,
    public nombre: string,
    public email: string,
    public password: string,
    public role: string[],
    public img?: string,
    public google?: boolean
  ) {
  }
}



