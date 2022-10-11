import axios from "axios";

const RX_ISDIGIT = /^\d+$/;

export const is_digit = (input: string) => !!input.match(RX_ISDIGIT);

export const requestNewToken = async (refresh_token: string) => {
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refresh_token);

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
            "utf8"
          ).toString("base64")}`,
        },
      }
    );

    const { access_token, expires_in } = response.data;

    return { access_token, expires: Date.now() + expires_in * 1000 };
  } catch {
    return false;
  }
};

export const unbigify = (input: { [key: string]: any }) => {
  // Loop over all the keys in the object, convert any BigInts to numbers.
  // If the key is an object, recurse.

  const output: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "bigint") {
      output[key] = Number(value);
    } else if (typeof value === "object") {
      output[key] = unbigify(value);
    } else {
      output[key] = value;
    }
  }

  return output;
};
