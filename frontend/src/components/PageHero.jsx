const CARD_CLASS =
  'rounded-xl border border-emerald-900/10 bg-white shadow-sm overflow-hidden';

export default function PageHero({ title, subtitle, image, imagePosition = 'center', actions = null }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <article className={`${CARD_CLASS} p-6 md:p-8 flex flex-col justify-center gap-5 order-2 md:order-1 md:min-h-[320px]`}>
        <div>
          <h1 className="text-[27px] md:text-[33px] font-bold text-emerald-900">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-[17px] md:text-[19px] text-stone-600 leading-relaxed">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </article>

      <article className={`${CARD_CLASS} relative order-1 md:order-2 min-h-[220px] md:min-h-[320px]`}>
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: imagePosition }}
        />
      </article>
    </div>
  );
}
