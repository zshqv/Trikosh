-- =============================================================================
-- TRIKOSH FINANCIAL RESEARCH INFRASTRUCTURE
-- Database Schema v0.1 — PostgreSQL
-- Six tables | 200 companies | 6 sectors | 5 years of financial data
--
-- Sectors covered: Financial Services | AI & Technology | Healthcare
--                  Consumer & Retail  | Consumer Internet & Digital Platforms | Industrials
--
-- Schema designed to analyst-grade standards:
-- Every line item matches what appears in actual SEC 10-K filings,
-- Bloomberg terminal exports, and institutional equity research models.
--
-- PostgreSQL chosen over MySQL for:
--   - NUMERIC type enforces exact decimal arithmetic (no floating-point errors)
--   - TIMESTAMPTZ stores timezone-aware timestamps (enterprise standard)
--   - Custom ENUM types defined once, reused across all tables
--   - CHECK constraints enforced natively without workarounds
--   - Syntax compatibility with AWS Redshift, Aurora PostgreSQL, Google BigQuery
--   - Industry standard in enterprise FinTech and data infrastructure
--
-- Author: Trikosh Open-Source Project
-- GitHub: github.com/Trikosh/trikosh
-- =============================================================================

-- =============================================================================
-- CUSTOM ENUM TYPES
-- PostgreSQL defines ENUM types at the database level, not per-column.
-- This enforces consistency across every table that uses them.
-- =============================================================================

DROP TYPE IF EXISTS sector_type          CASCADE;
DROP TYPE IF EXISTS period_type          CASCADE;
DROP TYPE IF EXISTS unit_type            CASCADE;
DROP TYPE IF EXISTS consensus_rating_type CASCADE;

CREATE TYPE sector_type AS ENUM (
    'Financial Services',
    'AI & Technology',
    'Healthcare',
    'Consumer & Retail',
    'Consumer Internet & Digital Platforms',
    'Industrials'
);

CREATE TYPE period_type AS ENUM (
    'Annual',
    'TTM'
    -- TTM = Trailing Twelve Months: last four quarters combined.
    -- Used by analysts when a full fiscal year is not yet complete.
);

CREATE TYPE unit_type AS ENUM (
    'USD',
    'Thousands',
    'Millions',
    'Billions'
    -- Scale of all monetary values in a given row.
    -- If unit = 'Millions' and revenue = 394328, that means $394.3 billion.
    -- Always verify this before any cross-company comparison.
);

CREATE TYPE consensus_rating_type AS ENUM (
    'Strong Buy',
    'Buy',
    'Hold',
    'Sell',
    'Strong Sell'
);


-- =============================================================================
-- TRIGGER FUNCTION: auto-update updated_at on any row modification
-- PostgreSQL does not have MySQL's ON UPDATE CURRENT_TIMESTAMP shorthand.
-- This function is created once and attached to every table via triggers below.
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- =============================================================================
-- TABLE 1: companies
-- Master directory of all 200 companies covered by Trikosh.
-- Every other table links back to this via company_id.
-- =============================================================================

DROP TABLE IF EXISTS companies CASCADE;

CREATE TABLE companies (

    -- IDENTIFIERS
    company_id              SERIAL          PRIMARY KEY,
        -- SERIAL = auto-incrementing INTEGER. PostgreSQL creates a sequence behind it.
        -- Equivalent to MySQL's INT AUTO_INCREMENT.

    ticker                  VARCHAR(10)     NOT NULL UNIQUE,
        -- Stock ticker as listed on primary exchange. E.g. AAPL, JPM, NVO, NVDA.

    company_name            VARCHAR(255)    NOT NULL,
        -- Full legal company name. E.g. "JPMorgan Chase & Co."

    short_name              VARCHAR(100),
        -- Common display name for charts and tables. E.g. "JPMorgan".
        -- In PostgreSQL, omitting NOT NULL makes the column nullable by default.

    -- CLASSIFICATION
    sector                  sector_type     NOT NULL,
        -- Uses the custom ENUM type defined above.
        -- Only accepts: 'Financial Services', 'Artificial Intelligence', 'Healthcare'

    industry                VARCHAR(150),
        -- Granular classification within sector.
        -- E.g. "Investment Banking", "Large Language Models", "Pharmaceuticals"

    sub_industry            VARCHAR(150),
        -- GICS sub-industry (Global Industry Classification Standard).

    -- EXCHANGE AND MARKET
    primary_exchange        VARCHAR(50)     NOT NULL,
        -- E.g. NYSE, NASDAQ, LSE, Euronext Paris, NSE

    secondary_exchange      VARCHAR(50),
        -- Secondary listing for dual-listed companies.

    reporting_currency      CHAR(3)         NOT NULL DEFAULT 'USD',
        -- ISO 4217 three-letter currency code for financial statements.
        -- Critical: Novo Nordisk reports in DKK, not USD.

    functional_currency     CHAR(3),
        -- Currency the company primarily operates in. Can differ from reporting.

    -- GEOGRAPHY
    country_of_incorporation    VARCHAR(100)    NOT NULL,
        -- Legal country of registration. E.g. "United States", "Denmark"

    country_of_headquarters     VARCHAR(100),
        -- Physical location of head office. Often differs from incorporation.

    region                  VARCHAR(50),
        -- E.g. "North America", "Europe", "Asia-Pacific"

    -- COMPANY PROFILE
    fiscal_year_end         SMALLINT        NOT NULL DEFAULT 12
                            CHECK (fiscal_year_end BETWEEN 1 AND 12),
        -- Month fiscal year ends. 12 = December. Apple ends September (9).
        -- CHECK constraint is enforced by PostgreSQL natively.

    ipo_date                DATE,
    founded_year            SMALLINT,
    employees               INTEGER,

    description             TEXT,
        -- Two to four sentence business description for research report starters.

    -- DATA COVERAGE
    data_start_year         SMALLINT        NOT NULL,
    data_end_year           SMALLINT        NOT NULL,

    -- EXTERNAL IDENTIFIERS
    investor_relations_url  TEXT,
        -- Primary source for all financial data validation.

    sec_cik                 VARCHAR(20),
        -- SEC Central Index Key. Enables programmatic pull from data.sec.gov.
        -- Apple CIK: 0000320193.

    isin                    CHAR(12),
        -- International Securities Identification Number. Used in European markets.

    -- METADATA
    is_active               BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
        -- TIMESTAMPTZ = timestamp with time zone. PostgreSQL best practice.
        -- Stores in UTC; displays in session timezone. No ambiguity.
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()

);

