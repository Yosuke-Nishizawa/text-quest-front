import { newApi } from "@repositories/chatgpt";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { player, enemy } = req.body;

  if (!player || !enemy) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const api = newApi();
  const gptRes = await api.sendMessage(message(player, enemy));
  console.log({ player, enemy, gptRes: gptRes.text });
  res.status(200).json(JSON.parse(gptRes.text));
}

function message(player, enemy) {
  return `
あなたはRPGゲームの戦闘システムです。
player, enemyの情報を使用して、戦いの模様を臨場感たっぷりにテキストで表現してください。
[player]
name: ${player.name}
items: ${player.items}
[enemy]
name: ${enemy.name}
items: ${enemy.items}
[フォーマット]
{
  "battleText": [
    ..., // 戦闘テキスト。臨場感たっぷりに。特殊な記号を入れないでください。
  ],
  "winner": ..., // player or enemy
  "gold": , // 数値。100以上
}
[注意事項]
- winner項目は必ずplayerかenemyにしてください。
- 回答はJSONのみでお願いします。
- テキストは最低10行以上でお願いします。
`;
}

// (以下は一例です)
// player: { name: '太郎', items: ['剣'] }
// enemy: { name: 'スライム', items: ['身体', '薬草'] }
// 出力
// {
//   "battleText": [
//     "太郎が剣で斬りかかるが、スライムは避けた。",
//     "スライムが太郎に身体で体当たりした。",
//     "スライムが薬草で回復。",
//     "太郎が剣で突き刺す。スライムを倒した。",
//     "太郎の勝利。100Gを獲得した。",
//   ],
//   "winner": "player",
//   "gold": 100,
// }
