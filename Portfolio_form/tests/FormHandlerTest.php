<?php

namespace Tests;

use PHPUnit\Framework\TestCase;
use App\FormHandler;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPUnit\Framework\MockObject\MockObject;


class FormHandlerTest extends TestCase
{
    private $smtpConfig;

    protected function setUp(): void
    {
        parent::setUp();
        $this->smtpConfig = [
            "SMTP_HOST" => "test.smtp.com",
            "SMTP_USERNAME" => "test@example.com",
            "SMTP_PASSWORD" => "testpassword",
            "SMTP_PORT" => 465,
        ];
    }

    //TEST 1 Prázdná pole
    public function testHandlesEmptyFields(): void
    {
        //ARRANGE
        /** @var PHPMailer $mailerMock */
        $mailerMock = $this->createMock(PHPMailer::class);
        $handler = new FormHandler($mailerMock, $this->smtpConfig);

        $input = [
            "name" => "",
            "email" => "",
            "message" => "",
            "Subject" => "",
            "Body" => ""
        ];

        // ACT
        $result = $handler->handle($input);
        //ASSERT
        $this->assertFalse($result["success"]);
        $this->assertStringContainsString(
            "Name je povinné pole. Email je povinné pole. Message je povinné pole. Subject je povinné pole. Body je povinné pole.",
            $result["message"]
        );
    }
    //TEST 2 NEPLATNÝ EMAIL
    public function testHandlesInvalidEmail(): void
    {
        // ARRANGE
        /** @var PHPMailer $mailerMock */
        $mailerMock = $this->createMock(PHPMailer::class);
        $handler = new FormHandler($mailerMock, $this->smtpConfig);

        $input = [
            "name" => "Test Jméno",
            "email" => "neplatny-email",
            "message" => "Testovací zpráva",
            "Subject" => "Testovací předmět",
            "Body" => "Testovací tělo"
        ];

        // ACT
        $result = $handler->handle($input);

        // ASSERT
        $this->assertFalse($result["success"]);
        $this->assertStringContainsString("Zadejte prosím platnou emailovou adresu.", $result["message"]);
    }
    //TEST 3 ÚSPĚŠNÉ ODESLÁNÍ
    public function testSendsEmailSuccessfully(): void
    {
        //ARRANGE
        /** @var PHPMailer|MockObject $mailerMock */
        $mailerMock = $this->createMock(PHPMailer::class);

        /** @var MockObject $mockBuilder */
        $mockBuilder = $mailerMock;

        $mockBuilder->expects($this->once())
            ->method('isSMTP');

        $mockBuilder->expects($this->once())
            ->method('setFrom')
            ->with($this->smtpConfig['SMTP_USERNAME'], "Kontakt z Portfolio");

        $mockBuilder->expects($this->once())
            ->method('addAddress')
            ->with($this->smtpConfig['SMTP_USERNAME'], "Příjemce");

        $mockBuilder->expects($this->once())
            ->method('addReplyTo')
            ->with("test@email.com", "Test Jméno");

        $mockBuilder->expects($this->once())
            ->method('isHTML')
            ->with(true);

        $mockBuilder->expects($this->once())
            ->method('send')
            ->willReturn(true);

        $handler = new FormHandler($mailerMock, $this->smtpConfig);

        $input = [
            "name" => "Test Jméno",
            "email" => "test@email.com",
            "message" => "Testovací zpráva",
            "Subject" => "Testovací předmět",
            "Body" => "Testovací tělo"
        ];


        //ACT
        $result = $handler->handle($input);

        //ASSERT
        $this->assertTrue($result["success"]);
        $this->assertEquals("Váš dotaz byl úspěšně odeslán!", $result["message"]);
    }

    public function testHandlesEmailSendingError(): void
    {
        // ARRANGE
        /** @var PHPMailer|MockObject $mailerMock */
        $mailerMock = $this->createMock(PHPMailer::class);

        /** @var MockObject $mockBuilder */
        $mockBuilder = $mailerMock;

        $mockBuilder->expects($this->once())
            ->method('send')
            ->willThrowException(new Exception("Simulovaná chyba odesílání."));


        $mailerMock->ErrorInfo = "Simulovaná chyba odesílání.";

        $mockBuilder->expects($this->once())->method('isSMTP');
        $mockBuilder->expects($this->once())->method('setFrom');
        $mockBuilder->expects($this->once())->method('addAddress');
        $mockBuilder->expects($this->once())->method('addReplyTo');
        $mockBuilder->expects($this->once())->method('isHTML');

        $handler = new FormHandler($mailerMock, $this->smtpConfig);

        $input = [
            "name" => "Validní Jméno",
            "email" => "valid@example.com",
            "message" => "Toto je testovací zpráva.",
            "Subject" => "Testovací předmět",
            "Body" => "Testovací tělo e-mailu."
        ];

        // ACT 
        $result = $handler->handle($input);

        // ASSERT 
        $this->assertFalse($result["success"]);
        $this->assertStringContainsString(
            "Chyba při odesílání dotazu: Simulovaná chyba odesílání.",
            $result["message"]
        );
    }
}
