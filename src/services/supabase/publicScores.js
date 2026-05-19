import { supabase } from './client';

export async function getPublicLeaguesWithScores() {
  const { data: leagues, error: leaguesError } = await supabase
    .from('leagues')
    .select('*')
    .eq('is_active', true)
    .order('day_of_week', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true });

  if (leaguesError) {
    throw new Error(leaguesError.message);
  }

  if (!leagues || leagues.length === 0) {
    return [];
  }

  const leagueIds = leagues.map((league) => league.id);

  const { data: weeks, error: weeksError } = await supabase
    .from('league_weeks')
    .select('*')
    .in('league_id', leagueIds)
    .order('week_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (weeksError) {
    throw new Error(weeksError.message);
  }

  const latestWeekByLeague = new Map();

  for (const week of weeks || []) {
    if (!latestWeekByLeague.has(week.league_id)) {
      latestWeekByLeague.set(week.league_id, week);
    }
  }

  const latestWeeks = Array.from(latestWeekByLeague.values());

  if (latestWeeks.length === 0) {
    return leagues.map((league) => ({
      ...league,
      latestWeek: null,
      playerScores: [],
    }));
  }

  const leagueWeekIds = latestWeeks.map((week) => week.id);

  const { data: playerScores, error: playerScoresError } = await supabase
    .from('player_scores')
    .select('*')
    .in('league_week_id', leagueWeekIds)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (playerScoresError) {
    throw new Error(playerScoresError.message);
  }

  return leagues.map((league) => {
    const latestWeek = latestWeekByLeague.get(league.id) || null;

    return {
      ...league,
      latestWeek,
      playerScores: latestWeek
        ? (playerScores || []).filter(
            (score) => score.league_week_id === latestWeek.id
          )
        : [],
    };
  });
}