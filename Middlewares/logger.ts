export default async (context: any, next: any) => {

    const { request, response } = context;
    await next();
    let rt = response.headers.get("X-Response-Time");
    let dataLog = `${request.method} sobre url: ${request.url.pathname} en ${rt}`;
    console.log(dataLog);
}