CREATE INDEX idx_companies_sector   ON companies(sector);
CREATE INDEX idx_companies_exchange ON companies(primary_exchange);
CREATE INDEX idx_companies_currency ON companies(reporting_currency);

CREATE TRIGGER trg_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE companies IS 'Master company directory — anchor table for all 200 Trikosh companies';


-- =============================================================================
-- TABLE 2: income_statements
-- The Profit and Loss (P&L) statement.
-- Shows what a company earned, what it spent, and what it kept as profit
-- over a specific period (one fiscal year).
-- Maps directly to SEC 10-K Annual Report disclosures.
-- =============================================================================

DROP TABLE IF EXISTS income_statements CASCADE;

CREATE TABLE income_statements (

    -- RECORD IDENTIFIERS
    statement_id            BIGSERIAL       PRIMARY KEY,
        -- BIGSERIAL for potentially high-volume tables. Future-proofs expansion.

    company_id              INTEGER         NOT NULL
                            REFERENCES companies(company_id) ON DELETE RESTRICT,
        -- Inline REFERENCES syntax. ON DELETE RESTRICT prevents orphaned rows.

    fiscal_year             SMALLINT        NOT NULL,
    fiscal_year_end_date    DATE            NOT NULL,
    period_type             period_type     NOT NULL DEFAULT 'Annual',
    currency                CHAR(3)         NOT NULL DEFAULT 'USD',
    unit                    unit_type       NOT NULL DEFAULT 'Millions',

    -- -------------------------------------------------------------------------
    -- REVENUE
    -- -------------------------------------------------------------------------

    revenue_total               NUMERIC(20,3),
        -- NUMERIC(20,3): exact decimal arithmetic. No floating-point rounding.
        -- Up to 17 digits before decimal, 3 after. Handles any company size.
        -- Total net revenue / net sales. The income statement's first line.

    revenue_product             NUMERIC(20,3),
        -- Revenue from physical product sales. E.g. iPhone hardware revenue.

    revenue_service             NUMERIC(20,3),
        -- Revenue from services. E.g. Apple Services (App Store, iCloud).

    revenue_subscription        NUMERIC(20,3),
        -- Recurring subscription revenue. Critical for SaaS and AI platforms.

    revenue_licensing           NUMERIC(20,3),
        -- IP licensing, software licences, patent royalties.

    revenue_interest_income     NUMERIC(20,3),
        -- PRIMARY revenue for banks: interest earned on loans and securities.

    revenue_fee_commission      NUMERIC(20,3),
        -- Advisory fees, trading commissions, management fees.

    revenue_trading             NUMERIC(20,3),
        -- Revenue from trading operations (banks and broker-dealers).

    revenue_other               NUMERIC(20,3),

    -- -------------------------------------------------------------------------
    -- COST STRUCTURE
    -- -------------------------------------------------------------------------

    cost_of_revenue             NUMERIC(20,3),
        -- Cost of Goods Sold (COGS). Direct costs to produce what was sold.

    interest_expense            NUMERIC(20,3),
        -- Interest paid on deposits and borrowings. The cost side for banks.
        -- Net Interest Income = revenue_interest_income - interest_expense.

    gross_profit                NUMERIC(20,3),
        -- Revenue minus Cost of Revenue. What remains before operating expenses.

    -- -------------------------------------------------------------------------
    -- OPERATING EXPENSES
    -- -------------------------------------------------------------------------

    research_and_development    NUMERIC(20,3),
        -- R&D: Drug development, AI model training, product engineering.
        -- R&D intensity = R&D / Revenue. Critical for AI and pharma sectors.

    selling_general_admin       NUMERIC(20,3),
        -- SG&A combined: sales force, marketing, corporate overhead.

    selling_and_marketing       NUMERIC(20,3),
        -- Customer acquisition, advertising, sales team costs.

    general_and_administrative  NUMERIC(20,3),
        -- Pure overhead: executive comp, legal, accounting, HR, office.

    provision_for_credit_losses NUMERIC(20,3),
        -- BANK-SPECIFIC. Reserve for expected loan defaults.
        -- Rising provisions signal deteriorating loan book quality.

    amortization_intangibles    NUMERIC(20,3),
        -- Amortisation of acquired IP, patents, customer lists. Non-cash charge.

    restructuring_charges       NUMERIC(20,3),
        -- One-time costs: layoffs, facility closures. Analysts exclude from core earnings.

    impairment_charges          NUMERIC(20,3),
        -- Write-down of assets below book value. Goodwill impairment is most common.

    other_operating_expenses    NUMERIC(20,3),
    total_operating_expenses    NUMERIC(20,3),

    -- -------------------------------------------------------------------------
    -- OPERATING PROFIT
    -- -------------------------------------------------------------------------

    operating_income            NUMERIC(20,3),
        -- EBIT: Earnings Before Interest and Tax. Core operational profitability.

    operating_margin_pct        NUMERIC(8,4),
        -- Operating Income / Revenue * 100. Pre-computed and stored.

    -- -------------------------------------------------------------------------
    -- NON-OPERATING ITEMS
    -- -------------------------------------------------------------------------

    interest_income_other       NUMERIC(20,3),
        -- Interest earned on cash holdings (for non-bank companies).

    interest_expense_net        NUMERIC(20,3),
        -- Net interest cost after deducting interest earned.

    gain_loss_investments       NUMERIC(20,3),
        -- Realised gains or losses on sold securities.

    gain_loss_foreign_exchange  NUMERIC(20,3),
        -- FX translation impact. Material for multinationals like Novo Nordisk.

    other_non_operating_income  NUMERIC(20,3),

    -- -------------------------------------------------------------------------
    -- PRE-TAX AND TAX
    -- -------------------------------------------------------------------------

    income_before_tax           NUMERIC(20,3),
        -- EBT: Operating Income plus all non-operating items.

    income_tax_expense          NUMERIC(20,3),
        -- Total taxes: current (cash paid) plus deferred (timing differences).

    effective_tax_rate_pct      NUMERIC(8,4),
        -- Tax Expense / Income Before Tax * 100.

    -- -------------------------------------------------------------------------
    -- NET INCOME
    -- -------------------------------------------------------------------------

    net_income_including_minority   NUMERIC(20,3),
        -- Net profit including minority shareholders in partially-owned subs.

    minority_interest_expense       NUMERIC(20,3),
        -- Profit attributable to external minority shareholders. Subtract this.

    net_income                  NUMERIC(20,3),
        -- THE bottom line. Belongs entirely to the company's own shareholders.

    net_income_margin_pct       NUMERIC(8,4),
        -- Net Income / Revenue * 100.

    -- -------------------------------------------------------------------------
    -- EBITDA
    -- -------------------------------------------------------------------------

    depreciation_amortization   NUMERIC(20,3),
        -- Total D&A. Non-cash expense. Adding back gives a cash flow proxy.

    ebitda                      NUMERIC(20,3),
        -- Earnings Before Interest, Tax, Depreciation, and Amortisation.
        -- Primary input for EV/EBITDA multiples used in M&A and LBO analysis.

    ebitda_margin_pct           NUMERIC(8,4),

    -- -------------------------------------------------------------------------
    -- PER SHARE DATA
    -- -------------------------------------------------------------------------

    eps_basic                   NUMERIC(12,4),
        -- Net Income / Basic Shares.

    eps_diluted                 NUMERIC(12,4),
        -- Net Income / Diluted Shares. Always use this for analysis.

    dividends_per_share         NUMERIC(12,4),
        -- Annual cash dividend per common share.

    shares_basic                NUMERIC(20,3),
        -- Weighted average basic shares outstanding during the year (millions).

    shares_diluted              NUMERIC(20,3),
        -- Weighted average diluted shares. Denominator for diluted EPS.

    -- DATA QUALITY
    data_source                 VARCHAR(100),
    is_restated                 BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_income_company_year UNIQUE (company_id, fiscal_year, period_type)
);

