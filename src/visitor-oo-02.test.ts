// Add Subtract

interface Visitor {
    visitInteger(n: Integer): void
    visitAdd(n: Add): void
    visitSubtract(n: Subtract): void
}

interface Node {
    Visit(visitor: Visitor): void
}

class Integer implements Node {
    constructor(x: number) {this._value = x;}

    Visit(visitor: Visitor): void {
        visitor.visitInteger(this);
    }
    readonly _value: number
}

class Add implements Node {
    constructor(left: Node, right: Node) 
    {
        this._left = left; 
        this._right = right;
    }
    Visit(visitor: Visitor): void {
        visitor.visitAdd(this);
    }

    readonly _left: Node;
    readonly _right: Node;
}

class Subtract implements Node {
    constructor(left: Node, right: Node) 
    {
        this._left = left; 
        this._right = right;
    }
    Visit(visitor: Visitor): void {
        visitor.visitSubtract(this);
    }

    readonly _left: Node;
    readonly _right: Node;
}

const graph1 = new Add(
    new Integer(1),
    new Add(
        new Add(
            new Integer(2),
            new Integer(4)
        ),
        new Add(
            new Integer(8),
            new Add(
                new Integer(16),
                new Integer(32)
            )
        )
    )
)

const graph2 = new Add(
    new Integer(1),
    new Add(
        new Add(
            new Integer(2),
            new Integer(4)
        ),
        new Add(
            new Integer(8),
            new Subtract(
                new Integer(32),
                new Integer(16)
            )
        )
    )
)

class TestVisitor implements Visitor {
    constructor() {
        this.output = "";
    }

    output: string

    visitInteger(n: Integer): void {
        this.output = this.output + n._value.toString();
    }
    visitAdd(n: Add): void {
        this.output = this.output + '+';
    }
    visitSubtract(n: Subtract): void {
        this.output = this.output + '-';
    }
}

describe('visitor oo', () => {

    const node1 = new Integer(7);
    const node2 = new Integer(3);
    const addNode = new Add(node1, node2);


    test.each([
        [new Integer(7), '7'],
        [addNode, '+'],
    ])('is equal', (node, expectedResult) => {
        const visitor = new TestVisitor();
        node.Visit(visitor);
        expect(visitor.output).toEqual(expectedResult)
    })
})

class DisplayVisitor implements Visitor {
    constructor() {
        this.output = "";
    }

    output: string

    visitInteger(n: Integer): void {
        this.output = this.output + n._value.toString();
    }
    visitAdd(n: Add): void {
        n._left.Visit(this);
        this.output = this.output + '+';
        n._right.Visit(this);
    }
    visitSubtract(n: Subtract): void {
        n._left.Visit(this);
        this.output = this.output + '-';
        n._right.Visit(this);
    }
}


describe('displayVisitor', () => {

    const node1 = new Integer(7);
    const node2 = new Integer(3);
    const addNode = new Add(node1, node2);


    test.each([
        [new Integer(7), '7'],
        [addNode, '7+3'],
        [graph1, '1+2+4+8+16+32'],
        [graph2, '1+2+4+8+32-16']
    ])('is equal', (node, expectedResult) => {
        const visitor = new DisplayVisitor();
        node.Visit(visitor);
        expect(visitor.output).toEqual(expectedResult)
    })
})

class CalculateVisitor implements Visitor {
    constructor() {
        this._stack = [];
    }

    private _stack: number[]

    public get result(): number  {
        return this._stack[0];
    }

    visitInteger(n: Integer): void {
        this._stack.push(n._value);
    }
    visitAdd(n: Add): void {
        n._left.Visit(this);
        n._right.Visit(this);
        const rightValue = this._stack.pop() as number;
        const leftValue = this._stack.pop() as number;
        this._stack.push(rightValue + leftValue);
    }
    visitSubtract(n: Subtract): void {
        n._left.Visit(this);
        n._right.Visit(this);
        const rightValue = this._stack.pop() as number;
        const leftValue = this._stack.pop() as number;
        this._stack.push(leftValue - rightValue);
    }
}

describe('calculateVisitor', () => {

    const node1 = new Integer(7);
    const node2 = new Integer(3);
    const addNode = new Add(node1, node2);

    test.each([
        [new Integer(7), 7],
        [addNode, 10],
        [graph1, 63],
        [graph2, 31]
    ])('is equal', (node, expectedResult) => {
        const visitor = new CalculateVisitor();
        node.Visit(visitor);
        expect(visitor.result).toEqual(expectedResult)
    })
})

export {}