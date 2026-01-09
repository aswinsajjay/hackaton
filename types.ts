
export interface SphereSettings {
  rotationX: number;
  rotationY: number;
  autoRotate: boolean;
  size: number;
  rings: number;
  segments: number;
  glowIntensity: number;
  neonColor: string;
}

export interface VivaFact {
  topic: string;
  explanation: string;
  codeSnippet?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
