-- 既存の public.products に正規品カラムを追加する。
-- 商品ごとの出所・素材は docs/update-product-details.sql を使うこと。
-- このファイルの UPDATE は初回投入用で、再実行すると化粧品ダミーで上書きされる。

alter table public.products
  add column if not exists category text,
  add column if not exists is_authentic boolean not null default true,
  add column if not exists origin text,
  add column if not exists ingredients text,
  add column if not exists skin_concern_tags text[] not null default '{}',
  add column if not exists skin_type text;

update public.products
set
  category = coalesce(nullif(category, ''), 'スキンケア'),
  is_authentic = true,
  origin = coalesce(
    origin,
    'メーカー正規代理店との直契約による正規輸入品です。並行輸入ではありません。'
  ),
  ingredients = coalesce(
    ingredients,
    'Water, Glycerin, Niacinamide, Panthenol, Hyaluronic Acid'
  ),
  skin_concern_tags = case
    when skin_concern_tags is null or cardinality(skin_concern_tags) = 0
      then array['保湿']
    else skin_concern_tags
  end,
  skin_type = coalesce(nullif(skin_type, ''), '全肌質')
where origin is null
   or ingredients is null
   or category is null
   or skin_type is null
   or skin_concern_tags is null
   or cardinality(skin_concern_tags) = 0;
