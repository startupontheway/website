const fs = require('fs');
let content = fs.readFileSync('src/routes/admin.tsx', 'utf8');

// 1. Add HelpCircle to lucide-react imports
if (!content.includes('HelpCircle')) {
  content = content.replace(/Sparkles,/, 'Sparkles,\n  HelpCircle,');
}

// 2. Add FaqItem interface
const faqInterface = `
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order_index: number;
  created_at: string;
}
`;
if (!content.includes('export interface FaqItem')) {
  content = content.replace(/export interface Lead \{/, faqInterface + '\nexport interface Lead {');
}

// 3. Add 'faqs' to Tab type
if (!content.includes('| "faqs"')) {
  content = content.replace(/type Tab = "overview" \| "leads" \| "blogs" \| "services" \| "estimator" \| "tips";/, 'type Tab = "overview" | "leads" | "blogs" | "services" | "estimator" | "tips" | "faqs";');
}

// 4. Add Faq states right after InvestmentTip states
const faqStates = `
  // FAQ States
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [newFaqQuestion, setNewFaqQuestion] = useState("");
  const [newFaqAnswer, setNewFaqAnswer] = useState("");
  const [newFaqOrder, setNewFaqOrder] = useState<number>(0);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
`;
if (!content.includes('const [faqs, setFaqs] = useState<FaqItem[]>')) {
  content = content.replace(/const \[editingTip, setEditingTip\] = useState\<InvestmentTip \| null\>\(null\);/, 'const [editingTip, setEditingTip] = useState<InvestmentTip | null>(null);\n' + faqStates);
}

// 5. Add Realtime listener for faqs
const faqRealtime = `
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "faqs" },
        (payload) => {
          console.log("Realtime faqs update received:", payload);
          fetchDashboardData(true);
        },
      )
`;
if (!content.includes('table: "faqs"')) {
  content = content.replace(/\.on\([\s\S]*?table: "investment_tips"[\s\S]*?fetchDashboardData\(true\);\s*\/\/\s*Silent update in background!\s*\}\s*,\s*\)/, match => match + faqRealtime);
}

// 6. Fetch FAQs
const fetchFaqs = `
      // 8. Fetch FAQs
      try {
        const { data: faqData, error: faqErr } = await supabase
          .from("faqs")
          .select("*")
          .order("order_index", { ascending: true });
        if (!faqErr && faqData) {
          setFaqs(faqData as unknown as FaqItem[]);
        }
      } catch (e) {
        console.warn("FAQs table not loaded yet.", e);
      }
`;
if (!content.includes('// 8. Fetch FAQs')) {
  content = content.replace(/\} catch \(err\) \{[\s\S]*?console\.error\(err\);/, match => fetchFaqs + '\n    ' + match);
}

// 7. Add FAQ Handlers
const faqHandlers = `
  // FAQ Operations
  const handleCreateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    try {
      const { error } = await supabase.from("faqs").insert({
        question: newFaqQuestion,
        answer: newFaqAnswer,
        order_index: newFaqOrder,
      });
      if (error) throw error;
      toast.success("FAQ added successfully!");
      setNewFaqQuestion("");
      setNewFaqAnswer("");
      setNewFaqOrder(0);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleUpdateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    try {
      const { error } = await supabase.from("faqs").update({
        question: newFaqQuestion,
        answer: newFaqAnswer,
        order_index: newFaqOrder,
      }).eq("id", editingFaq.id);
      if (error) throw error;
      toast.success("FAQ updated!");
      setEditingFaq(null);
      setNewFaqQuestion("");
      setNewFaqAnswer("");
      setNewFaqOrder(0);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const { error } = await supabase.from("faqs").delete().eq("id", id);
      if (error) throw error;
      toast.success("FAQ deleted.");
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  const startEditFaq = (f: FaqItem) => {
    setEditingFaq(f);
    setNewFaqQuestion(f.question);
    setNewFaqAnswer(f.answer);
    setNewFaqOrder(f.order_index);
  };
`;
if (!content.includes('const handleCreateFaq')) {
  content = content.replace(/\/\/ Leads Operations/, faqHandlers + '\n  // Leads Operations');
}

// 8. Add FAQ sidebar link
const faqSidebarLink = `\n              { id: "faqs", label: "FAQ Editor", icon: HelpCircle, badge: faqs.length },`;
if (!content.includes('label: "FAQ Editor"')) {
  content = content.replace(/\{ id: "tips", label: "Wealth Tips", icon: Coins, badge: investmentTips\.length \},/, match => match + faqSidebarLink);
}

// 9. Add FAQ Tab View
const faqTabView = `
        {/* ----------------------------------------------------
            TAB VIEW: FAQS
            ---------------------------------------------------- */}
        {activeTab === "faqs" && (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            {/* Create/Edit FAQ Form */}
            <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card space-y-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                </h3>
              </div>
              <form onSubmit={editingFaq ? handleUpdateFaq : handleCreateFaq} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Question *</label>
                  <input required value={newFaqQuestion} onChange={(e) => setNewFaqQuestion(e.target.value)} className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Answer *</label>
                  <textarea required value={newFaqAnswer} onChange={(e) => setNewFaqAnswer(e.target.value)} className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all min-h-[120px]" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Order Index</label>
                  <input type="number" required value={newFaqOrder} onChange={(e) => setNewFaqOrder(Number(e.target.value))} className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm outline-none focus:border-primary transition-all" />
                </div>
                <div className="pt-3 flex gap-3">
                  {editingFaq && (
                    <button type="button" onClick={() => { setEditingFaq(null); setNewFaqQuestion(""); setNewFaqAnswer(""); setNewFaqOrder(0); }} className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                  )}
                  <button type="submit" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105">
                    {editingFaq ? "Update FAQ" : "Save FAQ"}
                  </button>
                </div>
              </form>
            </div>
            
            {/* FAQ List */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/40 backdrop-blur-sm p-6 shadow-card">
                <h3 className="text-base font-semibold text-foreground">Published FAQs ({faqs.length})</h3>
                <div className="space-y-3 mt-6 max-h-[600px] overflow-y-auto pr-1">
                  {faqs.map(faq => (
                    <div key={faq.id} className="rounded-xl border border-border bg-card/60 p-4 hover:border-primary/30 transition-all">
                      <h4 className="font-semibold text-sm">{faq.question}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                        <span className="text-[10px] font-medium text-muted-foreground">Order: {faq.order_index}</span>
                        <div className="flex gap-1">
                          <button onClick={() => startEditFaq(faq)} className="p-1.5 text-primary hover:bg-primary/10 rounded"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDeleteFaq(faq.id)} className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
`;
if (!content.includes('TAB VIEW: FAQS')) {
  content = content.replace(/<\/main>/, faqTabView + '\n      </main>');
}

fs.writeFileSync('src/routes/admin.tsx', content, 'utf8');
console.log('Processed admin.tsx for FAQs');
