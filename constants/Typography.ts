/**
 * Breathe App Design System - Typography
 * Consistent type scale and styles.
 */

import { TextStyle } from 'react-native';

type TypographyVariant =
    | 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
    | 'bodyLarge' | 'bodyRegular' | 'bodyBold'
    | 'caption' | 'small'
    | 'button' | 'label';

export const Typography: Record<TypographyVariant, TextStyle> = {
    // Headings
    h1: {
        fontSize: 32,
        fontWeight: '700',
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 28,
        fontWeight: '700',
        lineHeight: 36,
        letterSpacing: -0.25,
    },
    h3: {
        fontSize: 24,
        fontWeight: '600',
        lineHeight: 32,
        letterSpacing: 0,
    },
    h4: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
        letterSpacing: 0.15,
    },
    h5: {
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 26,
        letterSpacing: 0.15,
    },

    // Body
    bodyLarge: {
        fontSize: 18,
        fontWeight: '400',
        lineHeight: 28,
        letterSpacing: 0.5,
    },
    bodyRegular: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
        letterSpacing: 0.5,
    },
    bodyBold: {
        fontSize: 16,
        fontWeight: '700',
        lineHeight: 24,
        letterSpacing: 0.5,
    },

    // Metadata & Small Text
    caption: {
        fontSize: 14,
        fontWeight: '400',
        lineHeight: 20,
        letterSpacing: 0.4,
    },
    small: {
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 16,
        letterSpacing: 0.4,
    },

    // UI Elements
    button: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        letterSpacing: 1.25,
        textTransform: 'uppercase',
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        lineHeight: 16,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
};

export default Typography;
