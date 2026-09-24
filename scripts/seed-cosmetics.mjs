import { createClient } from "@supabase/supabase-js";

const authentic = "メーカー正規代理店との直契約による正規輸入品です。並行輸入ではありません。";

const products = [
  {
    name: "SK-II フェイシャル トリートメント セラム",
    price: 19900,
    stock: 8,
    description:
      "ピテラ配合のエイジングケア美容液。マイクロオイルビーズが弾ける濃密セラムと、フェイシャル トリートメント エッセンスをあわせたケアです。",
    image_url: "/products/skii-facial-treatment-serum.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Galactomyces Ferment Filtrate, Triethylhexanoin, Tocopheryl Acetate, Water",
    skin_concern_tags: ["エイジング", "ハリ", "ツヤ"],
    skin_type: "全肌質",
  },
  {
    name: "SK-II フェイシャル トリートメント ジェントル クレンザー",
    price: 9350,
    stock: 20,
    description:
      "ピテラ配合の洗顔料。きめ細かな泡で汚れをやさしく落とし、洗い上がりのつっぱりを抑えます。",
    image_url: "/products/skii-gentle-cleanser.png",
    category: "洗顔",
    origin: authentic,
    ingredients: "Galactomyces Ferment Filtrate, Glycerin, Stearic Acid, Water",
    skin_concern_tags: ["毛穴", "保湿"],
    skin_type: "全肌質",
  },
  {
    name: "SK-II R.N.A.パワー ラディカル ニュー エイジ",
    price: 24800,
    stock: 10,
    description:
      "R.N.A.パワーのエイジングケア。ラディカル ニュー エイジ クリームとエッセンスで、ハリと弾力のある肌印象へ。",
    image_url: "/products/skii-rna-power.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Galactomyces Ferment Filtrate, Glycerin, Squalane, Peony Extract",
    skin_concern_tags: ["エイジング", "ハリ", "乾燥"],
    skin_type: "普通肌〜乾燥肌",
  },
  {
    name: "SK-II フェイシャル トリートメント エッセンス",
    price: 24200,
    stock: 10,
    description:
      "ピテラ配合の導入美容液。通称「神仙水」。透明感とキメを整えるスキンケアの定番です。",
    image_url:
      "https://images.ctfassets.net/4qp6lhjn6atl/4iWwuzsKoSJS9qUd2JBKO0/7bc35d87fa9112e3a62f07aaecb5d17e/FTE_Product_Tile_PC.png?fm=webp&w=800&q=90",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Galactomyces Ferment Filtrate, Butylene Glycol, Pentylene Glycol, Water",
    skin_concern_tags: ["くすみ", "保湿", "キメ"],
    skin_type: "全肌質",
  },
  {
    name: "SK-II スキンパワー クリーム",
    price: 19800,
    stock: 8,
    description: "ハリとエイジングケア向けの濃密クリーム。日中・夜の仕上げに。",
    image_url: "/products/skii-skinpower-cream.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Galactomyces Ferment Filtrate, Squalane, Glycerin, Shea Butter",
    skin_concern_tags: ["エイジング", "ハリ", "乾燥"],
    skin_type: "普通肌〜乾燥肌",
  },
  {
    name: "SK-II フェイシャル トリートメント クリア ローション",
    price: 8500,
    stock: 14,
    description: "ふき取り化粧水。毛穴と古い角質をやさしくオフして後の美容液のなじみを高めます。",
    image_url: "/products/skii-clear-lotion.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Water, Galactomyces Ferment Filtrate, Hamamelis Virginiana Water",
    skin_concern_tags: ["毛穴", "くすみ"],
    skin_type: "全肌質",
  },
  {
    name: "SK-II フェイシャル トリートメント マスク",
    price: 2800,
    stock: 36,
    description: "ピテラをたっぷり含ませたシートマスク。スペシャルケアの1枚。",
    image_url: "/products/skii-treatment-mask.png",
    category: "マスク",
    origin: authentic,
    ingredients: "Galactomyces Ferment Filtrate, Niacinamide, Sodium Hyaluronate",
    skin_concern_tags: ["保湿", "くすみ"],
    skin_type: "全肌質",
  },
  {
    name: "資生堂 エリクシール ナイトクリーム",
    price: 6500,
    stock: 16,
    description: "夜用エイジングケアクリーム。睡眠中のうるおいとハリをサポートします。",
    image_url: "/products/shiseido-elixir-night-cream.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Water, Glycerin, Retinol alternative complex, Squalane, Ceramide",
    skin_concern_tags: ["エイジング", "乾燥", "ハリ"],
    skin_type: "乾燥肌",
  },
  {
    name: "資生堂 エリクシール アイクリーム",
    price: 5500,
    stock: 18,
    description: "目元の小じわ・乾燥が気になる方向けのアイクリーム。",
    image_url: "/products/shiseido-elixir-eye-cream.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Water, Glycerin, Caffeine, Hyaluronic Acid, Tocopherol",
    skin_concern_tags: ["シワ", "目元", "乾燥"],
    skin_type: "全肌質",
  },
  {
    name: "資生堂 口元リンクルクリーム",
    price: 4800,
    stock: 15,
    description: "口元の縦ジワ・乾燥を集中ケアするクリーム。",
    image_url: "/products/shiseido-wrinkle-cream.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Water, Shea Butter, Peptide, Glycerin, Dimethicone",
    skin_concern_tags: ["シワ", "乾燥"],
    skin_type: "乾燥肌",
  },
  {
    name: "資生堂 洗顔フォーム",
    price: 1800,
    stock: 28,
    description: "きめ細かい泡でやさしく洗う洗顔。朝晩の基本ケアに。",
    image_url: "/products/shiseido-cleansing-foam.png",
    category: "洗顔",
    origin: authentic,
    ingredients: "Water, Stearic Acid, Glycerin, Lauric Acid, Clay",
    skin_concern_tags: ["毛穴", "保湿"],
    skin_type: "全肌質",
  },
  {
    name: "資生堂 保湿シートマスク",
    price: 1280,
    stock: 40,
    description: "ヒアルロン酸配合のデイリー保湿マスク。",
    image_url: "/products/shiseido-moisture-mask.png",
    category: "マスク",
    origin: authentic,
    ingredients: "Water, Glycerin, Sodium Hyaluronate, Panthenol",
    skin_concern_tags: ["保湿", "乾燥"],
    skin_type: "乾燥肌",
  },
  {
    name: "資生堂 美白シートマスク",
    price: 1480,
    stock: 32,
    description: "ビタミンC誘導体配合。くすみが気になる日のスペシャルマスク。",
    image_url: "/products/shiseido-whitening-mask.png",
    category: "マスク",
    origin: authentic,
    ingredients: "Water, 3-O-Ethyl Ascorbic Acid, Niacinamide, Glycerin",
    skin_concern_tags: ["くすみ", "シミ"],
    skin_type: "全肌質",
  },
  {
    name: "KOSE 雪肌精 日焼け止め",
    price: 2200,
    stock: 26,
    description:
      "雪肌精 スキンケア UV ディフェンス エッセンス ミルク N。SPF50+/PA++++。日常の紫外線から肌を守るミルクタイプの日焼け止めです。",
    image_url: "/products/kose-sekkisei-sunscreen.png",
    category: "日焼け止め",
    origin: authentic,
    ingredients: "Zinc Oxide, Ethylhexyl Methoxycinnamate, Water, Glycerin",
    skin_concern_tags: ["紫外線", "くすみ"],
    skin_type: "全肌質",
  },
  {
    name: "KOSE 夜用保湿クリーム",
    price: 2800,
    stock: 20,
    description:
      "雪肌精 クリーム エクセレント。濃密な夜用クリームがうるおいを閉じ込め、ハリのある肌印象へ導きます。",
    image_url: "/products/kose-night-cream.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Water, Squalane, Ceramide NP, Glycerin, Tocopherol",
    skin_concern_tags: ["乾燥", "保湿"],
    skin_type: "普通肌〜乾燥肌",
  },
  {
    name: "KOSE スリーピングマスク",
    price: 1600,
    stock: 34,
    description:
      "KOSE クリアターン ホワイトマスク。コラーゲン・ヒアルロン酸・ビタミンC・トラネキサム酸のシートマスク4種。",
    image_url: "/products/kose-sleeping-mask.png",
    category: "マスク",
    origin: authentic,
    ingredients: "Water, Glycerin, Dimethicone, Hyaluronic Acid",
    skin_concern_tags: ["保湿", "乾燥"],
    skin_type: "全肌質",
  },
  {
    name: "KOSE インフィニティ ファンデーション",
    price: 6800,
    stock: 12,
    description:
      "KOSE インフィニティ パウダーファンデーション。カバー力と透明感を両立したケース入りファンデーションです。",
    image_url: "/products/kose-infinity-foundation.png",
    category: "メイク",
    origin: authentic,
    ingredients: "Talc, Mica, Titanium Dioxide, Silica, Dimethicone",
    skin_concern_tags: ["トーンアップ", "毛穴"],
    skin_type: "全肌質",
  },
  {
    name: "雪肌精 プレストパウダー",
    price: 3980,
    stock: 16,
    description:
      "雪肌精のプレストパウダー。雪の結晶モチーフのコンパクトで、明るい肌印象に仕上げます。",
    image_url: "/products/kose-sekkisei-powder.png",
    category: "メイク",
    origin: authentic,
    ingredients: "Talc, Mica, Silica, Titanium Dioxide, Zinc Oxide",
    skin_concern_tags: ["トーンアップ", "くすみ"],
    skin_type: "全肌質",
  },
  {
    name: "KOSE ソフティモ ディープクレンジングオイル",
    price: 1480,
    stock: 30,
    description:
      "ソフティモ ディープクレンジングオイル。角栓・毛穴の黒ずみをオフし、すすぎ落ちしやすい処方です。",
    image_url: "/products/kose-softymo-cleansing-oil.png",
    category: "洗顔",
    origin: authentic,
    ingredients: "Mineral Oil, Ethylhexyl Palmitate, PEG-20 Glyceryl Triisostearate",
    skin_concern_tags: ["毛穴", "くすみ"],
    skin_type: "全肌質",
  },
  {
    name: "カネボウ ミラノコレクション フェースパウダー 2026",
    price: 12000,
    stock: 6,
    description:
      "カネボウ ミラノコレクション 2026 フェースアップパウダー。Since 1897のレリーフコンパクト。透明感とやわらかい光をのせる数量限定パウダーです。",
    image_url: "/products/kanebo-milano-collection-2026.png",
    category: "メイク",
    origin: authentic,
    ingredients: "Talc, Mica, Silica, Titanium Dioxide, Fragrance",
    skin_concern_tags: ["トーンアップ", "毛穴"],
    skin_type: "全肌質",
  },
  {
    name: "カネボウ リフレッシング クリーミィ ウォッシュ",
    price: 3850,
    stock: 22,
    description:
      "KANEBO Refreshing Creamy Wash。濃密なクリームがきめ細かな泡になり、汚れをやさしくオフ。洗い上がりのつっぱりを抑える洗顔料です。",
    image_url: "/products/kanebo-refreshing-creamy-wash.png",
    category: "洗顔",
    origin: authentic,
    ingredients: "Water, Glycerin, Stearic Acid, Myristic Acid, Potassium Hydroxide",
    skin_concern_tags: ["毛穴", "保湿"],
    skin_type: "全肌質",
  },
  {
    name: "カネボウ オン スキン エッセンス＆クリーム",
    price: 14800,
    stock: 10,
    description:
      "KANEBO オン スキン エッセンス F / V とクリーム イン デイ SPF20・クリーム イン ナイト。導入美容液とうるおいクリームで日中〜夜のスキンケアを整えます。",
    image_url: "/products/kanebo-on-skin-essence.png",
    category: "スキンケア",
    origin: authentic,
    ingredients: "Water, Glycerin, Squalane, Dimethicone, Butylene Glycol",
    skin_concern_tags: ["保湿", "乾燥", "ハリ"],
    skin_type: "普通肌〜乾燥肌",
  },
  {
    name: "カネボウ KATE ホイップマットBB",
    price: 1650,
    stock: 28,
    description:
      "KATE TOKYO THE BASE ZERO ホイップマットBB。軽やかなホイップ質感で毛穴をぼかし、マットにカバーするBBクリームです。",
    image_url: "/products/kanebo-kate-whipped-matte-bb.jpg",
    category: "メイク",
    origin: authentic,
    ingredients: "Water, Titanium Dioxide, Dimethicone, Iron Oxides, Silica",
    skin_concern_tags: ["トーンアップ", "毛穴"],
    skin_type: "全肌質",
  },
  {
    name: "ちふれ 日焼け止めミルク SPF50+",
    price: 880,
    stock: 36,
    description:
      "ちふれ 日焼け止めミルク SPF50+/PA++++。毎日の紫外線から肌を守るミルクタイプ。白浮きしにくくなじみやすい日焼け止めです。",
    image_url: "/products/chifure-sunscreen-milk.png",
    category: "日焼け止め",
    origin: "国内メーカー正規品です。",
    ingredients: "Zinc Oxide, Ethylhexyl Methoxycinnamate, Water, Glycerin",
    skin_concern_tags: ["紫外線", "くすみ"],
    skin_type: "全肌質",
  },
  {
    name: "ちふれ 化粧落としリキッド",
    price: 770,
    stock: 40,
    description:
      "ちふれ クレンジング リキッド。水感のあるリキッドがメイクをすばやくオフ。洗い流しやすく、朝晩の化粧落としに使えます。",
    image_url: "/products/chifure-cleansing-liquid.png",
    category: "洗顔",
    origin: "国内メーカー正規品です。",
    ingredients: "Water, Mineral Oil, Cetyl Ethylhexanoate, Glycerin",
    skin_concern_tags: ["毛穴", "くすみ"],
    skin_type: "全肌質",
  },
  {
    name: "ちふれ ウォッシャブル コールドクリーム",
    price: 990,
    stock: 32,
    description:
      "ちふれ ウォッシャブル コールドクリーム。クリームがメイクとなじみ、ぬるま湯で洗い流せるクレンジングクリームです。",
    image_url: "/products/chifure-washable-cold-cream.png",
    category: "洗顔",
    origin: "国内メーカー正規品です。",
    ingredients: "Mineral Oil, Water, Beeswax, Glycerin, Sorbitan Stearate",
    skin_concern_tags: ["乾燥", "毛穴"],
    skin_type: "普通肌〜乾燥肌",
  },
  {
    name: "ちふれ メーキャップ ベース クリーム UV",
    price: 770,
    stock: 42,
    description:
      "ちふれ メーキャップ ベース クリーム UV。化粧下地として肌を整えて化粧ノリを高め、日常の紫外線もケアします。",
    image_url: "/products/chifure-makeup-base-uv.png",
    category: "メイク",
    origin: "国内メーカー正規品です。",
    ingredients: "Water, Titanium Dioxide, Glycerin, Dimethicone, Zinc Oxide",
    skin_concern_tags: ["トーンアップ", "紫外線"],
    skin_type: "全肌質",
  },
].map((row) => ({
  ...row,
  is_authentic: true,
}));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY がありません。");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data: existing, error: listError } = await supabase
  .from("products")
  .select("name");

if (listError) {
  console.error(listError.message);
  process.exit(1);
}

const names = new Set((existing ?? []).map((row) => row.name));
const toInsert = products.filter((product) => !names.has(product.name));

if (toInsert.length === 0) {
  console.log("美容カテゴリの商品はすでに登録済みです。");
  process.exit(0);
}

const { error } = await supabase.from("products").insert(toInsert);
if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`追加しました: ${toInsert.length}件`);
for (const product of toInsert) {
  console.log(`- ${product.category} / ${product.name}`);
}
