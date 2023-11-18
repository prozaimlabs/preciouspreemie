import { ProductCreatedEvent, Publisher, Subjects } from '@prozaimlabs/common';

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
    readonly subject: Subjects.ProductCreated = Subjects.ProductCreated;
}
