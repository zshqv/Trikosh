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
]
