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
            <th align="center" colspan="11">MOVEMENTS - SUMMARY</th>
        </tr>
    </thead>
    <thead>
        <tr>
            <th align="center">Date</th>
            <th align="center">Document No.</th>
            <th align="center">Type</th>
            <th align="center">Description</th>
            <th align="center">Batch</th>
            <th align="center">Expiration</th>
            <th align="center">Quantity</th>
            <th align="center">Unit</th>
            <th align="center">Weight</th>
            <th align="center">Reference</th>
            <th align="center">Header text</th>
        </tr>
    </thead>
    <tbody>
        @if(count($movementsData) > 0)
            @foreach($movementsData as $movement)
            <tr>
                <td>{{ $movement['date'] }}</td>
                <td>{{ $movement['documentNo'] }}</td>
                <td>{{ $movement['movementType'] }}</td>
                <td>{{ $movement['description'] }}</td>
                <td>{{ $movement['batch'] }}</td>
                <td>{{ $movement['expiration'] }}</td>
                <td>{{ $movement['quantity'] }}</td>
                <td>{{ $movement['unit'] }}</td>
                <td>{{ $movement['weight'] }}</td>
                <td>{{ $movement['reference']}}</td>
                <td>{{ $movement['headerText']}}</td>
            </tr>
            @endforeach
        @endif
    </tbody>
</table>