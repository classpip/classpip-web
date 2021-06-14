export class User {
    username: string;
    email: string;
    password: string;
  
    constructor(username: string, password?: string, email?:string) {
  
      this.username = username;
      this.password = password;
      this.email = email;
    }
  }
  