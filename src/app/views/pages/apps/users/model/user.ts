export interface Users{
    id: string;
    documento: string;
    nombres: string;
    apellidos: string;
    telefono: string;
    email: string;
    password: string;
    confirm_password: string;
    rol: string;
    is_active: string;
    created_at: string;

}

export interface Roles{
    id_rol: string;
    rol: string;
}

export interface Modulos{
    id_modulo: string;
    rol: string;
    modulo: string;
    habilitado: boolean;
}

export interface Permisos{
    id : string;
    documento : string;
    id_rol : string;
    id_modulo : string;
    asignar : string;
    guardar : string;
    actualizar : string;
    eliminar : string;
}