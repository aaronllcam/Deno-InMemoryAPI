export default async (context: any) => {
    const {response} = context;

    response.status = 404;
    response.body = {
        status: false,
        msg: "Recurso no encontrado"
    }

}