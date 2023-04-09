import './globals.css';

export const metadata = {
  title: 'Listr',
  description: 'Bookmark your favorite finds and share them with Listr.',
  keywords:
    'Listr, Nostr, Nostr protocol, decentralized, censorship-resistant, social network, web client, pins, bookmark',
  manifest: '/manifest.json',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    title: 'Listr',
    description: 'Bookmark your favorite finds and share them with Listr',
    images: [
      {
        url: 'https://raw.githubusercontent.com/sepehr-safari/listr/main/public/listr.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full w-full bg-gradient-to-l from-base-200 to-base-200"
      data-theme="nostribish"
    >
      <body className="overflow-y-auto overflow-x-hidden">{children}</body>
    </html>
  );
}
