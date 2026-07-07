'use client';

import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import { InteractiveFolderGallery } from '@/app/components/ui/InteractiveFolderGallery';
import { supabase } from '@/lib/supabaseClient';
import { AccordionItem } from '@/app/components/ui/Accordion';

const RIZAL_PORTRAIT = 'https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Rizal_full.jpg?width=300';
const KATIPUNAN_FLAG = 'https://commons.wikimedia.org/wiki/Special:FilePath/Flag_of_Katipunan.svg?width=300';
const VELARDE_MAP = 'https://commons.wikimedia.org/wiki/Special:FilePath/Carta%20Hydrographica%20y%20Chorographica%20de%20la%20Yslas%20Filipinas%20MANILA%2C%201734.jpg?width=700';
const BONIFACIO_PORTRAIT = 'https://commons.wikimedia.org/wiki/Special:FilePath/Andres_Bonifacio.jpg?width=800';
const NOLI_COVER = 'https://commons.wikimedia.org/wiki/Special:FilePath/Noli_Me_Tangere.jpg?width=300';

export default function LandingPage() {
  const [getStartedHref, setGetStartedHref] = useState('/auth?signup=true');

  useEffect(() => {
    let isMounted = true;

    const resolveDestination = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setGetStartedHref(session ? '/dashboard' : '/auth?signup=true');
      }
    };

    resolveDestination();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setGetStartedHref(session ? '/dashboard' : '/auth?signup=true');
      }
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-charcoal font-sans antialiased selection:bg-muted">
      
      {/* Navigation */}
      <header className="border-b border-border-subtle">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative h-8 w-8 sm:h-9 sm:w-9 shrink-0 overflow-hidden rounded-lg border border-border-subtle bg-background/80 shadow-sm">
              <Image src="/logo2.png" alt="Kasaysayan logo" fill sizes="36px" className="object-cover" />
            </div>
            <span className="font-semibold text-[14px] sm:text-[15px] tracking-tight truncate">Kasaysayan</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <Link href="#how-it-works" className="hidden sm:block text-sm text-stone hover:text-charcoal transition-colors">
              How it works
            </Link>
            <Link href="/auth" className="text-sm text-stone hover:text-charcoal transition-colors whitespace-nowrap">
              Sign in
            </Link>
            <Link
              href={getStartedHref}
              className="text-sm font-medium px-3 sm:px-4 py-2 rounded-md border border-charcoal hover:bg-charcoal hover:text-background transition-colors focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 whitespace-nowrap"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center pt-10 sm:pt-16 pb-16 sm:pb-24">
          <div>
            <div className="inline-flex items-center gap-2 mb-5 sm:mb-6 text-[11px] font-mono uppercase tracking-[0.12em] text-oxblood bg-oxblood-muted px-3 py-1.5 rounded-full">
              <BookOpen className="w-3.5 h-3.5" />
              Grounded in primary sources
            </div>
            <h1 className="font-display text-[2.1rem] sm:text-[2.75rem] md:text-[3.4rem] leading-[1.12] sm:leading-[1.08] font-medium tracking-tight mb-5 sm:mb-6">
              Query the archives of
              <br />
              Philippine history.
            </h1>
            <p className="text-base sm:text-lg text-stone leading-relaxed mb-7 sm:mb-9 max-w-md">
              Upload digitized manuscripts, Katipunan records, colonial-era maps, 
              or personal notes. Kasaysayan synthesizes your private archive, providing 
              answers strictly grounded in your documents with every claim traced back to the specific page.
            </p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <Link
                href="/dashboard"
                className="group flex items-center bg-charcoal hover:bg-black text-background px-6 py-3.5 rounded-md text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
              >
                Try Kasaysayan
                <ArrowRight className="w-0 h-4 opacity-0 overflow-hidden transition-all duration-300 ease-out group-hover:w-4 group-hover:ml-2 group-hover:opacity-100" />
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

        {/* How it works */}
        <section id="how-it-works" className="py-16 sm:py-24 md:py-32 border-t border-border-subtle">
          <div className="mb-12 sm:mb-20 text-center max-w-2xl mx-auto">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight mt-4 text-charcoal">
              Your AI-Powered Archival Partner
            </h2>
          </div>

          <div className="max-w-5xl mx-auto flex flex-col gap-14 sm:gap-24 md:gap-32">
            {[
              {
                icon: Upload,
                title: 'Upload your sources',
                body: 'Build a private knowledge base by uploading scanned letters, historical texts, or images. Kasaysayan extracts, OCRs, and indexes the text instantly, preparing it for deep analysis.',
                imagePlaceholderText: 'Drop Screenshot of Workspace Upload Here',
              },
              {
                icon: MessageSquareText,
                title: 'Contextual Querying',
                body: 'Query your documents in Filipino or English. Once your sources are indexed, Kasaysayan acts as a research assistant, providing grounded analysis derived exclusively from the materials you have curated.',
                imagePlaceholderText: 'Drop Screenshot of Chat Panel Here',
              },
              {
                icon: Quote,
                title: 'See the source, not just the answer',
                body: 'Gain confidence in every response. Kasaysayan provides clear, verifiable inline citations for its work, allowing you to trace every claim back to the exact paragraph in your archives.',
                imagePlaceholderText: 'Drop Screenshot of Inline Citations Here',
              },
            ].map(({ icon: Icon, title, body, imagePlaceholderText }) => (
              <div key={title} className="grid md:grid-cols-12 gap-8 md:gap-16 items-center">
                
                <div className="md:col-span-4 flex flex-col items-start text-left order-2 md:order-1">
                  <div className="mb-6">
                    <Icon className="w-7 h-7 text-charcoal" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-display font-medium text-charcoal mb-4">
                    {title}
                  </h3>
                  <p className="text-[15px] text-stone leading-relaxed">
                    {body}
                  </p>
                </div>

                <div className="md:col-span-8 order-1 md:order-2">
                  <div className="w-full aspect-[16/10] bg-muted rounded-2xl border border-border-strong shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center justify-center overflow-hidden group relative">
                    <div className="text-center px-6">
                      <div className="w-12 h-12 rounded-full bg-surface border border-border-subtle flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5 text-stone" />
                      </div>
                      <p className="font-mono text-xs uppercase tracking-widest text-stone">
                        {imagePlaceholderText}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* Feature */}
        <section className="py-16 sm:py-24 border-t border-border-subtle">
          <div className="mb-10 sm:mb-14 max-w-xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone">
              The Kasaysayan Standard
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-medium tracking-tight mt-3">
              Built for people who need to trust the answer.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              {
                icon: Library,
                title: 'Strictly source-grounded',
                body: 'Responses are formulated exclusively from your uploaded archives. The AI is restricted from injecting outside internet knowledge.',
              },
              {
                icon: Quote,
                title: 'Transparent verification',
                body: 'Every assertion carries a reference back to its specific source document, ensuring nothing is taken on faith.',
              },
              {
                icon: NotebookPen,
                title: 'Bilingual comprehension',
                body: 'Analyze and query documents seamlessly in both Filipino and English, bridging the gap between historical texts and modern research.',
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
    
        {/* FAQ */}
        <section className="py-16 sm:py-24 border-t border-border-subtle">
          <div className="mb-10 sm:mb-16">
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone mb-4 block">
              Support & Details
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-charcoal">
              Frequently asked questions
            </h2>
          </div>

          <div className="border-b border-[#E6E2D8]">
            {[
              {
                q: "How can I verify the historical accuracy of the AI's claims?",
                a: "Kasaysayan operates on a 'grounded intelligence' model. Instead of drawing from general internet knowledge, the system is strictly constrained to your uploaded primary sources. Every assertion is anchored to a specific document and page, allowing you to trace the evidence back to its origin immediately."
              },
              {
                q: "What happens to the archival documents I upload?",
                a: "We treat your research as intellectual property. Your documents are hosted in a private, secure environment and are never used to train public AI models. Your archives remain entirely inaccessible to other users, ensuring the integrity of your private research remains intact."
              },
              {
                q: "Can Kasaysayan analyze documents written in languages other than English?",
                a: "Yes. The platform is specifically calibrated for the nuances of Philippine history. It offers deep comprehension for English, Filipino, and Spanish-era manuscripts. It can synthesize these languages during analysis, allowing you to bridge linguistic gaps between historical texts and modern research."
              }
            ].map((item, index) => (
              <AccordionItem key={index} question={item.q} answer={item.a} />
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-20 sm:py-32 border-t border-border-subtle">
          <div className="max-w-2xl mx-auto text-center px-2 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-medium tracking-tight text-charcoal mb-5 sm:mb-6">
              Bring your archives. Discover the truth within them.
            </h2>
            <p className="text-stone text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
              Stop searching through fragmented folders. Consolidate your Philippine historical research into a single, intelligent, and verifiable repository.
            </p>
            <Link
              href="/dashboard"
              className="group inline-flex items-center bg-charcoal hover:bg-black text-background px-8 py-4 rounded-md text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
            >
              Begin your research
              <ArrowRight className="w-0 h-4 opacity-0 overflow-hidden transition-all duration-300 ease-out group-hover:w-4 group-hover:ml-2 group-hover:opacity-100" />
            </Link>
            <p className="mt-6 text-[11px] font-mono text-stone uppercase tracking-widest">
              No archives uploaded yet? Start with our samples.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
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