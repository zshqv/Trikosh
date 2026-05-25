import type { Company, CardData, GlossaryTerm, SectorSnapshot, ResearchKit } from './types'

export const COMPANIES: Company[] = [
  // Financial Services
  {
    ticker: 'JPM', exchange: 'NYSE', name: 'JPMorgan Chase & Co.',
    sector: 'Financial Services', industry: 'Diversified Banks',
    analyticalLens: 'The benchmark for large-cap banking — sets the standard against which all US commercial banks are measured.',
  },
  {
    ticker: 'BAC', exchange: 'NYSE', name: 'Bank of America Corp.',
    sector: 'Financial Services', industry: 'Diversified Banks',
    analyticalLens: 'The most rate-sensitive of the mega-banks, making it the clearest lens for understanding net interest margin dynamics across rate cycles.',
  },
  {
    ticker: 'GS', exchange: 'NYSE', name: 'Goldman Sachs Group Inc.',
    sector: 'Financial Services', industry: 'Investment Banking & Brokerage',
    analyticalLens: 'The purest investment bank in the US — analysing GS reveals how capital markets revenues fluctuate with deal activity and market volatility.',
  },
  {
    ticker: 'MS', exchange: 'NYSE', name: 'Morgan Stanley',
    sector: 'Financial Services', industry: 'Investment Banking & Brokerage',
    analyticalLens: 'The clearest example of a Wall Street bank successfully pivoting toward wealth management, reducing earnings volatility in the process.',
  },
  {
    ticker: 'BLK', exchange: 'NYSE', name: 'BlackRock Inc.',
    sector: 'Financial Services', industry: 'Asset Management',
    analyticalLens: 'The world\'s largest asset manager — understanding BLK means understanding AUM flows, fee compression, and scale economics in passive investing.',
  },
  {
    ticker: 'WFC', exchange: 'NYSE', name: 'Wells Fargo & Co.',
    sector: 'Financial Services', industry: 'Diversified Banks',
    analyticalLens: 'A turnaround story constrained by a Federal Reserve asset cap — the clearest example of regulatory risk overhanging a bank\'s earnings power.',
  },
  {
    ticker: 'AXP', exchange: 'NYSE', name: 'American Express Co.',
    sector: 'Financial Services', industry: 'Consumer Finance',
    analyticalLens: 'The premium spend-centric card network — illustrates how a closed-loop model captures both issuing economics and network fees simultaneously.',
  },
  {
    ticker: 'C', exchange: 'NYSE', name: 'Citigroup Inc.',
    sector: 'Financial Services', industry: 'Diversified Banks',
    analyticalLens: 'The most globally complex US bank, undergoing a multi-year simplification — useful for studying the cost of operating a sprawling international footprint.',
  },
  {
    ticker: 'USB', exchange: 'NYSE', name: 'U.S. Bancorp',
    sector: 'Financial Services', industry: 'Diversified Banks',
    analyticalLens: 'The largest pure-play US regional bank, valued for consistent efficiency ratios and fee income diversity relative to its size.',
  },
  {
    ticker: 'PNC', exchange: 'NYSE', name: 'PNC Financial Services Group',
    sector: 'Financial Services', industry: 'Diversified Banks',
    analyticalLens: 'A mid-size regional bank that demonstrates how geographic focus and organic loan growth drive returns without relying on investment banking revenue.',
  },
  // AI & Technology
  {
    ticker: 'MSFT', exchange: 'NASDAQ', name: 'Microsoft Corp.',
    sector: 'AI & Technology', industry: 'Systems Software',
    analyticalLens: 'The clearest case study in enterprise cloud transition — Azure\'s growth trajectory shows how legacy software revenue transforms into recurring cloud revenue.',
  },
  {
    ticker: 'GOOGL', exchange: 'NASDAQ', name: 'Alphabet Inc.',
    sector: 'AI & Technology', industry: 'Interactive Media & Services',
    analyticalLens: 'Advertising dependency meets cloud ambition — understanding GOOGL means analysing the risk of revenue concentration versus the diversification optionality of GCP.',
  },
  {
    ticker: 'NVDA', exchange: 'NASDAQ', name: 'NVIDIA Corp.',
    sector: 'AI & Technology', industry: 'Semiconductors',
    analyticalLens: 'The infrastructure layer of the AI boom — understanding NVDA is understanding AI capex cycles and the economics of GPU platform monopoly.',
  },
  {
    ticker: 'META', exchange: 'NASDAQ', name: 'Meta Platforms Inc.',
    sector: 'AI & Technology', industry: 'Interactive Media & Services',
    analyticalLens: 'The most efficient monetiser of attention in digital advertising — studying META illuminates social platform economics and the ROI calculus of Reality Labs investment.',
  },
  {
    ticker: 'AMZN', exchange: 'NASDAQ', name: 'Amazon.com Inc.',
    sector: 'AI & Technology', industry: 'Internet & Direct Marketing Retail',
    analyticalLens: 'AWS margin subsidises the retail flywheel — AMZN is the archetype of using profitable infrastructure businesses to fund low-margin consumer growth.',
  },
  {
    ticker: 'AAPL', exchange: 'NASDAQ', name: 'Apple Inc.',
    sector: 'AI & Technology', industry: 'Technology Hardware & Storage',
    analyticalLens: 'The premium hardware ecosystem play — Services revenue growth is the story; hardware is the installed base that makes Services economics possible.',
  },
  {
    ticker: 'CRM', exchange: 'NYSE', name: 'Salesforce Inc.',
    sector: 'AI & Technology', industry: 'Application Software',
    analyticalLens: 'The defining SaaS company — studying CRM means understanding how net revenue retention, sales efficiency, and operating leverage interact in enterprise software.',
  },
  {
    ticker: 'ADBE', exchange: 'NASDAQ', name: 'Adobe Inc.',
    sector: 'AI & Technology', industry: 'Application Software',
    analyticalLens: 'The benchmark for creative software monetisation — Adobe\'s subscription transition is the clearest case study in SaaS conversion from perpetual licenses.',
  },
  {
    ticker: 'ORCL', exchange: 'NYSE', name: 'Oracle Corp.',
    sector: 'AI & Technology', industry: 'Systems Software',
    analyticalLens: 'Database incumbency meets cloud infrastructure — Oracle\'s OCI growth shows how legacy enterprise vendors leverage sticky customer relationships for cloud migration.',
  },
  {
    ticker: 'INTC', exchange: 'NASDAQ', name: 'Intel Corp.',
    sector: 'AI & Technology', industry: 'Semiconductors',
    analyticalLens: 'The canonical case of technological disruption in semiconductors — studying INTC reveals the compounding cost of ceding manufacturing leadership to TSMC.',
  },
  // Healthcare
  {
    ticker: 'JNJ', exchange: 'NYSE', name: 'Johnson & Johnson',
    sector: 'Healthcare', industry: 'Pharmaceuticals',
    analyticalLens: 'The diversified healthcare conglomerate benchmark — post-Kenvue spin-off, JNJ is a pure pharma and MedTech story worth studying for segment contribution analysis.',
  },
  {
    ticker: 'UNH', exchange: 'NYSE', name: 'UnitedHealth Group Inc.',
    sector: 'Healthcare', industry: 'Managed Health Care',
    analyticalLens: 'The largest US health insurer by revenue, a proxy for understanding managed care economics, medical loss ratios, and vertical integration in healthcare.',
  },
  {
    ticker: 'PFE', exchange: 'NYSE', name: 'Pfizer Inc.',
    sector: 'Healthcare', industry: 'Pharmaceuticals',
    analyticalLens: 'Post-COVID revenue normalization in real time — PFE illustrates how a pharma company\'s revenue profile transforms when a blockbuster product cycles off.',
  },
  {
    ticker: 'ABBV', exchange: 'NYSE', name: 'AbbVie Inc.',
    sector: 'Healthcare', industry: 'Pharmaceuticals',
    analyticalLens: 'The Humira cliff and what comes next — ABBV is the definitive study of patent cliff risk and pipeline-led revenue replacement in specialty pharma.',
  },
  {
    ticker: 'MRK', exchange: 'NYSE', name: 'Merck & Co. Inc.',
    sector: 'Healthcare', industry: 'Pharmaceuticals',
    analyticalLens: 'Keytruda concentration risk meets oncology dominance — MRK shows how a single blockbuster drug can define an entire company\'s growth trajectory and risk profile.',
  },
  {
    ticker: 'TMO', exchange: 'NYSE', name: 'Thermo Fisher Scientific Inc.',
    sector: 'Healthcare', industry: 'Life Sciences Tools & Services',
    analyticalLens: 'The picks-and-shovels play on biotech and pharma R&D — TMO revenues correlate with industry-wide research spending rather than the success of any single drug.',
  },
  {
    ticker: 'ABT', exchange: 'NYSE', name: 'Abbott Laboratories',
    sector: 'Healthcare', industry: 'Health Care Equipment',
    analyticalLens: 'The diversified medical device and diagnostics company — ABT\'s segment mix shows how to analyse a multi-product healthcare business across different growth cycles.',
  },
  {
    ticker: 'DHR', exchange: 'NYSE', name: 'Danaher Corp.',
    sector: 'Healthcare', industry: 'Life Sciences Tools & Services',
    analyticalLens: 'The Danaher Business System in practice — studying DHR is studying how rigorous operational discipline and disciplined M&A create compounding returns.',
  },
  {
    ticker: 'BMY', exchange: 'NYSE', name: 'Bristol-Myers Squibb Co.',
    sector: 'Healthcare', industry: 'Pharmaceuticals',
    analyticalLens: 'A highly acquisitive pharma navigating multiple patent cliffs simultaneously — BMY illustrates the M&A-driven approach to sustaining pharmaceutical revenue.',
  },
  {
    ticker: 'AMGN', exchange: 'NYSE', name: 'Amgen Inc.',
    sector: 'Healthcare', industry: 'Biotechnology',
    analyticalLens: 'The original biotech bellwether — AMGN demonstrates how a biologic franchise generates durable cash flows and how those flows are deployed in capital allocation.',
  },
  // Consumer & Retail
  {
    ticker: 'WMT', exchange: 'NYSE', name: 'Walmart Inc.',
    sector: 'Consumer & Retail', industry: 'Hypermarket & Super Center',
    analyticalLens: 'The world\'s largest retailer by revenue — Walmart\'s price leadership and supply chain scale set the benchmark against which all mass-market retail is measured.',
  },
  {
    ticker: 'COST', exchange: 'NASDAQ', name: 'Costco Wholesale Corp.',
    sector: 'Consumer & Retail', industry: 'Wholesale Clubs',
    analyticalLens: 'The membership model in its purest form — Costco\'s economics show how locking customers into annual fees allows near-zero product margins while generating exceptional returns on capital.',
  },
  {
    ticker: 'TGT', exchange: 'NYSE', name: 'Target Corp.',
    sector: 'Consumer & Retail', industry: 'Broadline Retail',
    analyticalLens: 'The differentiated general merchandise retailer — Target\'s mix of owned brands and curated assortment illustrates how a mid-market retailer sustains margins against both Walmart on price and Amazon on convenience.',
  },
  {
    ticker: 'HD', exchange: 'NYSE', name: 'Home Depot Inc.',
    sector: 'Consumer & Retail', industry: 'Home Improvement Retail',
    analyticalLens: 'The canonical high-ticket discretionary retailer — Home Depot\'s performance tracks housing turnover and remodelling demand, making it the clearest lens for understanding consumer spending on big-ticket categories.',
  },
  {
    ticker: 'NKE', exchange: 'NYSE', name: 'Nike Inc.',
    sector: 'Consumer & Retail', industry: 'Footwear',
    analyticalLens: 'The global athletic brand benchmark — Nike\'s DTC transition illustrates how incumbent consumer brands are restructuring distribution to capture margin and own the customer relationship directly.',
  },
  {
    ticker: 'SBUX', exchange: 'NASDAQ', name: 'Starbucks Corp.',
    sector: 'Consumer & Retail', industry: 'Restaurants',
    analyticalLens: 'The loyalty program as a financial instrument — Starbucks\' rewards ecosystem generates float and purchasing data that fundamentally changes the economics of a restaurant chain.',
  },
  {
    ticker: 'MCD', exchange: 'NYSE', name: 'McDonald\'s Corp.',
    sector: 'Consumer & Retail', industry: 'Restaurants',
    analyticalLens: 'The franchise model at maximum scale — understanding McDonald\'s means understanding how a real estate and licensing business masquerades as a restaurant company, and why that matters for margin structure.',
  },
  {
    ticker: 'PG', exchange: 'NYSE', name: 'Procter & Gamble Co.',
    sector: 'Consumer & Retail', industry: 'Household Products',
    analyticalLens: 'The defensive consumer staples benchmark — P&G\'s brand portfolio and pricing power through inflationary cycles illustrates the durable earnings quality of category-dominant consumer goods companies.',
  },
  {
    ticker: 'KO', exchange: 'NYSE', name: 'Coca-Cola Co.',
    sector: 'Consumer & Retail', industry: 'Beverages',
    analyticalLens: 'The asset-light branded consumer model — Coca-Cola\'s concentrate business with independent bottlers demonstrates how brand ownership separates from manufacturing to generate exceptional capital efficiency.',
  },
  {
    ticker: 'LOW', exchange: 'NYSE', name: 'Lowe\'s Companies Inc.',
    sector: 'Consumer & Retail', industry: 'Home Improvement Retail',
    analyticalLens: 'The number two home improvement retailer pursuing operational convergence with Home Depot — Lowe\'s Pro segment growth and margin expansion story illustrates how a follower-strategy closes the gap on an entrenched leader.',
  },
  // Consumer Internet & Digital Platforms
  {
    ticker: 'NFLX', exchange: 'NASDAQ', name: 'Netflix Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Streaming Entertainment',
    analyticalLens: 'The streaming subscription model reaching profitability inflection — Netflix\'s transition from growth-at-all-costs to margin expansion is the defining case study in how digital subscription businesses monetise at scale.',
  },
  {
    ticker: 'UBER', exchange: 'NYSE', name: 'Uber Technologies Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Ride-sharing & Delivery',
    analyticalLens: 'The gig economy platform at scale — Uber\'s path to GAAP profitability illustrates how marketplace businesses absorb enormous early losses to establish network density before monetising the take rate.',
  },
  {
    ticker: 'ABNB', exchange: 'NASDAQ', name: 'Airbnb Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Travel Platforms',
    analyticalLens: 'The asset-light travel marketplace — Airbnb\'s take rate on host earnings and capital-light model shows how platform businesses can generate superior returns without owning the underlying assets.',
  },
  {
    ticker: 'BKNG', exchange: 'NASDAQ', name: 'Booking Holdings Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Online Travel',
    analyticalLens: 'The most profitable online travel aggregator — Booking\'s merchant model and performance marketing economics set the standard for take rate sustainability in travel platforms.',
  },
  {
    ticker: 'SPOT', exchange: 'NYSE', name: 'Spotify Technology S.A.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Audio Streaming',
    analyticalLens: 'The audio streaming platform navigating structural margin constraints — Spotify\'s label royalty economics illustrate the challenge of building a durable business when the content owner holds the pricing leverage.',
  },
  {
    ticker: 'LYFT', exchange: 'NASDAQ', name: 'Lyft Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Ride-sharing',
    analyticalLens: 'The number two ride-share platform confined to North America — Lyft\'s narrower scope versus Uber illustrates the trade-off between focus and optionality in platform markets, and how network density economics play out in a duopoly.',
  },
  {
    ticker: 'DASH', exchange: 'NYSE', name: 'DoorDash Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Food Delivery',
    analyticalLens: 'The food delivery market share leader still proving unit economics — DoorDash\'s path from loss-making logistics to marketplace profitability is the clearest live experiment in delivery platform economics.',
  },
  {
    ticker: 'PINS', exchange: 'NYSE', name: 'Pinterest Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Social Media',
    analyticalLens: 'The intent-driven social platform — Pinterest\'s purchase-intent user base commands premium CPMs versus awareness-only platforms, illustrating how audience quality drives monetisation rate.',
  },
  {
    ticker: 'SNAP', exchange: 'NYSE', name: 'Snap Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Social Media',
    analyticalLens: 'The social media platform with a structurally difficult monetisation model — Snap\'s ARPU gap versus Meta illustrates how audience demographics and ad measurement capabilities determine ad pricing power.',
  },
  {
    ticker: 'RDDT', exchange: 'NASDAQ', name: 'Reddit Inc.',
    sector: 'Consumer Internet & Digital Platforms', industry: 'Social Media',
    analyticalLens: 'The community-driven platform at early monetisation stage — Reddit\'s data licensing and advertising businesses show how a platform with high user intent but modest ARPU attempts to build sustainable revenue from a uniquely structured audience.',
  },
]

