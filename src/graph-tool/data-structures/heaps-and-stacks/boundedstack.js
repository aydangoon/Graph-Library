// @fileoverview Object constructor for a Bounded Stack. A Bounded Stack is a stack with
// a limit on the number of items it can hold.

/* eslint-disable */

// A Bounded Stack is a stack with a limited size. This stack follows a first in first out
// rule when an item is being pushed to the stack that would cause it to exceed its bound.
export default function BoundedStack(max = 10) {

    // @private {Type[]} an array representing the stack. Invariant is that the first element
    // in the array is on the top of the stack.
    this.stack = []

    // @private {int} the bound of the stack.
    this.max = max

    // Pushes an element to the stack.
    // @param {Type} elt: some element that will be added to the stack
    this.push = (elt) => {
        this.stack.push(elt)
        if (this.stack.length > this.max) {
            this.stack.shift()
        }
    }

    // Pops an element from the stack.
    // @returns {Type} the top element from the stack
    this.pop = () => {
        return this.stack.pop()
    }

    // Checks if the stack is empty.
    // @returns  {boolean} if the stack is empty
    this.empty = () => {
        return this.stack.length === 0
    }

    // Empties the stack.
    this.clear = () => {
        this.stack = []
    }

    // Returns the top element in the stack, if empty, returns null.
    // @returns {Type} the top element.
    this.peek = () => {
        if (this.empty()) {
            return null
        }
        return this.stack[this.stack.length - 1]
    }

    // Returns a copy of the stack as an array.
    // @returns {Type[]} the stack as an array
    this.asSet = () => {return [...this.stack]}
}
