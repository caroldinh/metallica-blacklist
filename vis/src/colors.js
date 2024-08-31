
export const useThemeColors = () => {

    const background = getComputedStyle(document.body).getPropertyValue('--color-background');
    const foreground = getComputedStyle(document.body).getPropertyValue('--color-foreground');
    const primary = getComputedStyle(document.body).getPropertyValue('--primary');
    const accent = getComputedStyle(document.body).getPropertyValue('--accent');

    return {
        BACKGROUND: background,
        FOREGROUND: foreground,
        PRIMARY: primary,
        ACCENT: accent,
    }

}