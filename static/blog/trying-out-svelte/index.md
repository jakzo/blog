---
title: Trying out Svelte
date: 2022-03-15
excerpt: I built a Wordle clone using Svelte for the first time and loved it. These are my initial thoughts on the framework.
---

> **tl;dr** I loved it enough to write a blog post about it. 😍 It's like vanilla HTML/CSS/JS but everything's easier to do and structured better. Read the "[what Svelte feels like to me](#what-svelte-feels-like-to-me)" section for a summary of everything I like about it.

I made a [Wordle clone](https://jakzo.github.io/eternal-wordle/) the other day ([code](https://github.com/jakzo/eternal-wordle)). First a simple one in React, then I decided to try making another game mode, but also try out [Svelte](https://svelte.dev/) at the same time to see what all the fuss was about. I had no idea this would happen before I started, but within the first hour of using it I became a huge fan. 🤩

## What Svelte feels like to me

Overall I feel that Svelte is focused on being **pragmatic**. Every common task has a shortcut and there are multiple ways to do things (usually one approach is recommended but only loosely enforced). Coming from React, Svelte **feels like a return to vanilla web development**, with HTML, CSS and JS being used in equal parts as it was originally intended. However in Svelte **all the things I hate about vanilla web dev have been fixed**:

- HTML, CSS and JS are all colocated instead of in separate files
- HTML/CSS/JS are encapsulated into components (eg. CSS rules you write in one component will not affect another component)
- Tooling enforces proper HTML/CSS (eg. no unused CSS rules or typos in HTML attribute names)
- All the common things you do in web dev have convenient shortcuts
  - `<input type="text" bind:value={myVar} />` keeps `myVar` updated with the text entered and setting the value of `myVar` in code will update the input text
  - Adding transition animations (CSS or JS) is as simple as `<div out:fade />` where `fade` is an animation declared in JS and it will automatically handle starting the animation on removal and removing the element from the DOM when the animation finishes
  - Listen for events with `<input on:click|preventDefault={e => { ... }} />` (other options like `|once` to only fire the event once, etc.)
  - Components (individual `.svelte` files in your project) are used like JSX (eg. `<MyComponent prop={value}>...</MyComponent>`)
  - Many more...
- HTML logic blocks (eg. `{#if showMessage} <span>something</span> {/if}`, `{#each arr as item}`, etc.)

Plus there's one major thing which is _not_ like vanilla JS which I love:

- Svelte is **reactive** and when a variable is updated (eg. `myVar += 1`) it will rerender whatever has changed

Those are a lot of good things, but my praise doesn't stop there:

- Usually I dread the period when I need to focus and learn a new framework, but the [tutorial](https://svelte.dev/tutorial) was pleasant and so easy to follow along with that I got through it in under an hour and I felt like I knew what it was capable of and ready to build something. Perhaps that was just because I was building on my prior knowledge of vanilla web dev though. 🤷‍♂️
- Finally the thing I'd heard so much about: performance. The app I built was **much faster** than the React version, even though this was my first time using Svelte and not paying attention to performance at all (more on that later).

## What issues I had with it

There were a couple of gotcha's in Svelte:

### It's not obvious how reactivity works

This presents problems in a few ways. The **first** and most minor is that _mutating_ a variable does not trigger a reaction.

```svelte
<script> let arr = [1, 2, 3]; </script>
<ul> {#each arr as n} <li>{n}</li> </ul>
<button on:click={() => arr.push(0)}>Add</button>
<!-- WRONG: arr.push() will not trigger an update on the UI! -->
```

This could bite you but: it was called out in the tutorial, I never encountered a problem with this, and I think it's more of a quirk of how JS works rather than a problem with Svelte (variables are just _references_, they are not the actual data nested inside).

The **second** problem: things will only react if the _changed variable is in the AST_. This confused me when I was wondering why my UI wasn't updating. It turns out it was because I'd put my logic inside a function.

```svelte
<script>
  let n = 1;
  const getN = () => n;
</script>

<span>{getN()}</span>
```

In this example, updating `n` will not update the `<span>` because Svelte doesn't know that the `<span>` depends on `n`. To fix this you would have to do `<span>{n}</span>` but for more complicated cases (eg. if you need to perform some logic) you need to pass whatever you want it to react to as arguments to your function, create a new component and variable which performs the logic in the script or do the logic inline.

Related to this, **third** is dealing with triggering procedural code when some condition occurs. For example, in Wordle I wanted to pop confetti when a word was guessed right. What variable(s) should I react to trigger this?

```js
$: if (words) popConfetti();
```

In that example `words` is always `true`, I'm just putting it in the reactive block so that `popConfetti()` is called whenever `words` changes (because the words are only updated when guessing one right). But what if I needed to pass some other variable to `popConfetti()`? That would suddenly make `popConfetti()` start getting called every time either `words` or this other variable is updated!

Regardless, this solution is ugly and I ended up finding something cleaner, but it wasn't obvious what I was meant to do in this situation and the framework didn't guide me to a particular solution. Should I restructure my components so that word guessing logic could call `popConfetti()`? Should I emit a custom event which will be caught by a `<Confetti>` component? 🤷‍♂️

**Fourth**, most things are reactive by default, except code in the script tag. For example, `<span>{n}</span>` will update the DOM every time `n` changes because it is reactive, but in the script below `x` will _not_ update automatically when `n` changes:

```svelte
<script>
  let n = 1;

  let x = n; // will not update when n changes, only gets set to the initial value of n

  let y;
  $: y = n; // do this if you want to update every time n changes
</script>
```

I don't know if that was explicit in the tutorial but I must have missed it.

Finally the **fifth** problem I encountered was an infinite loop where an update triggered a reaction which updated the variable again. Svelte can handle most of these cases but apparently not all because I got bit by it. I can't remember or reproduce it anymore but I swear it happened. 🥲

### Non-standard JS behaviour

Svelte reuses JS syntax but gives them new semantics which seems odd at first but I don't think this is a big issue because you get used to it.

For example, props are declared by `export`ing variables. The way I think of this conceptually is that exporting a variable makes it available outside of this file to be both written to (as a prop) and read from (with binding).

Reactive statements using the `$:` label are just magic. 🙃 But doesn't take long to get used to them.

### Other missing bits

Animations are easy with Svelte, but I found a case which wasn't: transitioning when replacing an element with another. Turns out this is an [open issue](https://github.com/sveltejs/svelte/issues/544) and I had to hack around it by making the element being removed become `position: absolute` during the exit animation so that the elements don't appear side-by-side for a brief moment before going back to how it was before. Thankfully Svelte made this pretty easy and I could house this logic [fully inside my transition function](https://github.com/jakzo/eternal-wordle/blob/e6c46c016c98665b8f53a09af17be8b14874b02d/src/transitions.ts#L27-L32) rather than polluting the business logic.

### Lack of structure

Perhaps Svelte lets you do too much. I found it easy to keep adding more and more into a component until it was the size of a full app and filled with spaghetti code. In something like React this doesn't happen because it gets cumbersome to manage an entire app in a single component and performance will be terrible.

I don't know if this is a _problem_ with Svelte per-se, since it is definitely easy to structure things nicely, it's just also easy to structure things badly because it lets you do almost whatever you want. I imagine with more experience I'd break components down in the way that makes sense for Svelte apps more proactively.

## Comparison to React

React takes a more restrictive approach than Svelte. For example, React provides ways for components to easily influence their children (you return whatever you want as children from the render function) but not their parents. To alter parents you need to build out scaffolding like accepting an `onChange` prop where the parent provides a function which the child will call to pass it a value. In contrast, Svelte provides an easy one-line solution to just about any task. Here are some examples of identical programs in both Svelte and React:

### Pass data to parent

`Child.svelte`: [Svelte playground](https://svelte.dev/repl/841fbc88f263447f900de441a046571d?version=3.46.4)

```svelte
<script>
  export let n = 1;
  setInterval(() => n++, 1000);
</script>

<div>Child = {n}</div>
```

`Parent.svelte`:

```svelte
<script>
  import Child from "./Child.svelte";
  let n;
</script>

<Child bind:n />

<div>Parent = {n}</div>
```

For Svelte, the magic happens in the `bind:n` which automatically syncs `Parent.svelte`'s `n` to the value of `Child.svelte`'s exported `n`. Note also that this binding is two-way, meaning the parent can update `n` which will also change `n` in the child.

`Child.jsx`: [CodeSandbox](https://codesandbox.io/s/pass-data-to-parent-eqyush?file=/src/Parent.jsx)

```js
import React, { useState, useEffect } from "react";
export const Child = ({ onChange }) => {
  const [n, setN] = useState(1);
  useEffect(() => {
    setInterval(() => setN((n) => n + 1), 1000);
  }, []);
  useEffect(() => {
    onChange(n);
  }, [onChange, n]);
  return <div>Child = {n}</div>;
};
```

`Parent.jsx`:

```js
import React, { useState } from "react";
import { Child } from "./Child";
export const Parent = () => {
  const [n, setN] = useState();
  return (
    <>
      <Child onChange={setN} />

      <div>Parent = {n}</div>
    </>
  );
};
```

You can see that it's a lot more effort to do the same thing in React. It's more verbose and less intuitive (dealing with the useState and useEffect hooks while also having to pay attention to not accidentally use a stale reference of `n` like `setN(n + 1)`, and it would be much more verbose if types were involved), while Svelte is all just vanilla JS/HTML except for the `bind`.

### Animations

Animating a DOM node when it is removed was important for my Wordle clone, but this is _extremely_ tedious in React. Svelte has many built-in animations but I'll create a custom animation to even the playing field for React which does not have them built-in. The code below fades some text in and out each second, removing the elements from the DOM after they've faded out.

`Animations.svelte`: [Svelte playground](https://svelte.dev/repl/9fc72cc1eba04eb192df4f65c6a9f0a7?version=3.46.4)

```svelte
<script>
  let show = true;
  setInterval(() => (show = !show), 1000);
  const fade = () => ({ duration: 500, css: (t) => `opacity: ${t};` });
</script>

{#if show}<span transition:fade>Hello, world!</span>{/if}
```

`Animations.jsx`: [CodeSandbox](https://codesandbox.io/s/animations-18srn2?file=/src/Animations.jsx)

```js
import React, { useCallback, useEffect, useState } from "react";
export const Animations = () => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    setInterval(() => setShow((show) => !show), 1000);
  }, []);
  const [isAttached, setAttached] = useState(true);
  const [isFadeInStarted, setFadeInStarted] = useState(true);
  useEffect(() => {
    if (show) {
      setAttached(true);
      setImmediate(() => setFadeInStarted(true));
    }
  }, [show, isFadeInStarted]);
  const onTransitionEnd = useCallback(() => {
    if (!show) {
      setAttached(false);
      setFadeInStarted(false);
    }
  }, [show]);
  return isAttached ? (
    <span
      style={{
        transition: "opacity linear 500ms",
        opacity: show && isFadeInStarted ? 1 : 0,
      }}
      onTransitionEnd={onTransitionEnd}
    >
      Hello, world!
    </span>
  ) : null;
};
```

Handling these sorts of transitions is honestly a nightmare in React. Instead of simply not rendering a child anymore like you'd normally do, you need to set up this monstrosity to transition in/out and only stop rendering the child once its animation has finished. No library can abstract this away fully either, because no matter what you do, removing the child from the virtual DOM will instantly remove it from the real DOM and cut off its transition.

### Performance

There's another benefit of Svelte shown in the example above as well. Notice how I used `useCallback()` in the React example? That's not strictly necessary – the program will work without it – but it helps performance. Another thing I'd do if this were production code is extract the styles into global constants to avoid creating an object every time it renders, but these arcane tricks are not required in Svelte. Declaring callbacks inline inside props is perfectly fine and will only produce a single function during runtime, rather than creating a new one on every render like React.

## Wordle

Those React-Svelte comparisons above came directly from my Wordle project.

For passing data to a parent, I had an `<App>` component which rendered the menu/status bar UI for choosing game options which would be passed as props to the `<Game>` component. However the `<Game>` handled the score, but I wanted it displayed in the status bar, which meant I needed to send it up from `<Game>` to the `<App>`.

For transitions, I really wanted the game to _feel_ good to play and be satisfying to guess a word right. That meant I needed a fancy transition for when a word disappeared from the screen. I actually never ended up implementing this in the React version because of what a hassle I knew it would be, and this is what prompted me to try out Svelte instead! Boy am I glad I did.

Finally for performance I did things the "right" way in React using `useCallback()` and such, but when I submitted guesses with hundreds of Wordle games on the screen at once it would noticeably freeze for about half a second. There's probably ways to optimise it further but none were immediately obvious to me. However when building the same thing in Svelte, the game shows no lag for the same case. And remember before this started I had a lot of experience in React but **zero** in Svelte, so that's really saying something about how easy it is to build performant apps in Svelte.

Right now the game is near-finished with polish like animations, autosaves, seeded games to play with friends, etc. but even with this complexity it was still only ~800 lines of code, which says something about how little code you need to write to do things. I reckon the same thing in React would easily be 2k lines or more.

## Conclusion

I don't know if you can tell by now but I love Svelte. 😜 After using it once it felt so good that I decided to write a blog post about how great it is, and I don't do this for every technology I try! I'm used to hacking things together in vanilla JS (occasionally I challenge myself to build a simple arcade game in an hour using vanilla JS). Using Svelte felt like this where everything was vanilla web dev and I was free to do things however I wanted, but with much more convenience. It opened my eyes to how much dread I felt in React realising I'd need to make a callback prop to use data outside a component or set up animation logic. But in Svelte I know these things can be as easy as a single line of code. 😌 As far as I can tell, there are no major negative tradeoffs to using Svelte (other than a smaller community than React) so I think I'll be using it in a lot more personal projects in the future.
