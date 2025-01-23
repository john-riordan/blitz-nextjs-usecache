import { unstable_cacheLife as cacheLife } from "next/cache";

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
  "use cache";
  cacheLife("minutes");

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
