export default async (context: any, next: any) => {
    
    try{
        await next();
    }catch (err){
        context.response.status = 500;
        context.response.body = {
            status: false,
            msg: err.message
        }
    }

}