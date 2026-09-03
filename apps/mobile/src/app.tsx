import { SUPPORTED_LOCALES, type SupportedLocale } from "@suq-insights/shared-types";
import { designTokens } from "@suq-insights/design-tokens";
import { StatusBar } from "expo-status-bar";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import "./i18n";

const languageNames: Record<SupportedLocale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

export default function App() {
  const { i18n, t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.brandRow}>
          <View style={styles.mark} accessibilityElementsHidden>
            <Text style={styles.markText}>S</Text>
          </View>
          <Text style={styles.brand}>Suq Insights</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.eyebrow}>{t("foundation.eyebrow")}</Text>
          <Text accessibilityRole="header" style={styles.title}>
            {t("foundation.title")}
          </Text>
          <Text style={styles.body}>{t("foundation.body")}</Text>
        </View>

        <View accessibilityLabel={t("language.label")} style={styles.languages}>
          {SUPPORTED_LOCALES.map((locale) => {
            const isActive = i18n.resolvedLanguage === locale;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                key={locale}
                onPress={() => void i18n.changeLanguage(locale)}
                style={[styles.languageButton, isActive && styles.languageButtonActive]}
              >
                <Text style={styles.languageText}>{languageNames[locale]}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: designTokens.color.paper,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: designTokens.space[6],
  },
  brandRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: designTokens.space[3],
  },
  mark: {
    alignItems: "center",
    backgroundColor: designTokens.color.ink,
    borderRadius: designTokens.radius.control,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  markText: {
    color: designTokens.color.white,
    fontSize: 16,
    fontWeight: "800",
  },
  brand: {
    color: designTokens.color.ink,
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    gap: designTokens.space[4],
  },
  eyebrow: {
    alignSelf: "flex-start",
    backgroundColor: designTokens.color.lime,
    borderRadius: designTokens.radius.panel,
    color: designTokens.color.ink,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    overflow: "hidden",
    paddingHorizontal: designTokens.space[3],
    paddingVertical: designTokens.space[2],
    textTransform: "uppercase",
  },
  title: {
    color: designTokens.color.ink,
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1.5,
    lineHeight: 46,
  },
  body: {
    color: designTokens.color.slate,
    fontSize: 18,
    lineHeight: 27,
  },
  languages: {
    flexDirection: "row",
    gap: designTokens.space[2],
  },
  languageButton: {
    alignItems: "center",
    borderColor: designTokens.color.line,
    borderRadius: designTokens.radius.panel,
    borderWidth: 1,
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: designTokens.space[2],
  },
  languageButtonActive: {
    backgroundColor: designTokens.color.lime,
    borderColor: designTokens.color.lime,
  },
  languageText: {
    color: designTokens.color.ink,
    fontSize: 13,
    fontWeight: "600",
  },
});
