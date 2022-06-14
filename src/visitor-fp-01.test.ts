interface Integer
{
    readonly kind:'integer'
    readonly value: number
}

const integer = (v: number): Integer => ({kind: 'integer', value: v})

interface Add
{
    readonly kind:'add'
    readonly left: Node,
    readonly right: Node
}

const add = (left: Node, right: Node): Add => ({kind: 'add', left:left, right: right})

type Node = Integer | Add

const testVisitor = (n: Node): string => {
    switch (n.kind) {
        case 'integer': return n.value.toString();
        case 'add': return '+';
    }
}

describe('test visitor fp', () => {

    const left: Integer = integer(7)
    const right: Integer = integer(3);
    const addNode: Add = add(left, right);

    test.each([
        [integer(7), '7'],
        [addNode, '+'],
    ])('is equal', (node:Node, expectedResult) => {
        const result = testVisitor(node);
        expect(result).toEqual(expectedResult)
    })
})


const graph1 = add(
    integer(1),
    add(
        add(
            integer(2),
            integer(4)
        ),
        add(
            integer(8),
            add(
                integer(16),
                integer(32)
            )
        )
    )
)

// New visitor is a ... function(s) :-)
const displayIntegerNode = (n: Integer): string =>
    n.value.toString()

const displayAddNode = (n: Add): string =>
    `${displayVisitor(n.left)}+${displayVisitor(n.right)}`

const displayVisitor = (n: Node): string => {
    switch (n.kind) {
        case 'integer': return displayIntegerNode(n);
        case 'add': return displayAddNode(n);
    }
}

describe('displayVisitor fp', () => {

    const node1 = integer(7);
    const node2 = integer(3);
    const addNode = add(node1, node2);

    test.each([
        [integer(7), '7'],
        [addNode, '7+3'],
        [graph1, '1+2+4+8+16+32']
    ])('is equal', (node, expectedResult) => {
        const result = displayVisitor(node);
        expect(result).toEqual(expectedResult)
    })
})

const calculateIntegerNode = (n: Integer): number => n.value;
const calculateAddNode = (n: Add): number => calculate(n.left) + calculate(n.right);

const calculate = (n: Node): number => {
    switch (n.kind) {
        case 'integer': return calculateIntegerNode(n);
        case 'add': return calculateAddNode(n);
    }
}

describe('calculate fp', () => {

    const node1 = integer(7);
    const node2 = integer(3);
    const addNode = add(node1, node2);

    test.each([
        [integer(7), 7],
        [addNode, 10],
        [graph1, 63]
    ])('is equal', (node, expectedResult) => {
        const result = calculate(node);
        expect(result).toEqual(expectedResult)
    })
})

const getLongestPathLengthR = (n: Node, currentLength: number): number => {
    switch (n.kind) {
        case 'integer': {
            return currentLength + 1;
        }
        case 'add': {
            const leftLength = getLongestPathLengthR(n.left, currentLength + 1)
            const rightLength = getLongestPathLengthR(n.left, currentLength + 1)
            return Math.max(leftLength, rightLength);
        }
    }
}

const getLongestPathLength = (n: Node): number => 
    getLongestPathLengthR(n, 0);

export {}