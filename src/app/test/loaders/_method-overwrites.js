Object.assign(window, {
    "scrollTo": () => null,
    "requestAnimationFrame": () => null
});

Object.assign(HTMLCanvasElement, {
    "getContext": () => {}
});
