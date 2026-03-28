/**
 * Authentication configuration using Better Auth.
 *
 * This file sets up the authentication system for Code Horse, including:
 * - PostgreSQL adapter (via Prisma) for storing user data.
 * - GitHub OAuth provider for user login.
 * - Integration with Polar.sh for subscription management.
 * - Webhook handlers for syncing Polar subscription events to the local database.
 *
 * @module lib/auth
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
	polar,
	checkout,
	portal,
	usage,
	webhooks,
} from "@polar-sh/better-auth";


import prisma from "./db";
import { polarClient } from "@/modules/payment/config/polar";
import {
	SubscriptionTier,
	updatePolarCustomerId,
	updateUserTier,
} from "@/modules/payment/lib/subscription";

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
	throw new Error("Missing required GitHub OAuth environment variables");
}


export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL!,
  ],

  cookies: {
    secure: true,
    sameSite: "none",
    domain: ".onrender.com", 
  },
  redirects: {
  afterLogin: "/dashboard",
},

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ["repo"],
    },
  },

  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "9d8fa7aa-0cf4-4668-804e-25145aad5d7f",
              slug: "codeverdict",
            },
          ],
          successUrl:
            process.env.POLAR_SUCCESS_URL ||
            "/dashboard/subscriptions?success=true",
          authenticatedUsersOnly: true,
        }),
        portal({
          returnUrl:
            process.env.NEXT_PUBLIC_APP_URL ||
            "http://localhost:3000/dashboard",
        }),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionActive: async (payload: any) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: { polarCustomerId: customerId },
            });

            if (user) {
              await updateUserTier(
                user.id,
                "PRO",
                "ACTIVE",
                payload.data.id
              );
            }
          },
          onSubscriptionCanceled: async (payload: any) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: { polarCustomerId: customerId },
            });

            if (user) {
              await updateUserTier(
                user.id,
                user.subscriptionsStatus as SubscriptionTier,
                "CANCELLED"
              );
            }
          },
          onSubscriptionRevoked: async (payload: any) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: { polarCustomerId: customerId },
            });

            if (user) {
              await updateUserTier(user.id, "FREE", "EXPIRED");
            }
          },
          onOrderPaid: async () => {},
          onCustomerCreated: async (payload: any) => {
            const user = await prisma.user.findUnique({
              where: { email: payload.data.email },
            });

            if (user) {
              await updatePolarCustomerId(user.id, payload.data.id);
            }
          },
        }),
      ],
    }),
  ],
});

