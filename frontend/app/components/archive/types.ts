export interface ArchiveSource {
  name: string;
  url: string;
  type: string;
  rawText?: string;
}

export interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

export interface Citation {
  index: number;
  sourceName: string;
  snippet: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  citations?: Citation[];
  fromChat?: boolean; // true = saved from chat response
  createdAt: string;
  updatedAt: string;
}