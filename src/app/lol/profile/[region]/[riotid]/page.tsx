import { Suspense } from "react";

import { getProfile, getMatchList, getMatch } from "@/api/rust-api";

async function Match({ matchid }: { matchid: string }) {
  const match = await getMatch(matchid);

  return (
    <div>
      Id: {match.info.gameId} Duration: {match.info.gameDuration}
    </div>
  );
}

async function MatchList({
  params,
}: {
  params: Promise<{ region: string; riotid: string }>;
}) {
  const { region = "", riotid = "" } = await params;
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

async function ProfileHeader({
  params,
}: {
  params: Promise<{ region: string; riotid: string }>;
}) {
  const { region = "", riotid = "" } = await params;
  const profile = await getProfile(region, riotid);

  return (
    <h1>
      {profile.account.game_name}#{profile.account.tag_line}
    </h1>
  );
}

export default async function Profile({
  params,
}: {
  params: Promise<{ region: string; riotid: string }>;
}) {
  return (
    <div>
      <Suspense fallback={<div>Loading Profile...</div>}>
        <ProfileHeader params={params} />
      </Suspense>
      <Suspense fallback={<div>Loading Matchlist...</div>}>
        <MatchList params={params} />
      </Suspense>
    </div>
  );
}
