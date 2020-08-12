export default function BoundedStack(max = 10) {

    this.stack = []
    this.max = max

    this.push = (elt) => {
        this.stack.push(elt)
        if (this.stack.length > this.max) {
            this.stack.shift()
        }
    }

    this.pop = () => {
        return this.stack.pop()
    }

    this.empty = () => {
        return this.stack.length === 0
    }
    
    this.clear = () => {
        this.stack = []
    }

    this.peek = () => {
        if (this.empty()) {
            return null
        }
        return this.stack[this.stack.length - 1]
    }

    this.asSet = () => {return [...this.stack]}
}