export const MOCK_CARDS: CardData[] = [
  // Financial Services cards
  {
    company: COMPANIES.find(c => c.ticker === 'JPM')!,
    primaryMetric: { label: 'ROE', value: 0.177, unit: 'PCT', period: 'FY2024', delta: 0.018 },
    secondaryMetric: { label: 'Net Interest Margin', value: 0.027, unit: 'PCT', period: 'FY2024', delta: 0.003 },
    ratios: [
      { label: 'P/E', value: 12.8, unit: 'MULTIPLE', period: 'FY2024' },
      { label: 'CET1', value: 0.153, unit: 'PCT', period: 'FY2024' },
      { label: 'ROA', value: 0.013, unit: 'PCT', period: 'FY2024' },
      { label: 'Eff. Ratio', value: 0.52, unit: 'PCT', period: 'FY2024' },
    ],
    sparkline: [0.14, 0.15, 0.13, 0.16, 0.17, 0.177],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2024', updatedAt: '2025-01-14', currency: 'USD' },
  },
  {
    company: COMPANIES.find(c => c.ticker === 'GS')!,
    primaryMetric: { label: 'ROE', value: 0.114, unit: 'PCT', period: 'FY2024', delta: 0.024 },
    secondaryMetric: { label: 'Net Interest Margin', value: 0.019, unit: 'PCT', period: 'FY2024', delta: -0.001 },
    ratios: [
      { label: 'P/E', value: 14.1, unit: 'MULTIPLE', period: 'FY2024' },
      { label: 'CET1', value: 0.147, unit: 'PCT', period: 'FY2024' },
      { label: 'ROA', value: 0.009, unit: 'PCT', period: 'FY2024' },
      { label: 'Eff. Ratio', value: 0.64, unit: 'PCT', period: 'FY2024' },
    ],
    sparkline: [0.08, 0.05, 0.09, 0.10, 0.09, 0.114],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2024', updatedAt: '2025-01-16', currency: 'USD' },
  },
  {
    company: COMPANIES.find(c => c.ticker === 'BAC')!,
    primaryMetric: { label: 'ROE', value: 0.093, unit: 'PCT', period: 'FY2024', delta: -0.008 },
    secondaryMetric: { label: 'Net Interest Margin', value: 0.021, unit: 'PCT', period: 'FY2024', delta: 0.001 },
    ratios: [
      { label: 'P/E', value: 13.2, unit: 'MULTIPLE', period: 'FY2024' },
      { label: 'CET1', value: 0.136, unit: 'PCT', period: 'FY2024' },
      { label: 'ROA', value: 0.007, unit: 'PCT', period: 'FY2024' },
      { label: 'Eff. Ratio', value: 0.66, unit: 'PCT', period: 'FY2024' },
    ],
    sparkline: [0.09, 0.10, 0.08, 0.09, 0.10, 0.093],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2024', updatedAt: '2025-01-15', currency: 'USD' },
  },
  // AI & Technology cards
  {
    company: COMPANIES.find(c => c.ticker === 'MSFT')!,
    primaryMetric: { label: 'FCF Margin', value: 0.341, unit: 'PCT', period: 'FY2024', delta: 0.028 },
    secondaryMetric: { label: 'Revenue Growth YoY', value: 0.158, unit: 'PCT', period: 'FY2024', delta: 0.012 },
    ratios: [
      { label: 'P/E', value: 34.2, unit: 'MULTIPLE', period: 'FY2024' },
      { label: 'Gross Margin', value: 0.699, unit: 'PCT', period: 'FY2024' },
      { label: 'Op. Margin', value: 0.446, unit: 'PCT', period: 'FY2024' },
      { label: 'R&D %', value: 0.125, unit: 'PCT', period: 'FY2024' },
    ],
    sparkline: [196e9, 168e9, 198e9, 211e9, 245e9, 261e9],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2024', updatedAt: '2025-01-29', currency: 'USD' },
  },
  {
    company: COMPANIES.find(c => c.ticker === 'NVDA')!,
    primaryMetric: { label: 'FCF Margin', value: 0.552, unit: 'PCT', period: 'FY2025', delta: 0.187 },
    secondaryMetric: { label: 'Revenue Growth YoY', value: 1.142, unit: 'PCT', period: 'FY2025', delta: 0.842 },
    ratios: [
      { label: 'P/E', value: 52.1, unit: 'MULTIPLE', period: 'FY2025' },
      { label: 'Gross Margin', value: 0.749, unit: 'PCT', period: 'FY2025' },
      { label: 'Op. Margin', value: 0.618, unit: 'PCT', period: 'FY2025' },
      { label: 'R&D %', value: 0.103, unit: 'PCT', period: 'FY2025' },
    ],
    sparkline: [10.9e9, 16.7e9, 26.9e9, 44.9e9, 60.9e9, 130.5e9],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2025', updatedAt: '2025-02-26', currency: 'USD' },
  },
  {
    company: COMPANIES.find(c => c.ticker === 'AAPL')!,
    primaryMetric: { label: 'FCF Margin', value: 0.264, unit: 'PCT', period: 'FY2024', delta: 0.009 },
    secondaryMetric: { label: 'Revenue Growth YoY', value: 0.020, unit: 'PCT', period: 'FY2024', delta: -0.014 },
    ratios: [
      { label: 'P/E', value: 30.8, unit: 'MULTIPLE', period: 'FY2024' },
      { label: 'Gross Margin', value: 0.461, unit: 'PCT', period: 'FY2024' },
      { label: 'Op. Margin', value: 0.314, unit: 'PCT', period: 'FY2024' },
      { label: 'R&D %', value: 0.079, unit: 'PCT', period: 'FY2024' },
    ],
    sparkline: [274e9, 365e9, 394e9, 383e9, 385e9, 391e9],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2024', updatedAt: '2024-11-01', currency: 'USD' },
  },
  // Healthcare cards
  {
    company: COMPANIES.find(c => c.ticker === 'UNH')!,
    primaryMetric: { label: 'Gross Margin', value: 0.248, unit: 'PCT', period: 'FY2024', delta: -0.009 },
    secondaryMetric: { label: 'R&D as % Revenue', value: 0.005, unit: 'PCT', period: 'FY2024', delta: 0.001 },
    ratios: [
      { label: 'P/E', value: 19.4, unit: 'MULTIPLE', period: 'FY2024' },
      { label: 'Op. Margin', value: 0.068, unit: 'PCT', period: 'FY2024' },
      { label: 'MLR', value: 0.843, unit: 'PCT', period: 'FY2024' },
      { label: 'ROE', value: 0.261, unit: 'PCT', period: 'FY2024' },
    ],
    sparkline: [0.228, 0.238, 0.246, 0.249, 0.257, 0.248],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2024', updatedAt: '2025-01-16', currency: 'USD' },
  },
  {
    company: COMPANIES.find(c => c.ticker === 'JNJ')!,
    primaryMetric: { label: 'Gross Margin', value: 0.684, unit: 'PCT', period: 'FY2024', delta: 0.012 },
    secondaryMetric: { label: 'R&D as % Revenue', value: 0.154, unit: 'PCT', period: 'FY2024', delta: 0.008 },
    ratios: [
      { label: 'P/E', value: 14.8, unit: 'MULTIPLE', period: 'FY2024' },
      { label: 'Op. Margin', value: 0.213, unit: 'PCT', period: 'FY2024' },
      { label: 'Net Margin', value: 0.178, unit: 'PCT', period: 'FY2024' },
      { label: 'ROE', value: 0.252, unit: 'PCT', period: 'FY2024' },
    ],
    sparkline: [0.652, 0.661, 0.668, 0.672, 0.680, 0.684],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2024', updatedAt: '2025-01-22', currency: 'USD' },
  },
  {
    company: COMPANIES.find(c => c.ticker === 'ABBV')!,
    primaryMetric: { label: 'Gross Margin', value: 0.706, unit: 'PCT', period: 'FY2024', delta: 0.018 },
    secondaryMetric: { label: 'R&D as % Revenue', value: 0.144, unit: 'PCT', period: 'FY2024', delta: -0.012 },
    ratios: [
      { label: 'P/E', value: 16.2, unit: 'MULTIPLE', period: 'FY2024' },
      { label: 'Op. Margin', value: 0.192, unit: 'PCT', period: 'FY2024' },
      { label: 'Net Margin', value: 0.118, unit: 'PCT', period: 'FY2024' },
      { label: 'ROE', value: 0.841, unit: 'PCT', period: 'FY2024' },
    ],
    sparkline: [0.712, 0.724, 0.698, 0.701, 0.710, 0.706],
    source: { source: 'SEC 10-K', standard: 'GAAP', period: 'FY2024', updatedAt: '2025-01-31', currency: 'USD' },
  },
]

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Revenue',
    definition: 'The total income generated by a company from its primary business activities before any expenses are deducted.',
    analystNote: 'Revenue is the starting line of every income statement analysis. Look for organic vs. acquired revenue growth, geographic mix, and whether growth is volume-driven or price-driven. A company growing revenue through price increases faces different durability risks than one growing through volume.',
    relatedTickers: ['MSFT', 'AAPL', 'AMZN', 'NVDA'],
  },
  {
    term: 'Gross Margin',
    definition: 'Gross profit (revenue minus cost of goods sold) expressed as a percentage of revenue. Measures how efficiently a company produces its goods or services.',
    analystNote: 'Gross margin is the first test of a business model\'s quality. Software companies routinely exceed 70%; retailers may run below 30%. Trend matters more than level — a declining gross margin signals pricing pressure, input cost inflation, or mix shift toward lower-value products.',
    relatedTickers: ['MSFT', 'AAPL', 'NVDA', 'JNJ', 'ABBV'],
  },
  {
    term: 'EBITDA',
    definition: 'Earnings Before Interest, Taxes, Depreciation, and Amortisation. A proxy for operating cash generation before financing and accounting choices.',
    analystNote: 'EBITDA is useful for comparing operating performance across companies with different capital structures, but it can mislead when capex is high — a capital-intensive business that shows strong EBITDA but weak free cash flow is telling you something important about its true earnings quality.',
    relatedTickers: ['AMZN', 'MSFT', 'GS', 'MS'],
  },
  {
    term: 'Free Cash Flow',
    definition: 'Operating cash flow minus capital expenditure. The cash a business generates after maintaining and growing its asset base.',
    analystNote: 'FCF is the most honest measure of a company\'s earnings quality. When net income and FCF diverge persistently, one of them is lying. Analyse FCF yield (FCF divided by market cap) to compare across sectors. FCF conversion above 90% suggests high-quality earnings.',
    relatedTickers: ['MSFT', 'AAPL', 'NVDA', 'META', 'GOOGL'],
  },
  {
    term: 'P/E Ratio',
    definition: 'Price-to-Earnings ratio. The current share price divided by earnings per share. Indicates how much investors pay for each dollar of earnings.',
    analystNote: 'A high P/E is only expensive if growth doesn\'t materialise. Compare P/E to earnings growth rate (PEG ratio) before judging value. Cyclical companies should be assessed on mid-cycle earnings; using trough or peak earnings distorts valuation. Always specify whether P/E is trailing or forward.',
    relatedTickers: ['NVDA', 'MSFT', 'JPM', 'BAC'],
  },
  {
    term: 'Return on Equity',
    definition: 'Net income divided by average shareholders\' equity. Measures how efficiently a company generates profit from its equity base.',
    analystNote: 'ROE is the primary profitability metric for banks and the secondary metric for most other sectors. High ROE can signal genuine competitive advantage or simply high leverage — always decompose using the DuPont framework (net margin × asset turnover × equity multiplier) to understand the source.',
    relatedTickers: ['JPM', 'BAC', 'GS', 'MS', 'BLK'],
  },
  {
    term: 'Net Interest Margin',
    definition: 'The difference between interest income earned on assets and interest paid on liabilities, expressed as a percentage of interest-earning assets.',
    analystNote: 'NIM is the foundational profitability metric for commercial banks. It rises in high-rate environments as loan yields reprice faster than deposit costs, and compresses in low-rate environments. Watch for NIM sensitivity disclosures in bank 10-Ks — a 25bps rate move can shift NII by hundreds of millions.',
    relatedTickers: ['JPM', 'BAC', 'WFC', 'USB', 'PNC'],
  },
  {
    term: 'R&D Intensity',
    definition: 'Research and development expense as a percentage of revenue. Measures how much a company invests in future products and capabilities relative to its current revenue base.',
    analystNote: 'R&D intensity is the forward-looking investment signal hidden in the income statement. For pharma, it predicts pipeline depth. For software, it signals future feature capability. A declining R&D ratio in a tech company often precedes product stagnation. Compare to peers — an outlier is always worth investigating.',
    relatedTickers: ['NVDA', 'MSFT', 'INTC', 'JNJ', 'ABBV', 'MRK'],
  },
  {
    term: 'CET1 Ratio',
    definition: 'Common Equity Tier 1 capital as a percentage of risk-weighted assets. The primary measure of a bank\'s capital adequacy under Basel III regulatory requirements.',
    analystNote: 'CET1 is the bank equivalent of an equity cushion — the higher it is, the more loss-absorbing capacity the bank holds. Regulators set minimums (typically 4.5% plus buffers), but banks operate well above them. A ratio near regulatory minimums signals the bank has limited capacity for buybacks or acquisitions.',
    relatedTickers: ['JPM', 'BAC', 'GS', 'C', 'WFC'],
  },
  {
    term: 'Operating Leverage',
    definition: 'The sensitivity of operating income to changes in revenue. A business with high operating leverage sees profits grow disproportionately when revenue rises.',
    analystNote: 'Operating leverage cuts both ways — it amplifies profits in good times and destroys them in downturns. Software companies have extreme operating leverage because marginal revenue costs near zero. Airlines have operating leverage too, but it works against them in demand downturns. Always model the downside case.',
    relatedTickers: ['MSFT', 'ADBE', 'CRM', 'NVDA'],
  },
  {
    term: 'Operating Margin',
    definition: 'Operating income (EBIT) divided by revenue. Measures profitability from core operations before financing and tax effects.',
    relatedTickers: ['MSFT', 'AAPL', 'NVDA'],
  },
  {
    term: 'Net Margin',
    definition: 'Net income divided by revenue. The bottom-line profitability percentage after all expenses, interest, and taxes.',
    relatedTickers: ['JPM', 'AAPL', 'MSFT'],
  },
  {
    term: 'Asset Turnover',
    definition: 'Revenue divided by average total assets. Measures how efficiently a company uses its assets to generate revenue.',
    relatedTickers: ['JPM', 'BAC', 'WFC'],
  },
  {
    term: 'Debt-to-Equity',
    definition: 'Total debt divided by shareholders\' equity. Measures the financial leverage of a company — how much it relies on debt versus equity financing.',
    relatedTickers: ['GS', 'MS', 'C'],
  },
  {
    term: 'Current Ratio',
    definition: 'Current assets divided by current liabilities. Measures a company\'s ability to pay short-term obligations with short-term assets.',
    relatedTickers: ['AAPL', 'MSFT', 'JNJ'],
  },
  {
    term: 'EV/EBITDA',
    definition: 'Enterprise Value divided by EBITDA. A capital structure-neutral valuation multiple used to compare companies across different leverage profiles.',
    relatedTickers: ['AMZN', 'MSFT', 'TMO'],
  },
  {
    term: 'Revenue CAGR',
    definition: 'Compound Annual Growth Rate of revenue over a defined period. Measures the steady-state growth rate that would result in the actual change in revenue.',
    relatedTickers: ['NVDA', 'MSFT', 'AMZN'],
  },
  {
    term: 'Medical Loss Ratio',
    definition: 'The percentage of health insurance premium revenue spent on medical claims and quality improvement. Regulated to be at least 80-85% under the ACA.',
    relatedTickers: ['UNH', 'AMGN'],
  },
  {
    term: 'Price-to-Book',
    definition: 'Share price divided by book value per share. Widely used for bank valuation because banks\' assets are mostly financial instruments marked to or near market.',
    relatedTickers: ['JPM', 'BAC', 'GS', 'BLK'],
  },
  {
    term: 'Working Capital',
    definition: 'Current assets minus current liabilities. The liquid capital available for day-to-day operations.',
    relatedTickers: ['AMZN', 'AAPL', 'WFC'],
  },
  {
    term: 'Capital Expenditure',
    definition: 'Spending on physical assets — property, plant, and equipment — that will be used for more than one year. Distinguishes investment in the business from operating costs.',
    relatedTickers: ['AMZN', 'MSFT', 'NVDA', 'INTC'],
  },
  {
    term: 'Efficiency Ratio',
    definition: 'Non-interest expense divided by total net revenue. The primary cost management metric for banks — lower is better.',
    relatedTickers: ['JPM', 'BAC', 'GS', 'USB'],
  },
  {
    term: 'Book Value Per Share',
    definition: 'Total shareholders\' equity divided by diluted shares outstanding. The per-share net asset value of the company.',
    relatedTickers: ['JPM', 'BAC', 'BLK'],
  },
  {
    term: 'Diluted EPS',
    definition: 'Earnings per share calculated using the fully diluted share count, including options, warrants, and convertible securities. The most conservative EPS measure.',
    relatedTickers: ['AAPL', 'MSFT', 'NVDA'],
  },
  {
    term: 'Share Buybacks',
    definition: 'The repurchase of a company\'s own shares from the market, reducing the share count and increasing earnings per share.',
    relatedTickers: ['AAPL', 'JPM', 'GS', 'BAC'],
  },
  {
    term: 'Dividend Payout Ratio',
    definition: 'Dividends per share divided by earnings per share. Measures what proportion of earnings is returned to shareholders as dividends.',
    relatedTickers: ['JNJ', 'ABBV', 'JPM', 'AXP'],
  },
  {
    term: 'Days Sales Outstanding',
    definition: 'Accounts receivable divided by daily revenue. Measures how many days on average it takes to collect payment after a sale.',
    relatedTickers: ['CRM', 'ADBE', 'ORCL'],
  },
  {
    term: 'Inventory Turnover',
    definition: 'Cost of goods sold divided by average inventory. Measures how efficiently a company manages its inventory relative to sales.',
    relatedTickers: ['AAPL', 'AMZN', 'NVDA'],
  },
  {
    term: 'Tangible Book Value',
    definition: 'Book value minus intangible assets and goodwill. Especially important for banks — goodwill cannot absorb losses, so tangible book value is the real capital base.',
    relatedTickers: ['JPM', 'BAC', 'C'],
  },
  {
    term: 'Interest Coverage Ratio',
    definition: 'EBIT divided by interest expense. Measures a company\'s ability to meet its debt interest payments from operating earnings.',
    relatedTickers: ['AMZN', 'MSFT', 'GS'],
  },
  {
    term: 'ROIC',
    definition: 'Return on Invested Capital. Net operating profit after tax divided by invested capital. The most comprehensive measure of capital efficiency.',
    relatedTickers: ['MSFT', 'AAPL', 'JNJ', 'DHR'],
  },
  {
    term: 'Net Debt',
    definition: 'Total debt minus cash and cash equivalents. A measure of the true financial leverage a company carries after accounting for its liquid assets.',
    relatedTickers: ['AMZN', 'MSFT', 'AAPL'],
  },
  {
    term: 'Enterprise Value',
    definition: 'Market capitalisation plus net debt plus minority interests. Represents the total economic value of a business regardless of its capital structure.',
    relatedTickers: ['NVDA', 'MSFT', 'AAPL'],
  },
  {
    term: 'Recurring Revenue',
    definition: 'Revenue that is contractually committed to recur, such as subscription fees or multi-year software licenses. Signals earnings predictability.',
    relatedTickers: ['MSFT', 'CRM', 'ADBE', 'ORCL'],
  },
  {
    term: 'AUM',
    definition: 'Assets Under Management. The total market value of assets a financial institution manages on behalf of clients. Drives fee revenue for asset managers.',
    relatedTickers: ['BLK', 'MS', 'GS'],
  },
  {
    term: 'Pipeline',
    definition: 'In healthcare, the portfolio of drug candidates in various stages of clinical development. Pipeline depth and phase distribution determine a pharma company\'s future revenue potential.',
    relatedTickers: ['ABBV', 'MRK', 'PFE', 'AMGN', 'BMY'],
  },
  {
    term: 'Patent Cliff',
    definition: 'The point at which a drug\'s patent protection expires, allowing generic manufacturers to compete. Results in sharp revenue declines for the originator company.',
    relatedTickers: ['ABBV', 'PFE', 'BMY', 'MRK'],
  },
  {
    term: 'Net Revenue Retention',
    definition: 'For SaaS companies: the percentage of recurring revenue retained from existing customers, including expansion revenue from upsells. Above 100% means expansion offsets churn.',
    relatedTickers: ['CRM', 'MSFT', 'ADBE', 'ORCL'],
  },
  {
    term: 'FCF Yield',
    definition: 'Free cash flow per share divided by share price. The inverse of a price-to-free-cash-flow multiple — used to compare value across sectors.',
    relatedTickers: ['AAPL', 'MSFT', 'META', 'GOOGL'],
  },
  {
    term: 'Loan-to-Deposit Ratio',
    definition: 'Total loans divided by total deposits. Measures how much of a bank\'s deposit funding is deployed into loans — a proxy for liquidity risk.',
    relatedTickers: ['JPM', 'BAC', 'USB', 'PNC'],
  },
]

