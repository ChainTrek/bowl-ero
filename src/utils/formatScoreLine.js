export function formatScoreLine(score) {
  const name = score.player_name?.trim() || 'Unknown Player';
  const average =
    score.average !== null && score.average !== undefined && score.average !== ''
      ? `(${score.average})`
      : '';

  const games = [score.game1, score.game2, score.game3]
    .filter((game) => game !== null && game !== undefined && game !== '')
    .join(', ');

  const series =
    score.series !== null && score.series !== undefined && score.series !== ''
      ? ` - ${score.series}`
      : '';

  return `${name}${average}${games ? ` ${games}` : ''}${series}`;
}