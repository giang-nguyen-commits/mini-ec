import { createClient } from "@supabase/supabase-js";

const IMAGE = "/products/uminoshizuku-fucoidan-capsule.png";
const disclaimer =
  "健康食品です。医薬品ではなく、病気の治療・予防を目的としたものではありません。";
const FROM_NAMES = ["フコイダン 高濃度カプセル", "海の雫 フコイダン 120粒"];
const payload = {
  name: "海の雫 フコイダン 120粒",
  description: `海藻サイエンスの会のフコイダン「海の雫」。120粒入りカプセル。オキナワモズク由来フコイダンを配合しています。${disclaimer}`,
  image_url: IMAGE,
  category: "フコイダン",
  is_authentic: true,
  origin: "海藻サイエンスの会の正規品です。",
  ingredients: "オキナワモズク由来フコイダン、植物由来カプセル",
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY がありません。");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from("products")
  .update(payload)
  .in("name", FROM_NAMES)
  .select("id, name, image_url");

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`updated ${data?.length ?? 0} row(s)`);
for (const row of data ?? []) {
  console.log(`- ${row.name}`);
}
