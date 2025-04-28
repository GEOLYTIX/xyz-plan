# Clean Code Guidelines

Please leave a blank line before a comment.

A function must not end with an if statement.

```JS
function foo(arg) {

  if (arg === 'foo') {
    return 'foo indeed';
  }

  // 'bar' should simply be returned.
  // The if statement is redundant.
  if (arg !== 'foo') {
    return 'bar';
  }
}
```

Array.map() methods return an array.
They should never be used if the return is not used.
There should not be a push into an array inside a map() method.
Array.forEach() should not be used instead of an Array.map() method.

```JS
// DO
const _arr = arr.map(entry => entry.value)

// DON'T
const _arr = []
arr.map(entry => _arr.push(antry.value))

// DON'T
const _arr = []
arr.forEach(entry => _arr.push(antry.value))
```

Functions should be ordered according to their execution.
An IIFE should be used if a function is only called repeatedly but from only one location within a module.

```JS
(async function ping() {

  const response = await query(params);

  if (response.status === 'processing') {
    setTimeout(ping, 1000)
    return;
  }

  // Call method to continue

})()
```

Functions should only return something if they are expected to return something.

```JS
function foo(arg)

  // Do if foo shouldn't return anything.
  if (arg) {
    console.log(arg)
    return;
  }

  // Do if foo should return console.log() to the caller.
  if (arg) {
    return console.log(arg)
  }
}
```

Errors should be returned, checked for, and 'logged' as such.

```JS
// DO
return new Error('Ruh rah')

// DON'T
return 'Guru Meditation'

// DO
if (response instanceof Error) {
  console.error(response)
}

// DON'T
console.log(error)
```

Prevent double negation checks.

```
// DO
if (check)

// DON'T
if (!no_check)
```

