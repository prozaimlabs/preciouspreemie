import { OrderCancelledEvent, Publisher, Subjects } from '@prozaimlabs/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
