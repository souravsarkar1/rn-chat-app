export const appTheme = {
    // Core Colors
    colors: {
        primary: {
            main: '#2563EB', // Accessible blue
            light: '#60A5FA',
            dark: '#1E40AF',
            contrast: '#FFFFFF'
        },
        secondary: {
            main: '#4B5563', // Sophisticated gray
            light: '#9CA3AF',
            dark: '#374151',
            contrast: '#FFFFFF'
        },
        accent: {
            main: '#10B981', // Modern green
            light: '#34D399',
            dark: '#059669',
            contrast: '#FFFFFF'
        },
        background: {
            primary: '#FFFFFF',
            secondary: '#F3F4F6',
            tertiary: '#E5E7EB'
        },
        text: {
            primary: '#1F2937',
            secondary: '#4B5563',
            disabled: '#9CA3AF',
            inverse: '#FFFFFF'
        },
        status: {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        },
        border: {
            light: '#E5E7EB',
            medium: '#D1D5DB',
            dark: '#9CA3AF'
        }
    },

    // Typography
    typography: {
        fontFamily: {
            primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            secondary: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif'
        },
        fontSize: {
            xs: 12,
            sm: 14,
            md: 16,
            lg: 18,
            xl: 20,
            '2xl': 24,
            '3xl': 30,
            '4xl': 36
        },
        fontWeight: {
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700'
        },
        lineHeight: {
            tight: 1.25,
            normal: 1.5,
            relaxed: 1.75
        }
    },

    // Spacing
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        '2xl': 48,
        '3xl': 64
    },

    // Border Radius
    borderRadius: {
        none: 0,
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999
    },

    // Shadows
    shadows: {
        none: 'none',
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
    },

    // Animation
    animation: {
        duration: {
            fast: '150ms',
            normal: '300ms',
            slow: '500ms'
        },
        easing: {
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
    }
};