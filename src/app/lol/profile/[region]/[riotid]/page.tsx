import { unstable_cacheLife as cacheLife } from 'next/cache';

async function getProfile(region: string, riotid: string) {
  'use cache';
  cacheLife('days');

  const [gameName, tagline] = riotid.split('-');
  const response = await fetch(
    `https://league-v2.iesdev.com/riot_account/lol/${region}/${gameName}/${tagline}`
  );
  const data = await response.json();
  return data;
}

async function getMatchList(region: string, riotid: string) {
  'use cache';
  cacheLife('minutes');

  const [gameName, tagline] = riotid.split('-');

  const response = await fetch(
    `https://league-v2.iesdev.com/lol/match_list/${region}/${gameName}/${tagline}`
  );
  const data = await response.json();
  return data;
}

async function getMatch(matchid: string) {
  'use cache';
  cacheLife('max');

  const response = await fetch(
    `https://league-v2.iesdev.com/lol/match/${matchid}`
  );
  const data = await response.json();
  return data;
}

async function Match({ matchid }: { matchid: string }) {
  const match = await getMatch(matchid);
  return (
    <div>
      Id: {match.info.gameId} Duration: {match.info.gameDuration}
    </div>
  );
}

async function MatchList({
  region,
  riotid,
}: {
  region: string;
  riotid: string;
}) {
  const matchList = await getMatchList(region, riotid);
  return (
    <div>
      {matchList.slice(0, 10).map((matchid: string) => (
        <Match key={matchid} matchid={matchid} />
      ))}
    </div>
  );
}

export default async function Profile({
  params,
}: {
  params: Promise<{ region: string; riotid: string }>;
}) {
  const { region, riotid } = await params;
  const profile = await getProfile(region, riotid);

  return (
    <div>
      <h1>
        {profile.account.game_name}#{profile.account.tag_line}
      </h1>
      <MatchList region={region} riotid={riotid} />
    </div>
  );
}
