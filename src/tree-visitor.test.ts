
import { number } from 'fp-ts';
import * as S from 'fp-ts/State'
import {State} from 'fp-ts/State'
import { last } from 'fp-ts/lib/ReadonlyNonEmptyArray';
import { flow } from 'fp-ts/lib/function'

type Value = number;

interface Node {
    value: Value,
    children: Node[]
}


describe('traverse', () => {
    test('is orderly', () => {
        const node1: Node = {value: 1, children: []};
        const node2: Node = {value: 2, children: []};
        const node3: Node = {value: 3, children: []};

        const node4: Node = {value: 4, children: [node1, node2, node3]}
        const node5: Node = {value: 5, children: [node4]};

        const depthFirstTraverse = (n: Node): string => {
            const values: string[]  = n.children.map(c => depthFirstTraverse(c))
            const allValues = values.join('');
            return allValues + n.value;
        }

        const result = depthFirstTraverse(node5);

        expect(result).toEqual('12345')
    }),

    test('can add', () => {
        const node1: Node = {value: 1, children: []};
        const node2: Node = {value: 2, children: []};
        const node3: Node = {value: 3, children: []};

        const node4: Node = {value: 4, children: [node1, node2, node3]}
        const node5: Node = {value: 5, children: [node4]};

        const depthFirstTraverse = (n: Node): number => {
            const values: Value[] = n.children.map(c => depthFirstTraverse(c))
            const allValues = values.reduce((prev, curr) => prev + curr, 0);
            return n.value + allValues;
        }

        const result = depthFirstTraverse(node5);

        expect(result).toEqual(15)
    })

    test('can accumulate leaves only', () => {
        const node1: Node = {value: 1, children: []};
        const node2: Node = {value: 2, children: []};
        const node3: Node = {value: 3, children: []};

        const node4: Node = {value: 4, children: [node1, node2, node3]}
        const node5: Node = {value: 5, children: [node4]};

        const leaves: Value[] = [];
        const depthFirstTraverse = (n: Node): Value[] => {
            if (n.children.length > 0) {
                const values: Value[] = n.children.flatMap(c => depthFirstTraverse(c))
                return values;
            }
            return [n.value];
        }

        const result = depthFirstTraverse(node5);

        expect(result).toEqual([1,2,3])
    })

    test('get all paths', () => {
        const node1: Node = {value: 1, children: []};
        const node2: Node = {value: 2, children: []};
        const node3: Node = {value: 3, children: []};

        const node4: Node = {value: 4, children: [node1, node2, node3]}
        const node5: Node = {value: 5, children: [node4]};

        const leaves: Value[] = [];
        const depthFirstTraverse = (n: Node): string[] => {
            if (n.children.length === 0) {
                return [n.value.toString()]
            }
            const childrenResult = n.children.flatMap(c => depthFirstTraverse(c));
            return childrenResult.map(c =>  c + n.value.toString());
        }

        const result = depthFirstTraverse(node5);

        expect(result).toEqual(['145', '245', '345'])
    })

    interface VisitState {
        log: string[]
    }

    interface Visitors {
        onEntry: (visitState: VisitState, node: Node) => VisitState
        onExit: (visitState: VisitState, node: Node) => VisitState
    }

    test('get all paths', () => {
        const node1: Node = {value: 1, children: []};
        const node2: Node = {value: 2, children: []};
        const node3: Node = {value: 3, children: []};

        const node4: Node = {value: 4, children: [node1, node2, node3]}
        const node5: Node = {value: 5, children: [node4]};



        const depthFirstTraverse = (n: Node, visitors: Visitors, s: VisitState): VisitState => {
            const entryVisitState: VisitState = visitors.onEntry(s, n);
            const childTraversals: VisitState = n.children.reduce(
                (prevState, child) => depthFirstTraverse(child, visitors, prevState), entryVisitState);
            const exitVisitState: VisitState = visitors.onExit(childTraversals, n);
            return exitVisitState;
        }

        const visitors: Visitors = {
            onEntry: function (visitState: VisitState, node: Node): VisitState {
                const newLog = `enter-${node.value}`
                const outLogs = visitState.log.concat([newLog]);
                return {log: outLogs}
            },
            onExit: function (visitState: VisitState, node: Node): VisitState {
                const newLog = `exit-${node.value}`
                const outLogs = visitState.log.concat([newLog]);
                return {log: outLogs}
            }
        }

        const result = depthFirstTraverse(node5, visitors, {log: []});
        const expectedResult =          
            [
                'enter-5', 
                'enter-4',
                'enter-1', 'exit-1',
                'enter-2', 'exit-2',
                'enter-3', 'exit-3',
                'exit-4',  
                'exit-5'
            ];

        expect(result).toEqual({log: expectedResult});
    })


    interface NodeG<T> {
        value: T,
        children: NodeG<T>[]
    }

    interface VisitorsG<S, T> {
        onEntry: (visitState: S, node: NodeG<T>) => S
        onExit: (visitState: S, node: NodeG<T>) => S
    }

    test('get all paths generic ed', () => {
        const node1: NodeG<number> = {value: 1, children: []};
        const node2: NodeG<number> = {value: 2, children: []};
        const node3: NodeG<number> = {value: 3, children: []};

        const node4: NodeG<number> = {value: 4, children: [node1, node2, node3]}
        const node5: NodeG<number> = {value: 5, children: [node4]};

        const depthFirstTraverse = <S, T>(n: NodeG<T>, visitors: VisitorsG<S, T>, s: S): S => {
            const entryVisitState: S = visitors.onEntry(s, n);
            const childTraversals: S = n.children.reduce(
                (prevState, child) => depthFirstTraverse(child, visitors, prevState), entryVisitState);
            const exitVisitState: S = visitors.onExit(childTraversals, n);
            return exitVisitState;
        }

        const visitors: VisitorsG<string[], number> = {
            onEntry: function (visitState: string[], node: NodeG<number>): string[] {
                const newLog = `enter-${node.value}`
                const outLogs = visitState.concat([newLog]);
                return outLogs;
            },
            onExit: function (visitState: string[], node: NodeG<number>): string[] {
                const newLog = `exit-${node.value}`
                const outLogs = visitState.concat([newLog]);
                return outLogs;
            }
        }

        const result = depthFirstTraverse(node5, visitors, []);
        const expectedResult =          
            [
                'enter-5', 
                'enter-4',
                'enter-1', 'exit-1',
                'enter-2', 'exit-2',
                'enter-3', 'exit-3',
                'exit-4',  
                'exit-5'
            ];

        expect(result).toEqual(expectedResult);
    })



    interface NodeG<T> {
        value: T,
        children: NodeG<T>[]
    }

    interface VisitorsS<S, T> {
        onEntry: (node: NodeG<T>) => State<S, T>
        onExit: (node: NodeG<T>) => State<S, T>
    }

    test('get all paths generic ed', () => {
        const node1: NodeG<number> = {value: 1, children: []};
        const node2: NodeG<number> = {value: 2, children: []};
        const node3: NodeG<number> = {value: 3, children: []};

        const node4: NodeG<number> = {value: 4, children: [node1, node2, node3]}
        const node5: NodeG<number> = {value: 5, children: [node4]};

        const depthFirstTraverse = <S, T>(n: NodeG<T>, visitors: VisitorsS<S, T>): State<S, T> => {

            const a: State<S,T> = visitors.onEntry(n);

            const childTraversals: State<S,T> = 
            n.children.reduce(
                (prevState, child) => S.chain(() => depthFirstTraverse(child, visitors))(prevState)
                , a);
            const b: State<S,T> = S.chain(() => visitors.onExit(n))(childTraversals);
            return b;
        }

        const visitors: VisitorsS<string[], number> = {
            onEntry: function (node: NodeG<number>): State<string[], number> {
                return (s) => {
                    const newLog = `enter-${node.value}`
                    const outLogs = s.concat([newLog]);
                    return [node.value, outLogs];
                }
            },
            onExit: function (node: NodeG<number>): State<string[], number> {
                return (s) => {
                    const newLog = `exit-${node.value}`
                    const outLogs = s.concat([newLog]);
                    return [node.value, outLogs];

                }
            }
        }

        const result: State<string[], number> = depthFirstTraverse(node5, visitors);
        const initialState: string[] = [];
        const executedResult = S.execute(initialState)(result);
        const expectedResult =          
            [
                'enter-5', 
                'enter-4',
                'enter-1', 'exit-1',
                'enter-2', 'exit-2',
                'enter-3', 'exit-3',
                'exit-4',  
                'exit-5'
            ];

        expect(executedResult).toEqual(expectedResult);
    })
})



export {}