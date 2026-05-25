import { NextResponse } from "next/server";
import * as XLSX from "xlsx";

export async function GET() {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Income Statement ──
  const incomeHeaders = [
    "Fiscal Year", "Revenue ($M)", "COGS ($M)", "Gross Profit ($M)",
    "Gross Margin (%)", "Operating Expenses ($M)", "EBIT ($M)",
    "Operating Margin (%)", "Interest Expense ($M)", "EBT ($M)",
    "Tax Expense ($M)", "Net Income ($M)", "Net Margin (%)",
    "EPS (Diluted)", "Shares Outstanding (M)",
  ];
  const incomeData = [
    incomeHeaders,
    ["FY2020", "", "", "=D2-C2", "=D2/B2", "", "=D2-F2", "=G2/B2", "", "=G2+I2", "", "=J2+K2", "=L2/B2", "", ""],
    ["FY2021", "", "", "=D3-C3", "=D3/B3", "", "=D3-F3", "=G3/B3", "", "=G3+I3", "", "=J3+K3", "=L3/B3", "", ""],
    ["FY2022", "", "", "=D4-C4", "=D4/B4", "", "=D4-F4", "=G4/B4", "", "=G4+I4", "", "=J4+K4", "=L4/B4", "", ""],
    ["FY2023", "", "", "=D5-C5", "=D5/B5", "", "=D5-F5", "=G5/B5", "", "=G5+I5", "", "=J5+K5", "=L5/B5", "", ""],
    ["FY2024", "", "", "=D6-C6", "=D6/B6", "", "=D6-F6", "=G6/B6", "", "=G6+I6", "", "=J6+K6", "=L6/B6", "", ""],
    [],
    ["YoY Revenue Growth", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    ["FY2021", "=B3/B2-1"],
    ["FY2022", "=B4/B3-1"],
    ["FY2023", "=B5/B4-1"],
    ["FY2024", "=B6/B5-1"],
  ];
  const wsIncome = XLSX.utils.aoa_to_sheet(incomeData);
  wsIncome["!cols"] = Array.from({ length: 15 }, () => ({ wch: 20 }));
  XLSX.utils.book_append_sheet(wb, wsIncome, "Income Statement");

  // ── Sheet 2: Balance Sheet ──
  const balanceHeaders = [
    "Fiscal Year",
    "Cash & Equivalents ($M)", "Total Current Assets ($M)", "PP&E ($M)",
    "Total Assets ($M)", "Total Current Liabilities ($M)",
    "Long-term Debt ($M)", "Total Liabilities ($M)",
    "Total Equity ($M)", "Book Value per Share",
    "Current Ratio", "Debt-to-Equity",
  ];
  const balanceData = [
    balanceHeaders,
    ["FY2020", "", "", "", "", "", "", "", "=E2-H2", "", "=C2/F2", "=G2/I2"],
    ["FY2021", "", "", "", "", "", "", "", "=E3-H3", "", "=C3/F3", "=G3/I3"],
    ["FY2022", "", "", "", "", "", "", "", "=E4-H4", "", "=C4/F4", "=G4/I4"],
    ["FY2023", "", "", "", "", "", "", "", "=E5-H5", "", "=C5/F5", "=G5/I5"],
    ["FY2024", "", "", "", "", "", "", "", "=E6-H6", "", "=C6/F6", "=G6/I6"],
  ];
  const wsBalance = XLSX.utils.aoa_to_sheet(balanceData);
  wsBalance["!cols"] = Array.from({ length: 12 }, () => ({ wch: 22 }));
  XLSX.utils.book_append_sheet(wb, wsBalance, "Balance Sheet");

  // ── Sheet 3: Cash Flow ──
  const cashHeaders = [
    "Fiscal Year",
    "Operating Cash Flow ($M)", "Capital Expenditure ($M)",
    "Free Cash Flow ($M)", "Acquisitions ($M)",
    "Dividends Paid ($M)", "Share Buybacks ($M)",
    "Net Change in Cash ($M)", "FCF Conversion (%)",
  ];
  const cashData = [
    cashHeaders,
    ["FY2020", "", "", "=B2+C2", "", "", "", "", "=D2/[Net Income]"],
    ["FY2021", "", "", "=B3+C3", "", "", "", "", "=D3/[Net Income]"],
    ["FY2022", "", "", "=B4+C4", "", "", "", "", "=D4/[Net Income]"],
    ["FY2023", "", "", "=B5+C5", "", "", "", "", "=D5/[Net Income]"],
    ["FY2024", "", "", "=B6+C6", "", "", "", "", "=D6/[Net Income]"],
  ];
  const wsCash = XLSX.utils.aoa_to_sheet(cashData);
  wsCash["!cols"] = Array.from({ length: 9 }, () => ({ wch: 24 }));
  XLSX.utils.book_append_sheet(wb, wsCash, "Cash Flow");

  // ── Sheet 4: Key Ratios ──
  const ratioData = [
    ["Ratio", "FY2020", "FY2021", "FY2022", "FY2023", "FY2024", "Notes"],
    ["— Profitability —"],
    ["Gross Margin (%)", "", "", "", "", "", "= Gross Profit / Revenue"],
    ["Operating Margin (%)", "", "", "", "", "", "= EBIT / Revenue"],
    ["Net Margin (%)", "", "", "", "", "", "= Net Income / Revenue"],
    ["EBITDA Margin (%)", "", "", "", "", "", "= (EBIT + D&A) / Revenue"],
    ["Return on Equity (ROE)", "", "", "", "", "", "= Net Income / Avg. Equity"],
    ["Return on Assets (ROA)", "", "", "", "", "", "= Net Income / Avg. Assets"],
    ["Return on Invested Capital (ROIC)", "", "", "", "", "", "= NOPAT / Invested Capital"],
    [],
    ["— Liquidity & Leverage —"],
    ["Current Ratio", "", "", "", "", "", "= Current Assets / Current Liabilities"],
    ["Quick Ratio", "", "", "", "", "", "= (Cash + Receivables) / Current Liabilities"],
    ["Debt / Equity", "", "", "", "", "", "= Total Debt / Total Equity"],
    ["Net Debt / EBITDA", "", "", "", "", "", "= (Debt - Cash) / EBITDA"],
    ["Interest Coverage", "", "", "", "", "", "= EBIT / Interest Expense"],
    [],
    ["— Valuation —"],
    ["P/E Ratio", "", "", "", "", "", "= Share Price / EPS"],
    ["P/B Ratio", "", "", "", "", "", "= Share Price / Book Value per Share"],
    ["EV/EBITDA", "", "", "", "", "", "= Enterprise Value / EBITDA"],
    ["EV/Revenue", "", "", "", "", "", "= Enterprise Value / Revenue"],
    ["FCF Yield (%)", "", "", "", "", "", "= FCF per Share / Share Price"],
  ];
  const wsRatios = XLSX.utils.aoa_to_sheet(ratioData);
  wsRatios["!cols"] = [{ wch: 36 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 44 }];
  XLSX.utils.book_append_sheet(wb, wsRatios, "Key Ratios");

  // ── Sheet 5: DCF Model ──
  const dcfData = [
    ["TRIKOSH — DCF MODEL"],
    [],
    ["Inputs"],
    ["Discount Rate (WACC)", "10.0%", "", "← Adjust based on sector and company risk"],
    ["Terminal Growth Rate", "3.0%",  "", "← Typically GDP growth rate (2–3% for developed markets)"],
    ["Forecast Years", "5",          "", ""],
    [],
    ["Projections (Year 1 → 5)"],
    ["",             "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
    ["Revenue ($M)",  "", "", "", "", ""],
    ["FCF Margin (%)", "", "", "", "", ""],
    ["Free Cash Flow ($M)", "=B10*B11", "=C10*C11", "=D10*D11", "=E10*E11", "=F10*F11"],
    ["Discount Factor", "=1/(1+$B$4)^1", "=1/(1+$B$4)^2", "=1/(1+$B$4)^3", "=1/(1+$B$4)^4", "=1/(1+$B$4)^5"],
    ["PV of FCF ($M)", "=B12*B13", "=C12*C13", "=D12*D13", "=E12*E13", "=F12*F13"],
    [],
    ["Sum of PV of FCFs ($M)", "=SUM(B14:F14)"],
    [],
    ["Terminal Value"],
    ["Terminal FCF ($M)", "=F12*(1+B5)"],
    ["Terminal Value ($M)", "=B19/(B4-B5)"],
    ["PV of Terminal Value ($M)", "=B20/(1+B4)^B6"],
    [],
    ["Enterprise Value ($M)", "=B16+B21"],
    ["Less: Net Debt ($M)", "", "← Enter net debt (debt minus cash)"],
    ["Equity Value ($M)", "=B23+B24"],
    ["Shares Outstanding (M)", "", "← Enter diluted shares"],
    ["Implied Share Price", "=B25/B26"],
  ];
  const wsDCF = XLSX.utils.aoa_to_sheet(dcfData);
  wsDCF["!cols"] = [{ wch: 28 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 16 }, { wch: 44 }];
  XLSX.utils.book_append_sheet(wb, wsDCF, "DCF Model");

  // ── Sheet 6: Comp Table ──
  const compData = [
    ["COMPARABLE COMPANY ANALYSIS"],
    [],
    ["Company", "Ticker", "Market Cap ($B)", "EV ($B)", "Revenue ($B)", "EBITDA ($B)", "Net Income ($B)", "P/E", "EV/EBITDA", "P/B", "Gross Margin", "Net Margin", "ROE"],
    ["[Company 1]", "", "", "", "", "", "", "", "=D4/F4", "", "", "", ""],
    ["[Company 2]", "", "", "", "", "", "", "", "=D5/F5", "", "", "", ""],
    ["[Company 3]", "", "", "", "", "", "", "", "=D6/F6", "", "", "", ""],
    ["[Target Company]", "", "", "", "", "", "", "", "=D7/F7", "", "", "", ""],
    [],
    ["Peer Average", "", "", "", "=AVERAGE(E4:E6)", "=AVERAGE(F4:F6)", "", "=AVERAGE(H4:H6)", "=AVERAGE(I4:I6)", "=AVERAGE(J4:J6)", "=AVERAGE(K4:K6)", "=AVERAGE(L4:L6)", "=AVERAGE(M4:M6)"],
    ["Peer Median",  "", "", "", "=MEDIAN(E4:E6)",  "=MEDIAN(F4:F6)",  "", "=MEDIAN(H4:H6)",  "=MEDIAN(I4:I6)",  "=MEDIAN(J4:J6)",  "=MEDIAN(K4:K6)",  "=MEDIAN(L4:L6)",  "=MEDIAN(M4:M6)"],
    [],
    ["Implied Value (using median EV/EBITDA)", "=I10*F7"],
    ["Implied Value (using median P/E)",        "=H10*G7"],
  ];
  const wsComp = XLSX.utils.aoa_to_sheet(compData);
  wsComp["!cols"] = Array.from({ length: 13 }, (_, i) => ({ wch: i === 0 ? 24 : 14 }));
  XLSX.utils.book_append_sheet(wb, wsComp, "Comp Table");

  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="trikosh-equity-research-template.xlsx"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
