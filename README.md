# Comparison of AST Algorithms

Sample code for the purpose of illustrating AST algorithms with:
* object-oriented paradigm, using visitor design pattern
* functional paradigm

The initial point of this code was to help illustrate how the principles of object oriented programming create the conditions necessary for inventing the visitor design pattern. When the same thing is implemented in a functional program, it is not necessary to have a design pattern using double dispatch to implement AST calculations. One may say that the visitor design pattern owes it existence to object-oriented programming.

Visitor Design Pattern

The visitor design pattern is already explained well elsewhere. 
[Visitor](https://refactoring.guru/design-patterns/visitor) provides a good overview.
[Clash of Styles series](https://vkontech.com/clash-of-styles-part-1-operations-matrix-via-oop/), a six part series (or seven including the [addendum on double dispatch](https://vkontech.com/polymorphism-on-steroids-dive-into-multiple-dispatch-multimethods/)) is also helpful in stepping through the elements of the visitor pattern (finally in part 4!). It also compares the oo pattern with an fp implementation along the way.


The main features to draw attention to for the sake of this comparison are:
* the visitor pattern is an attempt to separate out algorithms from the data in the objects. In a functional paradigm, data and functions are already separate so there is no need to use the visitor pattern.
* one of the potential disadvantages of the visitor pattern is that the visitor class may not be able to get access to the state in the object that it is visiting. This results in having to expose the object state (via say, getters) simply to perform vistor calculations. In a functional paradigm, this does not happen because the data is inherently accessible. Also note, that it is the exposing of object state that is essentially one of the major weaknesses of the object-oriented paradigm, approximating the same situation as using shared global state in a program [Object-oriented programming is bad](https://www.youtube.com/watch?v=QM1iUe6IofM&list=PL7ml_b7EM568LymSLjgRmLfCockNTCQ-2&index=4&t=1088s)
* while the visitor pattern takes advantage of polymorphic behaviour at one level, the need to use the double dispatch mechanism not only results in an unnecessarily complex program, but resulting in explicitly having to call methods based on the object type anyway, in the second call of the double dispatch.
* it is not necessarily the case that less code is better, but when less code is clearer it may well be. One could quibble about the odd line break or empty line, but the general tendency of the comparison is clear. One need only look at the AST based code to get a clear sense how FP code can be clearer than OO code.

|                            |OO      |FP
|---                         |---     |---
|AST code                    |27      |18
|test visitor                |14      |6
|display calculation/visitor |16      |12
|calculate                   |22      |9 (ok, I got impatient on all the extra lines for that one)

* one of the benefits of OO code is that expanding the code in certain ways leads to compile errors that force the programmer to implement required methods. For instance, adding a new node type results in adding new method to Visitor interface, which then requires its implementation on all vistors. However, it can equally well be noted that in functional programming, strict type checking can also check that all paths are covered by a switch statement, and compilation errors can provide exactly the same benefit in functional programming.
* in at least one comparison of OO vs FP an effort is made to try and present OO and FP as simply different paradigms (esp. [part 3](https://vkontech.com/clash-of-styles-part-3-extensibility-via-oop-and-fp/)), with pros and cons that should be understood in chosing which paradigm to use. However, I am not convinced the case it quite as clear as presented there. While adding a new node type to a routing function undoubtedly involves making a change to an existing function, the function that alters is simply a routing function. Adding a new type will not break any existing tests, or code. It simply makes another type of node available, and is the mechanism to get it called in the algorithm. The Open/Closed principle is a principle for an OO paradigm.
** The Open/Closed principle is largely relevant to OO, with its holding together of data and algorithm in a type. The more general programming principle (potentially applicable in any language) is whether the code is able to be extended as new requirements come along without introducing bugs into the code by altering existing code in a way that is dangerous. The routing function in fp certainly fits here, it is easily able to have new cases added without causing any damage at all to the existing code, as evidenced by not needing to alter any existing tests when adding a new node type. This may be further pressed home with the observation that in other languages, adding a new case like this would not even involve altering an existing function at all (e.g. Haskell - (to the groans of all reading))

* The differences in AST structures between object-oriented, in which all node types are coupled together by a common base class/interface, is essentially the oppose to algebraic data types, in which there is no coupling between nodes until they are or'ed together.

