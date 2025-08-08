export const metadata = {
  title: 'TOBI TECH Assistant',
  description: 'Your AI-powered assistant for automation, ads, and global reach',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
