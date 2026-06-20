<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Skill;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $map = [
            'viz-gaz-futesszereles' => [
                'vízvezeték-szerelő', 'gázszerelő', 'fűtésszerelő', 'duguláselhárítás',
            ],
            'villanyszereles' => ['villanyszerelő'],
            'autoszereles' => ['autószerelő'],
            'egeszseg-es-wellness' => ['gyógytornász', 'masszőr'],
            'kert-es-haz' => ['kertész'],
            'asztalos-burkolo-festo' => ['asztalos', 'burkoló', 'festő'],
            'uzleti-szolgaltatasok' => ['könyvelő', 'ügyvéd'],
            'it-es-design' => ['grafikus', 'webfejlesztő'],
            'sutemeny-es-kezmives' => ['házi sütemény készítő', 'kézműves'],
            'helyi-termekek' => ['helyi termelő'],
        ];

        foreach ($map as $categorySlug => $skills) {
            $category = Category::query()->where('slug', $categorySlug)->first();
            foreach ($skills as $name) {
                Skill::query()->firstOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name, 'category_id' => $category?->id, 'active' => true],
                );
            }
        }
    }
}
