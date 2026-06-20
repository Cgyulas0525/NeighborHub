<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            ['name' => 'Vác', 'county' => 'Pest', 'postal_code' => '2600'],
            ['name' => 'Sződ', 'county' => 'Pest', 'postal_code' => '2134'],
            ['name' => 'Sződliget', 'county' => 'Pest', 'postal_code' => '2133'],
            ['name' => 'Verőce', 'county' => 'Pest', 'postal_code' => '2621'],
            ['name' => 'Kismaros', 'county' => 'Pest', 'postal_code' => '2623'],
            ['name' => 'Nagymaros', 'county' => 'Pest', 'postal_code' => '2626'],
            ['name' => 'Göd', 'county' => 'Pest', 'postal_code' => '2131'],
            ['name' => 'Dunakeszi', 'county' => 'Pest', 'postal_code' => '2120'],
            ['name' => 'Kosd', 'county' => 'Pest', 'postal_code' => '2612'],
            ['name' => 'Rád', 'county' => 'Pest', 'postal_code' => '2613'],
            ['name' => 'Őrbottyán', 'county' => 'Pest', 'postal_code' => '2162'],
            ['name' => 'Vácduka', 'county' => 'Pest', 'postal_code' => '2167'],
            ['name' => 'Váchartyán', 'county' => 'Pest', 'postal_code' => '2167'],
        ];

        foreach ($cities as $city) {
            City::query()->firstOrCreate(
                ['name' => $city['name']],
                [...$city, 'active' => true],
            );
        }
    }
}
