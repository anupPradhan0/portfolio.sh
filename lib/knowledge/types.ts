export interface KnowledgeSource {
  id: number;
  title: string;
  url: string;
}

export interface ChatTurn {
  question: string;
  answer: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  sources?: KnowledgeSource[];
  error?: string;
}

export interface SourceDocument {
  id: string;
  kind: "portfolio" | "blog";
  title: string;
  sourceUrl: string;
  content: string;
}
