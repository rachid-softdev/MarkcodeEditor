'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-background/50 backdrop-blur-sm border-t border-border py-6"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © 2025 - {currentYear} MarkFlow. {t('copyright')}.
          </div>

          {/* Made with love */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 text-sm text-muted-foreground"
          >
            <span>{t('made_with_love')}</span>
          </motion.div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="https://github.com/markflow"
              className="text-muted-foreground hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="https://twitter.com/markflow"
              className="text-muted-foreground hover:text-primary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, y: -2 }}
              href="mailto:contact@markflow.dev"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}