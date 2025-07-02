<?php

namespace App;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class FormHandler
{
    private $mailer;
    private $smtpConfig;

    /**
     * Konstruktor třídy FormHandler.
     *
     * @param PHPMailer $mailer Instance PHPMailer pro odesílání e-mailů (pro testování může být mock).
     * @param array $smtpConfig Konfigurace SMTP (host, username, password, port, from_email).
     */
    public function __construct(PHPMailer $mailer, array $smtpConfig)
    {
        $this->mailer = $mailer;
        $this->smtpConfig = $smtpConfig;
    }

    /**
     * Zpracuje vstupní data formuláře, provede validaci a pokusí se odeslat e-mail.
     *
     * @param array $input Vstupní data z formuláře (očekává 'name', 'email', 'message', 'Subject', 'Body').
     * @return array Pole s výsledkem (success: bool, message: string).
     */
    public function handle(array $input): array
    {
        $errors = [];
        // Definice povinných polí, která musí být v datech z formuláře
        $required_fields = ["name", "email", "message", "Subject", "Body"];

        // Validace, zda jsou všechna povinná pole přítomna a nejsou prázdná
        foreach ($required_fields as $field) {
            if (!isset($input[$field]) || empty(trim($input[$field]))) {
                $errors[] = ucfirst($field) . " je povinné pole.";
            }
        }

        // Validace formátu e-mailu, pokud pole 'email' není prázdné
        if (!empty($input["email"]) && !filter_var($input["email"], FILTER_VALIDATE_EMAIL)) {
            $errors[] = "Zadejte prosím platnou emailovou adresu.";
        }

        // Pokud byly nalezeny chyby, vrátíme je a nebudeme pokračovat v odesílání
        if (!empty($errors)) {
            return ["success" => false, "message" => implode(" ", $errors)];
        } else {
            // Pokud validace prošla, pokusíme se odeslat e-mail
            try {
                // Nastavení PHPMailer instance s konfigurací z konstruktoru
                $this->mailer->isSMTP();
                $this->mailer->Host = $this->smtpConfig['SMTP_HOST'];
                $this->mailer->SMTPAuth = true;
                $this->mailer->Username = $this->smtpConfig['SMTP_USERNAME'];
                $this->mailer->Password = $this->smtpConfig['SMTP_PASSWORD'];
                $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
                $this->mailer->Port = $this->smtpConfig['SMTP_PORT'];
                $this->mailer->CharSet = 'UTF-8'; // Nastavení kódování pro správné zobrazení českých znaků

                // Nastavení odesílatele a příjemce e-mailu
                $this->mailer->setFrom($this->smtpConfig['SMTP_USERNAME'], "Kontakt z Portfolio");
                $this->mailer->addAddress($this->smtpConfig['SMTP_USERNAME'], "Příjemce");
                $this->mailer->addReplyTo($input["email"], $input["name"]);

                // Nastavení obsahu e-mailu
                $this->mailer->isHTML(true); // E-mail bude ve formátu HTML
                $this->mailer->Subject = $input["Subject"];
                $this->mailer->Body = $input["Body"];
                $this->mailer->AltBody = strip_tags($input["Body"]); // Alternativní text pro klienty bez HTML podpory

                // Odeslání e-mailu
                $this->mailer->send();
                return ["success" => true, "message" => "Váš dotaz byl úspěšně odeslán!"];
            } catch (Exception $e) {
                // Zachycení výjimky při chybě odesílání e-mailu
                // Zalogování chyby pro debugování na serveru
                error_log("PHPMailer Chyba: " . $this->mailer->ErrorInfo);
                return ["success" => false, "message" => "Chyba při odesílání dotazu: {$this->mailer->ErrorInfo}"];
            }
        }
    }
}
