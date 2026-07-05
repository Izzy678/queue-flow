import { Module } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { ResendService } from "./resend.service";

@Module({
  providers: [ResendService, NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
