import { newApi } from "@repositories/chatgpt";
export default async function handler(req, res) {
  const { itemName } = req.query;
  if (!validate(itemName)) {
    res.status(400).json({ message: "Bad Request" });
    return;
  }
  const api = newApi();
  const gptRes = await api.sendMessage(message(itemName));
  console.log({ itemName, gptRes: gptRes.text });
  res.status(200).json({ price: fetchPrice(gptRes.text) });
}

function validate(itemName) {
  if (!itemName) return false;
  if (itemName.trim() === "") return false;
  if (itemName.length > 100) return false;
  return true;
}
function fetchPrice(text) {
  const regex = /bjN5\{(\d+)\}bjN5/;
  const match = text.match(regex);
  if (match) {
    return match[1];
  } else {
    return 999999999999;
  }
}
function message(itemName) {
  return `
You are a shopkeeper in a game. Please attach a price to the tool name that I will enter from now on. No answers other than the format are necessary.
[Format]
bjN5{price}bjN5
example: bjN5{100}bjN5
[Reference Information]
Cypress Stick 10
Bamboo Spear 50
Sharp Bone 70
Fruit Knife 50
Oak Cane 130
Large Hammer 220
Stone Fang 240
Bronze Knife 150
Copper Sword 270
Boomerang 420
Thorn Whip 350
Iron Claws 550
Stone Axe 700
Iron Cane 850
Poison Knife 900
Blade Boomerang 1500
Chain Sickle 900
Saw Sword 1200
Chain Cross 1200
Large Sledgehammer 1800
Steel Sword 2000
Steel Fang 2000
Snake Sword 3900
Battle Axe 4000
Sword of Destruction 4400
Morning Star 3000
Sword of Sleep 6300
Staff of Power 2500
Flame Boomerang 13000
War Hammer 6500
Flame Claw 4700
Steel Whip 7400
Staff of Revival 45000
Sword of Temptation 9800
Ice Blade 9000
Zombie Killer 11500
Fairy Sword 7700
Thunder Spear 13500
Dragon Killer 15000
Sword of Sharpness 3300
Demon Spear 25000
Snowstorm Sword 21000
Big Crossbow 37000
Destruction Iron Ball 50000
Starfall Bracelet 6500
Megante Bracelet 500
Elf's Charm 3000
Healing Herb 8
Antidote Herb 10
Holy Water 20
Chimera Wing 25
Full Moon Herb 30
Prayer Ring 2500
Magic Water 120
Smell Pouch 80
Monster Bait 200
Bomb Stone 450
One-Shot Fight 600
Angel's Bell 500
Life Stone 300
Book of Evil 3000
Traveler's Map 1000
Monster Box 1000
Leather Hat 65
Pointed Hat 70
Wooden Hat 120
Shell Hat 150
Hairband 150
Hide Hood 400
Silver Hairpin 450
Iron Helmet 1100
Silk Hat 2000
Iron Mask 3500
Wind Hat 5000
Intelligence Helmet 13000
Great Helm 20000
Shield of Destruction 4200
Pot Lid 40
Leather Shield 70
Scale Shield 180
Flower Parasol 1000
Bronze Shield 370
Iron Shield 720
Magic Shield 3400
Dragon Shield 7100
Wind Shield 4700
Fire Shield 17000
Power Shield 25000
Mirror Shield 33000
Plain Cloth 25
Cloth Clothes 30
Traveler's Clothes 70
Silk Apron 110
Leather Armor 180
Leather Loincloth 220
Scale Armor 350
Stecko Pants 10
Leather Dress 380
Hide Cape 550
Chain Mail 500
Dancer's Clothes 1300
Slime Clothes 330
Bronze Armor 700
Iron Breastplate 1000
Iron Armor 1200
Dodging Clothes 3000
Steel Armor 2300
Turtle Shell 2500
Lace Bustier 5500
Sorcerer's Robe 6800
Silver Breastplate 5000
Silver Mail 4800
Blood Mail 6500
Light Dress 8800
Dragon Mail 7500
Sage's Robe 12000
Water Robe 14800
Dark Robe 16000
Magic Armor 12000
Silk Bustier 18800
Fire Armor 15000
Angel's Leotard 21000
Mirror Armor 30000
[Tool Name]
${itemName}
`;
}

