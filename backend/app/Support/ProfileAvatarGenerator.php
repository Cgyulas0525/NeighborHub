<?php

namespace App\Support;

use App\Models\Profile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class ProfileAvatarGenerator
{
    /** @var list<string> */
    private const STOCK_FILES = [
        'profiles/avatars/stock/man-1.png',
        'profiles/avatars/stock/woman-1.png',
        'profiles/avatars/stock/man-2.png',
    ];

    public static function assign(Profile $profile): string
    {
        $stock = self::pickStockPath($profile);
        $path = 'profiles/avatars/'.$profile->id.'.png';

        $contents = Storage::disk('public')->get($stock);
        Storage::disk('public')->put($path, $contents);
        $profile->update(['profile_image' => $path]);

        return $path;
    }

    public static function isGeneratedPath(?string $path): bool
    {
        return $path !== null && str_starts_with($path, 'profiles/avatars/');
    }

    public static function stockExists(): bool
    {
        foreach (self::STOCK_FILES as $file) {
            if (! Storage::disk('public')->exists($file)) {
                return false;
            }
        }

        return true;
    }

    public static function ensureStockAvatars(): void
    {
        $sourceDir = base_path('../frontend/public/avatars/stock');
        if (! is_dir($sourceDir)) {
            return;
        }

        foreach (glob($sourceDir.'/*.{png,jpg,webp}', GLOB_BRACE) ?: [] as $file) {
            $name = basename($file);
            $target = 'profiles/avatars/stock/'.$name;
            if (! Storage::disk('public')->exists($target)) {
                Storage::disk('public')->put($target, File::get($file));
            }
        }
    }

    private static function pickStockPath(Profile $profile): string
    {
        self::ensureStockAvatars();

        $available = array_values(array_filter(
            self::STOCK_FILES,
            fn (string $file) => Storage::disk('public')->exists($file),
        ));

        if ($available === []) {
            throw new \RuntimeException('Nincs elérhető alapértelmezett profilkép. Töltsd fel a stock avatárokat.');
        }

        $key = $profile->display_name ?: (string) $profile->id;
        $index = abs(crc32($key)) % count($available);

        return $available[$index];
    }
}
