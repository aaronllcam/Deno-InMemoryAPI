import { RouterContext, helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { IUser, Users } from '../Models/User.ts';


export const getUsers = (context: RouterContext) => {
    const { response, request } = context;
    response.status = 200;
    response.body = {
        status: true,
        msg: "Get users /users",
        data: Users
    }
};

export const getUser = (context: RouterContext) => {
    const { params, response } = context;
    const user: IUser | undefined = Users.filter(user => user.username == params.username)[0];
    const data: any = user ? user : `No existe el usuario con nombre ${params.username}`;

    response.status = user ? 200 : 404;
    response.body = {
        status: true,
        msg: `Recurso que actua sobre get .../users/${params.username}`,
        data: data
    }
}

export const insertUser = async (context: RouterContext) => {
    const { request, response } = context;
    if(!request.hasBody){
        response.status = 400;
        response.body = {
            status: false,
            msg: `Cuerpo de la petición vacio, No se ha podido insertar`
        }
        return;
    }
    
    const result = await request.body({type: "json"});
    const userBody = await result.value;

    Users.push(userBody);

    response.status = 201;
    response.body = {
        status: true,
        msg: `Usuario insertado`,
        data: userBody
    }
}

export const updateUser = async (context: RouterContext) => {
    const { request, response } = context;
    const { username } = helpers.getQuery(context, {mergeParams: true});

    if(!request.hasBody){
        response.status = 400;
        response.body = {
            status: false,
            msg: `Cuerpo de la petición vacio, No se ha podido insertar`
        }
        return;
    }
    let user: IUser | undefined = Users.filter(user => user.username == username)[0];
    if(!user){
        response.status = 404;
        response.body = {
            status: false,
            msg: `El usuario ${username} no existe`
        }
        return;
    }
    //Realizamos la actualizacion si existe!!


    const result = await request.body({type: "json"});
    const userBody: IUser = await result.value;

    // Users = [...Users.filter( (usr:IUser) => usr.username !== username ), userBody];
    const filteredUsers:Array<IUser> = Users.filter( (usr:IUser) => usr.username !== username );
    Users.splice(0, Users.length);
    Users.push(...filteredUsers);
    Users.push(userBody);


    response.status = 200;
    response.body = {
        status: true,
        msg: `${username} actualizado con éxito`
    }
}

export const deleteUser = (context: RouterContext) => {
    const { params, response } = context;
    let _id: any;
    if(params.id !== undefined){
        _id = parseInt(params.id);
    }else{
        _id = undefined;
    } 

    const user = Users.filter( (usr:IUser) => usr._id == _id )[0];
    

    if(!user){
        response.status = 404;
        response.body = {
            status: false,
            msg: `User con _id = ${params.id} no encontrado`
        }
        return;
    }
    
    // Users = [...Users.filter( (usr:IUser) => usr._id !== _id )];
    const filteredUsers:Array<IUser> = Users.filter( (usr:IUser) => usr._id !== _id );
    Users.splice(0, Users.length);
    Users.push(...filteredUsers);
    
    response.status = 200;
    response.body = {
        status: false,
        msg: `El user con _id ${params.id} borrado con éxito`
    }
}