export const SECTOR_SNAPSHOTS: SectorSnapshot[] = [
  {
    sector: 'Financial Services',
    avgGrossMargin: 0.62,
    avgROE: 0.131,
    avgRevenueGrowth: 0.072,
    companyCount: 10,
    analyticalFramework: 'Financial services companies are best understood through three lenses: asset quality (are the loans getting repaid?), capital adequacy (is the balance sheet strong enough to absorb losses?), and profitability (is management generating acceptable returns on that capital?). Net interest margin captures the core spread-lending profitability, while non-interest income diversification determines resilience across cycles. Regulatory capital requirements set the floor; capital allocation efficiency sets the ceiling.',
    keyValueDrivers: [
      'Net interest margin expansion in rising rate environments',
      'Loan growth driven by economic activity',
      'Fee income from wealth management and investment banking',
      'Cost efficiency (efficiency ratio improvement)',
      'Credit quality — net charge-off rates and provision levels',
      'Capital return through dividends and buybacks',
      'Regulatory capital buffers enabling M&A',
    ],
    sectorRisks: [
      'Credit cycle deterioration — rising defaults in a recession',
      'Net interest margin compression in low-rate or inverted yield curve environments',
      'Regulatory capital requirement increases limiting capital return',
      'Cyber and operational risk at scale',
      'Fintech disintermediation of core banking products',
      'Concentration risk in investment banking to market activity',
    ],
  },
  {
    sector: 'AI & Technology',
    avgGrossMargin: 0.624,
    avgROE: 0.312,
    avgRevenueGrowth: 0.183,
    companyCount: 10,
    analyticalFramework: 'Technology companies require separating durable platform advantages from cyclical demand. The key question is always: does this company control the layer that customers cannot easily walk away from? For cloud and software businesses, focus on recurring revenue proportion, net revenue retention, and rule-of-40 (revenue growth plus FCF margin). For hardware and semiconductors, understand where the company sits in the value chain and whether it designs, manufactures, or both. AI capex cycles create revenue tailwinds for infrastructure providers and cost headwinds for everyone else.',
    keyValueDrivers: [
      'Cloud infrastructure adoption driving recurring revenue',
      'AI model training and inference revenue for GPU providers',
      'Software subscription transition improving revenue predictability',
      'Developer ecosystem lock-in creating switching costs',
      'R&D investment sustaining technological moats',
      'Operating leverage on scalable software revenue',
    ],
    sectorRisks: [
      'Regulatory antitrust scrutiny of platform concentration',
      'AI commoditisation eroding GPU pricing power over time',
      'Customer cloud spend optimisation reducing growth rates',
      'Geopolitical risk in semiconductor supply chains',
      'Open-source alternatives disrupting proprietary software pricing',
      'Talent concentration and retention in a competitive labor market',
    ],
  },
  {
    sector: 'Healthcare',
    avgGrossMargin: 0.641,
    avgROE: 0.224,
    avgRevenueGrowth: 0.064,
    companyCount: 10,
    analyticalFramework: 'Healthcare analysis bifurcates by sub-sector. For pharmaceutical companies, the pipeline is the business — current revenue funds R&D that determines future revenue. Analysing a pharma company requires mapping revenue concentration risk (what percentage comes from the top drug?), patent cliff timelines, and pipeline stage probabilities. For managed care, the medical loss ratio determines profitability; for medical devices and life sciences tools, demand tracks industry R&D spending. Margin durability, pricing power, and regulatory approvals are the three levers that determine long-run value.',
    keyValueDrivers: [
      'Drug pipeline approval rates and revenue ramp potential',
      'Biologics pricing power versus biosimilar competition timing',
      'Life sciences tool demand driven by pharma R&D budgets',
      'Managed care enrollment growth and premium pricing',
      'Medical device procedure volume recovery and innovation',
      'M&A as a pipeline supplement — disciplined allocation matters',
    ],
    sectorRisks: [
      'Drug pricing reform and government negotiation under the IRA',
      'Patent cliff exposure — revenue cliff when key patents expire',
      'Clinical trial failure risk for pipeline drugs',
      'Biosimilar competition eroding biologic franchise revenue',
      'Medical loss ratio creep in managed care from utilisation surges',
      'Supply chain concentration in API manufacturing',
    ],
  },
  {
    sector: 'Consumer & Retail',
    avgGrossMargin: 0.336,
    avgROE: 0.382,
    avgRevenueGrowth: 0.045,
    companyCount: 10,
    analyticalFramework: 'Consumer and retail analysis centres on unit economics and same-store performance. The primary split is between companies that compete on price (Walmart, Costco) and those that compete on brand (Nike, Starbucks) — the analytical framework differs substantially. For physical retail, same-store sales growth separates organic demand from store-count expansion. For consumer staples and QSR, gross margin durability and pricing power through input cost cycles are the core tests. Working capital management — inventory turns, days payable — determines cash conversion efficiency. The long-run question for every retailer is whether the physical or digital format creates durable competitive advantage.',
    keyValueDrivers: [
      'Same-store sales growth as organic demand indicator',
      'Gross margin expansion through pricing power and mix shift',
      'Membership and loyalty economics creating switching costs',
      'Supply chain efficiency driving cost-of-goods improvements',
      'Private label penetration improving margin mix',
      'International expansion providing incremental growth vectors',
      'Digital integration extending physical store economics',
    ],
    sectorRisks: [
      'Consumer spending slowdown in recessionary environments',
      'Input cost inflation eroding gross margins before pricing catches up',
      'E-commerce disruption of physical retail traffic',
      'Private label competition from retailers threatening branded CPG',
      'Labour cost inflation in store operations and logistics',
      'Inventory mismanagement leading to markdown pressure',
    ],
  },
  {
    sector: 'Consumer Internet & Digital Platforms',
    avgGrossMargin: 0.648,
    avgROE: 0.186,
    avgRevenueGrowth: 0.224,
    companyCount: 10,
    analyticalFramework: 'Consumer internet platforms are valued on engagement economics and the monetisation of attention or transactions. The key analytical distinction is between advertising-monetised platforms (where revenue tracks DAU × ARPU), subscription platforms (where churn and LTV govern value), and marketplace/transaction platforms (where take rate × GMV determines revenue). Network effects are the primary moat — a platform becomes more valuable as more users join, creating a self-reinforcing competitive advantage. Profitability is typically deferred: early losses fund user acquisition at scale, with the expectation of operating leverage as the platform matures. Free cash flow inflection, not GAAP profit, is the milestone that signals business model validation.',
    keyValueDrivers: [
      'Daily active user growth and engagement depth',
      'Average revenue per user expansion through ad load or pricing',
      'Take rate stability or expansion on marketplace GMV',
      'Subscription net revenue retention above 100%',
      'Operating leverage on a largely fixed cost base as scale grows',
      'International monetisation closing the gap with domestic ARPU',
    ],
    sectorRisks: [
      'Platform regulation and data privacy legislation limiting targeting',
      'User engagement saturation in mature markets',
      'Advertiser budget concentration — top 10 advertisers drive outsized revenue share',
      'Algorithm changes from app store gatekeepers affecting distribution costs',
      'Competition from TikTok-style short-form content compressing attention share',
      'Driver/earner classification risk for gig economy platforms',
    ],
  },
]

