export interface MessageItem {
  id: string | number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  createdAt?: string;
}

export type ContactStatus = 'yeni' | 'devam' | 'tamamlandi' | 'arsiv';

export interface ContactState {
  status: ContactStatus;
  notes: string;
}

export interface ContactGroup {
  email: string;
  name: string;
  status: ContactStatus;
  notes: string;
  items: MessageItem[];
}

export interface ProjectLink {
  url: string;
  label: string;
}

export interface ProjectFormData {
  title: string;
  category: string;
  descriptionTr: string;
  descriptionEn: string;
  techStackInput: string;
}

export type AdminTab = 'analytics' | 'projects' | 'messages';
export type StatusFilter = 'all' | ContactStatus;