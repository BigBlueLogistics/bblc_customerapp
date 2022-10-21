<table>
    <thead>
        <!-- Empty cell for embedding image logo -->
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <tr></tr>
        <!-- Appending data begin on cell A5 -->
        <tr>
            <th>Customer</th>
            <th colspan="3">FGVIRGIN</th>
            <th colspan="2"></th>
            <th>DATE:</th>
            <th colspan="2">{{ $dateNow }}</th>
        </tr>
        <tr>
            <th class="fontBold">Address</th>
            <th colspan="3">Tayud Consolaction</th>
            <th colspan="2"></th>
            <th>WHSE:</th>
            <th colspan="2">{{ $warehouseNo }}</th>
        </tr>
        <tr>
            <th class="fontBold">PHONE/FAX:</th>
            <th align="left" colspan="3">22222</th>
            <th colspan="2"></th>
            <th>TIME:</th>
            <th colspan="2">{{ $timeNow }}</th>
        </tr>
        <tr class="fontBold">
            <th align="center" colspan="9">WAREHOUSE STOCKS - SUMMARY</th>
        </tr>
    </thead>
    <thead>
        <tr>
            <th align="center">Matrial</th>
            <th align="center">Material</th>
            <th align="center">Fixed Weight</th>
            <th align="center" colspan="2">Allocated</th>
            <th align="center" colspan="2">Available</th>
            <th align="center" colspan="2">Total</th>
        </tr>
        <tr>
            <th align="center">Code</th>
            <th align="center">Description</th>
            <th align="center">(KG/UNIT)</th>
            <th align="center">Quantity</th>
            <th align="center">Weight (kg)</th>
            <th align="center">Quantity</th>
            <th align="center">Weight (kg)</th>
            <th align="center">Quantity</th>
            <th align="center">Weight (kg)</th>
        </tr>
    </thead>
    <tbody>
        @php
        $subAllocatedQty = 0;
        $subAllocatedWt = 0;
        $subAvailableQty = 0;
        $subAvailableWt = 0;
        $subTotalQty = 0;
        $subTotalWt = 0;
        @endphp

        @if(count($stocks) > 0)
        @foreach($stocks as $inventory)
        <tr>
            <td>{{ $inventory['materialCode'] }}</td>
            <td>{{ $inventory['description'] }}</td>
            <td>{{ $inventory['fixedWt'] ?? 0 }} / {{ $inventory['unit'] ?? 0}}</td>
            <td>{{ $inventory['allocatedQty'] }}</td>
            <td>{{ $inventory['allocatedWt'] }}</td>
            <td>{{ $inventory['availableQty'] }}</td>
            <td>{{ $inventory['availableWt'] }}</td>
            <td>{{ $inventory['availableQty'] + $inventory['allocatedQty'] }}</td>
            <td>{{ $inventory['availableWt'] + $inventory['allocatedWt'] }}</td>

            <!-- Sum up -->
            {{ $subAllocatedQty += $inventory['allocatedQty'] }}
            {{ $subAllocatedWt += $inventory['allocatedWt'] }}
            {{ $subAvailableQty += $inventory['availableQty'] }}
            {{ $subAvailableWt += $inventory['availableWt'] }}
            {{ $subTotalQty += $inventory['availableWt'] }}
            {{ $subTotalWt += $inventory['availableWt'] }}
        </tr>
        @endforeach
        <tr>
            <td></td>
            <td colspan="2">TOTAL >>>>></td>
            <td>{{ $subAllocatedQty }}</td>
            <td>{{ $subAllocatedWt }}</td>
            <td>{{ $subAvailableQty }}</td>
            <td>{{ $subAvailableWt }}</td>
            <td>{{ $subTotalQty }}</td>
            <td>{{ $subTotalWt }}</td>
        </tr>
        @endif
    </tbody>
</table>