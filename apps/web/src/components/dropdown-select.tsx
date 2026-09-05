import { type KeyboardEvent, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import "./dropdown-select.css";

interface Option<T extends string> {
  value: T;
  label: string;
  mark?: string;
  lang?: string;
  disabled?: boolean;
}

interface DropdownSelectProps<T extends string> {
  id?: string;
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
  disabled?: boolean;
  compact?: boolean;
  hint?: string;
}

/** Select-only combobox: browsing never commits until Enter, Space, Tab or a click. */
export function DropdownSelect<T extends string>({ id, label, value, options, onChange, disabled = false, compact = false, hint }: DropdownSelectProps<T>) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const listId = `${controlId}-options`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef({ text: "", time: 0 });
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(value);
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0, maxHeight: 320 });
  const selected = options.find((option) => option.value === value);
  const enabled = options.filter((option) => !option.disabled);
  const expanded = open && !disabled && enabled.length > 0;

  function show() {
    setActive(selected && !selected.disabled ? value : enabled[0]?.value ?? value);
    searchRef.current = { text: "", time: 0 };
    setOpen(true);
  }

  function commit(next: T) {
    if (next !== value && options.some((option) => option.value === next && !option.disabled)) onChange(next);
    setOpen(false);
  }

  useLayoutEffect(() => {
    if (!expanded) return;
    const reposition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const viewport = window.visualViewport;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const offsetTop = viewport?.offsetTop ?? 0;
      const offsetLeft = viewport?.offsetLeft ?? 0;
      if (rect.bottom < offsetTop || rect.top > offsetTop + viewportHeight) {
        setOpen(false);
        return;
      }
      const below = viewportHeight + offsetTop - rect.bottom - 16;
      const above = rect.top - offsetTop - 16;
      const desired = Math.min(popupRef.current?.scrollHeight ?? 320, 400);
      const flip = below < desired && above > below;
      const maxHeight = Math.max(0, Math.min(400, flip ? above : below));
      const width = Math.min(Math.max(rect.width, 272), viewportWidth - 16);
      setPosition({
        left: Math.max(offsetLeft + 8, Math.min(rect.right - width, offsetLeft + viewportWidth - width - 8)),
        top: flip ? Math.max(offsetTop + 8, rect.top - Math.min(desired, maxHeight) - 8) : rect.bottom + 8,
        width,
        maxHeight,
      });
    };
    reposition();
    const resizeObserver = new ResizeObserver(reposition);
    if (triggerRef.current) resizeObserver.observe(triggerRef.current);
    if (popupRef.current) resizeObserver.observe(popupRef.current);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    window.visualViewport?.addEventListener("resize", reposition);
    window.visualViewport?.addEventListener("scroll", reposition);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      window.visualViewport?.removeEventListener("resize", reposition);
      window.visualViewport?.removeEventListener("scroll", reposition);
    };
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !triggerRef.current?.contains(event.target) && !popupRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [expanded]);

  useLayoutEffect(() => {
    if (!expanded) return;
    const popup = popupRef.current;
    const option = document.getElementById(`${listId}-${active}`);
    if (!popup || !option) return;
    // Scroll this surface only, retaining space around the focus outline.
    const top = option.offsetTop - 8;
    const bottom = option.offsetTop + option.offsetHeight + 8;
    if (top < popup.scrollTop) popup.scrollTop = top;
    else if (bottom > popup.scrollTop + popup.clientHeight) popup.scrollTop = bottom - popup.clientHeight;
  }, [active, expanded, listId, position.maxHeight]);

  function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape" && expanded) {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key === "Tab") {
      if (expanded) commit(active);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (expanded) commit(active);
      else show();
      return;
    }
    const index = enabled.findIndex((option) => option.value === active);
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!expanded) show();
      if (event.key === "Home") setActive(enabled[0]?.value ?? value);
      else if (event.key === "End") setActive(enabled.at(-1)?.value ?? value);
      else if (expanded) setActive(enabled[Math.max(0, Math.min(enabled.length - 1, index + (event.key === "ArrowDown" ? 1 : -1)))]?.value ?? value);
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase();
      const now = Date.now();
      const character = normalize(event.key);
      const previous = now - searchRef.current.time < 700 ? searchRef.current.text : "";
      const query = previous === character ? character : previous + character;
      searchRef.current = { text: query, time: now };
      const ordered = query.length === 1 ? [...enabled.slice(index + 1), ...enabled.slice(0, index + 1)] : enabled;
      const match = ordered.find((option) => normalize(option.label).startsWith(query));
      if (!expanded) setOpen(true);
      if (match) setActive(match.value);
    }
  }

  return (
    <>
      <button
        ref={triggerRef} id={controlId} className="dropdown-select__trigger" data-compact={compact}
        type="button" role="combobox" aria-label={label} aria-haspopup="listbox"
        aria-expanded={expanded} aria-controls={expanded ? listId : undefined}
        aria-activedescendant={expanded ? `${listId}-${active}` : undefined}
        disabled={disabled || enabled.length === 0}
        onClick={() => expanded ? setOpen(false) : show()} onKeyDown={handleKey}
        onFocus={event => setPortalTarget(event.currentTarget.closest("dialog"))}
        onBlur={() => setOpen(false)}
      >
        {selected?.mark ? <span className="dropdown-select__mark" aria-hidden="true">{selected.mark}</span> : null}
        <span className="dropdown-select__value" lang={selected?.lang}>{selected?.label ?? value}</span>
        <svg className="dropdown-select__chevron" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="m6 8 4 4 4-4" /></svg>
      </button>
      {expanded ? createPortal(
        <div ref={popupRef} className="dropdown-select__popup" style={position} onPointerDown={(event) => event.preventDefault()}>
          <p className="dropdown-select__heading">{label}</p>
          <ul className="dropdown-select__list" id={listId} role="listbox" aria-label={label}>
            {options.map((option) => (
              <li key={option.value} id={`${listId}-${option.value}`} role="option"
                className="dropdown-select__option" aria-selected={value === option.value}
                aria-disabled={option.disabled || undefined} data-active={active === option.value}
                onClick={() => !option.disabled && commit(option.value)}
              >
                {option.mark ? <span className="dropdown-select__mark" aria-hidden="true">{option.mark}</span> : null}
                <span className="dropdown-select__value" lang={option.lang}>{option.label}</span>
                <span className="dropdown-select__check" aria-hidden="true">{value === option.value ? "✓" : ""}</span>
              </li>
            ))}
          </ul>
          {hint ? <p className="dropdown-select__hint">{hint}</p> : null}
        </div>, portalTarget ?? document.body,
      ) : null}
    </>
  );
}
