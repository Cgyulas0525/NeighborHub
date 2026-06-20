<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CitySeeder::class,
            CategorySeeder::class,
            SkillSeeder::class,
        ]);

        User::query()->firstOrCreate(
            ['email' => 'admin@neighborhub.local'],
            [
                'name' => 'NeighborHub Admin',
                'password' => 'password',
                'role' => 'admin',
                'status' => 'active',
            ],
        );
    }
}
