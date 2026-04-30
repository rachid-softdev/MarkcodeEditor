'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Header } from '@/components/layout/header';
import { EditorLayout } from '@/components/editor/editor-layout';
import { WelcomeScreen } from '@/components/welcome/welcome-screen';
import { Footer } from '@/components/layout/footer';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isWelcome, setIsWelcome] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    if (status === 'authenticated' || session) {
      router.push('/documents');
    } else {
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center space-y-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto loading-spinner"
          />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-primary"
          >
            MarkFlow 📝
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-muted-foreground"
          >
            {t('loading')}...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {session ? (
          <EditorLayout />
        ) : (
          <WelcomeScreen onGetStarted={handleGetStarted} />
        )}
      </main>

      <Footer />
    </div>
  );
}