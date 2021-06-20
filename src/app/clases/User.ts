export class User {
    username: string;
    email: string;
    password: string;
    id: number;
  
    constructor(username: string, email?:string, password?: string, id?: number) {
  
      this.username = username;
      this.password = password;
      this.email = email;
      this.id = id;
    }
  }
  