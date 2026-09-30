import { BookOpen, Sparkles, Settings, Sun, Moon } from 'lucide-react';
import { getTranslation } from '../../utils/i18n';

interface HeaderProps {
  theme: 'light' | 'dark' | 'system';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

export function Header({
  theme,
  onToggleTheme,
  onOpenSettings
}: HeaderProps) {
  const t = getTranslation();

  return (
    <header className="header-bar">
      <div className="header-brand">
        <div className="header-logo-icon">
          <BookOpen size={16} />
          <Sparkles size={8} className="header-logo-sparkle" />
        </div>
        <div className="header-title-group">
          <h1>{t.appTitle}</h1>
          <p>{t.appSubtitle}</p>
        </div>
      </div>

      <div className="header-actions">
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button
          className="icon-btn"
          onClick={onOpenSettings}
          title={t.settings}
          aria-label="Open settings"
        >
          <Settings size={15} />
        </button>
      </div>
    </header>
  );
}
