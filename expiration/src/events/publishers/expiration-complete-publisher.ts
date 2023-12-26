import { ExpirationCompleteEvent, Publisher, Subjects } from "@prozaimlabs/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}