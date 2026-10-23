import type { Metadata } from 'next';
import './style.css';
export const metadata: Metadata = {title:'Voix DZ | TTS',description:'Prototype de synthèse vocale pour l’Algérie'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar"><body>{children}</body></html>}
