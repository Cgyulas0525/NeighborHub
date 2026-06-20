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
            // Termék kategóriák
            ['name' => 'Zöldség és gyümölcs', 'type' => 'product'],
            ['name' => 'Méz, lekvár, dzsem', 'type' => 'product'],
            ['name' => 'Tejtermékek és sajtok', 'type' => 'product'],
            ['name' => 'Tojás és baromfi', 'type' => 'product'],
            ['name' => 'Hús és hentesáru', 'type' => 'product'],
            ['name' => 'Pékáru', 'type' => 'product'],
            ['name' => 'Sütemény és sütés', 'type' => 'product'],
            ['name' => 'Italok (bor, pálinka, limonádé)', 'type' => 'product'],
            ['name' => 'Házi konzerv és befőtt', 'type' => 'product'],
            ['name' => 'Növények és virágok', 'type' => 'product'],
            ['name' => 'Kézműves és ajándék', 'type' => 'product'],
            ['name' => 'Textil és hímzés', 'type' => 'product'],
            ['name' => 'Kozmetika és házi szappan', 'type' => 'product'],
            ['name' => 'Egyéb helyi termék', 'type' => 'product'],
            ['name' => 'Közösségi kérdések', 'type' => 'community'],
        ];

        foreach ($items as $item) {
            Category::query()->firstOrCreate(
                ['slug' => Str::slug($item['name'])],
                ['name' => $item['name'], 'type' => $item['type'], 'active' => true, 'approval_status' => 'approved'],
            );
        }

        Category::query()
            ->whereIn('slug', ['helyi-termekek', 'sutemeny-es-kezmuves'])
            ->update(['active' => false]);
    }
}
