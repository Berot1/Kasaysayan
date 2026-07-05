import Link from 'next/link';
import Image from 'next/image';
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
import { InteractiveFolderGallery } from '@/app/components/ui/InteractiveFolderGallery';

const RIZAL_PORTRAIT = 'https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Rizal_full.jpg?width=300';
const KATIPUNAN_FLAG = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Katipunan.svg?width=300';
const VELARDE_MAP = 'https://commons.wikimedia.org/wiki/Special:FilePath/Carta%20Hydrographica%20y%20Chorographica%20de%20la%20Yslas%20Filipinas%20MANILA%2C%201734.jpg?width=700';
const BONIFACIO_PORTRAIT = 'https://commons.wikimedia.org/wiki/Special:FilePath/Andres_Bonifacio.jpg?width=800';
const NOLI_COVER = 'https://commons.wikimedia.org/wiki/Special:FilePath/Noli_Me_Tangere.jpg?width=300';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-charcoal font-sans antialiased selection:bg-muted">
      
      {/* Navigation */}
      <header className="border-b border-border-subtle">
        <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-oxblood flex items-center justify-center">
              <Landmark className="w-4 h-4 text-background" />
            </div>
            <span className="font-semibold text-[15px] tracking-tight">Kasaysayan</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#how-it-works" className="hidden sm:block text-sm text-stone hover:text-charcoal transition-colors">
              How it works
            </Link>
            <Link href="/workspace" className="text-sm text-stone hover:text-charcoal transition-colors">
              Sign in
            </Link>
            <Link
              href="/workspace"
              className="text-sm font-medium px-4 py-2 rounded-md border border-charcoal hover:bg-charcoal hover:text-background transition-colors focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center pt-16 pb-24">
          <div>
            <div className="inline-flex items-center gap-2 mb-6 text-[11px] font-mono uppercase tracking-[0.12em] text-oxblood bg-oxblood-muted px-3 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              Grounded in Philippine sources
            </div>
            <h1 className="font-display text-[2.75rem] md:text-[3.4rem] leading-[1.08] font-medium tracking-tight mb-6">
              Ask Philippine
              <br />
              history anything.
            </h1>
            <p className="text-lg text-stone leading-relaxed mb-9 max-w-md">
              Upload Rizal&apos;s writings, Katipunan records, colonial-era maps,
              or your own research notes. Kasaysayan answers strictly from what
              you give it — every claim traced to a page.
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 bg-charcoal hover:bg-black text-background px-6 py-3.5 rounded-md text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
              >
                Try Kasaysayan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-charcoal border-b border-charcoal/30 hover:border-charcoal pb-0.5 transition-colors focus-visible:outline-none"
              >
                See how it works
              </Link>
            </div>
          </div>

          <div className="relative hidden md:flex items-center justify-end -mt-12">
            <div className="relative z-10 w-full flex justify-end">
              <InteractiveFolderGallery
                folderName="Philippine.archive"
                dragHintText="Drag any document down to close"
                photos={[
                  { id: 1, image: RIZAL_PORTRAIT },
                  { id: 2, image: KATIPUNAN_FLAG },
                  { id: 3, image: VELARDE_MAP },
                  { id: 4, image: NOLI_COVER },
                  { id: 5, image: BONIFACIO_PORTRAIT },
                ]}
                className="!py-0" 
              />
            </div>
          </div>
        </section>

        {/* Source types strip */}
        <section className="py-24 border-t border-border-subtle">
          {/* FIX: Changed text-muted to text-stone for better contrast */}
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone mb-6">
            Reads across the archive
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { img: RIZAL_PORTRAIT, label: 'Personal writings', sub: 'Letters, diaries, essays' },
              { img: KATIPUNAN_FLAG, label: 'Revolutionary records', sub: 'Katipunan documents' },
              { img: VELARDE_MAP, label: 'Colonial-era maps', sub: 'Charts and surveys' },
              { img: NOLI_COVER, label: 'Published literature', sub: 'Novels and periodicals' },
            ].map(({ img, label, sub }) => (
              <div key={label} className="bg-surface border border-border-subtle rounded-xl overflow-hidden">
                <div className="relative h-28 bg-muted flex items-center justify-center overflow-hidden">
                  <Image src={img} alt={label} fill className="object-cover" unoptimized />
                </div>
                <div className="p-3">
                  {/* FIX: Added text-charcoal for crisp primary labels */}
                  <p className="text-sm font-medium text-charcoal">{label}</p>
                  
                  {/* FIX: Changed text-muted to text-stone for visible sub-labels */}
                  <p className="text-xs text-stone mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="py-24 border-t border-border-subtle">
          <div className="mb-14 max-w-xl">
            {/* FIX: Changed text-muted to text-stone */}
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone">
              How it works
            </span>
            <h2 className="font-display text-3xl font-medium tracking-tight mt-3 text-charcoal">
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
                className="bg-surface border border-border-subtle rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-9 h-9 rounded-lg bg-oxblood-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-oxblood" />
                  </div>
                  {/* FIX: Changed text-border-subtle to text-stone so the '01', '02' step numbers are visible */}
                  <span className="font-mono text-xs text-stone">{step}</span>
                </div>
                {/* FIX: Explicitly added text-charcoal for the card headers */}
                <h3 className="font-medium text-[15px] text-charcoal mb-2">{title}</h3>
                <p className="text-sm text-stone leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature grid */}
        <section className="py-24 border-t border-border-subtle">
          <div className="mb-14 max-w-xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
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
                <Icon className="w-5 h-5 text-charcoal mb-4" strokeWidth={1.5} />
                <h3 className="font-medium text-[15px] mb-2">{title}</h3>
                <p className="text-sm text-stone leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-24 border-t border-border-subtle flex flex-col items-center text-center">
          <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mb-5 max-w-lg">
            Bring your sources. Get answers you can check.
          </h2>
          <Link
            href="/workspace"
            className="group flex items-center gap-2 bg-charcoal hover:bg-black text-background px-6 py-3.5 rounded-md text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
          >
            Try Kasaysayan
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </section>
      </main>

      <footer className="border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* FIX: Changed text-muted to text-stone so the copyright is visible */}
          <span className="text-xs text-stone font-mono">© {new Date().getFullYear()} Kasaysayan</span>
          <div className="flex gap-6 text-xs text-stone">
            <Link href="#" className="hover:text-charcoal transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-charcoal transition-colors">Terms</Link>
            <Link href="#" className="hover:text-charcoal transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}