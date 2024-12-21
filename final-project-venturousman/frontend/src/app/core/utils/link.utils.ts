import { environment } from '../../../environments/environment';

export function generateViewLink(id: string) {
  return `v/${id}`;
}

export function generateLink(id: string) {
  return `s/${id}`;
}

export function generateCopyLink(id: string) {
  return `${environment.url}/s/${id}`;
}
