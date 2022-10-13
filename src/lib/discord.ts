import { REST } from "@discordjs/rest";

export * from "discord-api-types/v10";
export const getClient = (token?: string) => {
  const client = new REST({ version: "10" });

  return token ? client.setToken(token) : client;
};
