
interface Dog {
    t: 'dog'
    d: string
}
const dog = (d: string): Dog => ({
    t: 'dog',
    d: d
});

interface Cat {
    t: 'cat'
    c: string
}
const cat = (c: string): Cat => ({
    t: 'cat',
    c: c
})

interface Rat {
    t: 'rat'
    r: string
}

type Pet = Dog | Cat


const pets: Pet[] = [dog("a dog"), cat("a cat")]


const processDog = (dog: Dog): boolean => {
    console.log(dog.d);
    return false;
}
const processCat = (cat: Cat): boolean => {
    console.log(cat.c);
    return true;
}

const processPet = (pet: Pet): boolean => {
    switch(pet.t){
        case 'cat': return processCat(pet)
        case 'dog': return processDog(pet)
    }
}

describe('dummy test', () => {
    test('real dummy', () => {
        expect(1).toEqual(1);
    })
})