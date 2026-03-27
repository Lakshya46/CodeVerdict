
import { createAuthClient} from "better-auth/react";


export const { signIn , useSession , signOut } = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL ,

})