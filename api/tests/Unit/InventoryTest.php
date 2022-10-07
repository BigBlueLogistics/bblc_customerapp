<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Repository\InventoryRepository;

class InventoryTest extends TestCase
{
    /**
     * A basic unit test example.
     *
     * @return void
     */
    public function test_stocks_inventory_repo()
    {
        $stocks = new InventoryRepository();

        $actual = $stocks->getStocksInventory('FGVIRGIN', 'WH05');

        $this->assertJson(json_encode($actual));
    }
}
