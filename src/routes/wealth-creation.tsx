import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { supabase } from "@/integrations/supabase/client";
import {
  TrendingUp,
  Percent,
  Calendar,
  Wallet,
  Coins,
  BookOpen,
  Search,
  ArrowRight,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/wealth-creation")({
  head: () => ({
    meta: [
      { title: "Wealth Creation & Calculators — StartUpOnTheWay" },
      {
        name: "description",
        content:
          "Smart tools and expert advice to build your financial future. Compute compounding, EMIs, and read curated investment tips.",
      },
    ],
    links: [{ rel: "canonical", href: "/wealth-creation" }],
  }),
  component: WealthCreationPage,
});

export interface InvestmentTip {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
}

const DEFAULT_TIPS: InvestmentTip[] = [
  {
    id: "tip-1",
    title: "The Power of Compounding via SIP",
    category: "Mutual Funds",
    content:
      "<p>Compounding is often called the eighth wonder of the world. By starting a Systematic Investment Plan (SIP) early, you allow your interest to earn interest over time. For example, investing ₹10,000 monthly for 20 years at a 12% expected annual return could grow to over ₹99 Lakhs, with your own investment being only ₹24 Lakhs.</p><strong>Key Takeaways:</strong><ul><li>Start early: Even a 5-year delay can cut your final corpus by half.</li><li>Consistency: Automate your monthly investments to remove emotional bias.</li><li>Top-up: Increase your SIP by 5-10% every year as your income grows.</li></ul>",
    created_at: new Date().toISOString(),
  },
  {
    id: "tip-2",
    title: "Tax Saving under Section 80C & Beyond",
    category: "Tax Planning",
    content:
      "<p>Smart tax planning is the first step to wealth creation. Under Section 80C of the Income Tax Act, you can deduct up to ₹1.5 Lakhs from your taxable income. Key instruments include ELSS Mutual Funds (which have the shortest lock-in period of 3 years), PPF, and National Savings Certificates.</p><strong>Best Tax-Saving Strategies:</strong><ul><li>ELSS Funds: Benefit from equity returns while saving tax.</li><li>NPS (Section 80CCD(1B)): Save an additional ₹50,000 on top of the 80C limit.</li><li>Health Insurance (Section 80D): Claim deductions on premium paid for self and parents.</li></ul>",
    created_at: new Date().toISOString(),
  },
  {
    id: "tip-3",
    title: "Emergency Funds: Your Financial Shield",
    category: "Smart Savings",
    content:
      "<p>Before allocating money to high-yield equity funds, ensure you have an emergency fund. This fund should cover at least 6 months of your unavoidable monthly expenses (rent, food, EMIs, insurance premiums). Keep this money in liquid mutual funds or high-yield savings accounts that offer immediate access.</p><strong>Tips for Emergency Fund:</strong><ul><li>Calculate accurately: Include all essential bills and healthcare premiums.</li><li>High Liquidity: Do not lock it in long-term FDs or equity.</li><li>Replenish first: If you draw from it, make refilling it your number one priority.</li></ul>",
    created_at: new Date().toISOString(),
  },
  {
    id: "tip-4",
    title: "Equity vs Debt: Finding the Right Asset Mix",
    category: "Asset Allocation",
    content:
      "<p>An optimal asset allocation protects you from market volatility. Younger investors can afford to allocate 70-80% of their savings to equities for long-term growth, whereas those closer to retirement should skew towards debt or fixed income for stability.</p><strong>Allocation Rules of Thumb:</strong><ul><li>Rule of 100: Subtract your age from 100 to find your ideal equity allocation percentage.</li><li>Rebalance annually: Shift gains from equity to debt (or vice versa) to maintain your target mix.</li><li>Diversify globally: Allocate 10-15% in international funds to hedge geographic risk.</li></ul>",
    created_at: new Date().toISOString(),
  },
];

type CalcTab = "sip" | "lumpsum" | "emi" | "fd" | "8th_pay" | "step_up_sip" | "gst" | "income_tax" | "tds_interest" | "tds" | "ppf" | "gst_interest" | "compound_interest";

