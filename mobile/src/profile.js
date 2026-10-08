/* ================================================
   BİLGİLERİNİZİ BURADAN DEĞİŞTİRİN
   ================================================ */
export const PROFILE = {
  firstName: "Ahmetcan",
  lastName:  "Sakız",
  title:     "Co-founder",
  company:   "IBA Consultancy",
  bio:       "Power Platform ve otomasyon ile işleri hızlandırıyorum.",
  phone:     "+905449089905",          // boşluksuz, ülke koduyla
  phoneText: "+90 544 908 99 05",      // ekranda görünen hali
  email:     "ahmetcan.sakiz@ibaconsultancy.com.tr",
  website:   "https://ibaconsultancy.com.tr",
  location:  "",                       // boşsa satır görünmez
  linkedin:  "https://www.linkedin.com/in/kullaniciadi",
  github:    "https://github.com/kullaniciadi",
  photo:     "",                       // tam adres, örn. "https://.../foto.jpg"; boşsa baş harfler görünür
  cardUrl:   "https://bizcard-web-peach.vercel.app",  // QR kodun açacağı adres
  kvkkUrl:   "https://bizcard-web-peach.vercel.app/kvkk-aydinlatma-metni.html",
  privacyUrl:"https://bizcard-web-peach.vercel.app/gizlilik-politikasi.html",
  meetingWebhook: "",                  // n8n webhook adresi; boşsa e-posta taslağı açılır
  chatWebhook:    "",                  // n8n Chat Trigger adresi ("Soru sor" penceresi)
  projects: [
    { name: "BizCard",
      text: "Dijital kartvizit: web, iOS ve Android'de yayında. n8n akışlarıyla konuşuyor.",
      tags: ["React", "Expo", "n8n"] },
    { name: "Operasyon Planlama Sistemi",
      text: "Power Platform üzerinde üretim planlama ve takip uygulaması.",
      tags: ["Power Apps", "Dataverse"] },
    { name: "Süreç Otomasyonu Danışmanlığı",
      text: "Tekrar eden ofis işlerini n8n ve Power Automate ile otomatiğe bağlama.",
      tags: ["n8n", "Power Automate"] }
  ]
};
/* ================================================ */
