import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import DiscordProvider from "next-auth/providers/discord"
import axios from "axios"

const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://")

export const authOptions: NextAuthOptions = {
    useSecureCookies,
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60, // 1 hour
    },
    pages: {
        signIn: "/?login=true",
        error: "/unauthorized", // Redirect to unauthorized on login errors
    },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: { scope: 'identify email guilds' } },
            allowDangerousEmailAccountLinking: true,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "discord") {
                const discordId = (profile as any)?.id;
                const guildId = process.env.DISCORD_GUILD_ID;
                const botToken = process.env.DISCORD_BOT_TOKEN;
                // Optional: A specific role required just to ENTER the dashboard
                const requiredEntryRoleId = process.env.DISCORD_ROLE_ID;

                if (!guildId || !botToken) {
                    console.error("Missing Discord configuration environment variables");
                    return "/unauthorized";
                }

                try {
                    // Fetch member info from Discord API using Bot Token
                    const response = await axios.get(
                        `https://discord.com/api/guilds/${guildId}/members/${discordId}`,
                        {
                            headers: {
                                Authorization: `Bot ${botToken}`,
                            },
                        }
                    );

                    const member = response.data;
                    const roles = member.roles as string[];

                    // 1. Entry Check: Does the user have the minimum required role to log in?
                    // If DISCORD_ROLE_ID is not set, we allow everyone who is in the server.
                    if (requiredEntryRoleId && !roles.includes(requiredEntryRoleId)) {
                        return "/unauthorized";
                    }

                    // 2. Attach roles to the user object temporarily so it can be picked up by JWT callback
                    (user as any).discordRoles = roles;
                    (user as any).discordId = discordId;

                    // 3. Determine Website Role based on Discord Roles
                    // Define which Discord Role ID should become an ADMIN on the website
                    const discordAdminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
                    const isDiscordAdmin = discordAdminRoleId && roles.includes(discordAdminRoleId);
                    const websiteRole = isDiscordAdmin ? "ADMIN" : "USER";

                    // 4. Sync User in DB
                    const dbUser = await prisma.user.upsert({
                        where: { email: user.email! },
                        update: {
                            discordId: discordId,
                            // Only update role if it's currently USER to avoid downgrading superadmins
                            role: isDiscordAdmin ? "ADMIN" : undefined
                        },
                        create: {
                            email: user.email!,
                            name: user.name,
                            discordId: discordId,
                            role: websiteRole as any,
                            status: "ACTIVE"
                        }
                    });

                    // Attach the actual DB role to the user object for the JWT callback
                    user.role = dbUser.role;

                    return true;
                } catch (error) {
                    console.error("Discord Role Check Error");
                    return "/unauthorized";
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.isTrial = user.isTrial
                token.trialEndsAt = user.trialEndsAt
                token.discordId = user.discordId
                token.discordRoles = (user as any).discordRoles
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role
                session.user.id = token.id
                session.user.isTrial = token.isTrial as boolean
                session.user.trialEndsAt = token.trialEndsAt as Date | undefined
                session.user.discordId = token.discordId as string | undefined
                session.user.discordRoles = token.discordRoles as string[] | undefined
            }
            return session
        }
    }
}
