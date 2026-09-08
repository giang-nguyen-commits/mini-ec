-- 商品ごとの出所・素材を個別更新する。
-- Supabase SQL Editor でそのまま実行する。
-- 化粧品（スキンケア / メイク）が無い現行カタログ向け。
-- 肌悩みタグ・肌タイプは化粧品以外では空にする。

update public.products
set
  category = 'キッチン',
  is_authentic = true,
  origin = '国産ヒノキを国内工房で切削・仕上げした正規品です。',
  ingredients = '国産ヒノキ、水性ウレタン仕上げ',
  skin_concern_tags = '{}',
  skin_type = null
where id = 'bd9cb37e-9f66-4074-bfaa-cf7d57db1b64';

update public.products
set
  category = 'ファッション',
  is_authentic = true,
  origin = 'ヨーロッパ産リネン生地を国内で縫製した正規品です。',
  ingredients = 'リネン100%',
  skin_concern_tags = '{}',
  skin_type = null
where id = '0aa3d77c-24ff-4d04-b76f-2b4556779f06';

update public.products
set
  category = 'ファッション',
  is_authentic = true,
  origin = '国内縫製の自社企画品です。生地・金具とも正規仕入れルートです。',
  ingredients = 'コットンキャンバス（8号）、ポリエステル裏地、真鍮金具',
  skin_concern_tags = '{}',
  skin_type = null
where id = '1b478f05-b451-4b9a-9cec-695509c13945';

update public.products
set
  category = '雑貨',
  is_authentic = true,
  origin = 'ベトナムの工房で手刺繍した正規輸入品です。',
  ingredients = 'コットン生地、ポリエステル刺繍糸、YKKファスナー',
  skin_concern_tags = '{}',
  skin_type = null
where id = 'a53797de-1703-4ce1-8123-546a38358ba3';

update public.products
set
  category = 'インテリア',
  is_authentic = true,
  origin = 'ベトナム産レモングラス精油を使用し、国内で充填した正規品です。',
  ingredients = 'ソイワックス、レモングラス精油、コットン芯',
  skin_concern_tags = '{}',
  skin_type = null
where id = 'a8e7c6e0-ec59-4e48-9760-555a4103d668';

update public.products
set
  category = 'ファッション',
  is_authentic = true,
  origin = 'GOTS認証オーガニックコットンを使用した国内縫製品です。',
  ingredients = 'オーガニックコットン100%',
  skin_concern_tags = '{}',
  skin_type = null
where id = '8e51f4fd-a75b-49bb-9d30-8bfdfa2c210f';

update public.products
set
  category = 'フード',
  is_authentic = true,
  origin = 'ベトナム中部高原の農園から正規ルートで輸入したコーヒー豆とphinフィルターのセットです。',
  ingredients = 'ロブスタ種コーヒー豆（中挽き）、ステンレス製phinフィルター',
  skin_concern_tags = '{}',
  skin_type = null
where id = 'ce7bb96d-f86d-4bb0-968a-2e3f8b6cb728';

update public.products
set
  category = '文具',
  is_authentic = true,
  origin = '国内の和紙工房で漉いた紙を製本した正規品です。',
  ingredients = '手漉き和紙（木材パルプ・楮）、コットン表紙',
  skin_concern_tags = '{}',
  skin_type = null
where id = '87aef9c3-aba6-4aa6-9bb8-96244616719e';

update public.products
set
  category = 'キッチン',
  is_authentic = true,
  origin = '国内窯元で釉薬をかけて焼成した正規品です。',
  ingredients = '磁器素地、マット釉薬',
  skin_concern_tags = '{}',
  skin_type = null
where id = 'e19335a6-4d23-445b-b99e-4513e9d9ac38';

update public.products
set
  category = 'キッチン',
  is_authentic = true,
  origin = '食品衛生法に適合した国内検品済みの正規品です。原産国: 中国（自社QC通過）。',
  ingredients = '本体 ステンレス鋼（SUS304）、蓋 ポリプロピレン、パッキン シリコーン',
  skin_concern_tags = '{}',
  skin_type = null
where id = 'c662b6f8-4e65-4e87-80ed-0c0e8e460cc7';
