# BigBlue Customer Portal API

is an exclusive online services available to all clients of the company. These services enable clients to get realtime inventory, generate reports and conduct simple analytics for materials stored at any of company facilities anytime, anywhere.

## System Requirements

1. Ubuntu OS 20.04/18.4/16.04 or Windows using WSL2
2. Required [PHP version 7.2+](https://www.rosehosting.com/blog/how-to-install-php-7-2-on-ubuntu-16-04/) and apache2 and install common modules of php version.
3. Download and Install Composer from [Composer Official Page](https://getcomposer.org/).
4. Navigate to the root ./ directory of the poject and run `composer install` to install our local dependencies.
5. Download and Install MSSQL for database from [Microsoft SQL Server for Linux](https://docs.microsoft.com/en-us/sql/linux/quickstart-install-connect-ubuntu?view=sql-server-ver15)
6. Download and Install [PHP drivers PHP_PDO_SQLSRV and PDO_SQLSRV](https://serverok.in/install-php-drivers-for-microsoft-sql-server-on-ubuntu-php-7-2) to able php connect to MSSQL
7. Download and Install SAP NW RFC 7.50 driver and PHP7_SAPNWRFC driver. \
   [LINK 2](https://blog.csdn.net/daily886/article/details/90051167) \
    or \
   [LINK 1](https://www.silviogarbes.com.br/dicas/php/modulo-sap-nw-rfc-7-50-ou-sap-nw-rfc-7-20-no-php-7-2-em-um-redhat-7-7)

## Run Locally

Clone the project

```bash
  git clone https://github.com/bigbluelc/bblc_customerapi.git
```

Go to the project directory

```bash
  cd bblc_customerapi
```

Install dependencies

```bash
  composer install
```

Run the app in development mode. \
Open http://127.0.0.1:8000 to view it in your browser.

```bash
  php artisan serve
```

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
