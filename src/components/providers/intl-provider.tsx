'use client';

import { ReactNode } from 'react';

export default function IntlProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}