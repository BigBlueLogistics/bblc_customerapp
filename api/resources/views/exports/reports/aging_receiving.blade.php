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
            <th colspan="3">{{ $customerName }}</th>
            <th colspan="2"></th>
            <th>DATE:</th>
            <th colspan="2">{{ $dateNow }}</th>
        </tr>
        <tr>
            <th class="fontBold">Address</th>
            <th colspan="3">{{ $address }}</th>
            <th colspan="2"></th>
            <th>WHSE:</th>
            <th colspan="2">{{ $warehouseNo }}</th>
        </tr>
        <tr>
            <th class="fontBold">PHONE/FAX:</th>
            <th align="left" colspan="3">{{ $phone }}</th>
            <th colspan="2"></th>
            <th>TIME:</th>
            <th colspan="2">{{ $timeNow }}</th>
        </tr>
        <tr class="fontBold">
            <th align="center" colspan="11">{{$caption}}</th>
        </tr>
    </thead>
    <thead>
        <tr>
            <th align="center">Matrial</th>
            <th align="center">Material</th>
            <th align="center">Fixed Weight</th>
            <th align="center">More than</th>
            <th align="center">More than</th>
            <th align="center">More than</th>
            <th align="center">More than</th>
            <th align="center">More than</th>
            <th align="center">Receipts now</th>
            <th align="center">Total</th>
        </tr>
        <tr>
            <th align="center">Code</th>
            <th align="center">Description</th>
            <th align="center">(KG/UNIT)</th>
            <th align="center">120 Days</th>
            <th align="center">60 Days</th>
            <th align="center">30 Days</th>
            <th align="center">15 Days</th>
            <th align="center">1 Day</th>
            <th align="center"></th>
            <th align="center">Quantity</th>
        </tr>
    </thead>
    <tbody>
        @php
        $subQtyExp120 = 0;
        $subQtyExp60 = 0;
        $subQtyExp30 = 0;
        $subQtyExp15 = 0;
        $subQtyExp0 = 0;
        $subQtyExpired = 0;
        $subTotalQty = 0;
        @endphp

        @if(count($stocks) > 0)
        @foreach($stocks as $inventory)
        <tr>

            <td>{{ $inventory['materialCode'] }}</td>
            <td>{{ $inventory['description'] }}</td>
            <td>{{ $inventory['fixedWt'] }} / {{ $inventory['unit'] }}</td>
            <td>{{ $rndQtyExp120 = $inventory['qty_exp_120'] }}</td>
            <td>{{ $rndQtyExp60 = $inventory['qty_exp_60'] }}</td>
            <td>{{ $rndQtyExp30 = $inventory['qty_exp_30'] }}</td>
            <td>{{ $rndQtyExp15 = $inventory['qty_exp_15'] }}</td>
            <td>{{ $rndQtyExp0  = $inventory['qty_exp_0'] }}</td>
            <td>{{ $rndQtyExpired = $inventory['qty_expired'] }}</td>
            <td>{{ $rowTotalQty = $inventory['totalQty'] }}</td>

            <!-- Sum up -->
            {{ $subQtyExp120 += $rndQtyExp120 }}
            {{ $subQtyExp60 += $rndQtyExp60 }}
            {{ $subQtyExp30 += $rndQtyExp30 }}
            {{ $subQtyExp15 += $rndQtyExp15 }}
            {{ $subQtyExp0 += $rndQtyExp0 }}
            {{ $subQtyExpired += $rndQtyExpired }}
            {{ $subTotalQty += $rowTotalQty }}
        </tr>
        @endforeach
        <tr>
            <td></td>
            <td colspan="2">TOTAL >>>>></td>
            <td>{{ $subQtyExp120 }}</td>
            <td>{{ $subQtyExp60 }}</td>
            <td>{{ $subQtyExp30 }}</td>
            <td>{{ $subQtyExp15 }}</td>
            <td>{{ $subQtyExp0 }}</td>
            <td>{{ $subQtyExpired }}</td>
            <td>{{ $subTotalQty }}</td>
        </tr>
        @endif
    </tbody>
</table>