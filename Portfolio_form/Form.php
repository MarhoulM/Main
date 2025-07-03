<?php

mb_internal_encoding("UTF-8");
mb_http_output("UTF-8");

require __DIR__ . "/vendor/autoload.php";
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use PHPMailer\PHPMailer\PHPMailer;
use App\FormHandler;

/*
header("Access-Control-Allow-Origin: https://portfolio-g26i.onrender.com");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
*/

header("Content-Type: application/json; charset=UTF-8");

$response = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents("php://input"), true);

    $smtpConfig = [
        'SMTP_HOST' => $_ENV['SMTP_HOST'] ?? '',
        'SMTP_USERNAME' => $_ENV['SMTP_USERNAME'] ?? '',
        'SMTP_PASSWORD' => $_ENV['SMTP_PASSWORD'] ?? '',
        'SMTP_PORT' => $_ENV['SMTP_PORT'] ?? '',
    ];

    $mailer = new PHPMailer(true);

    $handler = new FormHandler($mailer, $smtpConfig);
    $response = $handler->handle($input);
} else {
    $response["success"] = false;
    $response["message"] = "Neplatná metoda požadavku";
}
echo json_encode($response);
exit();