CREATE INDEX idx_income_year    ON income_statements(fiscal_year);
CREATE INDEX idx_income_company ON income_statements(company_id);

CREATE TRIGGER trg_income_updated_at
    BEFORE UPDATE ON income_statements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE income_statements IS 'Income statements — P&L data for all 200 Trikosh companies';


-- =============================================================================
-- TABLE 3: balance_sheets
-- Financial position at a specific point in time (year-end snapshot).
-- Fundamental equation must hold: Total Assets = Total Liabilities + Equity.
-- =============================================================================

DROP TABLE IF EXISTS balance_sheets CASCADE;

CREATE TABLE balance_sheets (

    balance_sheet_id        BIGSERIAL       PRIMARY KEY,
    company_id              INTEGER         NOT NULL
                            REFERENCES companies(company_id) ON DELETE RESTRICT,
    fiscal_year             SMALLINT        NOT NULL,
    fiscal_year_end_date    DATE            NOT NULL,
    period_type             period_type     NOT NULL DEFAULT 'Annual',
    currency                CHAR(3)         NOT NULL DEFAULT 'USD',
    unit                    unit_type       NOT NULL DEFAULT 'Millions',

    -- =========================================================================
    -- ASSETS
    -- =========================================================================

    -- CURRENT ASSETS
    cash_and_equivalents            NUMERIC(20,3),
        -- Cash + bank accounts + money market funds + T-bills under 90 days.

    short_term_investments          NUMERIC(20,3),
        -- Marketable securities maturing within one year.

    accounts_receivable_gross       NUMERIC(20,3),
        -- Money owed by customers for goods delivered but not yet paid.

    allowance_doubtful_accounts     NUMERIC(20,3),
        -- Estimate of uncollectable receivables. Stored as negative value.

    accounts_receivable_net         NUMERIC(20,3),
        -- Gross receivables minus allowance. What the company realistically collects.

    notes_receivable_short_term     NUMERIC(20,3),
        -- Short-term loans made to other parties, due within one year.

    inventories                     NUMERIC(20,3),
        -- Raw materials + work-in-progress + finished goods.
        -- Near-zero for pure software. Significant for pharma and hardware.

    prepaid_expenses                NUMERIC(20,3),
        -- Advance payments for future benefits: insurance, rent, software.

    income_tax_receivable           NUMERIC(20,3),
        -- Tax overpayment owed back by the government.

    other_current_assets            NUMERIC(20,3),
    total_current_assets            NUMERIC(20,3),

    -- NON-CURRENT ASSETS
    gross_property_plant_equip      NUMERIC(20,3),
        -- Original purchase cost of all physical assets before depreciation.

    accumulated_depreciation        NUMERIC(20,3),
        -- Total depreciation taken since purchase. Stored as negative value.

    net_property_plant_equip        NUMERIC(20,3),
        -- Book value of physical assets = gross minus accumulated depreciation.

    operating_lease_right_of_use    NUMERIC(20,3),
        -- Present value of future lease payments (IFRS 16 / ASC 842 standard).

    long_term_investments           NUMERIC(20,3),
        -- Strategic equity stakes and long-dated bonds.

    equity_method_investments       NUMERIC(20,3),
        -- Associates (20-50% owned) under equity accounting method.

    goodwill                        NUMERIC(20,3),
        -- Premium paid above fair value in acquisitions.
        -- Goodwill impairment = admission the acquisition overpaid.

    intangible_assets               NUMERIC(20,3),
        -- Patents, trademarks, drug licences, acquired software, brand value.

    deferred_tax_assets             NUMERIC(20,3),
        -- Future tax benefits from timing differences and loss carryforwards.

    other_long_term_assets          NUMERIC(20,3),
    total_non_current_assets        NUMERIC(20,3),

    -- BANK-SPECIFIC ASSETS
    loans_and_leases_gross          NUMERIC(20,3),
        -- Total gross loan book. Primary earning asset for banks.

    allowance_for_loan_losses       NUMERIC(20,3),
        -- Loan loss reserve. Rising = bank anticipating more defaults.

    loans_and_leases_net            NUMERIC(20,3),
        -- Net loans = gross minus allowance.

    investment_securities           NUMERIC(20,3),
        -- Bond portfolio: government bonds, MBS, corporate bonds.

    trading_assets                  NUMERIC(20,3),
        -- Assets held for short-term trading at fair value.

    federal_funds_sold              NUMERIC(20,3),
        -- Overnight interbank loans extended to other banks.

    total_assets                    NUMERIC(20,3),
        -- Sum of all assets. Must equal total_liabilities + equity.

    -- =========================================================================
    -- LIABILITIES
    -- =========================================================================

    -- CURRENT LIABILITIES
    accounts_payable                NUMERIC(20,3),
        -- Amounts owed to suppliers not yet paid.

    short_term_debt                 NUMERIC(20,3),
        -- Debt maturing within 12 months: revolving credit, commercial paper.

    current_portion_long_term_debt  NUMERIC(20,3),
        -- Long-term debt due specifically within the next 12 months.

    accrued_liabilities             NUMERIC(20,3),
        -- Expenses incurred but not yet cash-settled: wages, accrued interest.

    deferred_revenue_current        NUMERIC(20,3),
        -- Cash received for services not yet delivered. High for SaaS and AI.

    income_tax_payable              NUMERIC(20,3),

    operating_lease_liability_current NUMERIC(20,3),
        -- Lease obligations due within one year.

    other_current_liabilities       NUMERIC(20,3),
    total_current_liabilities       NUMERIC(20,3),

    -- NON-CURRENT LIABILITIES
    long_term_debt                  NUMERIC(20,3),
        -- Bonds, term loans, notes with maturity beyond one year.
        -- Core of leverage analysis. Net Debt / EBITDA is the primary metric.

    long_term_operating_lease       NUMERIC(20,3),
    deferred_tax_liabilities        NUMERIC(20,3),
    deferred_revenue_long_term      NUMERIC(20,3),

    pension_obligations             NUMERIC(20,3),
        -- Present value of defined benefit pension liabilities.
        -- Material for legacy European banks and industrial companies.

    minority_interest_liability     NUMERIC(20,3),
        -- Non-controlling interest in partially-owned subsidiaries.

    other_long_term_liabilities     NUMERIC(20,3),
    total_non_current_liabilities   NUMERIC(20,3),

    -- BANK-SPECIFIC LIABILITIES
    total_deposits                  NUMERIC(20,3),
        -- Total customer deposits. Primary funding source for banks.

    deposits_demand                 NUMERIC(20,3),
        -- Non-interest-bearing checking accounts. Cheapest funding.

    deposits_savings                NUMERIC(20,3),
        -- Savings and money market accounts.

    deposits_time                   NUMERIC(20,3),
        -- CDs and fixed-term deposits. Most expensive deposit category.

    federal_funds_purchased         NUMERIC(20,3),
        -- Short-term interbank borrowings.

    repurchase_agreements           NUMERIC(20,3),
        -- Repos: short-term secured borrowings collateralised by securities.

    trading_liabilities             NUMERIC(20,3),
    total_liabilities               NUMERIC(20,3),

    -- =========================================================================
    -- SHAREHOLDERS EQUITY
    -- =========================================================================

    common_stock_par_value          NUMERIC(20,3),
        -- Nominal par value of issued shares. Usually near zero ($0.001).

    additional_paid_in_capital      NUMERIC(20,3),
        -- Share premium: proceeds from stock issuances above par value.

    retained_earnings               NUMERIC(20,3),
        -- Cumulative net income kept in the business (not paid as dividends).
        -- Negative = accumulated losses since inception.

    treasury_stock                  NUMERIC(20,3),
        -- Cost of shares repurchased. Always negative.
        -- Apple has bought back over $600 billion of its own shares.

    accumulated_other_comprehensive_income NUMERIC(20,3),
        -- AOCI: Unrealised gains/losses not yet reflected in net income.
        -- FX translation, unrealised investment moves, pension adjustments.

    total_shareholders_equity       NUMERIC(20,3),
        -- = Common Stock + APIC + Retained Earnings - Treasury Stock + AOCI.
        -- Book value of equity. Denominator for ROE and P/B ratio.

    total_liabilities_and_equity    NUMERIC(20,3),
        -- Validation: must exactly equal total_assets. If not, data has an error.

    book_value_per_share            NUMERIC(12,4),
        -- Total Equity / Diluted Shares. P/B = Price / BVPS.

    tangible_book_value             NUMERIC(20,3),
        -- Equity minus Goodwill minus Intangibles. Conservative hard-asset value.

    tangible_book_value_per_share   NUMERIC(12,4),
        -- Tangible Book Value / Diluted Shares. Primary bank valuation input.

    -- DATA QUALITY
    data_source                     VARCHAR(100),
    is_restated                     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_bs_company_year UNIQUE (company_id, fiscal_year, period_type)
);

