FROM debian:bullseye-slim as main

ARG ROOT_APP_DIR=/var/www/html

RUN groupadd --gid 1000 bblc \
  && useradd --uid 1000 --gid bblc --shell /bin/bash --create-home bblc

RUN apt update && apt upgrade -y && \
    apt install software-properties-common apt-transport-https -y

# Update OS packages and install required deps.
# https://github.com/silencesys/docker-php-oci8/blob/a9997b9a95d69fbe541878c636724bf27696b857/Dockerfile#L16
RUN apt update && apt install -y --no-install-recommends \
      gnupg2 \
      curl \
      git \
      libmemcached-dev \
      libz-dev \
      libpq-dev \
      libjpeg-dev \
      libpng-dev \
      libfreetype6-dev \
      libssl-dev \
      libmcrypt-dev \
      zip \
      unzip \
      build-essential \
      libaio1 \
      libzip-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && rm /var/log/lastlog /var/log/faillog

# dependencies required for running "phpize"
# https://github.com/docker-library/php/blob/2af934c6dd18d0ccbacb2cd8efb8f0b6f81be5b2/8.1/bullseye/apache/Dockerfile#L20
ENV PHPIZE_DEPS \
		autoconf \
		dpkg-dev \
		file \
		g++ \
		gcc \
		libc-dev \
		make \
		pkg-config \
		re2c \
        libtool \
        bison

# persistent / runtime deps
RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		$PHPIZE_DEPS \
		ca-certificates \
		curl \
		xz-utils \
	; \
	rm -rf /var/lib/apt/lists/*

# Add the PPA PHP and Apache2
RUN curl -sSL https://packages.sury.org/php/README.txt | bash -x && \
    curl -sSL https://packages.sury.org/apache2/README.txt | bash -x

RUN apt update && apt upgrade -y && \
    apt install apache2 php8.1 supervisor -y && \
    mkdir -p /var/log/supervisor

RUN service apache2 stop && \
    a2dismod php8.1 mpm_prefork

# Install PHP 8.1 FPM and it's modules
RUN a2enmod mpm_event rewrite && \
    apt install php8.1-fpm php8.1-curl php8.1-mbstring php8.1-gd php8.1-zip \
    libapache2-mod-fcgid -y --allow-unauthenticated

RUN a2enconf php8.1-fpm && \    
    a2enmod proxy proxy_fcgi setenvif && \
    a2enmod actions fcgid alias proxy_fcgi setenvif

# RUN mv /etc/php/8.1/fpm/pool.d/www.conf /etc/php/8.1/fpm/pool.d/www.conf-BK
# COPY ./docker/config/pool.d/www.conf /etc/php/8.1/fpm/pool.d

RUN apt update && apt upgrade -y && \
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN apt install php8.1-dev php8.1-xml -y

# MSSQL Driver Installation and PHP extension
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 && \
    ACCEPT_EULA=Y apt-get install -y mssql-tools && \
    apt-get install -y unixodbc-dev && \
    pecl install sqlsrv && \
    pecl install pdo_sqlsrv && \
    printf "; priority=20\nextension=sqlsrv.so\n" > /etc/php/8.1/mods-available/sqlsrv.ini && \
    printf "; priority=30\nextension=pdo_sqlsrv.so\n" > /etc/php/8.1/mods-available/pdo_sqlsrv.ini && \
    phpenmod -v 8.1 sqlsrv pdo_sqlsrv

# OCI8 Driver installation and PHP extension
RUN mkdir -p /usr/lib/oracle/19.15/client64
RUN curl -o instantclient-basic-19-15.zip https://download.oracle.com/otn_software/linux/instantclient/1915000/instantclient-basic-linux.x64-19.15.0.0.0dbru-2.zip && \
    curl -o instantclient-sdk-19-15.zip https://download.oracle.com/otn_software/linux/instantclient/1915000/instantclient-sdk-linux.x64-19.15.0.0.0dbru-2.zip && \
    unzip instantclient-basic-19-15.zip -d /usr/lib/oracle/19.15/client64 && \
    unzip instantclient-sdk-19-15.zip -d /usr/lib/oracle/19.15/client64 && \
    rm -rf instantclient-*.zip && \
    mv /usr/lib/oracle/19.15/client64/instantclient_19_15 /usr/lib/oracle/19.15/client64/lib

RUN ln -s /usr/lib/oracle/19.15/client64/lib/libclntsh.so.19.1 libclntsh.so && \
    ln -s /usr/lib/oracle/19.15/client64/lib/libocci.so.19.1 libocci.so

RUN echo /usr/lib/oracle/19.15/client64/lib > /etc/ld.so.conf.d/oracle.conf && \
    ldconfig

RUN pecl install oci8 && \
    echo "extension=oci8.so" >> /etc/php/8.1/fpm/php.ini && \
    printf "; priority=20\nextension=oci8.so\n" > /etc/php/8.1/mods-available/oci8.ini && \
    phpenmod -v 8.1 oci8

# SAP 7.50 Driver installation and PHP extension
ADD ./docker/sap-sdk/nwrfcsdk7-50.zip /

RUN mkdir -p /usr/sap && \
    chmod 775 -R /usr/sap && \
    unzip nwrfcsdk7-50.zip -d /usr/sap && \
    rm -rf nwrfcsdk7-50.zip 
    
RUN printf "/usr/sap/nwrfcsdk/lib" > /etc/ld.so.conf.d/sapnwrfc.conf && \
    cd /usr/sap && \
    ldconfig

RUN cd ~

RUN git clone https://github.com/gkralik/php7-sapnwrfc.git

RUN cd /php7-sapnwrfc && \
    phpize && \
    ./configure --with-sapnwrfc=/usr/sap/nwrfcsdk && \
    make && \
    make install

RUN printf "; priority=20\nextension=sapnwrfc.so\n" > /etc/php/8.1/mods-available/sapnwrfc.ini && \
    ln -s /etc/php/8.1/mods-available/sapnwrfc.ini 20-sapnwrfc.ini && \ 
    phpenmod sapnwrfc

WORKDIR $ROOT_APP_DIR

# Copy project api
RUN rm -rf ${ROOT_APP_DIR}/*

COPY --chown=bblc:bblc . $ROOT_APP_DIR

RUN composer install --ignore-platform-reqs

# Assign permissions of the working directory to current user.
RUN chmod 775 -R ${ROOT_APP_DIR}/storage

# Clean up
RUN apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


FROM main as api_dev
RUN echo "Listen 16692" >> /etc/apache2/ports.conf

EXPOSE 16692

COPY ./docker/sites-available/bblc_customer_api.conf /etc/apache2/sites-available/

RUN a2dissite 000-default.conf && \
    a2ensite bblc_customer_api.conf

COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Execute multiple services E.g: php and apache2
CMD ["/usr/bin/supervisord"]

FROM main as api_prod
COPY ./docker/sites-available/bblc_customer_app.conf /etc/apache2/sites-available/
COPY ./docker/sites-available/bblc_customer_app_ssl.conf /etc/apache2/sites-available/

RUN a2dissite 000-default.conf && \
    a2ensite bblc_customer_app.conf bblc_customer_app_ssl.conf

COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80
EXPOSE 443

# Execute multiple services E.g: php and apache2
CMD ["/usr/bin/supervisord"]