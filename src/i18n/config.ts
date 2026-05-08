import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      app: {
        title: 'Personal Accounts Kanban',
        description: 'Manage your payments and personal accounts',
      },
      kanban: {
        pending: 'Pending',
        overdue: 'Overdue',
        paid: 'Paid',
        addTask: 'Add Task',
        editTask: 'Edit Task',
        deleteTask: 'Delete Task',
        moveTask: 'Move Task',
        noTasks: 'No tasks here',
        columns: {
          pending: 'Pending',
          overdue: 'Overdue',
          paid: 'Paid',
        }
      },
      task: {
        name: 'Account Name',
        amount: 'Amount',
        dueDate: 'Due Date',
        notes: 'Notes',
        status: 'Status',
        save: 'Save',
        cancel: 'Cancel',
        placeholders: {
          name: 'e.g., Electricity Bill',
          amount: '0.00',
          notes: 'Write some details...',
        }
      },
      common: {
        confirm: 'Confirm',
        delete: 'Delete',
        actions: 'Actions',
        settings: 'Settings',
        theme: 'Theme',
        language: 'Language',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      }
    }
  },
  pt: {
    translation: {
      app: {
        title: 'Kanban de Contas Pessoais',
        description: 'Gerencie seus pagamentos e contas pessoais',
      },
      kanban: {
        pending: 'Pendente',
        overdue: 'Atrasado',
        paid: 'Pago',
        addTask: 'Adicionar Tarefa',
        editTask: 'Editar Tarefa',
        deleteTask: 'Excluir Tarefa',
        moveTask: 'Mover Tarefa',
        noTasks: 'Sem tarefas aqui',
        columns: {
          pending: 'Pendente',
          overdue: 'Atrasado',
          paid: 'Pago',
        }
      },
      task: {
        name: 'Nome da Conta',
        amount: 'Valor',
        dueDate: 'Data de Vencimento',
        notes: 'Notas',
        status: 'Status',
        save: 'Salvar',
        cancel: 'Cancelar',
        placeholders: {
          name: 'ex: Conta de Luz',
          amount: '0,00',
          notes: 'Escreva alguns detalhes...',
        }
      },
      common: {
        confirm: 'Confirmar',
        delete: 'Excluir',
        actions: 'Ações',
        settings: 'Configurações',
        theme: 'Tema',
        language: 'Idioma',
        light: 'Claro',
        dark: 'Escuro',
        system: 'Sistema',
      }
    }
  },
  it: {
    translation: {
      app: {
        title: 'Kanban Conti Personali',
        description: 'Gestisci i tuoi pagamenti e conti personali',
      },
      kanban: {
        pending: 'In sospeso',
        overdue: 'Scaduto',
        paid: 'Pagato',
        addTask: 'Aggiungi attività',
        editTask: 'Modifica attività',
        deleteTask: 'Elimina attività',
        moveTask: 'Sposta attività',
        noTasks: 'Nessuna attività qui',
        columns: {
          pending: 'In sospeso',
          overdue: 'Scaduto',
          paid: 'Pagato',
        }
      },
      task: {
        name: 'Nome Conto',
        amount: 'Importo',
        dueDate: 'Data di Scadenza',
        notes: 'Note',
        status: 'Stato',
        save: 'Salva',
        cancel: 'Annulla',
        placeholders: {
          name: 'es: Bolletta Luce',
          amount: '0,00',
          notes: 'Scrivi alcuni dettagli...',
        }
      },
      common: {
        confirm: 'Conferma',
        delete: 'Elimina',
        actions: 'Azioni',
        settings: 'Impostazioni',
        theme: 'Tema',
        language: 'Lingua',
        light: 'Luce',
        dark: 'Buio',
        system: 'Sistema',
      }
    }
  },
  fr: {
    translation: {
      app: {
        title: 'Kanban Comptes Personnels',
        description: 'Gérez vos paiements et comptes personnels',
      },
      kanban: {
        pending: 'En attente',
        overdue: 'En retard',
        paid: 'Payé',
        addTask: 'Ajouter une tâche',
        editTask: 'Modifier la tâche',
        deleteTask: 'Supprimer la tâche',
        moveTask: 'Déplacer la tâche',
        noTasks: 'Aucune tâche ici',
        columns: {
          pending: 'En attente',
          overdue: 'En retard',
          paid: 'Payé',
        }
      },
      task: {
        name: 'Nom du compte',
        amount: 'Montant',
        dueDate: 'Date d\'échéance',
        notes: 'Notes',
        status: 'Statut',
        save: 'Enregistrer',
        cancel: 'Annuler',
        placeholders: {
          name: 'ex: Facture d\'électricité',
          amount: '0,00',
          notes: 'Écrivez quelques détails...',
        }
      },
      common: {
        confirm: 'Confirmer',
        delete: 'Supprimer',
        actions: 'Actions',
        settings: 'Paramètres',
        theme: 'Thème',
        language: 'Langue',
        light: 'Clair',
        dark: 'Sombre',
        system: 'Système',
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
