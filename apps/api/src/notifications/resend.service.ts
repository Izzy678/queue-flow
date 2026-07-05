import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Resend } from "resend";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);
  private readonly client: Resend | null;
  private readonly fromEmail: string | null;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>("RESEND_API_KEY");
    this.fromEmail =
      this.configService.get<string>("NOTIFICATION_FROM_EMAIL") ?? null;
    this.client = apiKey ? new Resend(apiKey) : null;

    if (!this.client) {
      this.logger.warn(
        "RESEND_API_KEY is not set — email notifications are disabled"
      );
    }
  }

  async send(options: SendEmailOptions): Promise<boolean> {
    if (!this.client || !this.fromEmail) {
      this.logger.debug(
        `Skipping email to ${options.to}: ${options.subject}`
      );
      return false;
    }

    try {
      const { error } = await this.client.emails.send({
        from: this.fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        this.logger.error(`Resend error for ${options.to}: ${error.message}`);
        return false;
      }

      return true;
    } catch (err) {
      this.logger.error(
        `Failed to send email to ${options.to}`,
        err instanceof Error ? err.stack : err
      );
      return false;
    }
  }
}
