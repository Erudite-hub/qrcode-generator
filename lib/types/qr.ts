export type QRContentType = 
  | "url" 
  | "text" 
  | "wifi" 
  | "vcard" 
  | "email" 
  | "phone" 
  | "sms" 
  | "whatsapp" 
  | "location" 
  | "event"
  | "social"
  | "payment"
  | "pdf";

export interface GradientConfig {
  enabled: boolean;
  start: string;
  end: string;
  rotation: number;
}

export interface QRDesignConfig {
  foreground: string;
  background: string;
  dotStyle: "square" | "dots" | "rounded" | "extra-rounded" | "classy" | "classy-rounded";
  cornerSquareStyle: "square" | "dot" | "extra-rounded";
  cornerDotStyle: "square" | "dot";
  errorCorrection: "L" | "M" | "Q" | "H";
  width: number;
  height: number;
  margin: number;
  logo?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoMargin?: number;
  gradient?: GradientConfig;
}

export interface QRProject {
  id: string;
  name: string;
  description?: string;
  type: QRContentType;
  content: string;
  design: QRDesignConfig;
  folderId?: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface QRScanRecord {
  id: string;
  content: string;
  contentType: string;
  scannedAt: number;
  source: "camera" | "image";
  securityStatus?: string;
}

export interface QRTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  design: QRDesignConfig;
  contentType?: QRContentType;
  isCustom: boolean;
}

export interface QRDesignHistory {
  id: string;
  projectId: string;
  design: QRDesignConfig;
  createdAt: number;
}