// function message(itemName) {
//   return `
//   あなたはゲームの道具屋です。
//   今から入力する道具名に値段をつけてください。フォーマット以外の回答は不要です。
// [フォーマット]
// 100G
// [参考情報]
// どくばり(急所)	2900
// ひのきのぼう	10
// たけのやり	50
// とがったホネ	70
// くだものナイフ	50
// こんぼう	60
// かしのつえ	130
// おおきづち	220
// いしのキバ	240
// ブロンズナイフ	150
// どうのつるぎ	270
// ブーメラン(全体)	420
// いばらのムチ(グループ)	350
// てつのツメ	550
// いしのオノ	700
// てつのつえ	850
// どくがのナイフ(マヒ攻撃)	900
// やいばのブーメラン(全体)	1500
// くさりがま	900
// のこぎりがたな	1200
// チェーンクロス(グループ)	1200
// おおかなづち	1800
// はがねのつるぎ	2000
// はがねのキバ	2000
// スネークソード	3900
// バトルアックス	4000
// はじゃのつるぎ(ギラ)	4400
// モーニングスター(グループ)	3000
// まどろみのけん(眠り攻撃)	6300
// りりょくのつえ	2500
// ほのおのブーメラン(全体)	13000
// ウォーハンマー	6500
// ほのおのツメ(ギラ)	4700
// はがねのムチ(グループ)	7400
// ふっかつのつえ(ザオラル)	45000
// ゆうわくのけん(混乱攻撃)	9800
// こおりのやいば(バギマ)	9000
// ゾンビキラー	11500
// ようせいのけん(スカラ)	7700
// らいじんのヤリ(稲妻)	13500
// ドラゴンキラー	15000
// もろはのつるぎ	3300
// デーモンスピア(急所)	25000
// ふぶきのつるぎ	21000
// ビッグボウガン	37000
// はかいのてっきゅう(全体)	50000
// ほしふるうでわ	6500
// メガンテのうでわ	500
// エルフのおまもり	3000
// やくそう	8
// どくけしそう	10
// せいすい	20
// キメラのつばさ	25
// まんげつそう	30
// いのりのゆびわ	2500
// まほうのせいすい	120
// においぶくろ	80
// まもののエサ	200
// ばくだんいし	450
// ファイトいっぱつ	600
// てんしのすず	500
// いのちのいし	300
// イブールのほん	3000
// たびびとのちず （SFC版のみ）	1000
// モンスターボックス （PS2版以降）	1000
// かわのぼうし	65
// とんがりぼうし	70
// きのぼうし	120
// かいがらほうし	150
// ヘアバンド	150
// けがわのフード	400
// ぎんのかみかざり	450
// てつかぶと	1100
// シルクハット	2000
// てっかめん	3500
// かぜのぼうし	5000
// ちりょくのかぶと	13000
// グレートヘルム	20000
// はめつのたて	4200
// おなべのふた	40
// かわのたて	70
// うろこのたて	180
// フラワーパラソル	1000
// せいどうのたて	370
// てつのたて	720
// マジックシールド	3400
// ドラゴンシールド	7100
// ふうじんのたて	4700
// ほのおのたて	17000
// ちからのたて	25000
// みかがみのたて	33000
// ただのぬのきれ	25
// ぬののふく	30
// たびびとのふく	70
// きぬのエプロン	110
// かわのよろい	180
// かわのこしまき	220
// うろこのよろい	350
// ステテコパンツ	10
// かわのドレス	380
// けがわのマント	550
// くさりかたびら	500
// おどりこのふく	1300
// スライムのふく	330
// せいどうのよろい	700
// てつのむねあて	1000
// てつのよろい	1200
// みかわしのふく	3000
// はがねのよろい	2300
// カメのこうら	2500
// レースのビスチェ	5500
// まどうしのローブ	6800
// ぎんのむねあて	5000
// シルバーメイル	4800
// ブラッドメイル	6500
// ひかりのドレス	8800
// ドラゴンメイル	7500
// けんじゃのローブ	12000
// みずのはごろも	14800
// ダークローブ	16000
// まほうのよろい	12000
// シルクのビスチェ	18800
// ほのおのよろい	15000
// てんしのレオタード	21000
// ミラーアーマー	30000
// [道具名]
// ${itemName}
// `;
// }
