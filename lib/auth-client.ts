import { polarClient } from "@polar-sh/better-auth";
import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const { signIn, signUp, useSession, signOut, customer, checkout } =
	createAuthClient({
		baseURL,
		plugins: [polarClient()],
	});