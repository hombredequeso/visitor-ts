interface Visitor {
    visitInteger(n: Integer): void
    visitAdd(n: Add): void
}

interface Node {
    Visit(visitor: Visitor): void
}

class Integer implements Node {
    constructor(public readonly value: number) {}

    Visit(visitor: Visitor): void {
        visitor.visitInteger(this);
    }
}

class Add implements Node {
    constructor(
        public readonly left: Node, 
        public readonly right: Node) 
    {}

    Visit(visitor: Visitor): void {
        visitor.visitAdd(this);
    }
}

class TestVisitor implements Visitor {
    constructor() {
        this.output = "";
    }

    output: string

    visitInteger(n: Integer): void {
        this.output = this.output + n.value.toString();
    }
    visitAdd(n: Add): void {
        this.output = this.output + '+';
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
        this.output = this.output + n.value.toString();
    }
    visitAdd(n: Add): void {
        n.left.Visit(this);
        this.output = this.output + '+';
        n.right.Visit(this);
    }
}

const testGraph1 = new Add(
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

describe('displayVisitor', () => {

    const node1 = new Integer(7);
    const node2 = new Integer(3);
    const addNode = new Add(node1, node2);


    test.each([
        [new Integer(7), '7'],
        [addNode, '7+3'],
        [testGraph1, '1+2+4+8+16+32']
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
        this._stack.push(n.value);
    }
    visitAdd(n: Add): void {
        n.left.Visit(this);
        n.right.Visit(this);
        const rightValue = this._stack.pop() as number;
        const leftValue = this._stack.pop() as number;
        this._stack.push(rightValue + leftValue);
    }
}

describe('calculateVisitor', () => {

    const node1 = new Integer(7);
    const node2 = new Integer(3);
    const addNode = new Add(node1, node2);

    test.each([
        [new Integer(7), 7],
        [addNode, 10],
        [testGraph1, 63]
    ])('is equal', (node, expectedResult) => {
        const visitor = new CalculateVisitor();
        node.Visit(visitor);
        expect(visitor.result).toEqual(expectedResult)
    })
})


class LongestLengthVisitor implements Visitor {
    constructor() {
        this.maxLength = 0;
        this.currentLength = 0;
    }

    maxLength: number;
    currentLength: number;


    visitInteger(n: Integer): void {
        this.maxLength = Math.max(this.currentLength + 1, this.maxLength);
    }

    visitAdd(n: Add): void {
        this.currentLength++;
        // But, this could be a problem if there were promises/multiple threads, b/c it mutates
        n.left.Visit(this);
        n.right.Visit(this);
    }
}


export {}