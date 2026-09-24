import { createClient } from "@supabase/supabase-js";

const disclaimer =
  "健康食品です。医薬品ではなく、病気の治療・予防を目的としたものではありません。";

const products = [
  {
    name: "オキナワモズク フコイダン",
    price: 3980,
    stock: 18,
    description: `沖縄県産モズク由来フコイダンを配合。毎日の健康維持をサポートするサプリメントです。${disclaimer}`,
    image_url: "/images/fucoidan-01.jpg",
    category: "フコイダン",
    is_authentic: true,
    origin: "沖縄産モズクを国内で抽出・充填した正規品です。",
    ingredients: "オキナワモズクフコイダン、デキストリン、セルロース",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "海の雫 フコイダン 120粒",
    price: 12800,
    stock: 12,
    description: `海藻サイエンスの会のフコイダン「海の雫」。120粒入りカプセル。オキナワモズク由来フコイダンを配合しています。${disclaimer}`,
    image_url: "/products/uminoshizuku-fucoidan-capsule.png",
    category: "フコイダン",
    is_authentic: true,
    origin: "海藻サイエンスの会の正規品です。",
    ingredients: "オキナワモズク由来フコイダン、植物由来カプセル",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "沖縄フコイダン 180粒",
    price: 12800,
    stock: 12,
    description: `カネヒデバイオの沖縄フコイダン。オキナワモズク抽出物100%、180粒入り（1日目安6粒）。${disclaimer}`,
    image_url: "/products/kanehide-okinawa-fucoidan.png",
    category: "フコイダン",
    is_authentic: true,
    origin: "カネヒデバイオ（沖縄）の正規品です。",
    ingredients: "オキナワモズク抽出物、植物由来カプセル（HPMC）",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "フコイダン原液ドリンク",
    price: 5400,
    stock: 18,
    description: `濃縮モズクエキスの液体タイプ。毎日の健康習慣向けドリンクです。${disclaimer}`,
    image_url: "/products/uminoshizuku-fucoidan-drink.png",
    category: "フコイダン",
    is_authentic: true,
    origin: "国内充填の正規品です。",
    ingredients: "オキナワモズクエキス、エリスリトール、クエン酸",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "フコイダン ドリンク",
    price: 113000,
    stock: 20,
    description: `飲みやすいフコイダンドリンク。毎日の健康習慣向け。${disclaimer}`,
    image_url: "/products/uminoshizuku-fucoidan-drink.png",
    category: "フコイダン",
    is_authentic: true,
    origin: "国内充填の正規品です。",
    ingredients: "フコイダン、エリスリトール、クエン酸、香料",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "高純度フコイダン粉末",
    price: 8600,
    stock: 14,
    description: `褐藻由来の高純度フコイダン粉末。ドリンクやヨーグルトに混ぜてお使いいただけます。${disclaimer}`,
    image_url: "/products/fucoidan-powder.png",
    category: "フコイダン",
    is_authentic: true,
    origin: "国内正規ルートで検品したサプリメントです。",
    ingredients: "フコイダン（モズク由来）100%",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "82x Sakura Premium Collagen",
    price: 15000,
    stock: 16,
    description: `82xコース1ヶ月目。桜プレミアムコラーゲン配合の美容ドリンク。美肌習慣をサポートします。${disclaimer}`,
    image_url: "/products/82x-sakura-premium-collagen.png",
    category: "美容ドリンク",
    is_authentic: true,
    origin: "国内正規ルートの美容ドリンクです。",
    ingredients: "コラーゲンペプチド、植物発酵エキス、ビタミンC",
    skin_concern_tags: ["82xコース"],
    skin_type: null,
  },
  {
    name: "82x Collagen Classic (500ml)",
    price: 10500,
    stock: 20,
    description: `82xコース2ヶ月目。クラシックコラーゲン 500ml。毎日のうるおい習慣向けです。${disclaimer}`,
    image_url: "/products/82x-collagen-classic.png",
    category: "美容ドリンク",
    is_authentic: true,
    origin: "国内正規ルートの美容ドリンクです。",
    ingredients: "コラーゲンペプチド、植物発酵エキス、ビタミンC",
    skin_concern_tags: ["82xコース"],
    skin_type: null,
  },
  {
    name: "82x Placenta Classic",
    price: 12000,
    stock: 18,
    description: `82xコース3ヶ月目。プラセンタクラシック配合の美容ドリンク。美肌・ボディの3ヶ月目ケアです。${disclaimer}`,
    image_url: "/products/82x-placenta-classic.png",
    category: "美容ドリンク",
    is_authentic: true,
    origin: "国内正規ルートの美容ドリンクです。",
    ingredients: "プラセンタエキス、植物発酵エキス、ビタミンC",
    skin_concern_tags: ["82xコース"],
    skin_type: null,
  },
  {
    name: "コラーゲン美容ドリンク",
    price: 3980,
    stock: 24,
    description: `低分子コラーゲン配合の美容ドリンク。肌のうるおい習慣をサポートします。${disclaimer}`,
    image_url: "/products/collagen-beauty-drink.png",
    category: "美容ドリンク",
    is_authentic: true,
    origin: "国内充填の正規品です。",
    ingredients: "コラーゲンペプチド、ビタミンC、ヒアルロン酸、クエン酸",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "プラセンタ＆ヒアルロン酸ドリンク",
    price: 4480,
    stock: 20,
    description: `プラセンタとヒアルロン酸を配合した美容ドリンク。毎日の美容習慣向けです。${disclaimer}`,
    image_url: "/products/hyaluron-beauty-drink.png",
    category: "美容ドリンク",
    is_authentic: true,
    origin: "国内GMP工場製造の正規品です。",
    ingredients: "プラセンタエキス、ヒアルロン酸、ビタミンE、エリスリトール",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "オリヒロ 高純度グルコサミン 900粒",
    price: 3980,
    stock: 24,
    description: `オリヒロ 高純度グルコサミン 900粒（90日分）。1日10粒あたりグルコサミン塩酸塩1500mg配合。ひざの動きをサポートする機能性表示食品です。${disclaimer}`,
    image_url: "/products/orihiro-glucosamine-900.png",
    category: "関節サポート",
    is_authentic: true,
    origin: "オリヒロの国内正規品です。",
    ingredients: "グルコサミン塩酸塩、ムコ多糖蛋白複合体（コンドロイチン含有）、発酵コラーゲン分解物、ヒアルロン酸",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "コンドロイチンZS錠 270錠",
    price: 4480,
    stock: 16,
    description:
      "ゼリア新薬 コンドロイチンZS錠 270錠（45日分）。コンドロイチン硫酸Na 1日量1,560mg。関節痛・腰痛に。第3類医薬品です。用法・用量を守ってご使用ください。",
    image_url: "/products/zeria-chondroitin-zs.png",
    category: "関節サポート",
    is_authentic: true,
    origin: "ゼリア新薬工業の国内正規品です。",
    ingredients: "コンドロイチン硫酸ナトリウム",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "オリヒロ 深海鮫エキス 360粒",
    price: 2480,
    stock: 20,
    description: `オリヒロ 深海鮫エキス お徳用360粒（60日分）。肝油100%、スクワレン配合ソフトカプセル。1日目安6粒。${disclaimer}`,
    image_url: "/products/orihiro-squalene-360.png",
    category: "関節サポート",
    is_authentic: true,
    origin: "オリヒロの国内正規品です。",
    ingredients: "深海鮫精製肝油（スクワレン）、ゼラチン、グリセリン",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "キューピーコーワ コンドロイザー 90錠",
    price: 2980,
    stock: 18,
    description:
      "キューピーコーワ コンドロイザー 90錠。興和の第2類医薬品です。ひざなどの関節痛に。ボウイ乾燥エキス・コンドロイチン配合。用法・用量を守ってご使用ください。",
    image_url: "/products/qp-kowa-condroiser.png",
    category: "関節サポート",
    is_authentic: true,
    origin: "興和の国内正規品です。",
    ingredients: "ボウイ乾燥エキス、コンドロイチン硫酸エステルナトリウム",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "グルコサミン 関節サポート",
    price: 3280,
    stock: 26,
    description: `グルコサミン配合の関節ケアサプリ。歩く・階段の毎日をサポートします。${disclaimer}`,
    image_url: "/products/glucosamine-joint.png",
    category: "関節サポート",
    is_authentic: true,
    origin: "国内GMP工場で製造した正規品です。",
    ingredients: "グルコサミン塩酸塩、ビタミンD、セルロース",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "コンドロイチン＆カルシウム",
    price: 3680,
    stock: 18,
    description: `コンドロイチンとカルシウムを配合。骨と関節の健康維持をサポートします。${disclaimer}`,
    image_url: "/products/joint-care-box.png",
    category: "関節サポート",
    is_authentic: true,
    origin: "国内正規ルートで検品したサプリメントです。",
    ingredients: "コンドロイチン硫酸、カルシウム、マグネシウム、ビタミンD",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "ナットウキナーゼ 血流サポート",
    price: 3980,
    stock: 24,
    description:
      "納豆由来ナットウキナーゼ配合のサプリメント。日々の血流と健康維持をサポートします。医薬品ではありません。病気の治療・予防を目的としたものではありません。",
    image_url:
      "https://images.unsplash.com/photo-1584308666744-24d98eead311?auto=format&fit=crop&w=800&q=80",
    category: "健康食品",
    is_authentic: true,
    origin: "国内GMP工場で製造した正規品です。",
    ingredients: "納豆キナーゼ、デンプン、セルロース、ステアリン酸カルシウム",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    name: "ヘパリーゼプラスII 180錠",
    price: 4980,
    stock: 30,
    description:
      "ゼリア新薬 ヘパリーゼプラスII 180錠（30日分）。肝臓水解物・イノシトール配合の第3類医薬品です。疲れ・だるさ時の滋養強壮に。用法・用量を守ってご使用ください。",
    image_url: "/products/hepalyse-plus-ii.png",
    category: "健康食品",
    is_authentic: true,
    origin: "ゼリア新薬工業の国内正規品です。",
    ingredients: "肝臓水解物、イノシトール、リボフラビン、トコフェロール酢酸エステル",
    skin_concern_tags: [],
    skin_type: null,
  },
];

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
  .select("id, name");

if (listError) {
  console.error(listError.message);
  process.exit(1);
}

const byName = new Map((existing ?? []).map((row) => [row.name, row.id]));
const toInsert = [];
const updated = [];

for (const product of products) {
  const id = byName.get(product.name);
  if (id) {
    const { error } = await supabase.from("products").update(product).eq("id", id);
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    updated.push(product.name);
  } else {
    toInsert.push(product);
  }
}

if (toInsert.length > 0) {
  const { error } = await supabase.from("products").insert(toInsert);
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
}

console.log(`更新: ${updated.length}件 / 追加: ${toInsert.length}件`);
for (const name of updated) {
  console.log(`- 更新 ${name}`);
}
for (const product of toInsert) {
  console.log(`- 追加 ${product.category} / ${product.name}`);
}
