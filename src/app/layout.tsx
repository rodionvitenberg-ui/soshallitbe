/**
 * Root layout required by Next.js. Document shell (html/body/lang) lives in
 * `app/[locale]/layout.tsx` so next-intl can set `lang` per locale.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
