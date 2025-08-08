import React from 'react';

export const metadata = {
  title: 'Shipit - Mes Achats',
  description: 'Gérez vos demandes d\'achat en Turquie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
