<?php

namespace App\Support;

use App\Enums\RoomDifficulty;

/**
 * Generates an on-brand placeholder cover image for a room that has no
 * uploaded photo yet. Rendered as SVG so it needs no image extension or
 * external assets, and stays legible at any size.
 */
class RoomPlaceholderImage
{
    private const BACKGROUND = '#16140F';

    private const PANEL = '#201C15';

    private const PAPER = '#EFE7D8';

    /**
     * @return array<string, string>
     */
    private static function accents(): array
    {
        return [
            RoomDifficulty::Easy->value => '#6E7681',
            RoomDifficulty::Moderate->value => '#C69A3E',
            RoomDifficulty::Hard->value => '#A8432B',
            RoomDifficulty::Extreme->value => '#7A2020',
        ];
    }

    /**
     * Build the SVG markup for a room's placeholder cover image.
     */
    public static function svg(string $name, RoomDifficulty $difficulty): string
    {
        $background = self::BACKGROUND;
        $panel = self::PANEL;
        $paper = self::PAPER;
        $accent = self::accents()[$difficulty->value];
        $label = htmlspecialchars($name, ENT_QUOTES);
        $difficultyLabel = htmlspecialchars(ucfirst($difficulty->value), ENT_QUOTES);

        // Deterministic-but-varied tick count so rooms don't look identical.
        $tickCount = 18 + (crc32($name) % 10);
        $ticks = self::ticks($accent, $tickCount);

        return <<<SVG
        <svg viewBox="0 0 800 450" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="450" fill="{$background}" />
            <rect width="800" height="450" fill="url(#panelFade)" />
            <defs>
                <linearGradient id="panelFade" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="{$panel}" stop-opacity="0.6" />
                    <stop offset="100%" stop-color="{$background}" stop-opacity="0" />
                </linearGradient>
            </defs>
            <g transform="translate(620, 130)" opacity="0.9">
                {$ticks}
                <circle cx="0" cy="0" r="70" fill="none" stroke="{$accent}" stroke-width="2" />
            </g>
            <text x="48" y="360" fill="{$paper}" font-family="'Space Grotesk', 'Segoe UI', Arial, sans-serif" font-size="40" font-weight="600">{$label}</text>
            <text x="48" y="392" fill="{$accent}" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="18">{$difficultyLabel}</text>
            <rect x="48" y="410" width="48" height="3" fill="{$accent}" />
        </svg>
        SVG;
    }

    /**
     * Build the ring of tick marks used in the corner motif.
     */
    private static function ticks(string $accent, int $count): string
    {
        $marks = [];

        for ($i = 0; $i < $count; $i++) {
            $angle = ($i / $count) * 2 * M_PI;
            $long = $i % 6 === 0;
            $outer = 90;
            $inner = $long ? 78 : 84;

            $x1 = round($outer * sin($angle), 2);
            $y1 = round(-$outer * cos($angle), 2);
            $x2 = round($inner * sin($angle), 2);
            $y2 = round(-$inner * cos($angle), 2);

            $opacity = $long ? 0.8 : 0.4;

            $marks[] = sprintf(
                '<line x1="%s" y1="%s" x2="%s" y2="%s" stroke="%s" stroke-opacity="%s" stroke-width="%s" />',
                $x1,
                $y1,
                $x2,
                $y2,
                $accent,
                $opacity,
                $long ? 2 : 1
            );
        }

        return implode('', $marks);
    }
}
