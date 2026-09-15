'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Upload, Quote, BookOpen, ArrowRight, Library, NotebookPen, Plus, Search, User, FileText, CheckCircle2, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { AccordionItem } from '@/app/components/ui/Accordion';
import { UploadIllustration, QueryIllustration, CitationIllustration } from '@/app/components/ui/FeatureIllustrations';

export default function LandingPage() {
  const [getStartedHref, setGetStartedHref] = useState('/auth?signup=true');
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-charcoal font-sans antialiased selection:bg-oxblood selection:text-white flex flex-col">
      
      {/* Refined Navigation */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border-subtle shadow-sm' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-border-strong bg-white shadow-sm flex items-center justify-center group-hover:border-charcoal transition-colors">
              <Image src="/logo2.png" alt="Kasaysayan logo" fill sizes="32px" className="object-cover" />
            </div>
            <span className="font-semibold text-[16px] tracking-tight truncate">Kasaysayan</span>
          </Link>
          <div className="flex items-center gap-6 shrink-0">
            <Link href="#how-it-works" className="hidden sm:block text-[14px] font-medium text-stone hover:text-charcoal transition-colors">
              How it works
            </Link>
            <Link href="/auth" className="text-[14px] font-medium text-stone hover:text-charcoal transition-colors whitespace-nowrap">
              Sign in
            </Link>
            <Link
              href={getStartedHref}
              className="text-[14px] font-medium px-5 py-2 rounded-full bg-charcoal text-white hover:bg-black transition-all shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2 whitespace-nowrap"
            >
              Try Kasaysayan
            </Link>
          </div>
        </nav>
      </header>

      <main className="w-full flex-1">
        
        {/* Premium Hero Section */}
        <section className="relative pt-20 sm:pt-28 pb-20 sm:pb-32 overflow-hidden bg-gradient-to-b from-background to-surface">
          {/* Subtle background texture/gradient */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(140,47,47,0.05),rgba(255,255,255,0))]"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-semibold tracking-tight mb-6 text-charcoal animate-[fadeInUp_0.8s_ease-out_0.1s_both] max-w-4xl mx-auto">
              Your AI research assistant<br className="hidden md:block"/> for Philippine history.
            </h1>
            
            <p className="text-lg sm:text-xl text-stone leading-relaxed mb-10 max-w-2xl mx-auto animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
              Upload digitized manuscripts, colonial records, or personal notes. Synthesize your private archive and get answers strictly grounded in your documents with verifiable citations.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-[fadeInUp_0.8s_ease-out_0.3s_both]">
              <Link
                href="/dashboard"
                className="group flex items-center gap-2 bg-charcoal hover:bg-black text-white px-8 py-3.5 rounded-full text-[15px] font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-oxblood focus-visible:ring-offset-2"
              >
                Start your research
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <div className="flex items-center gap-3 text-sm text-stone px-4 py-2">
                 <CheckCircle2 className="w-4 h-4 text-oxblood" />
                 Free to try
              </div>
            </div>
            
            {/* High-Fidelity UI Mockup */}
            <div className="relative mx-auto max-w-5xl text-left perspective-[2000px] animate-[fadeInUp_1.2s_ease-out_0.5s_both]">
              
              {/* Outer App Frame (macOS Style) */}
              <div className="bg-white ring-1 ring-border-strong rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px] transform-gpu transition-transform hover:scale-[1.01] duration-700 relative">
                
                {/* Left Sidebar */}
                <div className="hidden md:flex w-72 bg-muted/40 border-r border-border-subtle flex-col">
                  {/* macOS Window Controls */}
                  <div className="h-14 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></div>
                  </div>

                  <div className="px-4 pb-4 flex-1 overflow-y-auto">
                    <div className="flex items-center justify-between mb-4 mt-2">
                      <span className="text-[11px] font-semibold text-stone uppercase tracking-widest">Sources</span>
                      <button className="bg-white border border-border-strong rounded-md p-1 shadow-sm hover:bg-surface transition-colors cursor-default">
                        <Plus className="w-3.5 h-3.5 text-charcoal" />
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Mock Source 1 */}
                      <div className="bg-white ring-1 ring-charcoal/10 rounded-xl p-3 flex gap-3 items-center shadow-sm cursor-default">
                         <div className="bg-oxblood-muted p-2 rounded-lg shrink-0">
                           <FileText className="w-4 h-4 text-oxblood" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-[13px] font-medium text-charcoal truncate">Noli Me Tangere (1887)</p>
                           <p className="text-[11px] text-stone truncate">PDF • 432 pages</p>
                         </div>
                      </div>
                      {/* Mock Source 2 */}
                      <div className="bg-transparent hover:bg-white/50 rounded-xl p-3 flex gap-3 items-center border border-transparent cursor-default transition-colors">
                         <div className="bg-white border border-border-strong p-2 rounded-lg shrink-0 shadow-sm">
                           <Library className="w-4 h-4 text-stone" />
                         </div>
                         <div className="min-w-0">
                           <p className="text-[13px] font-medium text-charcoal truncate">La Solidaridad Scans</p>
                           <p className="text-[11px] text-stone truncate">Images • 24 items</p>
                         </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-4 border-t border-border-subtle">
                      <p className="text-[11px] font-semibold text-stone uppercase tracking-widest mb-3">Notebook Guide</p>
                      <div className="space-y-1">
                        <div className="bg-transparent rounded-md p-2 text-[13px] font-medium text-stone flex items-center gap-2 cursor-default">
                          <BookOpen className="w-4 h-4" />
                          Generate Summary
                        </div>
                        <div className="bg-transparent rounded-md p-2 text-[13px] font-medium text-stone flex items-center gap-2 cursor-default">
                          <NotebookPen className="w-4 h-4" />
                          Extract Timeline
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 flex flex-col relative bg-white">
                  {/* Mobile header fallback */}
                  <div className="h-14 border-b border-border-subtle flex items-center px-6 bg-white/80 backdrop-blur-sm sticky top-0 z-10 md:hidden">
                    <span className="font-semibold text-charcoal text-[14px]">Kasaysayan Engine</span>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-32">
                    {/* Assistant Intro Message */}
                    <div className="max-w-2xl mx-auto mt-6">
                       <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-lg bg-oxblood-muted flex items-center justify-center shrink-0 border border-border-subtle mt-0.5">
                           <Search className="w-4 h-4 text-oxblood" />
                         </div>
                         <div>
                           <h3 className="text-[15px] font-medium text-charcoal mb-1">Ready to research</h3>
                           <p className="text-[14px] text-stone leading-relaxed mb-4">Kasaysayan has analyzed your 2 uploaded sources. Ask a question to begin, or try one of these:</p>
                           <div className="flex flex-wrap gap-2">
                             <span className="bg-surface border border-border-strong px-3 py-1.5 rounded-full text-[12px] font-medium text-charcoal shadow-sm cursor-default">
                               Summarize the main conflicts
                             </span>
                             <span className="bg-surface border border-border-strong px-3 py-1.5 rounded-full text-[12px] font-medium text-charcoal shadow-sm cursor-default">
                               Extract key dates
                             </span>
                           </div>
                         </div>
                       </div>
                    </div>

                    {/* Mock User Message */}
                    <div className="max-w-2xl mx-auto mt-8 flex gap-4 justify-end">
                        <div className="bg-muted px-4 py-3 rounded-2xl rounded-tr-sm text-[14px] text-charcoal border border-border-strong shadow-sm max-w-[85%]">
                          What were the main arguments of the reformists?
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white border border-border-strong flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                          <User className="w-4 h-4 text-stone" />
                        </div>
                    </div>
                    
                    {/* Mock Assistant Response (Floating/Animated) */}
                    <div className="max-w-2xl mx-auto mt-8 flex gap-4 opacity-0 animate-[floatIn_1s_ease-out_1.5s_forwards]">
                         <div className="w-8 h-8 rounded-lg bg-oxblood-muted flex items-center justify-center shrink-0 border border-border-subtle mt-0.5 shadow-sm">
                           <BookOpen className="w-4 h-4 text-oxblood" />
                         </div>
                         <div className="pt-1">
                           <p className="text-[14px] text-charcoal leading-relaxed mb-3">
                             Based on your uploaded sources, the reformists primarily argued for assimilation rather than independence. They demanded:
                           </p>
                           <ul className="list-disc pl-5 space-y-1.5 text-[14px] text-charcoal">
                              <li>Representation in the Spanish Cortes <span className="inline-flex items-center justify-center w-[16px] h-[16px] mx-0.5 rounded-full bg-border-subtle hover:bg-oxblood hover:text-white transition-colors cursor-default text-[9px] font-semibold text-charcoal">1</span></li>
                              <li>Secularization of parishes <span className="inline-flex items-center justify-center w-[16px] h-[16px] mx-0.5 rounded-full bg-border-subtle hover:bg-oxblood hover:text-white transition-colors cursor-default text-[9px] font-semibold text-charcoal">2</span></li>
                           </ul>
                         </div>
                    </div>
                  </div>

                  {/* Input Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-12 pb-6 px-6 md:px-10">
                    <div className="bg-white border border-border-strong shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-xl p-2 pl-4 flex items-center gap-3 relative z-10">
                      <input 
                        type="text" 
                        placeholder="Ask Kasaysayan..." 
                        className="flex-1 text-[14px] text-charcoal placeholder:text-stone outline-none bg-transparent"
                        disabled
                      />
                      <div className="w-8 h-8 rounded-lg bg-charcoal flex items-center justify-center shadow-sm cursor-default">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="text-center mt-3">
                      <span className="text-[11px] font-medium text-stone flex items-center justify-center gap-1">
                        <Lock className="w-3 h-3" /> Citations are grounded exclusively in your archives.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -left-16 top-24 hidden lg:flex items-center gap-3 bg-white p-3 rounded-2xl shadow-xl border border-border-subtle transform -rotate-3 animate-[pulse_4s_ease-in-out_infinite]">
                <div className="bg-oxblood-muted p-2 rounded-xl border border-border-subtle">
                  <Upload className="w-4 h-4 text-oxblood" />
                </div>
                <div className="pr-2">
                  <div className="text-[12px] font-semibold text-charcoal">Secure Upload</div>
                </div>
              </div>

              <div className="absolute -right-12 bottom-40 hidden lg:flex items-center gap-3 bg-white p-3 rounded-2xl shadow-xl border border-border-subtle transform rotate-3 animate-[pulse_4s_ease-in-out_infinite_2s]">
                <div className="bg-surface p-2 rounded-xl border border-border-strong">
                  <Quote className="w-4 h-4 text-charcoal" />
                </div>
                <div className="pr-2">
                  <div className="text-[12px] font-semibold text-charcoal">Verified Citations</div>
                </div>
              </div>
            </div>
            
          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="how-it-works" className="py-24 sm:py-32 bg-background relative overflow-hidden">
          {/* Subtle top border gradient for depth */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-50"></div>
          
          {/* Background ambient lighting */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(230,226,216,0.3)_0%,transparent_70%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="font-display text-4xl sm:text-5xl font-medium tracking-tight text-charcoal mb-6">
                Designed for rigorous historical research
              </h2>
              <p className="text-[17px] sm:text-lg text-stone leading-relaxed max-w-2xl mx-auto">
                Kasaysayan isn&apos;t a general chatbot. It is a specialized engine built to process, comprehend, and cite your specific historical documents.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: Upload,
                  title: 'Build your knowledge base',
                  desc: 'Upload PDFs, images, and text files. Kasaysayan instantly processes them, making your entire archive searchable and queryable in seconds.',
                  illustration: <UploadIllustration />
                },
                {
                  icon: Search,
                  title: 'Ask complex questions',
                  desc: 'Interact with your documents conversationally. Ask Kasaysayan to summarize themes, extract timelines, or compare perspectives across multiple texts.',
                  illustration: <QueryIllustration />
                },
                {
                  icon: Quote,
                  title: 'Always cited, never hallucinated',
                  desc: 'Unlike general AI, Kasaysayan strictly grounds its answers in your uploaded materials. Every claim includes a clickable citation to the exact source page.',
                  illustration: <CitationIllustration />
                }
              ].map((feature, idx) => (
                <div key={idx} className="group relative flex flex-col bg-white border border-border-subtle rounded-[2rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 transition-all duration-500 ease-out">
                  
                  {/* Illustration Window (Top Half) */}
                  <div className="h-[280px] bg-[#FDFBF7] border-b border-border-subtle overflow-hidden relative flex items-end justify-center px-6 pt-6">
                     {/* Decorative background grid for the illustration area */}
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(216,212,200,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(216,212,200,0.4)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />
                     
                     {/* Inner soft shadow to make the window feel inset */}
                     <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] pointer-events-none" />

                     {/* The illustration itself lifts up slightly and scales on hover */}
                     <div className="relative z-10 w-full transform group-hover:-translate-y-3 group-hover:scale-[1.02] transition-all duration-700 ease-out pb-4">
                       {feature.illustration}
                     </div>
                  </div>
                  
                  {/* Text Content (Bottom Half) */}
                  <div className="p-8 md:p-10 flex flex-col flex-1 bg-gradient-to-b from-white to-[#FDFBF7]/50 relative z-20">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border-strong flex items-center justify-center mb-6 shadow-sm group-hover:border-oxblood/30 group-hover:bg-oxblood/5 group-hover:shadow-oxblood/10 transition-all duration-500">
                      <feature.icon className="w-5 h-5 text-stone group-hover:text-oxblood transition-colors duration-500" strokeWidth={1.5} />
                    </div>
                    <h4 className="text-[20px] font-medium text-charcoal mb-3 group-hover:text-oxblood transition-colors duration-300">{feature.title}</h4>
                    <p className="text-[15px] text-stone leading-relaxed">{feature.desc}</p>
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 sm:py-32 bg-surface border-t border-border-subtle">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-start justify-center gap-10 md:gap-16">
              
              {/* Left Column: Image */}
              <div className="w-full md:w-1/2 lg:w-5/12 shrink-0 relative">
                <Image
                  src="/faq-bg.jpg"
                  alt="FAQ section illustration"
                  width={600}
                  height={800}
                  className="max-w-sm w-full rounded-2xl h-auto object-cover shadow-sm ring-1 ring-border-strong/50"
                />
              </div>

              {/* Right Column: Titles & Accordion */}
              <div className="w-full md:w-1/2 lg:w-7/12 pt-2 md:pt-0">
                <p className="text-oxblood text-[12px] font-semibold uppercase tracking-[0.15em] mb-2">
                  Support & Details
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-charcoal mb-3">
                  Frequently asked questions
                </h2>
                <p className="text-[15px] sm:text-[16px] text-stone mb-6 leading-relaxed max-w-lg">
                  Everything you need to know about how Kasaysayan processes, secures, and cites your historical archives.
                </p>
                
                <div className="border-t border-border-subtle w-full">
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
                    <AccordionItem 
                      key={index} 
                      question={item.q} 
                      answer={item.a} 
                      isOpen={openFaqIndex === index}
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    />
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-24 sm:py-32 bg-background border-t border-border-subtle relative overflow-hidden">
          
          {/* Decorative Background Elements applied to the full section */}
          {/* Subtle graph-paper grid fading out at the edges to blend smoothly */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(230,226,216,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(230,226,216,0.4)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)] pointer-events-none" />
          
          {/* Soft ambient glow centered behind the text */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-oxblood/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">

            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-charcoal mb-6 leading-[1.1]">
              Bring your archives.<br className="hidden sm:block" /> Discover the truth within them.
            </h2>
            
            <p className="text-stone text-[17px] sm:text-lg mb-10 leading-relaxed max-w-2xl">
              Stop searching through fragmented folders. Consolidate your Philippine historical research into a single, intelligent, and verifiable repository today.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 bg-charcoal hover:bg-black text-white px-8 py-4 rounded-full text-[15px] font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-charcoal focus-visible:ring-offset-2"
              >
                Start your free workspace
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-background py-10 border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-80">
            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-[4px] border border-border-strong bg-white flex items-center justify-center grayscale">
              <Image src="/logo2.png" alt="Kasaysayan logo" fill sizes="24px" className="object-cover" />
            </div>
            <span className="text-[13px] font-medium text-stone">© {new Date().getFullYear()} Kasaysayan</span>
          </div>
          <div className="flex gap-6 text-[13px] font-medium text-stone">
            <Link href="#" className="hover:text-charcoal transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-charcoal transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-charcoal transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>

      {/* Global Styles for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatIn {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}