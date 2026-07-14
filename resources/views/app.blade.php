<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }

            :root {
                --primary: {{ $colors['primary'] ?? '#10b981' }};
                --primary-foreground: #ffffff;
                --ring: {{ $colors['primary'] ?? '#10b981' }};
                --sidebar-primary: {{ $colors['primary'] ?? '#10b981' }};
                --sidebar-primary-foreground: #ffffff;
                --sidebar-ring: {{ $colors['primary'] ?? '#10b981' }};
                --chart-1: {{ $colors['primary'] ?? '#10b981' }};
                --chart-4: {{ $colors['primary'] ?? '#10b981' }};
                --secondary: {{ $colors['secondary'] ?? '#d946ef' }};
                --secondary-foreground: #111111;
                --accent: {{ $colors['secondary'] ?? '#d946ef' }};
                --accent-foreground: #111111;
                --chart-2: {{ $colors['secondary'] ?? '#d946ef' }};
                --chart-5: {{ $colors['secondary'] ?? '#d946ef' }};
            }
        </style>

        <link rel="icon" href="{{ $settings['favicon'] ?? '/favicon.ico' }}" sizes="any">
        <link rel="icon" href="{{ $settings['favicon_svg'] ?? '/favicon.svg' }}" type="image/svg+xml">
        <link rel="apple-touch-icon" href="{{ $settings['apple_touch_icon'] ?? '/apple-touch-icon.png' }}">

        {{-- Google Fonts for Bangla and English --}}
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@400;500;600;700&family=Galada:wght@400;700&family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&family=Tiro+Bangla:ital@0;1&display=swap" rel="stylesheet">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
