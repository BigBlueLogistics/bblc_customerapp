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
            <th colspan="8">{{ $customerName }}</th>
            <th>DATE:</th>
            <th colspan="3">{{ $dateNow }}</th>
        </tr>
        <tr>
            <th class="fontBold">Address</th>
            <th colspan="8">{{ $address }}</th>
            <th>WHSE:</th>
            <th colspan="3">{{ $warehouseNo }}</th>
        </tr>
        <tr>
            <th class="fontBold">PHONE/FAX:</th>
            <th align="left" colspan="8">{{ $phone }}</th>
            <th>TIME:</th>
            <th colspan="3">{{ $timeNow }}</th>
        </tr>
        <tr class="fontBold">
            <th align="center" colspan="14">MOVEMENTS - SUMMARY</th>
        </tr>
    </thead>
    <thead>
        <tr>
            <th align="center">Warehouse</th>
            <th align="center">Date</th>
            <th align="center">Type</th>
            <th align="center">Document No.</th>
            <th align="center">Material code</th>
            <th align="center">Description</th>
            <th align="center">Batch</th>
            <th align="center">Expiration</th>
            <th align="center">Quantity</th>
            <th align="center">Unit</th>
            <th align="center">Weight</th>
            <th align="center">Reference</th>
            <th align="center">Header text</th>
            <th align="center">Vehicle</th>
        </tr>
    </thead>
    <tbody>
        @if(count($movementsData) > 0)
            @foreach($movementsData as $movement)
            <tr>
                <td>{{ $movement['warehouse'] }}</td>
                <td>{{ $movement['date'] }}</td>
                <td>{{ $movement['movementType'] }}</td>
                <td>{{ $movement['documentNo'] }}</td>
                <td>{{ $movement['materialCode'] }}</td>
                <td>{{ $movement['description'] }}</td>
                <td>{{ $movement['batch'] }}</td>
                <td>{{ $movement['expiration'] }}</td>
                <td>{{ $movement['quantity'] }}</td>
                <td>{{ $movement['unit'] }}</td>
                <td>{{ $movement['weight'] }}</td>
                <td>{{ $movement['reference'] ?? ""}}</td>
                <td>{{ $movement['headerText'] ?? ""}}</td>
                <td>{{ $movement['vehicle'] ?? ""}}</td>
            </tr>
            @endforeach
        @endif
    </tbody>
</table>