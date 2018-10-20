# How to contribute

## Testing

Currently, there is no testing framework (I know, I'm working on it).

My plan is to implement unit testing to both the front-end and back-end of the project, using a framework like [Jasmine](https://jasmine.github.io).
Additionally, I may set up UI/regression testing, using a framework like [Selenium](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html).

## Submitting changes

Please send a [GitHub Pull Request to eggbeatr](https://github.com/istreight/eggbeatr/pull/new/master) with a clear statement about your change.

When you send a pull request, please include a set of tests (unit tests are a minimum, UI/regression are a fantastic addition). Following the existing coding conventions improves the pull request drastically.

## Coding conventions

Start reading our code and you'll get the hang of it. We optimize for readability:

  * We indent using four spaces
  * We always put spaces after list items and method parameters (`[1, 2, 3]`, not `[1,2,3]`), around operators (`x += 1`, not `x+=1`), and around hash arrows.
  * We put block comments above each function, giving a brief description of what's going on inside
  * This is open source software. Consider the people who will read your code, and make it look nice for them.



Thanks,
Isaac
