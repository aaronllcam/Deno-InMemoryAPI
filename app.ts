import { Application, Router, RouterContext, helpers } from "https://deno.land/x/oak@v6.3.1/mod.ts";

const app = new Application();
const userRouter = new Router();

/* Interface user */

interface IUser {
    _id: number,
    username: string,
    pass: string
}

let Users:Array<IUser> = [
    {
        _id: 1,
        username: "Aaron",
        pass: "1234"
    },
    {
        _id: 2,
        username: "Aaron2",
        pass: "1234"
    },
    {
        _id: 3,
        username: "Aaron3",
        pass: "1234"
    }
]

/* Vamos a crear algun middleware */

/* este middeleware nos incluye en la cabecera la propiedad X-Response-Time con el tiempo que pasa desde la llamada hasta tener los datos */
app.use( async (context, next) => {

    const { request, response } = context;
    const start = Date.now();
    await next();
    const timePassed = Date.now() - start;
    response.headers.set("X-Response-Time", `${timePassed}ms`);
})
/* Vamos a crear un pqueño logger */

app.use( async (context, next) => {

    const { request, response } = context;
    await next();
    let rt = response.headers.get("X-Response-Time");
    let dataLog = `${request.method} sobre url: ${request.url.pathname} en ${rt}`;
    console.log(dataLog);
})

/* End middlewares */

userRouter.get("/users", (context: RouterContext) => {
    const { response, request } = context;
    response.status = 200;
    response.body = {
        status: true,
        msg: "Get users /users",
        data: Users
    }
});
userRouter.get("/users/:username", (context: RouterContext) => {
    const { params, response } = context;
    const user: IUser | undefined = Users.filter(user => user.username == params.username)[0];
    const data: any = user ? user : `No existe el usuario con nombre ${params.username}`;

    response.status = user ? 200 : 404;
    response.body = {
        status: true,
        msg: `Recurso que actua sobre get .../users/${params.username}`,
        data: data
    }
});
userRouter.post("/users", async (context: RouterContext) => {
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
});
userRouter.put("/users/:username", async (context: RouterContext) => {
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

    Users = [...Users.filter( (usr:IUser) => usr.username !== username ), userBody];

    response.status = 200;
    response.body = {
        status: true,
        msg: `${username} actualizado con éxito`
    }
});
userRouter.delete("/users/:id", (context: RouterContext) => {
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
    
    Users = [...Users.filter( (usr:IUser) => usr._id !== _id )];
    
    response.status = 200;
    response.body = {
        status: false,
        msg: `El user con _id ${params.id} borrado con éxito`
    }
});

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

await app.listen({ port: 8000 });