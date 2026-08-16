export const THEME_COOKIE = "tc-theme";
export const themeValues = ["light", "dark", "system"] as const;
export type ThemeValue = (typeof themeValues)[number];

export function isThemeValue(value: string | undefined | null): value is ThemeValue {
  return value === "light" || value === "dark" || value === "system";
}

export const themeScript = `(function(){try{var k=${JSON.stringify(THEME_COOKIE)};var m=document.cookie.match(new RegExp("(?:^|; )"+k+"=([^;]*)"));var t=m?decodeURIComponent(m[1]):"system";var d=t==="dark"||(t!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;
