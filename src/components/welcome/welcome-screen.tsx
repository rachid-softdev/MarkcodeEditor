'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FileText, 
  Zap, 
  Users, 
  Download, 
  Share2, 
  Palette,
  Globe,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const { t } = useTranslation();

  const features = [
    {
      icon: FileText,
      title: 'Édition en Temps Réel',
      description: 'Prévisualisation instantanée avec coloration syntaxique avancée'
    },
    {
      icon: Users,
      title: 'Collaboration Live',
      description: 'Travaillez en équipe avec synchronisation temps réel'
    },
    {
      icon: Download,
      title: 'Export Multiformat',
      description: 'PDF, HTML, DOCX, présentations et plus encore'
    },
    {
      icon: Share2,
      title: 'Partage Facile',
      description: 'Liens publics et partage sur réseaux sociaux'
    },
    {
      icon: Palette,
      title: 'Thèmes Personnalisés',
      description: 'Mode sombre/clair avec animations fluides'
    },
    {
      icon: Globe,
      title: 'Multilingue',
      description: 'Français, Anglais, Espagnol avec détection auto'
    },
    {
      icon: Smartphone,
      title: 'PWA & Offline',
      description: 'Utilisable hors-ligne sur tous vos appareils'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Interface ultra-rapide avec Framer Motion'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-8xl mb-6"
          >
            📝
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4"
          >
            {t('welcome_title')}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {t('welcome_subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <Zap className="w-5 h-5 mr-2" />
              {t('get_started')}
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader className="text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-lg flex items-center justify-center"
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Demo Video Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8">
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center mb-4">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl"
                >
                  🎬
                </motion.div>
              </div>
              <h3 className="text-2xl font-bold mb-2">Découvrez MarkFlow en Action</h3>
              <p className="text-muted-foreground">
                Regardez comment créer, éditer et collaborer facilement avec notre éditeur Markdown moderne.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}