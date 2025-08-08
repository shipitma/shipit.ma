import React from 'react';

export const metadata = {
  title: 'Shipit - Tableau de Bord',
  description: 'Gérez vos achats en Turquie et vos expéditions vers le Maroc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
