import os
from dotenv import load_dotenv

load_dotenv()

YEARS_OF_DATA = 5

DB_HOST     = os.getenv("DB_HOST", "localhost")
DB_PORT     = int(os.getenv("DB_PORT", 5432))
DB_NAME     = os.getenv("DB_NAME", "trikosh")
DB_USER     = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")

DB_CONFIG = {
    "host":     DB_HOST,
    "port":     DB_PORT,
    "dbname":   DB_NAME,
    "user":     DB_USER,
    "password": DB_PASSWORD
}

COMPANIES = [
    # Financial Services — US
    ("JPM",              "JPMorgan Chase",    "Financial Services"),
    ("GS",               "Goldman Sachs",     "Financial Services"),
    ("MS",               "Morgan Stanley",    "Financial Services"),
    ("C",                "Citigroup",         "Financial Services"),
    ("V",                "Visa",              "Financial Services"),

    # Financial Services — European
    ("DB",               "Deutsche Bank AG",  "Financial Services"),
    ("ALIZF",            "Allianz",           "Financial Services"),
    ("ING",              "ING Group",         "Financial Services"),
    ("BNPQY",            "BNP Paribas",       "Financial Services"),

    # Financial Services — Indian
    ("HDB",              "HDFC Bank",         "Financial Services"),

    # AI & Technology — US
    ("NVDA",             "NVIDIA",            "AI & Technology"),
    ("MSFT",             "Microsoft",         "AI & Technology"),
    ("GOOGL",            "Alphabet",          "AI & Technology"),
    ("META",             "Meta Platforms",    "AI & Technology"),
    ("AMD",              "AMD",               "AI & Technology"),

    # AI & Technology — European & Asian
    ("SAP",              "SAP SE",            "AI & Technology"),
    ("ASML",             "ASML Holding",      "AI & Technology"),
    ("TSM",              "TSMC",              "AI & Technology"),
    ("INFY",             "Infosys",           "AI & Technology"),
    ("WIT",              "Wipro",             "AI & Technology"),

    # Healthcare — US
    ("JNJ",              "Johnson & Johnson", "Healthcare"),
    ("LLY",              "Eli Lilly",         "Healthcare"),
    ("UNH",              "UnitedHealth",      "Healthcare"),
    ("ABBV",             "AbbVie",            "Healthcare"),
    ("PFE",              "Pfizer",            "Healthcare"),

    # Healthcare — European
    ("NVS",              "Novartis",          "Healthcare"),
    ("BAYRY",            "Bayer",             "Healthcare"),
    ("RHHBY",            "Roche",             "Healthcare"),

    # Healthcare — Indian
    ("SUNPHARMA.NS",     "Sun Pharma",        "Healthcare"),

    # Consumer & Retail — Global
    ("NSRGY",            "Nestle",            "Consumer & Retail"),
    ("UL",               "Unilever",          "Consumer & Retail"),
    ("LVMUY",            "LVMH",              "Consumer & Retail"),
    ("PG",               "Procter & Gamble",  "Consumer & Retail"),
    ("CL",               "Colgate-Palmolive", "Consumer & Retail"),
    ("WMT",              "Walmart",           "Consumer & Retail"),
    ("MCD",              "McDonald's",        "Consumer & Retail"),
    ("QSR",              "Restaurant Brands", "Consumer & Retail"),

    # Consumer & Retail — Indian
    ("HINDUNILVR.NS",    "Hindustan Unilever","Consumer & Retail"),
    ("TATACONSUM.NS",    "Tata Consumer",     "Consumer & Retail"),

    # Digital Platforms & E-Commerce — US
    ("AMZN",             "Amazon",            "Digital Platforms & E-Commerce"),
    ("UBER",             "Uber",              "Digital Platforms & E-Commerce"),
    ("EBAY",             "eBay",              "Digital Platforms & E-Commerce"),
    ("ETSY",             "Etsy",              "Digital Platforms & E-Commerce"),
    ("BKNG",             "Booking Holdings",  "Digital Platforms & E-Commerce"),

    # Digital Platforms & E-Commerce — Global
    ("BABA",             "Alibaba",           "Digital Platforms & E-Commerce"),
    ("JD",               "JD.com",            "Digital Platforms & E-Commerce"),
    ("SE",               "Sea Limited",       "Digital Platforms & E-Commerce"),
    ("SHOP",             "Shopify",           "Digital Platforms & E-Commerce"),
    ("MELI",             "MercadoLibre",      "Digital Platforms & E-Commerce"),

    # Financial Services — North American additions
    ("TD",               "Toronto-Dominion Bank",      "Financial Services"),
    ("BMO",              "Bank of Montreal",            "Financial Services"),
    # Financial Services — Japanese megabanks
    ("MUFG",             "Mitsubishi UFJ Financial",    "Financial Services"),
    ("SMFG",             "Sumitomo Mitsui Financial",   "Financial Services"),
    ("MFG",              "Mizuho Financial Group",      "Financial Services"),
    # Financial Services — European banks
    ("SAN",              "Banco Santander",             "Financial Services"),
    ("BBVA",             "BBVA",                        "Financial Services"),
    # Financial Services — Custody banks & exchanges
    ("STT",              "State Street Corp",           "Financial Services"),
    ("BK",               "BNY Mellon",                  "Financial Services"),
    ("ICE",              "Intercontinental Exchange",   "Financial Services"),
    ("CME",              "CME Group",                   "Financial Services"),
    # Financial Services — Insurance
    ("CB",               "Chubb",                       "Financial Services"),
    ("AON",              "Aon",                         "Financial Services"),

    # AI & Technology — US hardware & legacy
    ("IBM",              "IBM",                         "AI & Technology"),
    ("CSCO",             "Cisco",                       "AI & Technology"),
    ("ACN",              "Accenture",                   "AI & Technology"),
    ("TXN",              "Texas Instruments",           "AI & Technology"),
    ("MU",               "Micron Technology",           "AI & Technology"),
    ("AMAT",             "Applied Materials",           "AI & Technology"),
    ("AVGO",             "Broadcom",                    "AI & Technology"),
    ("DELL",             "Dell Technologies",           "AI & Technology"),
    ("HPE",              "Hewlett Packard Enterprise",  "AI & Technology"),
    # AI & Technology — Indian IT services
    ("TCS.NS",           "Tata Consultancy Services",   "AI & Technology"),
    ("HCLTECH.NS",       "HCL Technologies",            "AI & Technology"),
    ("MPHASIS.NS",        "Mphasis",                     "AI & Technology"),
    ("PERSISTENT.NS",    "Persistent Systems",          "AI & Technology"),

    # Healthcare — US biotech & MedTech
    ("AMGN",             "Amgen",                       "Healthcare"),
    ("GILD",             "Gilead Sciences",             "Healthcare"),
    ("REGN",             "Regeneron",                   "Healthcare"),
    ("VRTX",             "Vertex Pharmaceuticals",      "Healthcare"),
    ("BSX",              "Boston Scientific",           "Healthcare"),
    ("DHR",              "Danaher",                     "Healthcare"),
    ("IQV",              "IQVIA Holdings",              "Healthcare"),
    ("CVS",              "CVS Health",                  "Healthcare"),
    ("BMY",              "Bristol-Myers Squibb",        "Healthcare"),
    ("HUM",              "Humana",                      "Healthcare"),
    ("EW",               "Edwards Lifesciences",        "Healthcare"),
    # Healthcare — Indian hospitals
    ("APOLLOHOSP.NS",    "Apollo Hospitals",            "Healthcare"),
    ("MAXHEALTH.NS",     "Max Healthcare",              "Healthcare"),

    # Consumer & Retail — US retail & staples
    ("LOW",              "Lowe's",                      "Consumer & Retail"),
    ("TJX",              "TJX Companies",               "Consumer & Retail"),
    ("MDLZ",             "Mondelez",                    "Consumer & Retail"),
    ("KHC",              "Kraft Heinz",                 "Consumer & Retail"),
    ("CLX",              "Clorox",                      "Consumer & Retail"),
    ("GIS",              "General Mills",               "Consumer & Retail"),
    ("KMB",              "Kimberly-Clark",              "Consumer & Retail"),
    # Consumer & Retail — European luxury
    ("HESAY",            "Hermes",                      "Consumer & Retail"),
    ("PPRUY",            "Kering",                      "Consumer & Retail"),
    # Consumer & Retail — Indian FMCG
    ("MARICO.NS",        "Marico",                      "Consumer & Retail"),
    ("DABUR.NS",         "Dabur India",                 "Consumer & Retail"),
    ("ITC.NS",           "ITC",                         "Consumer & Retail"),
    ("PIDILITIND.NS",    "Pidilite Industries",         "Consumer & Retail"),

    # Digital Platforms & E-Commerce — US additions
    ("RBLX",             "Roblox",                      "Digital Platforms & E-Commerce"),
    ("ZM",               "Zoom",                        "Digital Platforms & E-Commerce"),
    ("EXPE",             "Expedia",                     "Digital Platforms & E-Commerce"),
    ("CPNG",             "Coupang",                     "Digital Platforms & E-Commerce"),
    ("MTCH",             "Match Group",                 "Digital Platforms & E-Commerce"),
    ("IAC",              "IAC",                         "Digital Platforms & E-Commerce"),
    ("DKNG",             "DraftKings",                  "Digital Platforms & E-Commerce"),
    ("CHWY",             "Chewy",                       "Digital Platforms & E-Commerce"),
    # Digital Platforms & E-Commerce — Indian internet
    ("ZOMATO.NS",        "Zomato",                      "Digital Platforms & E-Commerce"),
    ("FSN.NS",           "Nykaa",                       "Digital Platforms & E-Commerce"),
    ("INDIAMRT.NS",      "IndiaMart",                   "Digital Platforms & E-Commerce"),
    ("ONE97.NS",         "Paytm",                       "Digital Platforms & E-Commerce"),
    ("CARTRADE.NS",      "CarTrade Tech",               "Digital Platforms & E-Commerce"),
    ("POLICYBZR.NS",     "PolicyBazaar",                "Digital Platforms & E-Commerce"),

    # Industrials — US additions
    ("GEV",              "GE Vernova",                  "Industrials"),
    ("ITW",              "Illinois Tool Works",         "Industrials"),
    ("ROK",              "Rockwell Automation",         "Industrials"),
    ("IR",               "Ingersoll Rand",              "Industrials"),
    ("FTV",              "Fortive",                     "Industrials"),
    ("TT",               "Trane Technologies",          "Industrials"),
    ("CARR",             "Carrier Global",              "Industrials"),
    ("OTIS",             "Otis Worldwide",              "Industrials"),
    ("CGNX",             "Cognex",                      "Industrials"),
    ("DOV",              "Dover",                       "Industrials"),
    # Industrials — Indian additions
    ("BHEL.NS",          "Bharat Heavy Electricals",    "Industrials"),
    ("HAVELLS.NS",       "Havells India",               "Industrials"),
    ("TIINDIA.NS",       "Tube Investments of India",   "Industrials"),
    ("THERMAX.NS",       "Thermax",                     "Industrials"),

    # ── Companies from mockData.ts previously not in this config ─────────────
    # Financial Services — additional
    ("UBS",              "UBS Group",                   "Financial Services"),
    ("BAC",              "Bank of America",             "Financial Services"),
    ("WFC",              "Wells Fargo",                 "Financial Services"),
    ("AXP",              "American Express",            "Financial Services"),
    ("BLK",              "BlackRock",                   "Financial Services"),
    ("SCHW",             "Charles Schwab",              "Financial Services"),
    ("HSBC",             "HSBC Holdings",               "Financial Services"),
    ("BNS",              "Bank of Nova Scotia",         "Financial Services"),
    ("ICICIBANK.NS",     "ICICI Bank",                  "Financial Services"),
    ("KOTAKBANK.NS",     "Kotak Mahindra Bank",         "Financial Services"),
    ("MA",               "Mastercard",                  "Financial Services"),

    # AI & Technology — additional
    ("AAPL",             "Apple",                       "AI & Technology"),
    ("ORCL",             "Oracle",                      "AI & Technology"),
    ("CRM",              "Salesforce",                  "AI & Technology"),
    ("ADBE",             "Adobe",                       "AI & Technology"),
    ("NOW",              "ServiceNow",                  "AI & Technology"),
    ("QCOM",             "Qualcomm",                    "AI & Technology"),
    ("INTC",             "Intel",                       "AI & Technology"),
    ("ARM",              "Arm Holdings",                "AI & Technology"),
    ("PLTR",             "Palantir",                    "AI & Technology"),
    ("SNOW",             "Snowflake",                   "AI & Technology"),

    # Healthcare — additional
    ("MRK",              "Merck",                       "Healthcare"),
    ("ABT",              "Abbott Laboratories",         "Healthcare"),
    ("TMO",              "Thermo Fisher Scientific",    "Healthcare"),
    ("AZN",              "AstraZeneca",                 "Healthcare"),
    ("SNY",              "Sanofi",                      "Healthcare"),
    ("GSK",              "GSK",                         "Healthcare"),
    ("ISRG",             "Intuitive Surgical",          "Healthcare"),
    ("MDT",              "Medtronic",                   "Healthcare"),
    ("CIPLA.NS",         "Cipla",                       "Healthcare"),
    ("DRREDDY.NS",       "Dr Reddy's Laboratories",     "Healthcare"),
    ("DIVISLAB.NS",      "Divi's Laboratories",         "Healthcare"),

    # Consumer & Retail — additional
    ("COST",             "Costco",                      "Consumer & Retail"),
    ("TGT",              "Target",                      "Consumer & Retail"),
    ("HD",               "Home Depot",                  "Consumer & Retail"),
    ("KO",               "Coca-Cola",                   "Consumer & Retail"),
    ("NKE",              "Nike",                        "Consumer & Retail"),
    ("SBUX",             "Starbucks",                   "Consumer & Retail"),
    ("EL",               "Estee Lauder",                "Consumer & Retail"),
    ("DMART.NS",         "Avenue Supermarts (DMart)",   "Consumer & Retail"),
    ("BRITANNIA.NS",     "Britannia Industries",        "Consumer & Retail"),
    ("RELIANCE.NS",      "Reliance Industries",         "Consumer & Retail"),

    # Digital Platforms & E-Commerce — additional
    ("NFLX",             "Netflix",                     "Digital Platforms & E-Commerce"),
    ("SPOT",             "Spotify",                     "Digital Platforms & E-Commerce"),
    ("ABNB",             "Airbnb",                      "Digital Platforms & E-Commerce"),
    ("DASH",             "DoorDash",                    "Digital Platforms & E-Commerce"),
    ("LYFT",             "Lyft",                        "Digital Platforms & E-Commerce"),
    ("PINS",             "Pinterest",                   "Digital Platforms & E-Commerce"),
    ("SNAP",             "Snap",                        "Digital Platforms & E-Commerce"),
    ("GRAB",             "Grab Holdings",               "Digital Platforms & E-Commerce"),
    ("TCOM",             "Trip.com",                    "Digital Platforms & E-Commerce"),

    # Industrials — additional
    ("CAT",              "Caterpillar",                 "Industrials"),
    ("HON",              "Honeywell",                   "Industrials"),
    ("GE",               "GE Aerospace",                "Industrials"),
    ("SIEGY",            "Siemens",                     "Industrials"),
    ("ABB",              "ABB",                         "Industrials"),
    ("RYCEY",            "Rolls-Royce",                 "Industrials"),
    ("LT.NS",            "Larsen & Toubro",             "Industrials"),
    ("MMM",              "3M",                          "Industrials"),
    ("EMR",              "Emerson Electric",            "Industrials"),
    ("DE",               "Deere & Company",             "Industrials"),
    ("BA",               "Boeing",                      "Industrials"),
    ("EADSY",            "Airbus",                      "Industrials"),
    ("LMT",              "Lockheed Martin",             "Industrials"),
    ("RTX",              "RTX Corporation",             "Industrials"),
    ("PH",               "Parker Hannifin",             "Industrials"),
    ("ETN",              "Eaton Corporation",           "Industrials"),
    ("BEL.NS",           "Bharat Electronics",         "Industrials"),
    ("APOLLOTYRE.NS",    "Apollo Tyres",                "Industrials"),
    ("CUMMINSIND.NS",    "Cummins India",               "Industrials"),
    ("SBGSY",            "Schneider Electric",          "Industrials"),
]
