declare module 'next-intl' {
  export interface IntlMessages {
    common: {
      loading: string;
      error: string;
      success: string;
      cancel: string;
      confirm: string;
      delete: string;
      save: string;
      close: string;
      edit: string;
      create: string;
      search: string;
      no_results: string;
    };
    navigation: {
      new_document: string;
      open_file: string;
      save: string;
      export: string;
      share: string;
      settings: string;
      home: string;
      documents: string;
      account: string;
    };
    editor: {
      welcome_title: string;
      welcome_subtitle: string;
      get_started: string;
      editor: string;
      preview: string;
      split_view: string;
      untitled: string;
      new_document: string;
      document: string;
      documents: string;
      rename: string;
      duplicate: string;
      delete_document: string;
      delete_confirm: string;
      document_deleted: string;
      document_saved: string;
      last_modified: string;
      created: string;
    };
    toolbar: {
      bold: string;
      italic: string;
      strikethrough: string;
      heading: string;
      heading1: string;
      heading2: string;
      heading3: string;
      bullet_list: string;
      numbered_list: string;
      link: string;
      image: string;
      code: string;
      quote: string;
      table: string;
      horizontal_rule: string;
      undo: string;
      redo: string;
    };
    export: {
      title: string;
      pdf: string;
      html: string;
      docx: string;
      markdown: string;
      export_success: string;
      export_error: string;
    };
    share: {
      title: string;
      share_link: string;
      copy_link: string;
      link_copied: string;
      public: string;
      private: string;
      make_public: string;
      make_private: string;
      invite_collaborator: string;
      remove_collaborator: string;
      collaborators: string;
      add_collaborator: string;
      enter_email: string;
    };
    collaboration: {
      owner: string;
      editor: string;
      viewer: string;
      online: string;
      offline: string;
      syncing: string;
      last_synced: string;
      collaborator_joined: string;
      collaborator_left: string;
    };
    auth: {
      login: string;
      logout: string;
      register: string;
      email: string;
      password: string;
      confirm_password: string;
      name: string;
      forgot_password: string;
      no_account: string;
      has_account: string;
      login_button: string;
      register_button: string;
      login_error: string;
      register_success: string;
      register_error: string;
    };
    settings: {
      title: string;
      theme: string;
      dark_mode: string;
      light_mode: string;
      system_mode: string;
      language: string;
      french: string;
      english: string;
      spanish: string;
      account_settings: string;
      change_password: string;
      delete_account: string;
      save_settings: string;
    };
    footer: {
      copyright: string;
      made_with_love: string;
      version: string;
    };
    storage: {
      local_save: string;
      cloud_save: string;
      last_saved: string;
      saving: string;
      saved: string;
      offline_mode: string;
      sync_pending: string;
      sync_error: string;
    };
  }
}