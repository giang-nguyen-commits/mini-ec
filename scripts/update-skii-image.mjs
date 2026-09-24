import { createClient } from "@supabase/supabase-js";

const FTE_IMAGE =
  "https://images.ctfassets.net/4qp6lhjn6atl/4iWwuzsKoSJS9qUd2JBKO0/7bc35d87fa9112e3a62f07aaecb5d17e/FTE_Product_Tile_PC.png?fm=webp&w=800&q=90";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("missing supabase env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase
  .from("products")
  .update({ image_url: FTE_IMAGE })
  .eq("name", "SK-II フェイシャル トリートメント エッセンス")
  .select("id, name");

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log("updated", data?.length ?? 0, "row(s)");
