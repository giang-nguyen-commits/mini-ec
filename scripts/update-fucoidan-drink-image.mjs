import { createClient } from "@supabase/supabase-js";

const IMAGE = "/products/uminoshizuku-fucoidan-drink.png";
const NAMES = ["フコイダン ドリンク", "フコイダン原液ドリンク"];

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
  .update({ image_url: IMAGE, category: "フコイダン" })
  .in("name", NAMES)
  .select("id, name, image_url");

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`updated ${data?.length ?? 0} row(s)`);
for (const row of data ?? []) {
  console.log(`- ${row.name}`);
}
