@component('mail::message')
# Your new default Password.

<small>Recommended: To change your new default password to your own.</small>

@component('mail::button', ['url' => ''])
{{ $generatedRandomPassword }}
@endcomponent

Thanks,<br>
{{ env('MAIL_FROM_NAME') }}
@endcomponent