// src/app/layout.tsx
export const metadata = {
  title: 'HMSTR Dashboard',
  description: 'AI-powered lead tracking',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