export interface CompanyMetricOverride {
  primaryValue: number
  secondaryValue: number
  pe: number
  roe: number
  sparkline: number[]
}

export const COMPANY_METRICS: Record<string, CompanyMetricOverride> = {
  // Financial Services — primary: ROE, secondary: NIM
  MS:   { primaryValue: 0.138, secondaryValue: 0.015, pe: 16.4, roe: 0.138, sparkline: [0.080, 0.085, 0.110, 0.112, 0.121, 0.138] },
  BLK:  { primaryValue: 0.142, secondaryValue: 0.023, pe: 22.8, roe: 0.142, sparkline: [0.110, 0.118, 0.130, 0.128, 0.138, 0.142] },
  WFC:  { primaryValue: 0.109, secondaryValue: 0.027, pe: 13.1, roe: 0.109, sparkline: [0.088, 0.092, 0.098, 0.104, 0.108, 0.109] },
  AXP:  { primaryValue: 0.314, secondaryValue: 0.108, pe: 18.2, roe: 0.314, sparkline: [0.242, 0.268, 0.284, 0.296, 0.308, 0.314] },
  C:    { primaryValue: 0.069, secondaryValue: 0.021, pe: 11.8, roe: 0.069, sparkline: [0.058, 0.062, 0.064, 0.066, 0.068, 0.069] },
  USB:  { primaryValue: 0.112, secondaryValue: 0.028, pe: 12.4, roe: 0.112, sparkline: [0.126, 0.118, 0.104, 0.098, 0.106, 0.112] },
  PNC:  { primaryValue: 0.108, secondaryValue: 0.029, pe: 13.8, roe: 0.108, sparkline: [0.118, 0.122, 0.108, 0.102, 0.104, 0.108] },
  // AI & Technology — primary: FCF Margin, secondary: Revenue Growth YoY
  GOOGL: { primaryValue: 0.212, secondaryValue: 0.087, pe: 22.1, roe: 0.286, sparkline: [196e9, 258e9, 283e9, 308e9, 308e9, 350e9] },
  META:  { primaryValue: 0.386, secondaryValue: 0.221, pe: 26.5, roe: 0.362, sparkline: [118e9, 117e9, 116e9, 135e9, 135e9, 165e9] },
  AMZN:  { primaryValue: 0.145, secondaryValue: 0.110, pe: 46.2, roe: 0.212, sparkline: [470e9, 514e9, 470e9, 514e9, 575e9, 638e9] },
  CRM:   { primaryValue: 0.228, secondaryValue: 0.109, pe: 35.4, roe: 0.084, sparkline: [21.3e9, 26.5e9, 31.4e9, 34.9e9, 34.9e9, 38.6e9] },
  ADBE:  { primaryValue: 0.378, secondaryValue: 0.102, pe: 27.6, roe: 0.342, sparkline: [15.8e9, 17.6e9, 19.4e9, 21.5e9, 21.5e9, 23.7e9] },
  ORCL:  { primaryValue: 0.231, secondaryValue: 0.126, pe: 38.2, roe: 0.748, sparkline: [42.4e9, 42.4e9, 49.5e9, 52.9e9, 53.0e9, 59.8e9] },
  INTC:  { primaryValue: -0.004, secondaryValue: -0.024, pe: 28.4, roe: -0.009, sparkline: [79e9, 63e9, 54e9, 54e9, 54e9, 53e9] },
  // Healthcare — primary: Gross Margin, secondary: R&D as % Revenue
  PFE:   { primaryValue: 0.528, secondaryValue: 0.162, pe: 13.8, roe: 0.088, sparkline: [0.748, 0.698, 0.618, 0.528, 0.528, 0.528] },
  MRK:   { primaryValue: 0.752, secondaryValue: 0.128, pe: 11.4, roe: 0.346, sparkline: [0.706, 0.720, 0.728, 0.736, 0.748, 0.752] },
  TMO:   { primaryValue: 0.426, secondaryValue: 0.024, pe: 23.8, roe: 0.142, sparkline: [0.408, 0.412, 0.452, 0.444, 0.432, 0.426] },
  ABT:   { primaryValue: 0.554, secondaryValue: 0.068, pe: 21.2, roe: 0.162, sparkline: [0.528, 0.538, 0.568, 0.564, 0.558, 0.554] },
  DHR:   { primaryValue: 0.602, secondaryValue: 0.048, pe: 29.4, roe: 0.128, sparkline: [0.562, 0.578, 0.614, 0.608, 0.606, 0.602] },
  BMY:   { primaryValue: 0.694, secondaryValue: 0.246, pe: 7.2,  roe: 0.214, sparkline: [0.718, 0.706, 0.692, 0.688, 0.692, 0.694] },
  AMGN:  { primaryValue: 0.728, secondaryValue: 0.142, pe: 16.4, roe: 0.804, sparkline: [0.702, 0.712, 0.718, 0.722, 0.726, 0.728] },
  // Consumer & Retail — primary: Gross Margin, secondary: Revenue Growth YoY
  WMT:   { primaryValue: 0.246, secondaryValue: 0.049, pe: 34.8, roe: 0.202, sparkline: [0.228, 0.232, 0.236, 0.238, 0.242, 0.246] },
  COST:  { primaryValue: 0.126, secondaryValue: 0.050, pe: 52.1, roe: 0.294, sparkline: [0.118, 0.120, 0.122, 0.123, 0.124, 0.126] },
  TGT:   { primaryValue: 0.281, secondaryValue: -0.016, pe: 14.8, roe: 0.214, sparkline: [0.308, 0.298, 0.262, 0.274, 0.278, 0.281] },
  HD:    { primaryValue: 0.334, secondaryValue: -0.002, pe: 24.6, roe: 1.140, sparkline: [0.322, 0.334, 0.338, 0.336, 0.333, 0.334] },
  NKE:   { primaryValue: 0.446, secondaryValue: -0.104, pe: 26.8, roe: 0.288, sparkline: [0.448, 0.462, 0.458, 0.448, 0.446, 0.446] },
  SBUX:  { primaryValue: 0.278, secondaryValue: -0.020, pe: 23.4, roe: 0.382, sparkline: [0.282, 0.286, 0.292, 0.288, 0.282, 0.278] },
  MCD:   { primaryValue: 0.572, secondaryValue: 0.019, pe: 24.2, roe: 0.828, sparkline: [0.548, 0.554, 0.558, 0.564, 0.568, 0.572] },
  PG:    { primaryValue: 0.514, secondaryValue: 0.030, pe: 26.8, roe: 0.298, sparkline: [0.498, 0.502, 0.504, 0.508, 0.511, 0.514] },
  KO:    { primaryValue: 0.608, secondaryValue: 0.029, pe: 26.4, roe: 0.402, sparkline: [0.592, 0.596, 0.600, 0.602, 0.605, 0.608] },
  LOW:   { primaryValue: 0.331, secondaryValue: -0.031, pe: 22.4, roe: 1.062, sparkline: [0.338, 0.340, 0.338, 0.334, 0.332, 0.331] },
  // Consumer Internet & Digital Platforms — primary: Revenue Growth YoY, secondary: EBITDA Margin
  NFLX:  { primaryValue: 0.150, secondaryValue: 0.268, pe: 48.2, roe: 0.382, sparkline: [29.7e9, 31.6e9, 33.7e9, 33.7e9, 36.8e9, 39.0e9] },
  UBER:  { primaryValue: 0.180, secondaryValue: 0.102, pe: 68.4, roe: 0.148, sparkline: [17.5e9, 31.9e9, 37.3e9, 37.3e9, 41.0e9, 43.0e9] },
  ABNB:  { primaryValue: 0.114, secondaryValue: 0.312, pe: 41.8, roe: 0.296, sparkline: [5.9e9, 8.4e9, 9.9e9, 9.9e9, 11.0e9, 11.0e9] },
  BKNG:  { primaryValue: 0.108, secondaryValue: 0.354, pe: 20.6, roe: 0.742, sparkline: [11.0e9, 17.1e9, 21.4e9, 21.4e9, 23.7e9, 23.7e9] },
  SPOT:  { primaryValue: 0.184, secondaryValue: 0.078, pe: 76.4, roe: 0.082, sparkline: [11.7e9, 13.2e9, 15.0e9, 15.0e9, 16.6e9, 16.6e9] },
  LYFT:  { primaryValue: 0.306, secondaryValue: 0.034, pe: 142.0, roe: 0.048, sparkline: [3.2e9, 4.1e9, 4.4e9, 4.4e9, 5.0e9, 5.8e9] },
  DASH:  { primaryValue: 0.194, secondaryValue: 0.028, pe: 148.6, roe: -0.024, sparkline: [6.6e9, 8.1e9, 9.0e9, 9.0e9, 10.7e9, 10.7e9] },
  PINS:  { primaryValue: 0.184, secondaryValue: 0.176, pe: 42.8, roe: 0.128, sparkline: [2.6e9, 3.0e9, 3.3e9, 3.3e9, 3.6e9, 3.6e9] },
  SNAP:  { primaryValue: 0.142, secondaryValue: -0.048, pe: 84.6, roe: -0.182, sparkline: [4.1e9, 4.6e9, 5.0e9, 5.0e9, 5.4e9, 5.4e9] },
  RDDT:  { primaryValue: 0.678, secondaryValue: -0.104, pe: 112.4, roe: -0.048, sparkline: [0.5e9, 0.8e9, 1.2e9, 1.2e9, 1.6e9, 1.6e9] },
}

