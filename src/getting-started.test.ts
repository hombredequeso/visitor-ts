import * as m from './getting-started'

describe('testing tests', () => {
    test('x is correct', () => {
        expect(m.x).toEqual(1)
    })
})

const emptyVisitor: m.IVisitor = {
    visit: function (part: m.IVisitable): void {
        // throw new Error('Function not implemented.');
    },

    visitDog(d: m.Dog): void {
        // console.log("visiting dog")
        return;
    },

    visitCat(c: m.Cat): void {
        //console.log("visiting cat")
        return;
    }
};


describe('inheritance', () => {
    test('inheritance works', () => {
        const d = new m.Dog();
        const c = new m.Cat();

        const dv: m.IVisitable = d as m.IVisitable;
        const cv: m.IVisitable = c as m.IVisitable;

        const a: m.IVisitable[] = [dv,cv];

        const v: m.IVisitor = emptyVisitor;
        a.forEach(e => e.accept(v))
    })
})