
FROM php:8.2-apache

WORKDIR /var/www/html


COPY . /var/www/html

RUN php -v

RUN ls -la /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN rm -rf vendor/

RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev


RUN a2enmod rewrite

EXPOSE 80

# CMD ["apache2-foreground"] # Toto je výchozí CMD pro php:apache