CREATE INDEX idx_bs_year    ON balance_sheets(fiscal_year);
CREATE INDEX idx_bs_company ON balance_sheets(company_id);

CREATE TRIGGER trg_bs_updated_at
    BEFORE UPDATE ON balance_sheets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE balance_sheets IS 'Balance sheets — financial position snapshots for all 200 Trikosh companies';


-- =============================================================================
-- TABLE 4: cash_flow_statements
-- Tracks actual cash movements. Verifies quality of accounting earnings.
-- Operating | Investing | Financing
-- Free Cash Flow is the most important output from this table.
-- =============================================================================

DROP TABLE IF EXISTS cash_flow_statements CASCADE;

CREATE TABLE cash_flow_statements (

    cash_flow_id            BIGSERIAL       PRIMARY KEY,
    company_id              INTEGER         NOT NULL
                            REFERENCES companies(company_id) ON DELETE RESTRICT,
    fiscal_year             SMALLINT        NOT NULL,
    fiscal_year_end_date    DATE            NOT NULL,
    period_type             period_type     NOT NULL DEFAULT 'Annual',
    currency                CHAR(3)         NOT NULL DEFAULT 'USD',
    unit                    unit_type       NOT NULL DEFAULT 'Millions',

    -- =========================================================================
    -- OPERATING ACTIVITIES
    -- =========================================================================

    net_income_cfs                  NUMERIC(20,3),
        -- Starting point (indirect method). Non-cash adjustments follow.

    -- NON-CASH ADJUSTMENTS
    depreciation_and_amortization   NUMERIC(20,3),
        -- Largest non-cash addback. Reduces accounting profit but costs no cash.

    stock_based_compensation        NUMERIC(20,3),
        -- Non-cash equity compensation. Major item for tech and AI companies.

    deferred_income_taxes           NUMERIC(20,3),
        -- Timing gap between book tax expense and actual cash taxes paid.

    amortization_debt_issuance      NUMERIC(20,3),
        -- Non-cash amortisation of bond issuance fees.

    impairment_and_writeoffs        NUMERIC(20,3),
        -- Non-cash write-downs of impaired assets.

    gain_loss_on_disposals          NUMERIC(20,3),
        -- Removed from operating; actual cash flows in investing section.

    -- WORKING CAPITAL CHANGES
    change_accounts_receivable      NUMERIC(20,3),
        -- Increase = cash not yet collected = negative. Red flag if rising faster than revenue.

    change_inventories              NUMERIC(20,3),
        -- Increase = cash tied up in unsold goods = negative.

    change_accounts_payable         NUMERIC(20,3),
        -- Increase = held cash longer before paying suppliers = positive.

    change_deferred_revenue         NUMERIC(20,3),
        -- Increase = customers paid in advance = positive. Key for SaaS.

    change_other_working_capital    NUMERIC(20,3),
    other_operating_adjustments     NUMERIC(20,3),

    cash_from_operations            NUMERIC(20,3),
        -- Operating Cash Flow (OCF). THE most important cash flow line.
        -- Divergence from net income signals earnings quality concern.

    -- =========================================================================
    -- INVESTING ACTIVITIES
    -- =========================================================================

    capital_expenditures            NUMERIC(20,3),
        -- CAPEX: Cash spent on physical assets. Negative outflow.
        -- AI: GPU clusters, data centres. Pharma: manufacturing plants.

    capitalised_software_dev        NUMERIC(20,3),
        -- Internally developed software capitalised as a long-term asset.

    acquisitions_net_of_cash        NUMERIC(20,3),
        -- Cash paid for acquisitions net of target's cash. Negative.

    divestitures_asset_sales        NUMERIC(20,3),
        -- Proceeds from selling businesses or assets. Positive.

    purchases_investments           NUMERIC(20,3),
        -- Cash spent buying financial securities. Negative.

    sales_maturities_investments    NUMERIC(20,3),
        -- Proceeds from sold or matured investments. Positive.

    other_investing_activities      NUMERIC(20,3),
    cash_from_investing             NUMERIC(20,3),
        -- Almost always negative for actively growing companies.

    -- =========================================================================
    -- FINANCING ACTIVITIES
    -- =========================================================================

    proceeds_debt_issuance          NUMERIC(20,3),
        -- New bonds or loans issued. Positive.

    repayment_of_debt               NUMERIC(20,3),
        -- Debt retired. Negative.

    net_change_short_term_borrowings NUMERIC(20,3),

    proceeds_equity_issuance        NUMERIC(20,3),
        -- Shares issued via offering or employee stock plans.

    share_repurchases               NUMERIC(20,3),
        -- Cash spent buying back own shares. Negative.
        -- Apple: approximately $85-90 billion per year.

    dividends_paid                  NUMERIC(20,3),
        -- Dividends to common shareholders. Negative.

    dividends_paid_preferred        NUMERIC(20,3),
    other_financing_activities      NUMERIC(20,3),
    cash_from_financing             NUMERIC(20,3),

    -- =========================================================================
    -- SUMMARY
    -- =========================================================================

    effect_of_exchange_rates        NUMERIC(20,3),
        -- FX impact on foreign-held cash. Fourth reconciling line.

    net_change_in_cash              NUMERIC(20,3),
        -- = CFO + CFI + CFF + FX. Actual change in cash balance for the year.

    beginning_cash_balance          NUMERIC(20,3),
        -- Cash at start of year = prior year ending cash.

    ending_cash_balance             NUMERIC(20,3),
        -- Must match balance sheet cash_and_equivalents. Cross-validation check.

    free_cash_flow                  NUMERIC(20,3),
        -- = Cash From Operations - Capital Expenditures.
        -- What remains after maintaining and growing the physical asset base.
        -- Available for: dividends, buybacks, acquisitions, debt repayment.
        -- Basis for DCF valuation.

    free_cash_flow_yield_pct        NUMERIC(8,4),
        -- FCF / Market Cap * 100. Requires join with market_data table.

    -- DATA QUALITY
    data_source                     VARCHAR(100),
    is_restated                     BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_cfs_company_year UNIQUE (company_id, fiscal_year, period_type)
);

