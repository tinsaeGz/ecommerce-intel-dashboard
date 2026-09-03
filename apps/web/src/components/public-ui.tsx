import {
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getSupportedLanguage, supportedLanguages } from "../i18n";
import "./public-ui.css";

const languageNames = {
  en: "English",
  es: "Español",
  fr: "Français",
} as const;

const announcementStorageKey = "suq.landing-announcement-dismissed";

function readAnnouncementVisibility() {
  try {
    return window.sessionStorage.getItem(announcementStorageKey) !== "true";
  } catch {
    return true;
  }
}

export function SkipLink() {
  const { t } = useTranslation();
  return (
    <a className="skip-link" href="#main-content">
      {t("common.skipToContent")}
    </a>
  );
}

export function Brand() {
  const { t } = useTranslation();
  return (
    <Link className="brand" to="/" aria-label={t("brand.homeLabel")}>
      <span className="brand__mark" aria-hidden="true">
        S
      </span>
      <span>Suq Insights</span>
    </Link>
  );
}

interface ButtonLinkProps {
  children: ReactNode;
  to: string;
  variant?: "primary" | "secondary" | "quiet";
  onClick?: () => void;
}

export function ButtonLink({
  children,
  to,
  variant = "primary",
  onClick,
}: ButtonLinkProps) {
  return (
    <Link
      className="button-link"
      data-variant={variant}
      onClick={onClick}
      to={to}
    >
      {children}
    </Link>
  );
}

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const labelId = useId();
  const currentLanguage = getSupportedLanguage(i18n.resolvedLanguage);

  return (
    <div className="language-select" data-compact={compact}>
      <label className="visually-hidden" htmlFor={labelId}>
        {t("language.label")}
      </label>
      <select
        id={labelId}
        aria-label={t("language.label")}
        onChange={(event) => void i18n.changeLanguage(event.target.value)}
        value={currentLanguage}
      >
        {supportedLanguages.map((language) => (
          <option key={language} value={language}>
            {languageNames[language]}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Announcement() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(readAnnouncementVisibility);

  const dismiss = () => {
    setVisible(false);
    try {
      window.sessionStorage.setItem(announcementStorageKey, "true");
    } catch {
      // Dismissal still works for the current render when storage is unavailable.
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <aside className="announcement" aria-label={t("announcement.label")}>
      <p>{t("announcement.message")}</p>
      <button
        className="announcement__dismiss"
        onClick={dismiss}
        type="button"
        aria-label={t("announcement.dismiss")}
      >
        <span aria-hidden="true">×</span>
      </button>
    </aside>
  );
}

export function SiteHeader() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    document.body.dataset.menuOpen = menuOpen ? "true" : "false";
    if (menuOpen) {
      firstMenuLinkRef.current?.focus();
    }

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    if (menuOpen) {
      document.addEventListener("keydown", closeWithEscape);
    }

    return () => {
      delete document.body.dataset.menuOpen;
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Brand />

        <nav className="site-header__desktop" aria-label={t("navigation.primary")}>
          <Link className="site-header__nav-link" to="/demo">
            {t("actions.exploreDemo")}
          </Link>
          <LanguageSwitcher compact />
          <ButtonLink to="/login" variant="quiet">
            {t("actions.logIn")}
          </ButtonLink>
          <ButtonLink to="/signup">{t("actions.startFree")}</ButtonLink>
        </nav>

        <button
          ref={menuButtonRef}
          className="menu-toggle"
          type="button"
          aria-controls="site-mobile-menu"
          aria-expanded={menuOpen}
          aria-label={t(menuOpen ? "navigation.closeMenu" : "navigation.openMenu")}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>

      {menuOpen ? (
        <nav
          className="mobile-menu"
          id="site-mobile-menu"
          aria-label={t("navigation.mobile")}
        >
          <Link ref={firstMenuLinkRef} className="mobile-menu__link" to="/demo">
            {t("actions.exploreDemo")}
          </Link>
          <Link className="mobile-menu__link" to="/login">
            {t("actions.logIn")}
          </Link>
          <div className="mobile-menu__language">
            <LanguageSwitcher />
          </div>
          <ButtonLink to="/signup">{t("actions.startFree")}</ButtonLink>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="site-footer">
      <Brand />
      <p>{t("footer.previewNote")}</p>
      <p>{t("footer.languages")}</p>
    </footer>
  );
}

export { announcementStorageKey };