function WealthCreationPage() {
  const [activeTab, setActiveTab] = useState<CalcTab>("sip");
  const [tips, setTips] = useState<InvestmentTip[]>([]);
  const [selectedTip, setSelectedTip] = useState<InvestmentTip | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // SIP Calculator States
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // Lumpsum Calculator States
  const [lumpAmount, setLumpAmount] = useState(50000);
  const [lumpRate, setLumpRate] = useState(12);
  const [lumpYears, setLumpYears] = useState(10);

  // EMI Calculator States
  const [emiLoan, setEmiLoan] = useState(1000000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiYears, setEmiYears] = useState(15);

  // FD Calculator States
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(7);
  const [fdYears, setFdYears] = useState(5);

  // New Calculators States
  const [stepUpAmount, setStepUpAmount] = useState(5000);
  const [stepUpRate, setStepUpRate] = useState(10);
  const [stepUpReturn, setStepUpReturn] = useState(12);
  const [stepUpYears, setStepUpYears] = useState(10);

  const [payBasic, setPayBasic] = useState(18000);

  const [gstAmount, setGstAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [gstMode, setGstMode] = useState<"add" | "remove">("add");

  const [incTaxAmount, setIncTaxAmount] = useState(1000000);

  const [tdsPrincipal, setTdsPrincipal] = useState(100000);
  const [tdsRate, setTdsRate] = useState(10);

  const [tdsIntAmount, setTdsIntAmount] = useState(10000);
  const [tdsIntMonths, setTdsIntMonths] = useState(1);

  const [ppfYearly, setPpfYearly] = useState(150000);
  const [ppfYears, setPpfYears] = useState(15);

  const [gstIntTax, setGstIntTax] = useState(50000);
  const [gstIntDays, setGstIntDays] = useState(30);

  const [ciPrincipal, setCiPrincipal] = useState(100000);
  const [ciRate, setCiRate] = useState(10);
  const [ciYears, setCiYears] = useState(5);
  const [ciFreq, setCiFreq] = useState(1);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const { data, error } = await supabase
        .from("investment_tips" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setTips(data as any);
      } else {
        setTips(DEFAULT_TIPS);
      }
    } catch (e) {
      console.warn("Could not fetch investment_tips from DB, falling back to default tips.", e);
      setTips(DEFAULT_TIPS);
    }
  };

  // Helper formatting function
  const formatINR = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 1. Calculate SIP Values
  const getSipResult = () => {
    const monthlyRate = sipRate / 12 / 100;
    const months = sipYears * 12;
    const totalValue =
      sipMonthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    const investedAmount = sipMonthly * months;
    const estimatedReturns = Math.max(0, totalValue - investedAmount);
    return { investedAmount, estimatedReturns, totalValue };
  };

  // 2. Calculate Lumpsum Values
  const getLumpsumResult = () => {
    const totalValue = lumpAmount * Math.pow(1 + lumpRate / 100, lumpYears);
    const investedAmount = lumpAmount;
    const estimatedReturns = Math.max(0, totalValue - investedAmount);
    return { investedAmount, estimatedReturns, totalValue };
  };

  // 3. Calculate EMI Values
  const getEmiResult = () => {
    const monthlyRate = emiRate / 12 / 100;
    const months = emiYears * 12;
    const emi =
      emiLoan *
      monthlyRate *
      (Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1));
    const totalPayment = emi * months;
    const totalInterest = Math.max(0, totalPayment - emiLoan);
    return { emi, totalInterest, totalPayment };
  };

  // 4. Calculate FD Values (Quarterly Compounding standard in India)
  const getFdResult = () => {
    const rate = fdRate / 100;
    const maturityValue = fdPrincipal * Math.pow(1 + rate / 4, 4 * fdYears);
    const investedAmount = fdPrincipal;
    const interestEarned = Math.max(0, maturityValue - investedAmount);
    return { investedAmount, interestEarned, maturityValue };
  };

  const getStepUpSipResult = () => {
    let totalInvested = 0;
    let currentSip = stepUpAmount;
    let totalValue = 0;
    const monthlyRate = stepUpReturn / 12 / 100;
    for (let y = 1; y <= stepUpYears; y++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentSip;
        totalValue = (totalValue + currentSip) * (1 + monthlyRate);
      }
      currentSip = currentSip * (1 + stepUpRate / 100);
    }
    return { investedAmount: totalInvested, estimatedReturns: Math.max(0, totalValue - totalInvested), totalValue };
  };

  const get8thPay = () => payBasic * 1.92;

  const getGstResult = () => {
    if (gstMode === "add") {
      const tax = gstAmount * (gstRate / 100);
      return { cgst: tax / 2, sgst: tax / 2, total: gstAmount + tax };
    } else {
      const tax = gstAmount - (gstAmount * (100 / (100 + gstRate)));
      return { cgst: tax / 2, sgst: tax / 2, total: gstAmount - tax };
    }
  };

  const getIncomeTax = () => {
    let tax = 0;
    const inc = incTaxAmount;
    if (inc <= 300000) tax = 0;
    else if (inc <= 600000) tax = (inc - 300000) * 0.05;
    else if (inc <= 900000) tax = 15000 + (inc - 600000) * 0.1;
    else if (inc <= 1200000) tax = 45000 + (inc - 900000) * 0.15;
    else if (inc <= 1500000) tax = 90000 + (inc - 1200000) * 0.2;
    else tax = 150000 + (inc - 1500000) * 0.3;
    if (inc <= 700000) tax = 0;
    const cess = tax * 0.04;
    return tax + cess;
  };

  const getTdsResult = () => tdsPrincipal * (tdsRate / 100);
  const getTdsInterest = () => tdsIntAmount * 0.015 * tdsIntMonths;
  
  const getPpfResult = () => {
    let bal = 0;
    const r = 7.1 / 100;
    for (let i = 0; i < ppfYears; i++) {
      bal = (bal + ppfYearly) * (1 + r);
    }
    return { investedAmount: ppfYearly * ppfYears, estimatedReturns: Math.max(0, bal - (ppfYearly * ppfYears)), totalValue: bal };
  };

  const getGstInterest = () => gstIntTax * (18 / 100) * (gstIntDays / 365);
  const getCiResult = () => ciPrincipal * Math.pow(1 + (ciRate / 100) / ciFreq, ciFreq * ciYears);

  // Filter tips
  const categoriesList = ["All", ...Array.from(new Set(tips.map((t) => t.category)))];
  const filteredTips = tips.filter((tip) => {
    const matchesSearch =
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || tip.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      {/* Hero Header */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-12 md:px-10 md:pt-32 text-center">
        <Reveal>
          <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4 border border-primary/20">
            <TrendingUp className="h-3.5 w-3.5" /> Wealth Creation Studio
          </span>
          <h1 className="h-display text-3xl font-extrabold text-foreground sm:text-5xl md:text-6xl tracking-tight leading-none">
            Grow Your Savings,{" "}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Smarter.
            </span>
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed">
            Use our interactive fintech calculators to forecast compounding interest, plan EMI
            repayments, and read professional tax-saving guides.
          </p>
        </Reveal>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 pb-24 md:px-10 flex flex-col gap-12 w-full">
        {/* Row 1: Interactive Calculators */}
        <section className="space-y-6">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card/40 backdrop-blur-md p-6 md:p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative backgrounds */}
              <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />

              {/* Calculator Tab Switcher */}
              <div className="flex flex-wrap gap-2 border-b border-border pb-6 mb-6">
                {[
                  { id: "sip", label: "SIP Calculator", icon: Coins },
                  { id: "step_up_sip", label: "Step Up SIP", icon: TrendingUp },
                  { id: "lumpsum", label: "Lumpsum", icon: Wallet },
                  { id: "emi", label: "HDFC Home Loan EMI", icon: Percent },
                  { id: "fd", label: "Fixed Deposit", icon: Calendar },
                  { id: "ppf", label: "PPF Calculator", icon: TrendingUp },
                  { id: "compound_interest", label: "Compound Interest", icon: TrendingUp },
                  { id: "gst", label: "GST Calculator", icon: Percent },
                  { id: "income_tax", label: "Income Tax", icon: Wallet },
                  { id: "tds", label: "TDS Calculator", icon: Percent },
                  { id: "tds_interest", label: "TDS Interest", icon: Calendar },
                  { id: "gst_interest", label: "GST Interest", icon: Calendar },
                  { id: "8th_pay", label: "8th Pay Commission", icon: Wallet },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id + idx}
                      onClick={() => setActiveTab(item.id as CalcTab)}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                          : "text-muted-foreground bg-muted/30 hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* CALCULATOR VIEWS */}

              {/* Tab 1: SIP */}
              {activeTab === "sip" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Monthly Investment</span>
                        <span className="text-primary font-bold">{formatINR(sipMonthly)}</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="100000"
                        step="500"
                        value={sipMonthly}
                        onChange={(e) => setSipMonthly(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>₹500</span>
                        <span>₹1,00,000</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Expected Return Rate (p.a.)</span>
                        <span className="text-primary font-bold">{sipRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="0.5"
                        value={sipRate}
                        onChange={(e) => setSipRate(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>1%</span>
                        <span>30%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Time Period</span>
                        <span className="text-primary font-bold">{sipYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="40"
                        step="1"
                        value={sipYears}
                        onChange={(e) => setSipYears(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>1 Yr</span>
                        <span>40 Yrs</span>
                      </div>
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Invested Amount
                        </span>
                        <p className="text-lg font-bold text-foreground mt-0.5">
                          {formatINR(getSipResult().investedAmount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Est. Returns
                        </span>
                        <p className="text-lg font-bold text-emerald-500 mt-0.5">
                          +{formatINR(getSipResult().estimatedReturns)}
                        </p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Total Future Value
                        </span>
                        <p className="text-2xl font-black text-foreground mt-0.5">
                          {formatINR(getSipResult().totalValue)}
                        </p>
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="mt-6 space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                        <div
                          className="h-full bg-primary/80"
                          style={{
                            width: `${(getSipResult().investedAmount / getSipResult().totalValue) * 100}%`,
                          }}
                        />
                        <div
                          className="h-full bg-emerald-400"
                          style={{
                            width: `${(getSipResult().estimatedReturns / getSipResult().totalValue) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />{" "}
                          Invested
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />{" "}
                          Returns
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Lumpsum */}
              {activeTab === "lumpsum" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Total Investment</span>
                        <span className="text-primary font-bold">{formatINR(lumpAmount)}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="5000000"
                        step="5000"
                        value={lumpAmount}
                        onChange={(e) => setLumpAmount(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>₹5,000</span>
                        <span>₹50,00,000</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Expected Return Rate (p.a.)</span>
                        <span className="text-primary font-bold">{lumpRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="0.5"
                        value={lumpRate}
                        onChange={(e) => setLumpRate(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>1%</span>
                        <span>30%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Time Period</span>
                        <span className="text-primary font-bold">{lumpYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="40"
                        step="1"
                        value={lumpYears}
                        onChange={(e) => setLumpYears(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>1 Yr</span>
                        <span>40 Yrs</span>
                      </div>
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Invested Amount
                        </span>
                        <p className="text-lg font-bold text-foreground mt-0.5">
                          {formatINR(getLumpsumResult().investedAmount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Est. Returns
                        </span>
                        <p className="text-lg font-bold text-emerald-500 mt-0.5">
                          +{formatINR(getLumpsumResult().estimatedReturns)}
                        </p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Total Future Value
                        </span>
                        <p className="text-2xl font-black text-foreground mt-0.5">
                          {formatINR(getLumpsumResult().totalValue)}
                        </p>
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="mt-6 space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                        <div
                          className="h-full bg-primary/80"
                          style={{
                            width: `${(getLumpsumResult().investedAmount / getLumpsumResult().totalValue) * 100}%`,
                          }}
                        />
                        <div
                          className="h-full bg-emerald-400"
                          style={{
                            width: `${(getLumpsumResult().estimatedReturns / getLumpsumResult().totalValue) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />{" "}
                          Invested
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />{" "}
                          Returns
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: EMI */}
              {activeTab === "emi" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Loan Amount</span>
                        <span className="text-primary font-bold">{formatINR(emiLoan)}</span>
                      </div>
                      <input
                        type="range"
                        min="100000"
                        max="10000000"
                        step="50000"
                        value={emiLoan}
                        onChange={(e) => setEmiLoan(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>₹1 Lakh</span>
                        <span>₹1 Crore</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Interest Rate (p.a.)</span>
                        <span className="text-primary font-bold">{emiRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.1"
                        value={emiRate}
                        onChange={(e) => setEmiRate(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>1%</span>
                        <span>20%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Tenure</span>
                        <span className="text-primary font-bold">{emiYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="30"
                        step="1"
                        value={emiYears}
                        onChange={(e) => setEmiYears(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>1 Yr</span>
                        <span>30 Yrs</span>
                      </div>
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Monthly EMI
                        </span>
                        <p className="text-2xl font-black text-primary mt-0.5">
                          {formatINR(getEmiResult().emi)}
                        </p>
                      </div>
                      <div className="border-t border-border pt-4 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                            Principal Amount
                          </span>
                          <p className="text-sm font-bold text-foreground mt-0.5">
                            {formatINR(emiLoan)}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                            Total Interest Payable
                          </span>
                          <p className="text-sm font-bold text-purple-500 mt-0.5">
                            {formatINR(getEmiResult().totalInterest)}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                            Total Payment (P + I)
                          </span>
                          <p className="text-base font-bold text-foreground mt-0.5">
                            {formatINR(getEmiResult().totalPayment)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="mt-6 space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                        <div
                          className="h-full bg-primary/80"
                          style={{ width: `${(emiLoan / getEmiResult().totalPayment) * 100}%` }}
                        />
                        <div
                          className="h-full bg-purple-400"
                          style={{
                            width: `${(getEmiResult().totalInterest / getEmiResult().totalPayment) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />{" "}
                          Principal
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-purple-400 inline-block" />{" "}
                          Interest
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Fixed Deposit */}
              {activeTab === "fd" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Principal Amount</span>
                        <span className="text-primary font-bold">{formatINR(fdPrincipal)}</span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="10000000"
                        step="10000"
                        value={fdPrincipal}
                        onChange={(e) => setFdPrincipal(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>₹10,000</span>
                        <span>₹1 Crore</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Rate of Interest (p.a.)</span>
                        <span className="text-primary font-bold">{fdRate}%</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="15"
                        step="0.1"
                        value={fdRate}
                        onChange={(e) => setFdRate(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>2%</span>
                        <span>15%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-semibold text-foreground">
                        <span>Tenure</span>
                        <span className="text-primary font-bold">{fdYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="1"
                        value={fdYears}
                        onChange={(e) => setFdYears(Number(e.target.value))}
                        className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>1 Yr</span>
                        <span>10 Yrs</span>
                      </div>
                    </div>
                  </div>

                  {/* Outputs */}
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Invested Amount
                        </span>
                        <p className="text-lg font-bold text-foreground mt-0.5">
                          {formatINR(getFdResult().investedAmount)}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Interest Earned
                        </span>
                        <p className="text-lg font-bold text-emerald-500 mt-0.5">
                          +{formatINR(getFdResult().interestEarned)}
                        </p>
                      </div>
                      <div className="border-t border-border pt-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block">
                          Maturity Value
                        </span>
                        <p className="text-2xl font-black text-foreground mt-0.5">
                          {formatINR(getFdResult().maturityValue)}
                        </p>
                      </div>
                    </div>

                    {/* Progress representation */}
                    <div className="mt-6 space-y-1.5">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden flex">
                        <div
                          className="h-full bg-primary/80"
                          style={{ width: `${(fdPrincipal / getFdResult().maturityValue) * 100}%` }}
                        />
                        <div
                          className="h-full bg-emerald-400"
                          style={{
                            width: `${(getFdResult().interestEarned / getFdResult().maturityValue) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] font-medium text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />{" "}
                          Invested
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block" />{" "}
                          Interest
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Step Up SIP */}
              {activeTab === "step_up_sip" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Initial SIP</span><span className="text-primary">{formatINR(stepUpAmount)}</span></div><input type="range" min="1000" max="100000" step="1000" value={stepUpAmount} onChange={(e) => setStepUpAmount(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Annual Step-up (%)</span><span className="text-primary">{stepUpRate}%</span></div><input type="range" min="1" max="30" step="1" value={stepUpRate} onChange={(e) => setStepUpRate(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Expected Return (p.a.)</span><span className="text-primary">{stepUpReturn}%</span></div><input type="range" min="1" max="30" step="1" value={stepUpReturn} onChange={(e) => setStepUpReturn(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Time Period</span><span className="text-primary">{stepUpYears} Yrs</span></div><input type="range" min="1" max="40" step="1" value={stepUpYears} onChange={(e) => setStepUpYears(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Invested</span><p className="text-lg font-bold">{formatINR(getStepUpSipResult().investedAmount)}</p></div>
                      <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Est. Returns</span><p className="text-lg font-bold text-emerald-500">+{formatINR(getStepUpSipResult().estimatedReturns)}</p></div>
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Future Value</span><p className="text-2xl font-black">{formatINR(getStepUpSipResult().totalValue)}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: PPF */}
              {activeTab === "ppf" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Yearly Investment</span><span className="text-primary">{formatINR(ppfYearly)}</span></div><input type="range" min="500" max="150000" step="500" value={ppfYearly} onChange={(e) => setPpfYearly(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Time Period</span><span className="text-primary">{ppfYears} Yrs</span></div><input type="range" min="15" max="50" step="5" value={ppfYears} onChange={(e) => setPpfYears(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <p className="text-xs text-muted-foreground">PPF interest rate is fixed at 7.1% p.a. by the government.</p>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Invested</span><p className="text-lg font-bold">{formatINR(getPpfResult().investedAmount)}</p></div>
                      <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Est. Returns</span><p className="text-lg font-bold text-emerald-500">+{formatINR(getPpfResult().estimatedReturns)}</p></div>
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Maturity Value</span><p className="text-2xl font-black">{formatINR(getPpfResult().totalValue)}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: GST */}
              {activeTab === "gst" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Amount</span><span className="text-primary">{formatINR(gstAmount)}</span></div><input type="range" min="1000" max="1000000" step="1000" value={gstAmount} onChange={(e) => setGstAmount(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>GST Rate (%)</span><span className="text-primary">{gstRate}%</span></div><input type="range" min="5" max="28" step="1" value={gstRate} onChange={(e) => setGstRate(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-sm"><input type="radio" checked={gstMode === "add"} onChange={() => setGstMode("add")} /> Add GST (Exclusive)</label>
                      <label className="flex items-center gap-2 text-sm"><input type="radio" checked={gstMode === "remove"} onChange={() => setGstMode("remove")} /> Remove GST (Inclusive)</label>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">CGST ({(gstRate/2).toFixed(1)}%)</span><p className="text-lg font-bold">{formatINR(getGstResult().cgst)}</p></div>
                      <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">SGST ({(gstRate/2).toFixed(1)}%)</span><p className="text-lg font-bold">{formatINR(getGstResult().sgst)}</p></div>
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">{gstMode === "add" ? "Total Price" : "Base Price"}</span><p className="text-2xl font-black">{formatINR(getGstResult().total)}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Income Tax */}
              {activeTab === "income_tax" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Annual Income</span><span className="text-primary">{formatINR(incTaxAmount)}</span></div><input type="range" min="100000" max="5000000" step="50000" value={incTaxAmount} onChange={(e) => setIncTaxAmount(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <p className="text-xs text-muted-foreground">Calculated based on the simplified New Tax Regime (default). Assumes standard deductions and 87A rebate for income up to ₹7L.</p>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Estimated Tax Payable (incl. cess)</span><p className="text-2xl font-black text-rose-500">{formatINR(getIncomeTax())}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: TDS */}
              {activeTab === "tds" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Invoice/Payment Amount</span><span className="text-primary">{formatINR(tdsPrincipal)}</span></div><input type="range" min="1000" max="1000000" step="1000" value={tdsPrincipal} onChange={(e) => setTdsPrincipal(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>TDS Rate (%)</span><span className="text-primary">{tdsRate}%</span></div><input type="range" min="1" max="30" step="1" value={tdsRate} onChange={(e) => setTdsRate(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">TDS Deducted</span><p className="text-lg font-bold text-rose-500">-{formatINR(getTdsResult())}</p></div>
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Net Amount Receivable</span><p className="text-2xl font-black text-emerald-500">{formatINR(tdsPrincipal - getTdsResult())}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: TDS Interest */}
              {activeTab === "tds_interest" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>TDS Default Amount</span><span className="text-primary">{formatINR(tdsIntAmount)}</span></div><input type="range" min="1000" max="500000" step="1000" value={tdsIntAmount} onChange={(e) => setTdsIntAmount(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Delay (Months or part thereof)</span><span className="text-primary">{tdsIntMonths} Months</span></div><input type="range" min="1" max="24" step="1" value={tdsIntMonths} onChange={(e) => setTdsIntMonths(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Late Payment Interest (1.5% p.m.)</span><p className="text-2xl font-black text-rose-500">{formatINR(getTdsInterest())}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: GST Interest */}
              {activeTab === "gst_interest" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Tax Default Amount</span><span className="text-primary">{formatINR(gstIntTax)}</span></div><input type="range" min="1000" max="500000" step="1000" value={gstIntTax} onChange={(e) => setGstIntTax(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Delay (Days)</span><span className="text-primary">{gstIntDays} Days</span></div><input type="range" min="1" max="365" step="1" value={gstIntDays} onChange={(e) => setGstIntDays(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Late Payment Interest (18% p.a.)</span><p className="text-2xl font-black text-rose-500">{formatINR(getGstInterest())}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Compound Interest */}
              {activeTab === "compound_interest" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Principal</span><span className="text-primary">{formatINR(ciPrincipal)}</span></div><input type="range" min="10000" max="10000000" step="10000" value={ciPrincipal} onChange={(e) => setCiPrincipal(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Interest Rate (%)</span><span className="text-primary">{ciRate}%</span></div><input type="range" min="1" max="20" step="0.5" value={ciRate} onChange={(e) => setCiRate(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Years</span><span className="text-primary">{ciYears}</span></div><input type="range" min="1" max="50" step="1" value={ciYears} onChange={(e) => setCiYears(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Compounding Frequency</span><span className="text-primary">{ciFreq === 1 ? 'Yearly' : ciFreq === 12 ? 'Monthly' : 'Quarterly'}</span></div>
                      <select value={ciFreq} onChange={e => setCiFreq(Number(e.target.value))} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                        <option value={1}>Yearly</option>
                        <option value={2}>Half-Yearly</option>
                        <option value={4}>Quarterly</option>
                        <option value={12}>Monthly</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div><span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Interest</span><p className="text-lg font-bold text-emerald-500">+{formatINR(getCiResult() - ciPrincipal)}</p></div>
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Total Future Value</span><p className="text-2xl font-black">{formatINR(getCiResult())}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: 8th Pay */}
              {activeTab === "8th_pay" && (
                <div className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-6">
                    <div className="space-y-2"><div className="flex justify-between text-sm font-semibold"><span>Current Basic Pay (7th CPC)</span><span className="text-primary">{formatINR(payBasic)}</span></div><input type="range" min="18000" max="250000" step="1000" value={payBasic} onChange={(e) => setPayBasic(Number(e.target.value))} className="w-full h-1.5 rounded-lg bg-muted appearance-none cursor-pointer accent-primary" /></div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/20 border border-border/80 rounded-2xl p-5 md:p-6">
                    <div className="space-y-4">
                      <div className="border-t border-border pt-4"><span className="text-[10px] font-bold text-muted-foreground uppercase block">Est. 8th CPC Basic Pay (Factor 1.92)</span><p className="text-2xl font-black text-emerald-500">{formatINR(get8thPay())}</p></div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </Reveal>

          {/* Quick FAQ / Guide Info */}
          <Reveal>
            <div className="rounded-2xl border border-border bg-muted/20 p-5 text-sm flex gap-3 text-muted-foreground">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">About our calculations</h4>
                <p className="text-xs leading-relaxed">
                  These calculators are for educational purposes. Actual returns depend on market
                  factors, specific mutual fund expense ratios, tax liabilities, or loan
                  amortization policies. Always consult with a certified CA or financial advisor
                  before making investments.
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Row 2: Investment Tips */}
        <section className="space-y-6">
          <Reveal>
            <div className="rounded-3xl border border-border bg-card/60 backdrop-blur-md p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Curated Finance Guides
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expert articles and strategies on investing, tax planning, and saving.
                  </p>
                </div>

                {/* Search and Filters side-by-side */}
                <div className="flex flex-col sm:flex-row gap-3 min-w-0 md:w-auto items-stretch sm:items-center">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search finance tips..."
                      className="w-full rounded-xl border border-border bg-background/50 pl-9 pr-4 py-2.5 text-xs outline-none focus:border-primary transition-all"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 items-center">
                    {categoriesList.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-primary/10 text-primary border border-primary/25"
                            : "text-muted-foreground bg-muted/20 hover:bg-muted/50 border border-transparent"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tips grid layout */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredTips.map((tip) => (
                  <button
                    key={tip.id}
                    onClick={() => setSelectedTip(tip)}
                    className="w-full text-left rounded-2xl border border-border/80 bg-background/40 p-5 transition-all hover:border-primary/20 hover:bg-background/80 group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase border border-primary/25">
                        {tip.category}
                      </span>
                      <h4 className="font-semibold text-xs text-foreground mt-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {tip.title}
                      </h4>
                      <p
                        className="text-[11px] text-muted-foreground mt-2 line-clamp-3 leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: tip.content.replace(/<[^>]*>/g, "").slice(0, 100) + "...",
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-primary inline-flex items-center gap-1 mt-4">
                      Read Guide{" "}
                      <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </button>
                ))}

                {filteredTips.length === 0 && (
                  <div className="sm:col-span-2 lg:col-span-3 text-center py-12">
                    <p className="text-xs text-muted-foreground">
                      No articles found matching your query.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </section>
      </div>

      {/* Article Detail Modal */}
      {selectedTip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 md:p-8 shadow-2xl relative animate-scale-up max-h-[85vh] flex flex-col">
            <button
              onClick={() => setSelectedTip(null)}
              className="absolute top-4 right-4 rounded-full bg-muted/65 p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="pb-4 border-b border-border shrink-0">
              <span className="text-[10px] font-bold bg-primary/15 text-primary px-2.5 py-0.5 rounded-full uppercase border border-primary/20">
                {selectedTip.category}
              </span>
              <h3 className="text-xl font-bold text-foreground mt-3 tracking-tight leading-snug">
                {selectedTip.title}
              </h3>
            </div>

            <div className="overflow-y-auto py-6 flex-1 text-sm leading-relaxed prose prose-sm dark:prose-invert max-w-none text-foreground/85 space-y-4">
              <div dangerouslySetInnerHTML={{ __html: selectedTip.content }} />
            </div>

            <div className="pt-4 border-t border-border shrink-0 flex justify-between items-center">
              <span className="text-[10px] text-muted-foreground font-medium">
                Published{" "}
                {new Date(selectedTip.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <button
                onClick={() => setSelectedTip(null)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action Banner */}
      {/* <section className="mx-auto max-w-4xl px-6 pb-24 md:px-10 w-full mt-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card/50 to-surface px-8 py-14 text-foreground md:px-14 shadow-2xl backdrop-blur-sm">
            <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/15 blur-[60px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-purple-500/15 blur-[60px] pointer-events-none" />

            <p className="eyebrow text-primary font-medium tracking-wider font-semibold">Consult an Expert</p>
            <h2 className="h-display mt-4 text-3xl font-extrabold text-foreground md:text-4xl tracking-tight leading-tight">
              Need personalized tax planning or compliance advice?
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground leading-relaxed text-sm">
              Our network of senior CAs, CSs, and startup lawyers can audit your financial setup, structure tax-saving strategies, and manage compliance.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/15 transition-transform duration-300 hover:scale-[1.02]"
              >
                Book a Consultation
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center rounded-full border border-border bg-background/50 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:bg-muted/80"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </Reveal>
      </section> */}

      <Footer />
    </div>
  );
}

// Micro-components for close button
function X({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
