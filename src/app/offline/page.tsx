'use client';

import { useTranslation } from 'react-i18next';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OfflinePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">
            <WifiOff className="w-16 h-16 mx-auto text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">{t('storage.offline_mode')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            {t('storage.sync_pending')}
          </p>
          <p className="text-sm text-muted-foreground">
            Vous pouvez continuer à éditer vos documents. Les modifications seront synchronisées lorsque vous serez de nouveau en ligne.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}