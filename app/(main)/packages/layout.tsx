import React from 'react';

export const metadata = {
  title: 'Shipit - Mes Colis',
  description: 'Gérez vos colis et expéditions depuis la Turquie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