CREATE INDEX idx_cfs_year    ON cash_flow_statements(fiscal_year);
CREATE INDEX idx_cfs_company ON cash_flow_statements(company_id);

CREATE TRIGGER trg_cfs_updated_at
    BEFORE UPDATE ON cash_flow_statements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE cash_flow_statements IS 'Cash flow statements — operating, investing, and financing activities';


-- =============================================================================
-- TABLE 5: financial_ratios
-- Computed metrics derived from the three financial statements.
-- Profitability | Liquidity | Leverage | Efficiency | Valuation
-- =============================================================================

DROP TABLE IF EXISTS financial_ratios CASCADE;

CREATE TABLE financial_ratios (

    ratio_id                BIGSERIAL       PRIMARY KEY,
    company_id              INTEGER         NOT NULL
                            REFERENCES companies(company_id) ON DELETE RESTRICT,
    fiscal_year             SMALLINT        NOT NULL,
    period_type             period_type     NOT NULL DEFAULT 'Annual',
    currency                CHAR(3)         NOT NULL DEFAULT 'USD',

    -- =========================================================================
    -- PROFITABILITY
    -- =========================================================================

    gross_margin_pct                NUMERIC(8,4),
        -- Gross Profit / Revenue * 100. Software: 70-80%. Pharma: 70-85%.

    operating_margin_pct            NUMERIC(8,4),
        -- Operating Income / Revenue * 100.

    net_profit_margin_pct           NUMERIC(8,4),
        -- Net Income / Revenue * 100.

    ebitda_margin_pct               NUMERIC(8,4),
    ebit_margin_pct                 NUMERIC(8,4),

    -- RETURN METRICS
    return_on_equity_pct            NUMERIC(8,4),
        -- ROE = Net Income / Average Equity * 100.
        -- Buffett minimum: 15% sustained. Banks target: 10-15%.

    return_on_assets_pct            NUMERIC(8,4),
        -- ROA = Net Income / Average Assets * 100.
        -- Banks: 0.8-1.5% normal (huge asset base vs. profits).

    return_on_invested_capital_pct  NUMERIC(8,4),
        -- ROIC = NOPAT / Invested Capital * 100.
        -- If ROIC > WACC: value creation. If ROIC < WACC: value destruction.

    return_on_tangible_equity_pct   NUMERIC(8,4),
        -- ROTCE: Net Income / Avg Tangible Equity * 100. Primary bank metric.
        -- JPMorgan target: 17%+.

    -- BANK-SPECIFIC
    net_interest_margin_pct         NUMERIC(8,4),
        -- NIM = Net Interest Income / Avg Earning Assets * 100.
        -- THE core bank profitability metric. US average: 2.5-3.5%.

    efficiency_ratio_pct            NUMERIC(8,4),
        -- Non-Interest Expense / Total Revenue * 100. Lower is better.
        -- Best-in-class banks: 50-55%. Above 65%: inefficient.

    -- =========================================================================
    -- LIQUIDITY
    -- =========================================================================

    current_ratio                   NUMERIC(8,4),
        -- Current Assets / Current Liabilities. Healthy: >1.5.

    quick_ratio                     NUMERIC(8,4),
        -- (Current Assets - Inventories) / Current Liabilities. Acid test.

    cash_ratio                      NUMERIC(8,4),
        -- Cash / Current Liabilities. Most conservative liquidity measure.

    operating_cash_flow_ratio       NUMERIC(8,4),
        -- Operating Cash Flow / Current Liabilities.

    -- =========================================================================
    -- LEVERAGE / SOLVENCY
    -- =========================================================================

    debt_to_equity_ratio            NUMERIC(8,4),
        -- Total Debt / Total Equity.

    net_debt_to_ebitda              NUMERIC(8,4),
        -- Net Debt / EBITDA. Standard LBO and credit covenant metric.
        -- Under 2x: conservative. 2-4x: moderate. Above 5x: highly leveraged.

    debt_to_assets_ratio            NUMERIC(8,4),
        -- Total Liabilities / Total Assets.

    interest_coverage_ratio         NUMERIC(8,4),
        -- EBIT / Interest Expense. Below 1.5x: distress. Above 3x: comfortable.

    equity_multiplier               NUMERIC(8,4),
        -- Total Assets / Total Equity. DuPont decomposition component.

    -- BANK CAPITAL RATIOS
    tier1_capital_ratio_pct         NUMERIC(8,4),
        -- Tier 1 Capital / Risk-Weighted Assets. Basel III minimum: 6%.

    common_equity_tier1_pct         NUMERIC(8,4),
        -- CET1 Capital / RWA. Primary regulatory benchmark. JPM runs ~13-15%.

    leverage_ratio_pct              NUMERIC(8,4),
        -- Tier 1 Capital / Total Assets. Minimum 3-4% required.

    -- =========================================================================
    -- EFFICIENCY / ACTIVITY
    -- =========================================================================

    asset_turnover_ratio            NUMERIC(8,4),
        -- Revenue / Average Assets. Higher = more efficient use of assets.

    inventory_turnover              NUMERIC(8,4),
    days_inventory_outstanding      NUMERIC(8,4),
        -- 365 / Inventory Turnover. Lower = faster.

    receivables_turnover            NUMERIC(8,4),
    days_sales_outstanding          NUMERIC(8,4),
        -- 365 / Receivables Turnover. Rising DSO = customers paying slower.

    payables_turnover               NUMERIC(8,4),
    days_payable_outstanding        NUMERIC(8,4),
        -- Higher = company holds cash longer before paying suppliers.

    cash_conversion_cycle           NUMERIC(8,4),
        -- DSO + DIO - DPO. Negative = exceptional (Amazon model).

    rd_intensity_pct                NUMERIC(8,4),
        -- R&D / Revenue * 100. Pharma: 15-25%. AI/tech: 10-20%.

    capex_intensity_pct             NUMERIC(8,4),
        -- CAPEX / Revenue * 100. Signals physical asset intensity.

    -- =========================================================================
    -- VALUATION (requires market data)
    -- =========================================================================

    price_to_earnings_ratio         NUMERIC(10,4),
        -- P/E = Price / Diluted EPS. S&P 500 average: 20-25x.

    price_to_earnings_growth        NUMERIC(10,4),
        -- PEG = P/E / EPS Growth Rate. Under 1: potentially cheap. Over 2: expensive.

    ev_to_ebitda                    NUMERIC(10,4),
        -- EV / EBITDA. Primary M&A multiple. Tech: 15-30x. Healthcare: 12-20x.

    ev_to_ebit                      NUMERIC(10,4),
    ev_to_revenue                   NUMERIC(10,4),
        -- EV / Revenue. Used for loss-making growth companies.

    ev_to_free_cash_flow            NUMERIC(10,4),
        -- EV / FCF. Preferred by value investors.

    price_to_book_ratio             NUMERIC(10,4),
        -- Market Cap / Book Equity. Banks: 1-2x normal.

    price_to_tangible_book          NUMERIC(10,4),
        -- Market Cap / Tangible Book. Below 1x signals potential deep value.

    price_to_sales_ratio            NUMERIC(10,4),
    price_to_free_cash_flow         NUMERIC(10,4),

    dividend_yield_pct              NUMERIC(8,4),
        -- Annual DPS / Price * 100. Banks often yield 3-5%.

    dividend_payout_ratio_pct       NUMERIC(8,4),
        -- DPS / EPS * 100. Above 100%: unsustainable.

    -- DATA QUALITY
    calculation_method              VARCHAR(100),
        -- Notes on methodology. E.g. "Average balance sheet used for ROE denominator".
    data_source                     VARCHAR(100),
    created_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_ratio_company_year UNIQUE (company_id, fiscal_year, period_type)
);

