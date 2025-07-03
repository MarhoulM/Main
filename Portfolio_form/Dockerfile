
FROM php:8.2-apache

WORKDIR /var/www/html


COPY . /var/www/html

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Povolíme mod_rewrite pro hezké URL, pokud je váš PHP framework potřebuje
RUN a2enmod rewrite

EXPOSE 80

# CMD ["apache2-foreground"] # Toto je výchozí CMD pro php:apache
