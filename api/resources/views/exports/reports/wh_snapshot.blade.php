@php
    $headerOneColSpan = 7;
    $headerTwoColSpan = 2;
    $captionColSpan = 11;

    if ($groupBy === 'batch'){
        $headerOneColSpan = 8;
        $headerTwoColSpan = 3;
        $captionColSpan = 13;
    }
    else if($groupBy === 'expiry'){
        $headerTwoColSpan = 3;
        $captionColSpan = 12;
    }
@endphp
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
            <th colspan={{$headerOneColSpan}}>{{ $customerName }}</th>
            <th>DATE:</th>
            <th colspan={{$headerTwoColSpan}}>{{ $dateNow }}</th>
        </tr>
        <tr>
            <th class="fontBold">Address</th>
            <th colspan={{$headerOneColSpan}}>{{ $address }}</th>
            <th>WHSE:</th>
            <th colspan={{$headerTwoColSpan}}>{{ $warehouseNo }}</th>
        </tr>
        <tr>
            <th class="fontBold">PHONE/FAX:</th>
            <th align="left" colspan={{$headerOneColSpan}}>{{ $phone }}</th>
            <th>TIME:</th>
            <th colspan={{$headerTwoColSpan}}>{{ $timeNow }}</th>
        </tr>
        <tr class="fontBold">
            <th align="center" colspan={{$captionColSpan}}>{{$caption}}</th>
        </tr>
    </thead>
    <thead>
        <tr>
            <th align="center">Material</th>
            <th align="center">Material</th>
            <th align="center">Fixed Weight</th>
            @if ($groupBy === 'batch')
                <th align="center">Batch / Lot</th>
                <th align="center">Expiry Date</th>
            @elseif ($groupBy === 'expiry')
                <th align="center">Expiry Date</th>
            @endif
            <th align="center" colspan="2">Allocated</th>
            <th align="center" colspan="2">Available</th>
            <th align="center" colspan="2">Restricted</th>
            <th align="center" colspan="2">Total</th>
        </tr>
        <tr>
            <th align="center">Code</th>
            <th align="center">Description</th>
            <th align="center">(KG/UNIT)</th>
            @if ($groupBy === 'batch')
                <th align="center"></th>
                <th align="center"></th>
            @elseif ($groupBy === 'expiry')
                <th align="center"></th>
            @endif
            <th align="center">Quantity</th>
            <th align="center">Weight (kg)</th>
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
        $subRestrictedQty = 0;
        $subRestrictedWt = 0;
        $subTotalQty = 0;
        $subTotalWt = 0;
        $rowTotalWt = 0;
        @endphp

        @if(count($stocks) > 0)
        @foreach($stocks as $inventory)
        <tr>

            <td>{{ $inventory['materialCode'] }}</td>
            <td>{{ $inventory['description'] }}</td>
            <td>{{ $inventory['fixedWt'] }}</td>
            @if ($groupBy === 'batch')
                <td>{{ $inventory['batch']}}</td>
                <td>{{ $inventory['expiry']}}</td>
            @elseif ($groupBy === 'expiry')
                <td>{{ $inventory['expiry']}}</td>
            @endif
            <td>{{ $rndAllocatedQty = $inventory['allocatedQty'] }}</td>
            <td>{{ $rndAllocatedWt = $inventory['allocatedWt'] }}</td>
            <td>{{ $rndAvailableQty = $inventory['availableQty'] }}</td>
            <td>{{ $rndAvailableWt = $inventory['availableWt'] }}</td>
            <td>{{ $rndrestrictedQty = $inventory['restrictedQty'] }}</td>
            <td>{{ $rndrestrictedWt = $inventory['restrictedWt'] }}</td>
            <td>{{ $rowTotalQty = $inventory['totalQty'] }}</td>
            <td>{{ $rowTotalWt = $rndAllocatedWt + $rndAvailableWt + $rndrestrictedWt }}
            </td>

            <!-- Sum up -->
            {{ $subAllocatedQty += $rndAllocatedQty }}
            {{ $subAllocatedWt += $rndAllocatedWt }}
            {{ $subAvailableQty += $rndAvailableQty }}
            {{ $subAvailableWt += $rndAvailableWt }}
            {{ $subRestrictedQty += $rndrestrictedQty }}
            {{ $subRestrictedWt += $rndrestrictedWt }}
            {{ $subTotalQty += $rowTotalQty }}
            {{ $subTotalWt += $rowTotalWt }}
        </tr>
        @endforeach
        <tr>
            <td></td>
            @if ($groupBy === 'batch')
                <td></td>
                <td colspan="3">TOTAL >>>>></td>
            @elseif ($groupBy === 'expiry')
                <td colspan="3">TOTAL >>>>></td>
            @else
                <td colspan="2">TOTAL >>>>></td>
            @endif
            <td>{{ $subAllocatedQty }}</td>
            <td>{{ $subAllocatedWt }}</td>
            <td>{{ $subAvailableQty }}</td>
            <td>{{ $subAvailableWt }}</td>
            <td>{{ $subRestrictedQty }}</td>
            <td>{{ $subRestrictedWt }}</td>
            <td>{{ $subTotalQty }}</td>
            <td>{{ $subTotalWt }}</td>
        </tr>
        @endif
    </tbody>
</table>