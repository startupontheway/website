const fs = require('fs');
let content = fs.readFileSync('src/routes/index.tsx', 'utf8');

if (!content.includes('function FAQSection()')) {
  // 1. Import Plus from lucide-react if not present
  if (!content.includes('Plus')) {
    content = content.replace(/import \{([\s\S]*?)\} from "lucide-react";/, (match, p1) => {
      return `import {${p1}, Plus } from "lucide-react";`;
    });
  }

  // 2. Add FAQSection function
  const faqSectionCode = `
interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order_index: number;
}

function FAQSection() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const { data, error } = await supabase
          .from("faqs" as any)
          .select("*")
          .order("order_index", { ascending: true });
        if (!error && data) {
          setFaqs(data as FaqItem[]);
        }
      } catch (e) {
        console.warn("Could not load FAQs", e);
      }
    }
    loadFaqs();
  }, []);

  if (faqs.length === 0) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-20 md:px-10 md:py-32">
      <Reveal>
        <p className="eyebrow text-center text-primary/80 font-medium tracking-wider">
          Got Questions?
        </p>
        <h2 className="h-display mx-auto mt-2 sm:mt-3 max-w-2xl text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
          Frequently Asked Questions
        </h2>
      </Reveal>
      
      <div className="mx-auto mt-10 sm:mt-14 max-w-3xl space-y-4">
        {faqs.map((faq, i) => {
          const isOpen = openId === faq.id;
          return (
            <Reveal key={faq.id} delay={i * 0.05}>
              <div 
                className="rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-primary/20"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="font-semibold text-sm sm:text-base text-foreground pr-8">{faq.question}</span>
                  <div className={\`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 \${isOpen ? 'rotate-45 bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}\`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
                <div 
                  className={\`overflow-hidden transition-all duration-300 ease-in-out \${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}\`}
                >
                  <div className="p-5 sm:p-6 pt-0 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

`;
  
  content = content.replace(/function CTA\(\) \{/, faqSectionCode + 'function CTA() {');
  
  // 3. Render <FAQSection /> below <Testimonials />
  content = content.replace(/<Testimonials \/>/, '<Testimonials />\n      <FAQSection />');
  
  fs.writeFileSync('src/routes/index.tsx', content, 'utf8');
  console.log('Processed index.tsx for FAQs');
} else {
  console.log('FAQSection already exists');
}
