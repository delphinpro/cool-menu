# Multi-level mobile menu 

Простое многоуровневое мобильное меню.

## Установка

```
npm install cool-menu
```

или подключение в html

```html
<srcipt src="path-to/cool-menu.js"></script>
```

## Использвание

```javascript
import CoolMenu from 'cool-menu'; // Если используется бандлер

const coolMenu = new CoolMenu({
    source: [document.querySelector('#menu > ul.menu')],
    button: document.querySelector('.menu-button'),
});

coolMenu.create();
``` 

Стили следует подключить отдельно

```scss
@import './node_modules/cool-menu/cool-menu.scss';
```

## Опции

В качестве источника данных используется готовая разметка на странице, построенная на списках UL/OL. В параметр `source` передается массив DOM-элементов.

| Option | Default | Description
|---:|:---|:---|
| `source` | `null` | Источник данных для меню
| `button` | `null` | Кнопка переключения меню
| `container` | `document.body` | Контейнер, в котором будет рендерится меню
| `width` | `320` | Максимальная ширина меню
| `delimiter` | `false` | Не используется
| `headerText` | `'Menu'` | Заголовок меню
| `rootClass` | `'cool-menu'` | CSS-класс
| `stateOpenClass` | `'cool-menu_open'` | CSS-класс
| `scrollPaneClass` | `'cool-menu__scroll-pane'` | CSS-класс
| `closerClass` | `'cool-menu__closer'` | CSS-класс
| `headerClass` | `'cool-menu__header'` | CSS-класс
| `headerInnerClass` | `'cool-menu__header-in'` | CSS-класс
| `headerActiveClass` | `'cool-menu__header_active'` | CSS-класс
| `menuClass` | `'cool-menu__menu'` | CSS-класс
| `menuItemClass` | `'cool-menu__item'` | CSS-класс
| `menuLinkClass` | `'cool-menu__link'` | CSS-класс
| `menuNestedClass` | `'cool-menu__nested'` | CSS-класс
| `backdropClass` | `'cool-menu-backdrop'` | CSS-класс
| `buttonOpenClass` | `'open'` | CSS-класс
| `bodyOpenClass` | `'is-open-cool-menu'` | CSS-класс
| `onClose` | `null` | Коллбэк на закрытие меню
