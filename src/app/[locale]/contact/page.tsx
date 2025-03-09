import { useTranslations } from 'next-intl';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  const t = useTranslations('ContactPage');

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:mt-14">
      <h1 className="text-center text-3xl font-bold sm:text-4xl">
        {t('heading')}
      </h1>
      <p className="mt-2 text-center text-gray-600 sm:text-lg">
        {t('description')}
      </p>

      {/* Contact Buttons */}
      <div className="mt-8 flex items-center justify-center gap-4">
        {/* Phone */}
        <Link href="tel:+917302756618">
          <button className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-lg px-4 py-3 text-white transition sm:px-6">
            <Phone className="h-6 w-6" />
            <span className="hidden sm:inline">{t('callUs')}</span>
          </button>
        </Link>

        {/* Email */}
        <Link href="mailto:kamdhenuseva@dayadevraha.com">
          <button className="bg-secondary hover:bg-secondary/90 flex items-center gap-2 rounded-lg px-4 py-3 text-white transition sm:px-6">
            <Mail className="h-6 w-6" />
            <span className="hidden sm:inline">{t('emailUs')}</span>
          </button>
        </Link>

        {/* WhatsApp */}
        <Link href="https://wa.me/+917302756618" target="_blank">
          <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white transition hover:bg-green-700 sm:px-6">
            <MessageCircle className="h-6 w-6" />
            <span className="hidden sm:inline">{t('whatsappUs')}</span>
          </button>
        </Link>
      </div>

      {/* Contact Details */}
      <div className="mt-6 flex flex-col items-center gap-2 text-center sm:gap-4">
        {/* Phone Number */}
        <p className="flex items-center gap-2 text-lg font-semibold">
          <Phone className="text-primary h-5 w-5" /> +91 7302 756 618
        </p>

        {/* Email */}
        <p className="flex items-center gap-2 text-lg font-semibold">
          <Mail className="text-secondary h-5 w-5" />{' '}
          kamdhenuseva@dayadevraha.com
        </p>

        {/* Address */}
        <p className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="h-5 w-5 text-gray-700" />
          {t('address')}
        </p>
      </div>

      {/* Google Map */}
      <div className="mt-10 flex justify-center">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7242073.95577103!2d77.715488!3d27.588292!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736fb8c0918c63%3A0x5dd68797914571fe!2sYogiraj%20Devraha%20Baba%20(Samadhi%20sthal%20and%20Ashram)!5e0!3m2!1sen!2sus!4v1741432250612!5m2!1sen!2sus"
          width="600"
          height="450"
          className="w-full max-w-2xl rounded-lg border-0 shadow-lg"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}
