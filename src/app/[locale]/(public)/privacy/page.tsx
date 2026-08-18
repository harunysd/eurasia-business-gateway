import { setRequestLocale } from 'next-intl/server';
import { SectionHero } from '@/components/SectionHero';
import type { Locale } from '@/i18n/routing';

// TODO: This is placeholder boilerplate. Have real legal text drafted and
// reviewed before going live.

const copy: Record<Locale, { title: string; paragraphs: string[] }> = {
  en: {
    title: 'Privacy Policy',
    paragraphs: [
      'Eurasia Business Gateway (“we”, “us”) respects your privacy. This policy explains what information we collect through this website and how we use and protect it.',
      'When you submit the contact form, we collect the name, email address, company, phone number and message you choose to provide. We use this information solely to respond to your enquiry and, where relevant, to follow up on potential business discussions.',
      'We do not sell, rent or trade your personal information with third parties. We may share information with service providers who help us operate this website or respond to enquiries, only to the extent necessary and under appropriate confidentiality expectations.',
      'We retain submitted enquiries for as long as reasonably needed to respond to them and to maintain records of business correspondence, after which they are deleted or anonymised.',
      'You may request access to, correction of, or deletion of your personal information at any time by writing to info@eurasiabusinessgateway.com.',
    ],
  },
  tr: {
    title: 'Gizlilik Politikası',
    paragraphs: [
      'Eurasia Business Gateway (“biz”, “bizim”) gizliliğinize saygı duyar. Bu politika, bu web sitesi üzerinden hangi bilgileri topladığımızı ve bunları nasıl kullanıp koruduğumuzu açıklar.',
      'İletişim formunu gönderdiğinizde, sağlamayı seçtiğiniz ad, e-posta adresi, şirket, telefon numarası ve mesaj bilgilerini toplarız. Bu bilgileri yalnızca talebinize yanıt vermek ve uygun durumlarda olası iş görüşmelerini takip etmek için kullanırız.',
      'Kişisel bilgilerinizi üçüncü taraflara satmıyor, kiralamıyor veya ticaretini yapmıyoruz. Bu web sitesini işletmemize veya taleplere yanıt vermeye yardımcı olan hizmet sağlayıcılarla, yalnızca gerekli ölçüde ve uygun gizlilik beklentileri altında bilgi paylaşabiliriz.',
      'Gelen talepleri, yanıt vermek ve iş yazışmalarının kayıtlarını tutmak için makul ölçüde gereken süre boyunca saklarız; ardından siler veya anonimleştiririz.',
      'Kişisel bilgilerinize erişimi, düzeltmeyi veya silinmesini istediğiniz her an info@eurasiabusinessgateway.com adresine yazarak talep edebilirsiniz.',
    ],
  },
  ru: {
    title: 'Политика конфиденциальности',
    paragraphs: [
      'Eurasia Business Gateway («мы») уважает вашу конфиденциальность. Эта политика объясняет, какую информацию мы собираем через этот веб-сайт и как мы её используем и защищаем.',
      'Когда вы отправляете контактную форму, мы собираем имя, адрес эл. почты, компанию, номер телефона и сообщение, которые вы решили предоставить. Мы используем эту информацию исключительно для ответа на ваш запрос и, в соответствующих случаях, для последующего ведения деловых обсуждений.',
      'Мы не продаём, не сдаём в аренду и не передаём вашу личную информацию третьим лицам. Мы можем делиться информацией с поставщиками услуг, помогающими нам управлять этим сайтом или отвечать на запросы, только в необходимой мере и при надлежащих ожиданиях конфиденциальности.',
      'Мы храним полученные запросы столько, сколько разумно необходимо для ответа и ведения записей деловой переписки, после чего удаляем или анонимизируем их.',
      'Вы можете запросить доступ, исправление или удаление вашей личной информации в любое время, написав на info@eurasiabusinessgateway.com.',
    ],
  },
};

type Params = { locale: Locale };

export default async function PrivacyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = copy[locale];

  return (
    <>
      <SectionHero
        title={c.title.toUpperCase()}
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1920&q=80"
      />
      <section className="bg-white py-12 md:py-section">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <h1 className="mb-8 text-3xl font-extrabold uppercase tracking-tight text-navy md:text-4xl">
            {c.title}
          </h1>
          <div className="space-y-6 text-base leading-relaxed text-gray">
            {c.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
