export type Topic = {
  id: string;
  section: string;
  sectionShort: string;
  question: string;
};

const sections = [
  {
    code: "PV",
    name: "Products, pricing and value",
    short: "Price & value",
    questions: [
      "How are reference prices and discounts framed on online fashion product pages?",
      "Do price endings differ across product categories in online grocery listings?",
      "How clearly do published delivery-fee pages explain the final charge?",
      "How do subscription services visually and verbally differentiate plan tiers?",
      "How visible are free-trial conditions and post-trial prices?",
      "How comparable are pack sizes and unit values in marketplace listings?",
      "How are EMI or pay-later options framed on high-value product pages?",
      "When does a bundle offer provide a verifiable monetary advantage?",
      "What kinds of value are promised in public product-warranty descriptions?",
      "How do premium consumer products justify higher prices?",
    ],
  },
  {
    code: "AP",
    name: "Advertising, persuasion and consumer attention",
    short: "Persuasion",
    questions: [
      "How frequently do commerce landing pages use scarcity or urgency cues?",
      "What forms of social proof appear on direct-to-consumer homepages?",
      "How are superlative and leadership claims qualified?",
      "How do brands use festival or cultural cues in public digital promotions?",
      "Do product pages emphasize functional or emotional benefits?",
      "How do services describe personalization?",
      "How are wellness benefits expressed on consumer product pages?",
      "How are gender roles represented in official commerce campaign images?",
      "How consistently do official brand collaborations disclose sponsorship?",
      "What calls to action dominate digital commerce landing pages?",
    ],
  },
  {
    code: "CR",
    name: "Consumer experience, trust and redressal",
    short: "Trust & redressal",
    questions: [
      "How do published return windows differ across online retailers or categories?",
      "How clearly are refund timelines stated?",
      "What conditions govern cancellation before fulfilment?",
      "How discoverable are grievance and escalation contacts?",
      "What customer-support channels are publicly offered?",
      "What exclusions dominate public warranty policies?",
      "How are privacy choices presented on public consumer pages?",
      "How readable are return, refund or cancellation policies?",
      "How explicit are complaint-escalation steps?",
      "What remedies are promised for damaged, missing or incorrect orders?",
    ],
  },
  {
    code: "PM",
    name: "Platforms, marketplaces and work",
    short: "Platforms & work",
    questions: [
      "What benefits do marketplaces promise prospective sellers?",
      "How transparent are seller fees on public marketplace pages?",
      "How is flexibility framed in delivery- or service-partner recruitment?",
      "How are earning opportunities quantified and qualified?",
      "How do platforms explain rating and review systems?",
      "What seller-dispute routes are publicly described?",
      "What safety mechanisms do service platforms publicly describe?",
      "How do platforms explain recommendations or ranking to users?",
      "How are local or small sellers made visible on marketplace pages?",
      "What benefits and protections are described for platform partners?",
    ],
  },
  {
    code: "EM",
    name: "Entrepreneurship, MSMEs and local commerce",
    short: "Enterprise & MSMEs",
    questions: [
      "How clearly do lenders describe public eligibility for MSME credit products?",
      "What support is offered through women-entrepreneur programmes?",
      "How transparent are incubator or accelerator selection criteria?",
      "How do B2B software providers promise to digitise small businesses?",
      "What export-readiness barriers and solutions are named by service providers?",
      "How complete are public franchise opportunity disclosures?",
      "How do founders narrate business origins on official company pages?",
      "How actionable is the information on public entrepreneurship-scheme pages?",
      "What value do digital tools promise small retailers or service firms?",
      "How clearly do payment gateways explain merchant onboarding?",
    ],
  },
  {
    code: "IA",
    name: "Inclusion, access and representation",
    short: "Inclusion & access",
    questions: [
      "How available and complete are regional-language options on commerce websites?",
      "What commitments appear in public digital-accessibility statements?",
      "How well do public commerce pages support basic structural accessibility?",
      "How readable are public descriptions of consumer financial products?",
      "How are products or services tailored publicly for senior citizens?",
      "How do public job pages describe disability inclusion?",
      "How are products marketed specifically to women consumers or entrepreneurs?",
      "How do businesses address rural, small-town or ‘Bharat’ markets?",
      "What low-connectivity or offline-use features are publicly promised?",
      "Who is represented as the decision-maker in commerce campaign imagery?",
    ],
  },
  {
    code: "SR",
    name: "Sustainability and responsible business",
    short: "Responsible business",
    questions: [
      "How often do sustainability pages include quantified and dated targets?",
      "How are sustainable-packaging claims qualified on product or brand pages?",
      "What evidence supports responsible-sourcing claims?",
      "How actionable are take-back, repair or recycling programmes?",
      "How are carbon-neutral or net-zero claims bounded?",
      "What kinds of water-stewardship evidence are publicly reported?",
      "How specific are public supplier codes on responsible business?",
      "Do homepage sustainability claims match the detail in linked reports?",
      "What external standards or certifications are invoked in sustainability communication?",
      "How specific are ‘green’, ‘eco-friendly’ or similar product claims?",
    ],
  },
  {
    code: "AD",
    name: "AI, data and automation in commerce",
    short: "AI & automation",
    questions: [
      "What business outcomes are promised on AI-enabled product pages?",
      "Is AI framed as replacing work or augmenting human judgment?",
      "What commitments appear in public responsible-AI principles?",
      "How clearly are customer-facing chatbots identified as automated?",
      "What human-escalation routes are offered in AI-enabled services?",
      "How do organizations explain data use in AI-enabled features?",
      "What evidence is offered for commercial AI performance claims?",
      "What AI skills are requested in entry-level Commerce-related job advertisements?",
      "What limitations or disclaimers accompany generative-AI features?",
      "How do organizations disclose AI use in public content or decision processes?",
    ],
  },
] as const;

export const topics: Topic[] = sections.flatMap((section) =>
  section.questions.map((question, index) => ({
    id: `${section.code}${String(index + 1).padStart(2, "0")}`,
    section: section.name,
    sectionShort: section.short,
    question,
  })),
);

export const topicSections = sections.map(({ code, name, short }) => ({
  code,
  name,
  short,
}));

export const sectionColours: Record<string, string> = {
  PV: "coral",
  AP: "amber",
  CR: "teal",
  PM: "navy",
  EM: "plum",
  IA: "sage",
  SR: "green",
  AD: "blue",
};
