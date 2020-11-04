import { Application } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import logger from './Middlewares/logger.ts';
import headerTime from './Middlewares/header-time.ts';
import { userRouter } from './Routes/UserRoutes.ts';
import notFound from './Middlewares/notFound.ts';
import errorHandler from './Middlewares/errorHandler.ts';


const app = new Application();

app.use( headerTime );
app.use( logger );
app.use( errorHandler );

app.use(userRouter.routes());
app.use(userRouter.allowedMethods());

app.use( notFound );


await app.listen({ port: 8000 });