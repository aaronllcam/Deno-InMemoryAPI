import { Router} from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { getUsers, getUser, insertUser, updateUser, deleteUser} from '../Controllers/UsersController.ts';


const userRouter = new Router();


userRouter.get("/users", getUsers);
userRouter.get("/users/:username", getUser);
userRouter.post("/users", insertUser);
userRouter.put("/users/:username", updateUser);
userRouter.delete("/users/:id", deleteUser);

export { userRouter }
