<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            ['name' => 'Víz-, gáz-, fűtésszerelés', 'type' => 'service'],
            ['name' => 'Villanyszerelés', 'type' => 'service'],
            ['name' => 'Autószerelés', 'type' => 'service'],
            ['name' => 'Egészség és wellness', 'type' => 'service'],
            ['name' => 'Kert és ház', 'type' => 'service'],
            ['name' => 'Asztalos, burkoló, festő', 'type' => 'service'],
            ['name' => 'Üzleti szolgáltatások', 'type' => 'service'],
            ['name' => 'IT és design', 'type' => 'service'],
            ['name' => 'Helyi termékek', 'type' => 'product'],
            ['name' => 'Sütemény és kézműves', 'type' => 'product'],
            ['name' => 'Közösségi kérdések', 'type' => 'community'],
        ];

        foreach ($items as $item) {
            Category::query()->firstOrCreate(
                ['slug' => Str::slug($item['name'])],
                ['name' => $item['name'], 'type' => $item['type'], 'active' => true],
            );
        }
    }
}
