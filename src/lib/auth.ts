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

                // Basic User Upsert without Role Logic (Roles handled in JWT)
                await prisma.user.upsert({
                    where: { email: user.email! },
                    update: { discordId: discordId },
                    create: {
                        email: user.email!,
                        name: user.name,
                        discordId: discordId,
                        role: "USER",
                        status: "ACTIVE"
                    }
                });
            }
            return true;
        },
        async jwt({ token, user, account, profile }) {
            // Initial sign in
            if (user && account && account.provider === "discord") {
                const discordId = (profile as any)?.id;
                token.id = user.id;
                token.role = user.role;
                token.discordId = discordId;

                // Fetch Discord Roles HERE to ensure they are in the token
                try {
                    const guildId = process.env.DISCORD_GUILD_ID;
                    const botToken = process.env.DISCORD_BOT_TOKEN;

                    if (guildId && botToken && discordId) {
                        const response = await axios.get(
                            `https://discord.com/api/guilds/${guildId}/members/${discordId}`,
                            { headers: { Authorization: `Bot ${botToken}` } }
                        );
                        const roles = response.data.roles as string[];
                        token.discordRoles = roles;

                        // Update User Role in DB if Admin
                        const discordAdminRoleId = process.env.DISCORD_ADMIN_ROLE_ID;
                        if (discordAdminRoleId && roles.includes(discordAdminRoleId)) {
                            token.role = "ADMIN";
                            // Async update to DB
                            prisma.user.update({
                                where: { id: user.id },
                                data: { role: "ADMIN" }
                            }).catch(err => console.error("Failed to sync admin role", err));
                        }
                    }
                } catch (error) {
                    console.error("[Auth] JWT Role Fetch Error:", error);
                    token.discordRoles = [];
                }
            } else if (user) {
                // Non-discord login or subsequent token updates
                token.id = user.id
                token.role = user.role
            }

            // On subsequent calls, token.discordRoles should already be there. 
            // If we want to refresh roles on every session check, we could do it here too, 
            // but for performance, let's trust the token for the session duration (1 hour).

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
