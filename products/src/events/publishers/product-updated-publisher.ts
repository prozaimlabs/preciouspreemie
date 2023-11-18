import { ProductUpdatedEvent, Publisher, Subjects } from '@prozaimlabs/common';

export class ProductUpdatedPublisher extends Publisher<ProductUpdatedEvent> {
    readonly subject: Subjects.ProductUpdated = Subjects.ProductUpdated;
}