CREATE INDEX idx_ratio_year    ON financial_ratios(fiscal_year);
CREATE INDEX idx_ratio_company ON financial_ratios(company_id);

CREATE TRIGGER trg_ratio_updated_at
    BEFORE UPDATE ON financial_ratios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE financial_ratios IS 'Computed financial ratios — profitability, leverage, liquidity, efficiency, valuation';


-- =============================================================================
-- TABLE 6: market_data
-- Share prices, market capitalisation, enterprise value, analyst consensus.
-- Bridges accounting statements to market-based valuation.
-- =============================================================================

DROP TABLE IF EXISTS market_data CASCADE;

CREATE TABLE market_data (

    market_data_id          BIGSERIAL       PRIMARY KEY,
    company_id              INTEGER         NOT NULL
                            REFERENCES companies(company_id) ON DELETE RESTRICT,
    fiscal_year             SMALLINT        NOT NULL,
    data_date               DATE            NOT NULL,
        -- Date these market values represent. Typically fiscal year-end date.

    currency                CHAR(3)         NOT NULL DEFAULT 'USD',
    unit                    unit_type       NOT NULL DEFAULT 'Millions',

    -- SHARE PRICE
    share_price_close           NUMERIC(12,4),
        -- Closing price on data_date. Split-adjusted.

    share_price_high_52wk       NUMERIC(12,4),
        -- 52-week high as of data_date.

    share_price_low_52wk        NUMERIC(12,4),
    share_price_1yr_ago         NUMERIC(12,4),

    price_return_1yr_pct        NUMERIC(8,4),
        -- (close / 1yr_ago - 1) * 100. One-year price return.

    -- SHARES OUTSTANDING
    shares_outstanding_basic    NUMERIC(20,3),
    shares_outstanding_diluted  NUMERIC(20,3),
        -- Fully diluted shares. Used for all market cap calculations.

    float_shares                NUMERIC(20,3),
        -- Freely tradeable shares excluding locked-up insider holdings.

    insider_ownership_pct       NUMERIC(8,4),
    institutional_ownership_pct NUMERIC(8,4),

    -- MARKET CAPITALISATION
    market_cap                  NUMERIC(20,3),
        -- Market Cap = Price * Diluted Shares. Total equity market value.

    -- ENTERPRISE VALUE
    enterprise_value            NUMERIC(20,3),
        -- EV = Market Cap + Total Debt + Preferred + Minority Interest - Cash.
        -- Capital-structure-neutral measure of total business value.

    ev_components_total_debt    NUMERIC(20,3),
    ev_components_cash          NUMERIC(20,3),
    ev_components_preferred     NUMERIC(20,3),
    ev_components_minority      NUMERIC(20,3),

    net_debt                    NUMERIC(20,3),
        -- Net Debt = Total Debt - Cash. Negative = net cash position.

    -- BUYBACK AND ISSUANCE
    shares_repurchased_year     NUMERIC(20,3),
    buyback_amount_year         NUMERIC(20,3),
    shares_issued_year          NUMERIC(20,3),

    -- ANALYST CONSENSUS
    analyst_count               SMALLINT,
    consensus_rating            consensus_rating_type,
    consensus_price_target      NUMERIC(12,4),

    price_target_upside_pct     NUMERIC(8,4),
        -- (target / close - 1) * 100. Implied upside to consensus.

    -- TRADING METRICS
    average_daily_volume_30d    BIGINT,
        -- Average daily shares traded over 30 days. Liquidity measure.

    beta                        NUMERIC(6,4),
        -- Market sensitivity vs. S&P 500. Growth tech: 1.2-1.8. Pharma: 0.6-0.9.

    -- INDEX MEMBERSHIP
    is_sp500_member             BOOLEAN,
    is_nasdaq100_member         BOOLEAN,
    is_ftse100_member           BOOLEAN,
    is_eurostoxx50_member       BOOLEAN,
    is_msci_world_member        BOOLEAN,

    -- DATA QUALITY
    data_source                 VARCHAR(100),
    created_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_mktdata_company_year UNIQUE (company_id, fiscal_year)
);

CREATE INDEX idx_mktdata_year    ON market_data(fiscal_year);
CREATE INDEX idx_mktdata_company ON market_data(company_id);

CREATE TRIGGER trg_mktdata_updated_at
    BEFORE UPDATE ON market_data
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

COMMENT ON TABLE market_data IS 'Market data — share prices, market cap, enterprise value, analyst consensus';


-- =============================================================================
-- VERIFICATION
-- Run these queries after executing this file to confirm all six tables exist.
--
-- \dt                          -- list all tables in current database
--
-- SELECT table_name
-- FROM information_schema.tables
-- WHERE table_schema = 'public'
-- ORDER BY table_name;
--
-- SELECT COUNT(*) FROM companies;
-- =============================================================================

-- =============================================================================
-- END OF SCHEMA
-- schema.sql | Trikosh Financial Research Infrastructure | v0.1 — PostgreSQL
-- github.com/Trikosh/trikosh
-- =============================================================================
