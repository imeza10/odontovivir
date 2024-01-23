export interface RequestResultSMA {
    success: string
    message: string
    users: User[]
  }
  
  export interface User {
    document: string;
    name: string;
    last_name: string;
    program: string;
    email: string;
    type: string;
    state: string;
    stratum: string;
    rh: string;
    imagen:string;
    success: string;
    encontrados: string;
    message: string;
  }