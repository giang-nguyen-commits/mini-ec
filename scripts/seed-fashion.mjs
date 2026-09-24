import { createClient } from "@supabase/supabase-js";

const authenticImport =
  "メーカー正規代理店との直契約による正規輸入品です。並行輸入ではありません。";

const products = [
  {
    match: ["オーガニックコットンTシャツ", "ユニクロ エアリズムUVカット メッシュフルジップパーカ"],
    name: "ユニクロ エアリズムUVカット メッシュフルジップパーカ",
    price: 2990,
    stock: 28,
    description:
      "ユニクロ エアリズムUVカット メッシュフルジップパーカ。UPF50+で日差しをカットし、エアリズム素材で涼しい着心地。サムホール付き・パッカブル仕様です。",
    image_url: "/products/uniqlo-airism-uv-mesh-parka.png",
    category: "ファッション",
    is_authentic: true,
    origin: "ユニクロ正規ルートの国内正規品です。",
    ingredients: "ポリエステル、ポリウレタン（エアリズム）",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    match: ["キャンバストートバッグ", "マイケルコース シャーロット 3 IN 1 トート"],
    name: "マイケルコース シャーロット 3 IN 1 トート",
    price: 63800,
    stock: 8,
    description:
      "MICHAEL KORS CHARLOTTE 3 IN 1 ラージトート。サフィアーノレザートートに、シグネチャーポーチとウォレットが付属。肩掛けしやすいA4対応トートです。",
    image_url: "/products/michael-kors-charlotte-tote.png",
    category: "ファッション",
    is_authentic: true,
    origin: authenticImport,
    ingredients: "サフィアーノレザー、ポリエステル裏地、ゴールドトーン金具",
    skin_concern_tags: [],
    skin_type: null,
  },
  {
    match: ["リネンハンカチ", "コーチ ミニ ローワン クロスボディ"],
    name: "コーチ ミニ ローワン クロスボディ",
    price: 39800,
    stock: 10,
    description:
      "COACH Mini Rowan Crossbody。シグネチャーキャンバスのミニボストン。トップハンドルと取り外し可能なショルダーストラップで2WAY。",
    image_url: "/products/coach-mini-rowan-satchel.png",
    category: "ファッション",
    is_authentic: true,
    origin: authenticImport,
    ingredients: "シグネチャーコーテッドキャンバス、スムースレザー、ゴールドトーン金具",
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

for (const product of products) {
  const { match, ...payload } = product;
  let updated = null;
  for (const oldName of match) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("name", oldName)
      .select("id, name, price, image_url");
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    if (data?.length) {
      updated = data;
      break;
    }
  }
  if (updated) {
    console.log("updated", updated);
  } else {
    const { data, error } = await supabase.from("products").insert(payload).select("id, name, price");
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    console.log("inserted", data);
  }
}
