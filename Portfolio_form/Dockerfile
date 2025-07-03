FROM php:8.2-apache

WORKDIR /var/www/html


COPY . /var/www/html


RUN apt-get update && \
    apt-get install -y \
    zip \
    unzip \
    git \
    libzip-dev && \
    rm -rf /var/lib/apt/lists/*


RUN docker-php-ext-install zip


RUN php -v
RUN ls -la /var/www/html



COPY --from=composer:latest /usr/bin/composer /usr/bin/composer


RUN rm -rf vendor/

RUN COMPOSER_ALLOW_SUPERUSER=1 COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev

RUN a2enmod rewrite


EXPOSE 80