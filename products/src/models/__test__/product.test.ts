import { Product } from '../products';

it('implements optimistic concurrency control', async () => {
    // Create an instance of a product
    const product = Product.build({
        name: 'toy',
        price: 500,
        userId: '123',
    });

    // save the second fetched product and expect an error
    await product.save();

    //fetch the product twice
    const firstInstance = await Product.findById(product.id);
    const secondInstance = await Product.findById(product.id);

    // make two separate changes to the products fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const product = Product.build({
        name: 'toy',
        price: 30,
        userId: '001',
    });

    await product.save();
    expect(product.version).toEqual(0);
    await product.save();
    expect(product.version).toEqual(1);
    await product.save();
    expect(product.version).toEqual(2);
});
