<?php

namespace App\Console\Commands;

use App\Models\Profile;
use App\Support\ProfileAvatarGenerator;
use Illuminate\Console\Command;

class GenerateMissingProfileAvatarsCommand extends Command
{
    protected $signature = 'profiles:generate-avatars {--force : Regenerálja a korábban generált avatárokat is}';

    protected $description = 'Illusztrált alapértelmezett profilkép a kép nélküli profiloknak';

    public function handle(): int
    {
        $query = Profile::query()->orderBy('id');

        if (! $this->option('force')) {
            $query->where(function ($q) {
                $q->whereNull('profile_image')->orWhere('profile_image', '');
            });
        } else {
            $query->where(function ($q) {
                $q->whereNull('profile_image')
                    ->orWhere('profile_image', '')
                    ->orWhere('profile_image', 'like', 'profiles/avatars/%');
            });
        }

        $count = 0;
        $query->chunkById(100, function ($profiles) use (&$count) {
            foreach ($profiles as $profile) {
                if ($this->option('force') && $profile->profile_image && ! ProfileAvatarGenerator::isGeneratedPath($profile->profile_image)) {
                    continue;
                }
                ProfileAvatarGenerator::assign($profile);
                $count++;
                $this->line("  #{$profile->id} {$profile->display_name}");
            }
        });

        $this->info("Kész: {$count} profilkép generálva.");

        return self::SUCCESS;
    }
}
