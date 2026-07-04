import Link from 'next/link';
import {
  BookOpen,
  ArrowRight,
  Upload,
  MessageSquareText,
  Quote,
  Library,
  NotebookPen,
  Landmark,
} from 'lucide-react';

const RIZAL_PORTRAIT =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Rizal_full.jpg?width=300';
const KATIPUNAN_FLAG =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Katipunan.svg?width=300';
const VELARDE_MAP =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Carta%20Hydrographica%20y%20Chorographica%20de%20la%20Yslas%20Filipinas%20MANILA%2C%201734.jpg?width=700';
const NOLI_COVER =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Noli_Me_Tangere.jpg?width=300';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#201F1C] font-sans antialiased selection:bg-[#F1E2B8]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Fraunces', serif; font-optical-sizing: auto; }
        .font-mono { font-family: 'IBM Plex Mono', monospace; }
        body { font-family: 'Inter', sans-serif; }

        @keyframes slowPan {
          0%   { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.08) translate(-1.5%, -1%); }
        }
        .archive-pan {
          animation: slowPan 18s ease-in-out infinite alternate;
        }
        @media (prefers-reduced-motion: reduce) {
          .archive-pan { animation: none; }
        }
      `}</style>

      {/* Navigation */}
      <header className="border-b border-[#E6E2D8]">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#8C2F2F] flex items-center justify-center">
              <Landmark className="w-4 h-4 text-[#FAF8F4]" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Kasaysayan</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#how-it-works" className="hidden sm:block text-sm text-[#6B6862] hover:text-[#201F1C] transition-colors">
              How it works
            </Link>
            <Link href="/workspace" className="text-sm text-[#6B6862] hover:text-[#201F1C] transition-colors">
              Sign in
            </Link>
            <Link
              href="/workspace"
              className="text-sm font-medium px-4 py-2 rounded-md border border-[#201F1C] hover:bg-[#201F1C] hover:text-[#FAF8F4] transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-14 items-center pt-20 pb-20">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono uppercase tracking-[0.12em] text-[#8C2F2F] bg-[#F6EAE6] px-3 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              Grounded in Philippine sources
            </div>

            <h1 className="font-display text-[2.75rem] md:text-[3.4rem] leading-[1.08] font-medium tracking-tight mb-6">
              Ask Philippine
              <br />
              history anything.
            </h1>

            <p className="text-lg text-[#6B6862] leading-relaxed mb-9 max-w-md">
              Upload Rizal&apos;s writings, Katipunan records, colonial-era maps,
              or your own research notes. Kasaysayan answers strictly from what
              you give it — every claim traced to a page.
            </p>

            <div className="flex items-center gap-5">
              <Link
                href="/workspace"
                className="group flex items-center gap-2 bg-[#201F1C] hover:bg-black text-[#FAF8F4] px-6 py-3.5 rounded-md text-sm font-medium transition-all"
              >
                Try Kasaysayan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-[#201F1C] border-b border-[#201F1C]/30 hover:border-[#201F1C] pb-0.5 transition-colors"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Signature element: annotated archive card, built from real primary sources */}
          <div className="relative h-[440px] hidden md:block">
            {/* back card: 1734 Murillo Velarde map, slow pan for a living-archive feel */}
            <div className="absolute top-4 left-12 w-[300px] h-[220px] rotate-[4deg] bg-white border border-[#E6E2D8] rounded-xl shadow-sm overflow-hidden">
              <img
                src={VELARDE_MAP}
                alt="1734 Murillo Velarde map of the Philippines"
                className="archive-pan w-full h-full object-cover"
              />
            </div>

            {/* front card: excerpt card referencing Noli Me Tangere */}
            <div className="absolute top-0 left-0 w-[340px] bg-white border border-[#E6E2D8] rounded-xl shadow-md p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#EFEDE6]">
                <img
                  src={RIZAL_PORTRAIT}
                  alt="José Rizal"
                  className="w-6 h-6 rounded-full object-cover border border-[#E6E2D8]"
                />
                <span className="font-mono text-[11px] text-[#9C988E]">noli_me_tangere_1887.pdf</span>
              </div>
              <p className="font-display text-[15px] leading-relaxed text-[#2A2926]">
                Chapter 1 opens on a homecoming: a young reformist returns to
                {' '}
                <span className="bg-[#F6EAE6] rounded px-1 py-0.5">
                  a town still ruled by friars and old fears
                  <sup className="text-[#8C2F2F] font-mono text-[10px] ml-0.5">1</sup>
                </span>
                .
              </p>
              <div className="mt-4 pt-3 border-t border-[#EFEDE6] flex items-start gap-2">
                <Quote className="w-3 h-3 text-[#8C2F2F] mt-0.5 shrink-0" />
                <span className="font-mono text-[11px] text-[#6B6862]">
                  [1] Noli Me Tangere, Ch. 1 — Rizal, 1887
                </span>
              </div>
            </div>

            {/* floating question chip */}
            <div className="absolute -bottom-2 right-0 w-[270px] bg-[#201F1C] text-[#FAF8F4] rounded-xl shadow-md p-4 flex items-start gap-2.5">
              <MessageSquareText className="w-4 h-4 mt-0.5 shrink-0 text-[#E8C77A]" />
              <p className="text-[13px] leading-snug">
                How does Rizal portray colonial society in Chapter 1?
              </p>
            </div>
          </div>
        </section>

        {/* Source types strip, illustrated with real archival images */}
        <section className="py-14 border-t border-[#E6E2D8]">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9C988E] mb-6">
            Reads across the archive
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { img: RIZAL_PORTRAIT, label: 'Personal writings', sub: 'Letters, diaries, essays' },
              { img: KATIPUNAN_FLAG, label: 'Revolutionary records', sub: 'Katipunan documents' },
              { img: VELARDE_MAP, label: 'Colonial-era maps', sub: 'Charts and surveys' },
              { img: NOLI_COVER, label: 'Published literature', sub: 'Novels and periodicals' },
            ].map(({ img, label, sub }) => (
              <div key={label} className="bg-white border border-[#E6E2D8] rounded-xl overflow-hidden">
                <div className="h-28 bg-[#F1EFE9] flex items-center justify-center overflow-hidden">
                  <img src={img} alt={label} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-[#9C988E]">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 border-t border-[#E6E2D8]">
          <div className="mb-14 max-w-xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9C988E]">
              How it works
            </span>
            <h2 className="font-display text-3xl font-medium tracking-tight mt-3">
              Three steps from archive to answer.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload your sources',
                body: 'Add scanned letters, Katipunan documents, maps, or printed literature — Kasaysayan indexes them in place.',
              },
              {
                step: '02',
                icon: MessageSquareText,
                title: 'Ask a question',
                body: 'Ask in Filipino or English. It searches only within your uploaded material — nothing else.',
              },
              {
                step: '03',
                icon: Quote,
                title: 'Get a cited answer',
                body: 'Every response links back to the exact document and page it came from, so you can verify it yourself.',
              },
            ].map(({ step, icon: Icon, title, body }) => (
              <div
                key={step}
                className="bg-white border border-[#E6E2D8] rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-9 h-9 rounded-lg bg-[#F6EAE6] flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#8C2F2F]" />
                  </div>
                  <span className="font-mono text-xs text-[#D8D4C8]">{step}</span>
                </div>
                <h3 className="font-medium text-[15px] mb-2">{title}</h3>
                <p className="text-sm text-[#6B6862] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature grid */}
        <section className="py-20 border-t border-[#E6E2D8]">
          <div className="mb-14 max-w-xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#9C988E]">
              Why it&apos;s different
            </span>
            <h2 className="font-display text-3xl font-medium tracking-tight mt-3">
              Built for people who need to trust the answer.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Library,
                title: 'Strictly source-bound',
                body: 'Answers are drawn only from what you upload — no outside knowledge blended in unnoticed.',
              },
              {
                icon: Quote,
                title: 'Inline citations',
                body: 'Every claim carries a reference back to its document and page, so nothing is taken on faith.',
              },
              {
                icon: NotebookPen,
                title: 'Bilingual by design',
                body: 'Ask and read in Filipino or English, and compare passages across sources in either language.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="p-6">
                <Icon className="w-5 h-5 text-[#201F1C] mb-4" strokeWidth={1.5} />
                <h3 className="font-medium text-[15px] mb-2">{title}</h3>
                <p className="text-sm text-[#6B6862] leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 border-t border-[#E6E2D8] flex flex-col items-center text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-5 max-w-lg">
            Bring your sources. Get answers you can check.
          </h2>
          <Link
            href="/workspace"
            className="group flex items-center gap-2 bg-[#201F1C] hover:bg-black text-[#FAF8F4] px-6 py-3.5 rounded-md text-sm font-medium transition-all"
          >
            Try Kasaysayan
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-[#E6E2D8]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-xs text-[#9C988E] font-mono">© {new Date().getFullYear()} Kasaysayan</span>
          <div className="flex gap-6 text-xs text-[#6B6862]">
            <Link href="#" className="hover:text-[#201F1C] transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-[#201F1C] transition-colors">Terms</Link>
            <Link href="#" className="hover:text-[#201F1C] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}