export interface ChatTurn {
  question: string;
  answer: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  error?: string;
}

export interface SourceDocument {
  id: string;
  kind: "portfolio" | "blog";
  title: string;
  sourceUrl: string;
  content: string;
}
