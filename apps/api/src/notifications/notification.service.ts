import { Injectable, Logger } from "@nestjs/common";
import { ResendService } from "./resend.service";

export interface TicketEmailContext {
  customerEmail: string;
  customerName: string;
  ticketNumber: string;
  queueName: string;
  branchName: string;
  tenantName?: string;
  trackUrl?: string;
  position?: number;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly resend: ResendService) {}

  /** Fire-and-forget — does not block the caller. */
  sendTicketJoined(context: TicketEmailContext): void {
    void this.deliverJoined(context);
  }

  /** Fire-and-forget — does not block the caller. */
  sendTicketCalled(context: TicketEmailContext): void {
    void this.deliverCalled(context);
  }

  /** Fire-and-forget — does not block the caller. */
  sendAlmostYourTurn(context: TicketEmailContext): void {
    void this.deliverAlmostYourTurn(context);
  }

  private async deliverJoined(context: TicketEmailContext) {
    const sent = await this.resend.send({
      to: context.customerEmail,
      subject: `You're in line — ticket ${context.ticketNumber}`,
      html: this.joinedHtml(context),
    });

    if (sent) {
      this.logger.log(
        `Join confirmation sent to ${context.customerEmail} (${context.ticketNumber})`
      );
    }
  }

  private async deliverCalled(context: TicketEmailContext) {
    const sent = await this.resend.send({
      to: context.customerEmail,
      subject: `Your turn — ticket ${context.ticketNumber}`,
      html: this.calledHtml(context),
    });

    if (sent) {
      this.logger.log(
        `Called notification sent to ${context.customerEmail} (${context.ticketNumber})`
      );
    }
  }

  private async deliverAlmostYourTurn(context: TicketEmailContext) {
    const sent = await this.resend.send({
      to: context.customerEmail,
      subject: `Almost your turn — ticket ${context.ticketNumber}`,
      html: this.almostTurnHtml(context),
    });

    if (sent) {
      this.logger.log(
        `Almost-turn notification sent to ${context.customerEmail} (${context.ticketNumber})`
      );
    }
  }

  private joinedHtml(ctx: TicketEmailContext) {
    const org = ctx.tenantName ? `${ctx.tenantName} · ` : "";

    return `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
        <p style="color: #666; font-size: 14px;">${org}${this.escape(ctx.branchName)}</p>
        <h1 style="font-size: 24px; margin: 8px 0;">You're in the queue</h1>
        <p style="font-size: 32px; font-weight: bold; font-family: monospace; margin: 16px 0;">${this.escape(ctx.ticketNumber)}</p>
        <p style="color: #444;">Hi ${this.escape(ctx.customerName)}, you've joined <strong>${this.escape(ctx.queueName)}</strong>.</p>
        <p style="color: #666; font-size: 14px;">We'll email you when it's almost your turn and again when you're called.</p>
        ${this.trackLinkHtml(ctx.trackUrl)}
      </div>
    `.trim();
  }

  private calledHtml(ctx: TicketEmailContext) {
    const org = ctx.tenantName ? `${ctx.tenantName} · ` : "";

    return `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
        <p style="color: #666; font-size: 14px;">${org}${this.escape(ctx.branchName)}</p>
        <h1 style="font-size: 24px; margin: 8px 0; color: #059669;">It's your turn</h1>
        <p style="font-size: 32px; font-weight: bold; font-family: monospace; margin: 16px 0;">${this.escape(ctx.ticketNumber)}</p>
        <p style="color: #444;">Hi ${this.escape(ctx.customerName)}, please proceed to the counter for <strong>${this.escape(ctx.queueName)}</strong>.</p>
        <p style="color: #666; font-size: 14px;">Show your ticket number to staff when you arrive.</p>
        ${this.trackLinkHtml(ctx.trackUrl)}
      </div>
    `.trim();
  }

  private almostTurnHtml(ctx: TicketEmailContext) {
    const org = ctx.tenantName ? `${ctx.tenantName} · ` : "";
    const position = ctx.position ?? 3;

    return `
      <div style="font-family: system-ui, sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
        <p style="color: #666; font-size: 14px;">${org}${this.escape(ctx.branchName)}</p>
        <h1 style="font-size: 24px; margin: 8px 0;">Almost your turn</h1>
        <p style="font-size: 32px; font-weight: bold; font-family: monospace; margin: 16px 0;">${this.escape(ctx.ticketNumber)}</p>
        <p style="color: #444;">Hi ${this.escape(ctx.customerName)}, you're about <strong>#${position}</strong> in line for <strong>${this.escape(ctx.queueName)}</strong>.</p>
        <p style="color: #666; font-size: 14px;">Start heading over — we'll email you again when it's your turn.</p>
        ${this.trackLinkHtml(ctx.trackUrl)}
      </div>
    `.trim();
  }

  private trackLinkHtml(trackUrl?: string) {
    if (!trackUrl) return "";

    return `
      <p style="margin-top: 20px;">
        <a href="${this.escape(trackUrl)}" style="color: #6366f1; font-size: 14px;">Track your ticket status</a>
      </p>
    `.trim();
  }

  private escape(value: string) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}
