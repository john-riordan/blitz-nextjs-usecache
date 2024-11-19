import { unstable_cacheLife as cacheLife } from 'next/cache';
import { Suspense } from 'react';

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
  const response = await fetch(
    `https://league-v2.iesdev.com/lol/match/${matchid}`
  );
  const data = await response.json();
  return data;
}

async function Match({ matchid }: { matchid: string }) {
  const match = await getMatch(matchid);
  return <div>Duration: {match.info.gameDuration}</div>;
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
        <Suspense key={matchid} fallback={<div>Loading Match...</div>}>
          <Match matchid={matchid} />
        </Suspense>
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
      <Suspense fallback={<div>Loading Matchlist...</div>}>
        <MatchList region={region} riotid={riotid} />
      </Suspense>
    </div>
  );
}
