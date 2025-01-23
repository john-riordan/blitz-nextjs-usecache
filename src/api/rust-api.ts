import { unstable_cacheLife as cacheLife } from "next/cache";

// function wait(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export async function getProfile(region: string, riotid: string = "") {
  "use cache";
  cacheLife("days");

  if (!region || !riotid) {
    return null;
  }

  const [gameName, tagline] = riotid.split("-");
  const response = await fetch(
    `https://league-v2.iesdev.com/riot_account/lol/${region}/${gameName}/${tagline}`
  );
  const data = await response.json();
  return data;
}

export async function getMatchList(region: string, riotid: string) {
  // Intentionally commenting out to show how caching works
  // "use cache";
  // cacheLife("minutes");
  // await new Promise((resolve) => setTimeout(resolve, 5000));

  const [gameName, tagline] = riotid.split("-");

  const response = await fetch(
    `https://league-v2.iesdev.com/lol/match_list/${region}/${gameName}/${tagline}`
  );
  const data = await response.json();
  return data;
}

export async function getMatch(matchid: string) {
  "use cache";
  cacheLife("max");

  const response = await fetch(
    `https://league-v2.iesdev.com/lol/match/${matchid}`
  );
  const data = await response.json();
  return data;
}
