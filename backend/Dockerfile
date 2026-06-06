FROM php:8.2-apache

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libicu-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql intl

RUN a2enmod rewrite

COPY . /var/www/html

RUN mkdir -p /var/www/html/writable/cache
RUN mkdir -p /var/www/html/writable/logs
RUN mkdir -p /var/www/html/writable/session

RUN chown -R www-data:www-data /var/www/html/writable
RUN chmod -R 775 /var/www/html/writable

WORKDIR /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN composer install --no-dev --optimize-autoloader

ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    /etc/apache2/conf-available/*.conf

EXPOSE 80