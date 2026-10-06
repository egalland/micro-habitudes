import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Micro · Habitudes',description:'Tes petites actions, une case à la fois. Grilles annuelles, séries et cartes à conserver.',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>;}
