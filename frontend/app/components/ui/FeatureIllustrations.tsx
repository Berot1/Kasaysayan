import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { BookOpen, Search, Quote, Plus, Globe, ArrowUp } from "lucide-react";

const RIZAL_AVATAR = 'https://commons.wikimedia.org/wiki/Special:FilePath/Jose_Rizal_full.jpg?width=100';
const BONIFACIO_AVATAR = 'https://commons.wikimedia.org/wiki/Special:FilePath/Andres_Bonifacio.jpg?width=100';
const MABINI_AVATAR = 'https://commons.wikimedia.org/wiki/Special:FilePath/Apolinario_Mabini.jpg?width=100';

export const UploadIllustration = () => {
  return (
    <Card aria-hidden className="mt-9 aspect-video p-4 bg-muted border-border-subtle">
      <div className="relative hidden h-fit">
        <div className="absolute -left-1.5 bottom-1.5 rounded-md border-t border-oxblood bg-oxblood px-1 py-px text-[10px] font-medium text-white shadow-md shadow-oxblood/35">PDF</div>
      </div>
      <div className="mb-1 text-sm font-medium font-display text-charcoal">La Solidaridad Scans</div>
      <div className="mb-4 flex gap-2 text-[13px]">
        <span className="text-stone font-mono uppercase tracking-wider text-[10px]">Processing 4 documents</span>
      </div>
      <div className="mb-2 flex -space-x-1.5">
        <div className="flex -space-x-1.5">
          {[
            { src: RIZAL_AVATAR, alt: 'Jose Rizal' },
            { src: BONIFACIO_AVATAR, alt: 'Andres Bonifacio' },
            { src: MABINI_AVATAR, alt: 'Apolinario Mabini' },
          ].map((avatar, index) => (
            <div key={index} className="bg-background size-8 rounded-full border border-border-subtle p-0.5 shadow-sm">
              <img
                className="aspect-square rounded-full object-cover grayscale mix-blend-multiply opacity-80"
                src={avatar.src}
                alt={avatar.alt}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
        <div className="bg-oxblood h-full w-2/3 rounded-full"></div>
      </div>
    </Card>
  )
}

export const QueryIllustration = () => {
  return (
    <div aria-hidden className="relative mt-6">
      <Card className="aspect-video w-4/5 translate-y-4 p-4 border-border-subtle transition-transform duration-300 ease-out group-hover:-rotate-2 group-hover:scale-105 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <div className="bg-oxblood-muted size-7 rounded-full border border-border-subtle flex items-center justify-center shadow-sm">
             <BookOpen className="w-3.5 h-3.5 text-oxblood" />
          </div>
          <span className="text-charcoal text-[13px] font-medium">Kasaysayan Engine</span>
          <span className="text-stone text-[11px] ml-auto">1s ago</span>
        </div>
        <div className="ml-9 space-y-2.5">
          <div className="bg-stone/20 h-2 rounded-full w-full"></div>
          <div className="bg-stone/20 h-2 rounded-full w-5/6"></div>
          <div className="bg-stone/20 h-2 rounded-full w-4/6"></div>
        </div>
      </Card>
      
      <Card className="absolute -top-2 right-0 flex w-2/5 translate-y-4 p-2 transition-transform duration-300 ease-out group-hover:rotate-3 shadow-md border-border-subtle bg-white">
        <div className="bg-muted m-auto flex size-10 rounded-full border border-border-strong items-center justify-center">
          <Search className="text-oxblood size-4" strokeWidth={2} />
        </div>
      </Card>
    </div>
  )
}

export const CitationIllustration = () => {
  return (
    <Card aria-hidden className="mt-6 aspect-video translate-y-4 p-5 pb-6 border-border-subtle transition-transform duration-300 group-hover:translate-y-2 shadow-sm bg-surface">
      <div className="w-fit">
        <Quote className="size-4 text-oxblood fill-oxblood/10" />
        <p className="mt-3 text-[13px] leading-relaxed text-charcoal font-medium">
          Identify the key differences in strategy between the Magdalo and Magdiwang factions.
        </p>
      </div>
      <div className="bg-muted -mx-3 -mb-3 mt-4 space-y-3 rounded-lg p-3 border border-border-subtle/50">
        <div className="text-stone text-[11px] uppercase tracking-wider font-mono">Ask Kasaysayan</div>
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="size-7 rounded-full bg-white border-border-strong shadow-sm">
              <Plus className="w-3.5 h-3.5 text-charcoal" />
            </Button>
            <Button variant="outline" size="icon" className="size-7 rounded-full bg-white border-border-strong shadow-sm">
              <Globe className="w-3.5 h-3.5 text-charcoal" />
            </Button>
          </div>
          <Button size="icon" className="size-7 rounded-full bg-charcoal hover:bg-black">
            <ArrowUp strokeWidth={2.5} className="w-3.5 h-3.5 text-white" />
          </Button>
        </div>
      </div>
    </Card>
  )
}