/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "STUDEJA";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "STUDEJA apvieno mūziķus, pasākumu veidotājus un kultūras aktīvistus. Koncertprogrammas, pasākumu organizēšana un pakalpojumi māksliniekiem. Sakņojamies Latgalē, darbojamies visā Latvijā.";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap. */
export const SITE_URL = "https://studeja.lv";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "lv-LV";
/**
 * Routes kept out of search results. Each is excluded from the sitemap and
 * served with a `robots: noindex, nofollow` tag, so the two can't disagree.
 *
 * Surrounding slashes are optional: `"/thanks"`, `"thanks"` and `"/thanks/"`
 * all match the same route.
 */
export const NOINDEX_ROUTES: string[] = [
  "/anketa",
  "/404",
  /* Historical pages are deliberately not indexed. */
  "/legacy/homepage-v1",
  /* Title-only for now. Each leaves this list once its page is built. */
  "/par-studeja",
  "/projekti",
  "/pieteikums",
  "/sadarbiba",
  "/kontakti",
  "/meklet",
  "/privatuma-politika",
  "/sikdatnes",
];

/**
 * What site-wide search looks through. Every entry needs a destination that
 * actually exists, so these point at homepage sections and the new pages.
 * TODO.md replaces this hand-kept list with one built from the content. The
 * ones marked `featured` are what the search panel offers before anyone types;
 * everything else only surfaces once they do.
 */
export const SEARCH_INDEX: {
  /** What the result is called. */
  title: string;
  /** One line describing it, shown under the title. */
  text: string;
  /** Where the result leads. */
  href: string;
  /** Which part of the site it belongs to, shown as a tag. */
  group: string;
  /** Extra words that should match it but are not worth showing. */
  keywords?: string;
  /** Offered in the panel before the visitor types anything. */
  featured?: boolean;
}[] = [
  {
    title: "Koncertprogrammas",
    text: "Programmas, to ilgums un cenas nosacījumi.",
    href: "/#koncertprogrammas",
    group: "Piedāvājums",
    keywords: "koncerts programma repertuārs mūzika uzstāšanās",
    featured: true,
  },
  {
    title: "Mākslinieki",
    text: "Grupas un solisti STUDEJA piedāvājumā.",
    href: "/#koncertprogrammas",
    group: "Piedāvājums",
    keywords: "grupas solisti izpildītāji sastāvs dziedātāji",
    featured: true,
  },
  {
    title: "Pasākumu organizēšana",
    text: "No pirmās idejas līdz pasākuma norisei.",
    href: "/#pakalpojumi",
    group: "Piedāvājums",
    keywords: "pasākumi producēšana svinības korporatīvie publiskie",
    featured: true,
  },
  {
    title: "Pakalpojumi",
    text: "Seši pakalpojumi, atsevišķi vai vienā projektā.",
    href: "/#pakalpojumi",
    group: "Piedāvājums",
    keywords: "pakalpojumi nodrošinājums tehnika",
    featured: true,
  },
  {
    title: "Pieteikt ieceri",
    text: "Pastāsti, kas iecerēts, un sazināsimies.",
    href: "/pieteikums",
    group: "Saziņa",
    keywords: "pieteikums forma sazināties saruna",
    featured: true,
  },
  {
    title: "Apskaņošana un tehniskais nodrošinājums",
    text: "Skaņa, gaismas un skatuve atbilstoši norisei.",
    href: "/#pakalpojumi",
    group: "Pakalpojumi",
    keywords: "apskaņošana skaņa gaismas skatuve tehnika mikrofoni aparatūra",
  },
  {
    title: "Pasākumu vadītāji",
    text: "Vadītājs atbilstoši formātam, auditorijai un valodai.",
    href: "/#pakalpojumi",
    group: "Pakalpojumi",
    keywords: "vadītājs konferansjē moderators scenārijs",
  },
  {
    title: "Foto un video",
    text: "Pasākuma dokumentēšana un satura veidošana.",
    href: "/#pakalpojumi",
    group: "Pakalpojumi",
    keywords: "foto video fotogrāfs filmēšana materiāli",
  },
  {
    title: "Individuālu programmu veidošana",
    text: "Saturs, kas veidots konkrētam pasākumam.",
    href: "/#pakalpojumi",
    group: "Pakalpojumi",
    keywords: "individuāla programma pasūtījums tēma repertuārs",
  },
  {
    title: "Mūziķu menedžments",
    text: "Darbības attīstība, piedāvājums un sadarbības.",
    href: "/#pakalpojumi",
    group: "Pakalpojumi",
    keywords: "menedžments pārstāvība karjera grupas attīstība",
  },
  {
    title: "Mūzikas producēšana",
    text: "No ieceres un aranžējuma līdz ierakstam un izdošanai.",
    href: "/#pakalpojumi",
    group: "Pakalpojumi",
    keywords: "producēšana ieraksts studija aranžējums izdošana albums singls",
  },
  {
    title: "Jaunumi un aktivitātes",
    text: "Ko STUDEJA dara tieši tagad, sociālajos tīklos.",
    href: "/#jaunumi",
    group: "Sākumlapa",
    keywords: "instagram facebook ziņas jaunumi sociālie tīkli",
  },
  {
    title: "Par STUDEJA",
    text: "Kopiena ar saknēm Latgalē.",
    href: "/par-studeja",
    group: "STUDEJA",
    keywords: "komanda kopiena latgale rēzekne par mums dibinātāji",
  },
  {
    title: "Īstenotie projekti",
    text: "Notikumi un darbi, kuros esam piedalījušies.",
    href: "/projekti",
    group: "STUDEJA",
    keywords: "projekti atsauksmes darbi portfolio",
  },
  {
    title: "Festivāls SPAITS",
    text: "Pašu organizētais kultūras festivāls Rēzeknē.",
    href: "https://spaits.studeja.lv/",
    group: "STUDEJA",
    keywords: "spaits festivāls kovšu ezers rēzekne",
  },
  {
    title: "Kā veidojas cena",
    text: "Kas nosaka cenu un kas tajā iekļauts.",
    href: "/kontakti#buj",
    group: "Biežāk uzdotie jautājumi",
    keywords: "cena cenas samaksa budžets izmaksas tāme",
  },
  {
    title: "Vai pieteikums rezervē datumu",
    text: "Nē. Vispirms pārbaudām pieejamību.",
    href: "/kontakti#buj",
    group: "Biežāk uzdotie jautājumi",
    keywords: "rezervācija datums pieejamība avanss atcelšana",
  },
  {
    title: "Vai strādājat ārpus Latgales",
    text: "Jā, visā Latvijā.",
    href: "/kontakti#buj",
    group: "Biežāk uzdotie jautājumi",
    keywords: "latgale latvija teritorija ārvalstīs rīga",
  },
  {
    title: "info@studeja.lv",
    text: "Galvenais publiskais e-pasts.",
    href: "mailto:info@studeja.lv",
    group: "Saziņa",
    keywords: "e-pasts epasts mail kontakti rakstīt",
  },
  {
    title: "+371 26394018",
    text: "Galvenais tālrunis.",
    href: "tel:+37126394018",
    group: "Saziņa",
    keywords: "tālrunis telefons zvanīt kontakti numurs",
  },
];
