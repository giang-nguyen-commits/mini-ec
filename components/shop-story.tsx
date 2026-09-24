export function ShopStory() {
  return (
    <article id="shop-story" className="mt-16 max-w-[720px] text-foreground sm:mt-20">
      <h2 className="flex items-center gap-3 text-[20px] font-bold leading-snug tracking-tight text-foreground sm:text-[22px]">
        <span
          className="h-[1.05em] w-[5px] shrink-0 rounded-[1px] bg-gold"
          aria-hidden
        />
        少品種を丁寧に選び、購買の流れまで通せる店
      </h2>
      <div className="mt-7 space-y-6 text-[15px] leading-[2] sm:text-base">
        <p className="indent-[1em]">
          Giang
          Cosmeticは単体の通販モールではなく、化粧品と健康商品を少品種に絞って展開する学習用セレクトショップです。一覧から詳細、カート、Stripeのテスト決済まで、実際の購買導線を短い画面数で確認できるようにしています。
        </p>
        <p className="indent-[1em]">
          このデモが機能するのは、掲載サンプルに商品名・成分・在庫を持たせつつ、メーカー公式・正規販売ではないことを明示しているためです。検索やカテゴリ、肌悩みのヒントから商品へたどり着き、一般的なモールではなく「この店の品揃えに沿った選び方」ができるようにしています。
        </p>
      </div>

      <h3 className="mt-14 border-b border-border pb-3 text-[18px] font-bold leading-snug tracking-tight text-foreground sm:text-[20px]">
        誰でもすぐ使いこなせる、小さな操作
      </h3>
      <div className="mt-7 space-y-6 text-[15px] leading-[2] sm:text-base">
        <p className="indent-[1em]">
          使い方は直感的です。商品一覧で気になる一品を開き、「カートに入れる」を押すだけで、注文前の準備が数秒で始まります。
        </p>
        <p className="indent-[1em]">
          店の品揃えは2つに分かれます。1つ目はちふれやSK-IIなどの化粧品。2つ目はコラーゲンやグルコサミンなどの健康商品です。会員登録後は配送先を保存し、注文履歴から支払い済みの内容を確認できます。
        </p>
      </div>
    </article>
  );
}
