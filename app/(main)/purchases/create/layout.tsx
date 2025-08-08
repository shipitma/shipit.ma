import React from 'react';

export const metadata = {
  title: 'Shipit - Nouvelle Demande d\'Achat',
  description: 'Créez une nouvelle demande d\'achat en Turquie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
