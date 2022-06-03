export const x = 1;

export interface IVisitor {
    // An interface that custom Visitors should implement
    visit(part: IVisitable): void

    // or this:
    visitDog(d: Dog): void
    visitCat(c: Cat): void
}
export interface IVisitable {
    // An interface the concrete objects should implement that allows
    // the visitor to traverse a hierarchical structure of objects
    accept(visitor: IVisitor): void
}

export class Dog implements IVisitable {

    accept(visitor: IVisitor): void {
        // console.log('dog');
        visitor.visit(this);
        visitor.visitDog(this);
    }
}

export class Cat implements IVisitable {
    accept(visitor: IVisitor): void {
        // console.log('cat');
        visitor.visit(this);
        visitor.visitCat(this);
    }
}
