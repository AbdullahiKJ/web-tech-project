<?php

namespace Tests;

use CodeIgniter\Test\CIUnitTestCase;
use Config\Email;

class EmailConfigTest extends CIUnitTestCase
{
    public function testExplicitHostingVariablesAreLoaded(): void
    {
        $variables = [
            'EMAIL_PROTOCOL' => 'smtp',
            'EMAIL_FROM_ADDRESS' => 'sender@example.com',
            'EMAIL_FROM_NAME' => 'Movie Reviews',
            'SMTP_HOST' => 'smtp.example.com',
            'SMTP_USERNAME' => 'test-login',
            'SMTP_PASSWORD' => 'test-key',
            'SMTP_PORT' => '2525',
            'SMTP_ENCRYPTION' => 'tls',
        ];
        $previous = $_ENV;
        try {
            foreach ($variables as $name => $value) {
                $_ENV[$name] = $value;
            }
            $config = new Email();
            $this->assertSame('smtp', $config->protocol);
            $this->assertSame('sender@example.com', $config->fromEmail);
            $this->assertSame('Movie Reviews', $config->fromName);
            $this->assertSame('smtp.example.com', $config->SMTPHost);
            $this->assertSame('test-login', $config->SMTPUser);
            $this->assertSame('test-key', $config->SMTPPass);
            $this->assertSame(2525, $config->SMTPPort);
            $this->assertSame('tls', $config->SMTPCrypto);
        } finally {
            $_ENV = $previous;
        }
    }
}
