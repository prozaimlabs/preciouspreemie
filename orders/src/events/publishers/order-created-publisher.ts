import { OrderCreatedEvent, Publisher, Subjects } from '@prozaimlabs/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
