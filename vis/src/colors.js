
export const useThemeColors = () => {

    const background = getComputedStyle(document.body).getPropertyValue('--color-background');
    const foreground = getComputedStyle(document.body).getPropertyValue('--color-foreground');
    const primary = getComputedStyle(document.body).getPropertyValue('--primary');
    const accent = getComputedStyle(document.body).getPropertyValue('--accent');
    const paragraph = getComputedStyle(document.body).getPropertyValue('--paragraph');
    const theme1 = getComputedStyle(document.body).getPropertyValue('--theme-1');
    const theme2 = getComputedStyle(document.body).getPropertyValue('--theme-2');
    const theme3 = getComputedStyle(document.body).getPropertyValue('--theme-3');
    const theme4 = getComputedStyle(document.body).getPropertyValue('--theme-4');
    const theme5 = getComputedStyle(document.body).getPropertyValue('--theme-5');

    return {
        BACKGROUND: background,
        FOREGROUND: foreground,
        PRIMARY: primary,
        ACCENT: accent,
        PARAGRAPH: paragraph,
        THEME1: theme1,
        THEME2: theme2,
        THEME3: theme3,
        THEME4: theme4,
        THEME5: theme5,
    }

}