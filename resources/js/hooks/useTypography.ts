import { useEffect, useState } from 'react';

interface FontSettings {
    bangla: {
        font_family: string;
        font_size: string;
        font_weight: string;
        color: string;
        line_height: string;
        letter_spacing: string;
    };
    english: {
        font_family: string;
        font_size: string;
        font_weight: string;
        color: string;
        line_height: string;
        letter_spacing: string;
    };
}

// Detect if text contains Bengali characters
const isBengali = (text: string): boolean => {
    const bengaliRange = /[\u0980-\u09FF]/;
    return bengaliRange.test(text);
};

// Get language from text
const getLanguage = (text: string): 'bangla' | 'english' => {
    return isBengali(text) ? 'bangla' : 'english';
};

export const useTypography = (settings: FontSettings) => {
    const [currentLanguage, setCurrentLanguage] = useState<'bangla' | 'english'>('english');

    // Apply typography settings to document
    useEffect(() => {
        if (!settings) return;

        const applyTypography = () => {
            const root = document.documentElement;
            
            // Set CSS variables for both languages
            root.style.setProperty('--font-bangla-family', settings.bangla.font_family);
            root.style.setProperty('--font-bangla-size', settings.bangla.font_size);
            root.style.setProperty('--font-bangla-weight', settings.bangla.font_weight);
            root.style.setProperty('--font-bangla-color', settings.bangla.color);
            root.style.setProperty('--font-bangla-line-height', settings.bangla.line_height);
            root.style.setProperty('--font-bangla-letter-spacing', settings.bangla.letter_spacing);
            
            root.style.setProperty('--font-english-family', settings.english.font_family);
            root.style.setProperty('--font-english-size', settings.english.font_size);
            root.style.setProperty('--font-english-weight', settings.english.font_weight);
            root.style.setProperty('--font-english-color', settings.english.color);
            root.style.setProperty('--font-english-line-height', settings.english.line_height);
            root.style.setProperty('--font-english-letter-spacing', settings.english.letter_spacing);
        };

        applyTypography();

        // Cleanup
        return () => {
            const root = document.documentElement;
            root.style.removeProperty('--font-bangla-family');
            root.style.removeProperty('--font-bangla-size');
            root.style.removeProperty('--font-bangla-weight');
            root.style.removeProperty('--font-bangla-color');
            root.style.removeProperty('--font-bangla-line-height');
            root.style.removeProperty('--font-bangla-letter-spacing');
            root.style.removeProperty('--font-english-family');
            root.style.removeProperty('--font-english-size');
            root.style.removeProperty('--font-english-weight');
            root.style.removeProperty('--font-english-color');
            root.style.removeProperty('--font-english-line-height');
            root.style.removeProperty('--font-english-letter-spacing');
        };
    }, [settings]);

    // Get typography styles for a specific language
    const getTypographyStyles = (language: 'bangla' | 'english') => {
        const langSettings = settings[language];
        return {
            fontFamily: langSettings.font_family,
            fontSize: langSettings.font_size,
            fontWeight: parseInt(langSettings.font_weight),
            color: langSettings.color,
            lineHeight: langSettings.line_height,
            letterSpacing: langSettings.letter_spacing,
        };
    };

    // Auto-detect language and apply styles
    const applyAutoTypography = (text: string) => {
        const language = getLanguage(text);
        setCurrentLanguage(language);
        return getTypographyStyles(language);
    };

    return {
        currentLanguage,
        getTypographyStyles,
        applyAutoTypography,
        isBengali,
        getLanguage,
    };
};

// Custom hook for individual element typography
export const useElementTypography = (settings: FontSettings, text: string) => {
    const language = getLanguage(text);
    const styles = useTypography(settings).getTypographyStyles(language);

    return { language, styles };
};
