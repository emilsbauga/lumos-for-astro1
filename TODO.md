# STUDEJA site: to do

What is still missing from studeja.lv, one entry per job. Each entry says what
is already decided or written somewhere, and what has to be answered before
it can be built. Sources are the two files in `reference materials/`: the
content brief (`STUDEJA-majaslapas-satura-uzmetums.md`, "the brief") and the
company details (`STUDEJA-vispariga-un-juridiska-informacija.md`, "the company
file"). The brief was a first draft of ideas. Where the site has since gone
another way, the site wins.

Every page below exists as a title-only stub and is listed in `NOINDEX_ROUTES`
in `src/consts.ts`. Take a page off that list the day it gets real content.

## Site map

| URL | What it is | State |
| --- | --- | --- |
| `/` | Homepage: hero, Koncertprogrammas un mākslinieki, Ar ko varam palīdzēt, feed | Built, placeholder content |
| `/meklet` | Search results, also the catalogue | Stub |
| `/par-studeja` | About, team, FAQ | Stub |
| `/projekti` | Projekti un sasniegumi | Stub |
| `/kontakti` | Contacts, company details, FAQ (`#buj`) | Stub |
| `/pieteikums` | Enquiry form for clients | Stub |
| `/sadarbiba` | Form and expectations for musicians and partners | Stub |
| `/privatuma-politika` | Privacy policy | Stub |
| `/sikdatnes` | Cookie information | Stub |
| `/koncertprogrammas/[slug]` | One programme | Not created |
| `/makslinieki/[slug]` | One band or soloist | Not created |
| `/muziki/[slug]` | One musician | Not created |
| `/projekti/[slug]` | One project | Not created |

Services have no pages of their own. The drawer in the homepage section is
everything the site says about a service, and the nav's "Pakalpojumi" link goes
to `/#pakalpojumi`.

---

## Content and data

### Choose where catalogue content lives

Programmes, bands, musicians and projects will each be many items, and search,
the homepage sections and the detail pages all read them. Today they are
hard-coded arrays in `src/pages/index.astro`.

Known:

- A musician can play in several bands. A band can have several programmes. A
  programme can have several performers (brief §3).
- A band page lists its members and programmes. A musician page lists the bands
  they play in. Store membership once, on the band, and work out the musician's
  list from it, so the two pages cannot disagree.
- Founders and team members are people too. The About page should read the
  same person records as the musician pages, not a second copy.
- A soloist is a band with one member.
- Projects must support any number from the start, even though SPAITS is the
  only finished one today.

Questions:

- Astro content collections in the repo, or an external CMS? Who will edit
  content, and do they need to do it without touching code?
- Which fields does each type need? The brief's programme sheet (§3) is the
  starting point: name, photo, one-line summary, performers, description,
  media, duration, line-up, language, suitable events, technical needs, price
  and its terms.
- Are genres and event types fixed lists (needed for the filter pills), or free
  text?
- Does every musician agree to a public page? What may it show? No personal
  contacts, every enquiry goes through STUDEJA.

### Fill in the programmes

The homepage section "Koncertprogrammas un mākslinieki" shows 12 placeholder
programmes in brackets. It never shows more than 9 cards, whichever pill is
selected. "Skatīt katalogu" opens `/meklet?tips=koncertprogrammas`, and adds
`&notikums=<pill id>` when a pill is selected.

Known:

- The event pills are real: Ziemassvētki, Jaunais gads, Valsts svētki, Pilsētu
  svētki, Koncertizrādes, Kāzas, Valentīndiena, Līgo un Jāņi, Dažādi. A pill
  that no programme uses is hidden automatically.
- Each card shows a photo, name, performers, up to two genres, up to two event
  types and two lines of text.
- Show prices only where they are confirmed. The brief suggests "Cena: X €",
  "Cena no X €" or "Cena pēc vienošanās", with what is included and whether VAT,
  travel and technical setup cost extra.

Questions:

- Which 9 programmes lead on "Visi", and in what order? Newest, most booked, or
  picked by hand?
- On a phone, 9 cards in one column run to about 4,300px. Keep 9 there, or show
  fewer below a certain width?
- Real photos for each programme. The placeholders reuse the photos already in
  `src/assets/photos/`.

### Confirm the services and their audiences

The section "Ar ko varam palīdzēt" lists eight services, taken from the v1
homepage. Seven show at first, and "Rādīt visu" shows the rest. Picking a pill
closes any open drawer and collapses the list back to seven.

Known:

- Pills: Visi, Privātpersonām, Uzņēmumiem un organizācijām, Mūziķiem un
  māksliniekiem. "Organizācijas" covers municipalities, cultural centres,
  schools and non-profits; "Uzņēmumiem" is in the label so companies see
  themselves in it too.
- Every drawer has one paragraph now. The plan is one or two.
- "Pieteikt pakalpojumu" links to `/pieteikums?pakalpojums=<id>`.
- The brief keeps music production and event production apart, and management
  is a service of its own (§5).

Questions:

- Which audiences each service belongs to is a first guess made in
  `src/pages/index.astro`. Every event service is under both client pills;
  sound, photo/video, management and music production are under "Mūziķiem un
  māksliniekiem". Is that right?
- Should "Koncertprogrammas un mākslinieki" stay in the services list when
  the section right above it covers the same thing?
- Final text, one or two paragraphs each, and a real photo for each service.
- Are any services missing? Venue search, scriptwriting and team coordination
  are in the brief's list of what can be handed to STUDEJA (§4) but have no
  row of their own.

### Social feed and social links

The feed runs on Elfsight widget `a546cf55-7526-46c7-956c-88807ed4eedc`.

Questions:

- Switch the layout to a carousel, or show fewer posts before "Load More"?
  Right now the section is about 2,300px tall on desktop.
- Pick a dark or transparent theme in the Elfsight editor. The white "Load
  More" button stands out on the green.
- The "Free Social Feed Widget" badge disappears only on a paid plan.
- Elfsight loads from a third-party server. The brief (§16) says widgets that
  need consent must not load before it is given. Decide this together with the
  cookie page below.
- The YouTube link is `[YouTube kanāla adrese]`. Is there a channel?

---

## Homepage

### Team section ("Aizkulisēs")

Built as `SectionTeamV2.astro`, last on the homepage above the footer. The
order may change. A 16:9 frame for the team photo or video sits above six
credit lines, set like the credits on a record sleeve. Pointing at a name, or
at the person in the photo, dims the frame except for a spotlight on that
person. Nothing is lit until someone points, so nobody is picked out by
default. "Iepazīt mūs" leads to `/par-studeja`.

Known:

- Founders: Emīls Bauga, Ralfs Arbidāns, Kristaps Višs and Imants Spīčs (company
  file §5). The company file does not confirm board roles or signing rights, so
  roles describe the work, not company positions.
- Madara Arbidāne, "Sociālo tīklu guru".
- Damians Pavlovičs runs stage management and logistics: who, what and where
  at each moment. The title must not read as a helper's. "Diriģents" is out,
  because in music it means a conductor.

Questions:

- Each person's role. Founders show `[Loma]`, Damians shows
  `[Skatuves un loģistikas vadītājs]`.
- Team photo or video. Once there is one, set each person's `x` and `y` in
  `src/pages/index.astro` to where they stand in it. With a video, the
  spotlight only works if people stay in place, so shoot a mostly still group
  or drop the spotlight.
- The Latgalian hover label for "Iepazīt mūs". It shows `[LATGALISKI]` now.
- Should the spotlight move through the people on its own when nobody is
  pointing? It would be allowed, since it lights everyone in turn, but it adds
  motion to a page that already has a lot.
- At 1280×720 the section is 15px taller than the screen, and at 360×740 it is
  47px taller, because the frame has hit its minimum size. Accept, or shorten
  the description on small screens?

---

## Pages

### `/par-studeja`

Known:

- Company description: company file §4. Longer draft: brief §6 ("Kopiena, kas
  rada.").
- Team: the same people records as the homepage section and the musician pages.
- The FAQ section appears here and on `/kontakti` (see below).
- Keep the founders' earlier projects apart from STUDEJA's own work (brief §6).

Questions:

- Sections and their order. Story, team, community, FAQ, then a call to
  action?
- Full bios, or roles only?

### FAQ section

One section, used on `/par-studeja` and on `/kontakti`. The footer link
"Biežāk uzdotie jautājumi" goes to `/kontakti#buj`, and so do three search
entries in `SEARCH_INDEX`.

Known:

- Nine questions with answers are drafted in brief §14. Six of them were on the
  v1 homepage, in `src/pages/legacy/homepage-v1.astro`.
- Deposits, cancellation fees, minimum notice and guaranteed reply times are not
  approved. Do not publish them (brief §14, company file §10).

Questions:

- Same questions on both pages, or a different selection for each?
- Accordion, or all answers open?

### `/kontakti`

Known:

- info@studeja.lv, +371 26394018, studio at Strādnieku šķērsiela 5, Rēzekne,
  LV-4604 (company file §2–3).
- SIA STUDEJA, reg. no. 40203740201. The legal address is different from the
  studio: Rēzeknes nov., Gaigalavas pag., Cīmota, "Atmoda", LV-4618.
- Links to both forms: `/pieteikums` and `/sadarbiba`.
- Email and phone must be clickable, so people can still reach STUDEJA when the
  form is down.
- Do not publish bank details (brief §13).

Questions:

- Studio opening hours. Can people drop in, or only by appointment? (company
  file §10)
- A map, only if the studio takes visitors.
- A published reply time, only once one is agreed.
- VAT number, if STUDEJA has one.

### `/pieteikums`

The enquiry form for clients: booking artists or programmes, events, services.

Known:

- Fields from brief §8: what they are interested in (several choices allowed),
  programme or artist if they came from the catalogue, description, date or
  period with a "not known yet" option, place, guest count, budget, name and
  organisation, email, phone (optional).
- Required: name, email, description.
- Opens with the item filled in when it comes from a link. `?pakalpojums=<id>`
  is already sent by the services section. Programme and artist pages will need
  their own parameter.
- Status texts: "Pieteikums saņemts. Sazināsimies, lai precizētu detaļas un
  nākamos soļus." / "Pieteikumu neizdevās nosūtīt. Mēģini vēlreiz vai raksti uz
  info@studeja.lv. Vari arī zvanīt: +371 26394018." (company file §8)
- Under the form: "Pieteikuma nosūtīšana nav rezervācijas apstiprinājums."
- Privacy note by the form, from company file §7. Do not add a mandatory "I
  agree to the privacy policy" checkbox (brief §15).

Questions:

- Which parameter names for programmes and artists, e.g. `?programma=` and
  `?makslinieks=`?
- The form backend, see "Form delivery".

### `/sadarbiba`

For musicians and bands, and for other partners (venues, municipalities,
technical and media crews), who want to work with STUDEJA. It has a form and
more text than `/pieteikums` about what STUDEJA expects.

Known:

- Draft line from brief §17: "Vēlies sadarboties ar STUDEJA? Pastāsti par savu
  darbību un ieceri. Pievieno saiti uz mūziku, video vai paveikto darbu
  piemēriem."
- No event date or guest count fields here.
- Ask for links to material. Add file upload only if there is a real need and
  safe handling for it.
- Management and music production are the services aimed at musicians, so this
  page is a natural place to mention them.

Questions:

- What does STUDEJA expect from musicians, and what from partners? Genres,
  experience, availability, region?
- One form with a "musician / partner" choice, or two forms on the page?
- What happens after someone applies, and how soon do they hear back?

### `/projekti` and project pages

"Projekti un sasniegumi". A list page plus one page per project. Not shown on
the homepage.

Known:

- Per project (brief §7, §17): name, date, place, idea, what STUDEJA did,
  partners and their part, photo or video with credits, and a testimonial if
  one is approved.
- Mark which work is STUDEJA's and which is earlier experience of team members.
- SPAITS: 5 July 2026, Kovšu ezers, Rēzekne. Name the co-organisers and never
  present STUDEJA as the only organiser. SPAITS's line-up is not STUDEJA's
  bookable catalogue. Source: https://spaits.studeja.lv/
- Check publishing rights before using photos of identifiable people, private
  events or children.

Questions:

- What are "sasniegumi" beyond projects? Awards, releases, numbers?
- Which projects besides SPAITS are ready to publish?
- Does the list need categories or filters (own events, client events,
  partnerships)?

### Programme, band and musician pages

`/koncertprogrammas/[slug]`, `/makslinieki/[slug]`, `/muziki/[slug]`.

Known:

- Programme page contents: brief §3, listed under "Fill in the programmes".
- Band page: name, short description, photo, story, video or audio, members,
  programmes, enquiry button (brief §3).
- Musician page: photo, instruments, short bio, bands they play in, projects.
- Every deep page links back to the catalogue (brief §12).
- The catalogue label "Mākslinieki STUDEJA piedāvājumā" fits the whole list.
  Mention a representation agreement only if one exists (brief §3).

Questions:

- Depends on "Choose where catalogue content lives".
- The programme card links are `[Programmas lapa]` until these pages exist.

### `/meklet`: search and catalogue

One results page for everything, instead of separate lists for programmes,
bands and musicians. Every content item is findable there, plus fixed entries
like pages, contacts and FAQ.

Known:

- Text search, plus filters by type (programmes, artists, musicians, projects,
  pages).
- Links from elsewhere open it pre-filtered: `?tips=koncertprogrammas`,
  `?tips=makslinieki`, and `&notikums=<id>` from the programme pills.
- The nav search box already searches `SEARCH_INDEX` in `src/consts.ts`, a
  hand-written list. Replace it with an index built from the content, so a new
  programme is searchable as soon as it is added.
- Empty result text from brief §18: "Šādiem filtriem piedāvājumi nav atrasti",
  with a way to clear the filters.

Questions:

- Search in the browser (a JSON index built at build time, for example
  Pagefind) or through the CMS's search API?
- Which filters beyond type? Genre, event type, line-up, language?
- Should pressing Enter in the nav search box open this page with the typed
  text?

### Privacy policy and cookies

`/privatuma-politika` and `/sikdatnes`.

Known:

- Structure of the privacy policy: brief §15. Controller details: company
  file §7.
- Cookie rules: brief §16. Banner only if the site really uses optional
  cookies. Choices "Pieņemt visas", "Noraidīt neobligātās", "Pielāgot", none
  preselected.
- Both need to exist in Latvian and English, and be linked from every form.

Questions:

- Hosting, form tool, email, analytics and outside widgets. These decide what
  the policy has to say. Elfsight is already one of the widgets.
- How long is each kind of data kept? (company file §10)

### 404 page

`src/pages/404.astro` is still the framework's English page on the old layout.
Rewrite it in Latvian on the v2 look: "Šī lapa nav atrasta.", with links to the
homepage, the catalogue and contacts (brief §18).

### English version

The nav links to `/en/`, which does not exist.

Questions:

- Build the English pages now, or hide the language switch until they exist?
- Latgalian is planned later (brief §9). The hero and button labels already use
  some Latgalian.

---

## Functionality and setup

### Form delivery

Known:

- All enquiries go to one place and keep track of which programme or service
  they came from (brief §8).
- Show "sent" only after the server confirms. On error, keep what was typed and
  show the email and phone.
- No personal data in analytics events or URLs.

Questions:

- Where do submissions go: email, a form service, a CRM? The public address is
  info@studeja.lv, but that does not mean form delivery is set up (company
  file §8).
- Spam protection.

### Deploy

`wrangler.jsonc` still has the framework's name (`lumos-for-astro`) and route
(`preview.lumosframework.com`).

Questions:

- Is the site going to Cloudflare, on which account, and when does studeja.lv
  point to it?

### Legacy pages

`/legacy/homepage-v1` still uses the v1 nav (`src/components/Global/Nav.astro`),
which links to routes that no longer exist. It is not indexed. Delete it and
the v1-only components once nothing needs them for reference.