export const RESEARCH_KITS: ResearchKit[] = [
  {
    id: 'bank-analysis-starter',
    title: 'Bank Analysis Starter Kit',
    description: 'A structured framework for analysing commercial and investment banks. Covers NIM analysis, credit quality assessment, capital adequacy, and peer comparison methodology. Includes sector-specific ratio definitions and a five-step analytical checklist.',
    sector: 'Financial Services',
    tickers: ['JPM', 'BAC', 'GS', 'WFC'],
    metrics: ['ROE', 'Net Interest Margin', 'CET1 Ratio', 'Efficiency Ratio', 'Loan-to-Deposit Ratio'],
  },
  {
    id: 'pharma-pipeline-kit',
    title: 'Pharma Pipeline Analysis Kit',
    description: 'A framework for evaluating pharmaceutical companies with emphasis on pipeline valuation, patent cliff timing, and R&D return on investment. Covers how to read a product pipeline, assess biosimilar risk, and model patent expiry revenue impacts.',
    sector: 'Healthcare',
    tickers: ['JNJ', 'ABBV', 'MRK', 'PFE'],
    metrics: ['Gross Margin', 'R&D Intensity', 'Revenue Growth', 'Net Margin', 'Pipeline Count'],
  },
  {
    id: 'saas-cloud-kit',
    title: 'SaaS & Cloud Fundamentals Kit',
    description: 'A comprehensive framework for analysing software-as-a-service and cloud infrastructure companies. Covers rule-of-40, net revenue retention, FCF margin expansion, and how to evaluate AI-driven revenue acceleration in platform businesses.',
    sector: 'AI & Technology',
    tickers: ['MSFT', 'CRM', 'ADBE', 'ORCL'],
    metrics: ['FCF Margin', 'Revenue Growth', 'Gross Margin', 'R&D Intensity', 'Operating Margin'],
  },
]
