import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { getSupportedLanguage, supportedLanguages } from "../i18n";
import { emitJourneyEvent } from "../lib/journey-events";
import { DropdownSelect } from "./dropdown-select";
import "./public-ui.css";

const languageNames = {
  en: "English",
  es: "Español",
  fr: "Français",
} as const;

const landingSections = [
  ["product", "daily-decisions"], ["how", "how-it-works"], ["plans", "plans"], ["faq", "faq"],
] as const;

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
  const currentLanguage = getSupportedLanguage(i18n.resolvedLanguage);

  return (
    <div className="language-select" data-compact={compact}>
      <DropdownSelect
        label={t("language.label")} compact={compact}
        value={currentLanguage}
        onChange={(language) => void i18n.changeLanguage(language)}
        options={supportedLanguages.map((language) => ({
          value: language, label: languageNames[language], mark: language.toUpperCase(), lang: language,
        }))}
      />
    </div>
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
          {landingSections.map(([label, id]) => <Link className="site-section-link" key={id} to={`/#${id}`}>{t(`buying.nav.${label}`)}</Link>)}
          <LanguageSwitcher compact />
          <DemoLink location="header" />
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
          <Link ref={firstMenuLinkRef} className="mobile-menu__link" to="/demo"
            onClick={() => { emitJourneyEvent("landing_cta_selected", { location: "mobile-menu" }); setMenuOpen(false); }}>
            {t("actions.exploreDemo")}
          </Link>
          {landingSections.map(([label, id]) => <Link className="mobile-menu__link" key={id} to={`/#${id}`} onClick={() => setMenuOpen(false)}>{t(`buying.nav.${label}`)}</Link>)}
          <div className="mobile-menu__language">
            <LanguageSwitcher />
          </div>
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
      <nav className="site-footer__links" aria-label={t("buying.nav.footer")}>
        <Link to="/demo">{t("actions.exploreDemo")}</Link>
        <Link to="/#plans">{t("buying.nav.plans")}</Link>
        <Link to="/#faq">{t("buying.nav.faq")}</Link>
      </nav>
    </footer>
  );
}

export function DemoLink({ location }: { location: "header" | "hero" | "briefing" | "closing" | "how-it-works" }) {
  const { t } = useTranslation();
  return <ButtonLink to="/demo" onClick={() => emitJourneyEvent("landing_cta_selected", { location })}>{t("actions.exploreDemo")}</ButtonLink>;
}
