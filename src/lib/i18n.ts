import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      // Navigation
      'new_document': 'Nouveau Document',
      'open_file': 'Ouvrir un Fichier',
      'save': 'Enregistrer',
      'export': 'Exporter',
      'share': 'Partager',
      'settings': 'Paramètres',
      
      // Editor
      'welcome_title': 'Bienvenue dans MarkFlow 📝',
      'welcome_subtitle': 'L\'éditeur Markdown collaboratif ultime',
      'get_started': 'Commencer',
      'editor': 'Éditeur',
      'preview': 'Aperçu',
      'split_view': 'Vue Divisée',
      'fullscreen': 'Plein Écran',
      'distraction_free': 'Mode Focus',
      
      // Toolbar
      'bold': 'Gras',
      'italic': 'Italique',
      'underline': 'Souligné',
      'strikethrough': 'Barré',
      'heading': 'Titre',
      'link': 'Lien',
      'image': 'Image',
      'code': 'Code',
      'quote': 'Citation',
      'list': 'Liste',
      'table': 'Tableau',
      
      // Export
      'export_pdf': 'Exporter en PDF',
      'export_html': 'Exporter en HTML',
      'export_docx': 'Exporter en DOCX',
      'export_slides': 'Exporter en Diapositives',
      
      // Share
      'share_public': 'Partage Public',
      'copy_link': 'Copier le Lien',
      'share_facebook': 'Partager sur Facebook',
      'share_twitter': 'Partager sur Twitter',
      'share_linkedin': 'Partager sur LinkedIn',
      
      // Common
      'loading': 'Chargement',
      'save_success': 'Document sauvegardé avec succès',
      'error': 'Erreur',
      'cancel': 'Annuler',
      'confirm': 'Confirmer',
      'close': 'Fermer',
      'untitled': 'Sans titre',
      
      // Footer
      'copyright': 'Tous droits réservés',
      'made_with_love': 'Fait avec ❤️ par MarkFlow Team',
    }
  },
  en: {
    translation: {
      // Navigation
      'new_document': 'New Document',
      'open_file': 'Open File',
      'save': 'Save',
      'export': 'Export',
      'share': 'Share',
      'settings': 'Settings',
      
      // Editor
      'welcome_title': 'Welcome to MarkFlow 📝',
      'welcome_subtitle': 'The ultimate collaborative Markdown editor',
      'get_started': 'Get Started',
      'editor': 'Editor',
      'preview': 'Preview',
      'split_view': 'Split View',
      'fullscreen': 'Fullscreen',
      'distraction_free': 'Distraction Free',
      
      // Toolbar
      'bold': 'Bold',
      'italic': 'Italic',
      'underline': 'Underline',
      'strikethrough': 'Strikethrough',
      'heading': 'Heading',
      'link': 'Link',
      'image': 'Image',
      'code': 'Code',
      'quote': 'Quote',
      'list': 'List',
      'table': 'Table',
      
      // Export
      'export_pdf': 'Export to PDF',
      'export_html': 'Export to HTML',
      'export_docx': 'Export to DOCX',
      'export_slides': 'Export to Slides',
      
      // Share
      'share_public': 'Public Share',
      'copy_link': 'Copy Link',
      'share_facebook': 'Share on Facebook',
      'share_twitter': 'Share on Twitter',
      'share_linkedin': 'Share on LinkedIn',
      
      // Common
      'loading': 'Loading',
      'save_success': 'Document saved successfully',
      'error': 'Error',
      'cancel': 'Cancel',
      'confirm': 'Confirm',
      'close': 'Close',
      'untitled': 'Untitled',
      
      // Footer
      'copyright': 'All rights reserved',
      'made_with_love': 'Made with ❤️ by MarkFlow Team',
    }
  },
  es: {
    translation: {
      // Navigation
      'new_document': 'Nuevo Documento',
      'open_file': 'Abrir Archivo',
      'save': 'Guardar',
      'export': 'Exportar',
      'share': 'Compartir',
      'settings': 'Configuración',
      
      // Editor
      'welcome_title': 'Bienvenido a MarkFlow 📝',
      'welcome_subtitle': 'El editor Markdown colaborativo definitivo',
      'get_started': 'Comenzar',
      'editor': 'Editor',
      'preview': 'Vista Previa',
      'split_view': 'Vista Dividida',
      'fullscreen': 'Pantalla Completa',
      'distraction_free': 'Modo Enfoque',
      
      // Toolbar
      'bold': 'Negrita',
      'italic': 'Cursiva',
      'underline': 'Subrayado',
      'strikethrough': 'Tachado',
      'heading': 'Encabezado',
      'link': 'Enlace',
      'image': 'Imagen',
      'code': 'Código',
      'quote': 'Cita',
      'list': 'Lista',
      'table': 'Tabla',
      
      // Export
      'export_pdf': 'Exportar a PDF',
      'export_html': 'Exportar a HTML',
      'export_docx': 'Exportar a DOCX',
      'export_slides': 'Exportar a Diapositivas',
      
      // Share
      'share_public': 'Compartir Público',
      'copy_link': 'Copiar Enlace',
      'share_facebook': 'Compartir en Facebook',
      'share_twitter': 'Compartir en Twitter',
      'share_linkedin': 'Compartir en LinkedIn',
      
      // Common
      'loading': 'Cargando',
      'save_success': 'Documento guardado exitosamente',
      'error': 'Error',
      'cancel': 'Cancelar',
      'confirm': 'Confirmar',
      'close': 'Cerrar',
      'untitled': 'Sin título',
      
      // Footer
      'copyright': 'Todos los derechos reservados',
      'made_with_love': 'Hecho con ❤️ por MarkFlow Team',
    }
  }
};

// Initialisation d'i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en', 'es'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
  });

export function initI18n() {
  // i18n auto-initializes on module import
}

export default i18n;