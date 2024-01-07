import { PaymentCreatedEvent, Publisher, Subjects } from '@prozaimlabs/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
