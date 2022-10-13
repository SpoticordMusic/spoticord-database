import { REST } from "@discordjs/rest";

export * from "discord-api-types/v10";

/**
 * Helper function to create a Discord REST client.
 * This makes it easier to change the version in the future.
 *
 * @param token The token to use
 * @returns A discord rest client
 */
export const getClient = (token?: string) => {
  const client = new REST({ version: "10" });

  return token ? client.setToken(token) : client;
};
