# Rainbow Cat Web Component

A fun web component that adds an animated rainbow cat to your webpage. 🌈😺 
The cat follows your mouse/touch movement, changes colors, and jumps when you move your cursor to the top of the screen.

## Features

- 🐱 rainbow cat animation with realistic movement
- 🌈 Rainbow color cycling animation
- 🖱️ Follows mouse and touch movements
- 🦘 Physics-based jumping based on cursor position

## How to Use

### Installation

Simply include the `rainbow-cat.js` file in your project via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/rainbow-cat@latest/rainbow-cat.js"></script>
```

### Usage

Add the custom element to your HTML:

```html
<rainbow-cat/>
```

That's it! The cat will automatically appear and start following your mouse or touch input.


## Customization

You can customize the cat by modifying the CSS variables in the `setupStyles` method:

- `--cat-height`, `--cat-width`: Overall cat dimensions
- `--cat-body-height`, `--cat-body-width`: Body dimensions
- `--cat-head-height`, `--cat-head-width`: Head dimensions
- `--cat-leg-height`, `--cat-leg-width`: Leg dimensions
- Animation timing and colors in the rainbow animation

## Browser Support

Works in all modern browsers that support:
- Web Components
- CSS Variables
- requestAnimationFrame

## License

MIT License
