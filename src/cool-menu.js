/**
 * Cool Menu
 * @author      delphinpro <delphinpro@gmail.com>
 * @copyright   copyright © 2017—2019 delphinpro
 * @license     licensed under the MIT license
 */

const msgInvalidSource = 'CoolMenu: Invalid source, expected array of UL/OL elements';

function isListElement(el) {
    return (el instanceof HTMLOListElement) || (el instanceof HTMLUListElement);
}

function isObject(o) {
    return ((typeof o === 'object') && (o !== null) && !(o instanceof Element));
}

/**
 * @param  {HTMLElement|object} sourceItem
 * @returns {Boolean}
 */
function isValidSource(sourceItem) {
    if (isObject(sourceItem)) {
        if (!sourceItem.hasOwnProperty('container')) return false;

        return isListElement(sourceItem.container);
    }

    return isListElement(sourceItem);
}

function createElement(tagName, cssClass) {
    let el = document.createElement(tagName);
    el.classList.add(cssClass);
    return el;
}

/**
 * @param {object} sio
 * @returns {Array}
 */
function loadDataFromHtml(sio) {
    let list = [];

    Array.prototype.forEach.call(sio.container.children, liElement => {
        let titleElement = liElement.querySelector(sio.selectorTitle);
        let listElement  = liElement.querySelector(sio.selectorList);

        if (titleElement) {
            let item = {
                text    : titleElement.innerText.trim(),
                link    : titleElement.getAttribute('href') || '',
                children: false,
            };

            if (listElement && isListElement(listElement)) {
                const nextSio = { ...sio, container: listElement };
                item.children = loadDataFromHtml(nextSio);
            }

            list.push(item);
        }
    });

    return list;
}

function delegate(root, eventName, child, func) {
    let className = null;
    if (child.charAt(0) === '.') {
        className = child.replace(/^\./, '');
    }

    root.addEventListener(eventName, function (e) {
        let target = e.target;
        while (target !== this) {
            if (target.tagName === child.toUpperCase()
                || (className && target.classList.contains(className))
            ) {
                func(e, target);
                break;
            }
            target = target.parentNode;
        }
    });
}

const defaultSourceItemParams = {
    group        : null,
    container    : null,
    selectorTitle: 'a',
    selectorList : 'ul',
};

export class CoolMenu {
    constructor(options) {
        const blockClass = 'cool-menu';
        this.data        = [];
        this.level       = 0;
        this.opt         = {
            source           : null,
            button           : null,
            container        : document.body,
            width            : 320,
            delimiter        : false,
            headerText       : 'Menu',
            rootClass        : blockClass,
            stateOpenClass   : `${blockClass}_open`,
            scrollPaneClass  : `${blockClass}__scroll-pane`,
            closerClass      : `${blockClass}__closer`,
            headerClass      : `${blockClass}__header`,
            headerInnerClass : `${blockClass}__header-in`,
            headerActiveClass: `${blockClass}__header_active`,
            menuClass        : `${blockClass}__menu`,
            menuItemClass    : `${blockClass}__item`,
            menuLinkClass    : `${blockClass}__link`,
            menuNestedClass  : `${blockClass}__nested`,
            backdropClass    : `${blockClass}-backdrop`,
            buttonOpenClass  : `open`,
            bodyOpenClass    : `is-open-cool-menu`,
            onShow           : null,
            onClose          : null,
            ...options,
        };
        this.headers     = [this.opt.headerText];
        this.sources     = [];

        if (options.source && !Array.isArray(options.source)) {
            throw new Error(msgInvalidSource);
        }

        this.prepareSources();
        this.loadData();
    }

    create() {
        this.html = {
            container : this.opt.container,
            coolMenu  : createElement('div', this.opt.rootClass),
            scrollPane: createElement('div', this.opt.scrollPaneClass),
            header    : createElement('div', this.opt.headerClass),
            headerIn  : createElement('div', this.opt.headerInnerClass),
            closer    : createElement('div', this.opt.closerClass),
            backdrop  : createElement('div', this.opt.backdropClass),
        };

        this.html.header.appendChild(this.html.closer);
        this.html.header.appendChild(this.html.headerIn);
        this.html.coolMenu.appendChild(this.html.header);
        this.html.coolMenu.appendChild(this.html.scrollPane);
        this.html.container.appendChild(this.html.backdrop);
        this.html.container.appendChild(this.html.coolMenu);

        this.updateHeaderText();
        this.attachEvents();
        this.render();
    }

    updateHeaderText() {
        this.html.headerIn.innerHTML = (this.headers[this.headers.length - 1]);
    }

    addHeaderText(text) {
        this.headers.push(text);
    }

    removeHeaderText() {
        this.headers.pop();
    }

    prepareSources() {
        this.opt.source.forEach(sourceItem => {
            let validSourceItem = {
                ...defaultSourceItemParams,
                ...(isObject(sourceItem) ? sourceItem : { container: sourceItem }),
            };

            if (isValidSource(validSourceItem)) {
                this.sources.push(validSourceItem);
            } else {
                console.error(msgInvalidSource);
            }
        });
    }

    loadData() {
        this.sources.forEach(sourceItemObject => {
            let itemData = loadDataFromHtml(sourceItemObject);
            this.data    = [
                ...this.data,
                ...(
                    sourceItemObject.group
                        ? [
                            {
                                text           : sourceItemObject.group.title,
                                link           : sourceItemObject.group.link,
                                customItemClass: sourceItemObject.group.customItemClass,
                                customLinkClass: sourceItemObject.group.customLinkClass,
                                children       : itemData,
                            },
                        ]
                        : itemData
                ),
            ];
        });
    }

    toggleMenu(state) {
        if (this.opt.button) {
            this.opt.button.classList.toggle(this.opt.buttonOpenClass, state);
        }

        this.html.coolMenu.classList.toggle(this.opt.stateOpenClass, state);
        document.body.classList.toggle(this.opt.bodyOpenClass, state);
        if (state && typeof this.opt.onShow === 'function') {
            this.opt.onShow();
        }
        if (!state && typeof this.opt.onClose === 'function') {
            this.opt.onClose();
        }
    }

    attachEvents() {
        this.html.backdrop.addEventListener('click', () => this.toggleMenu(false));
        this.html.closer.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu(false);
        });

        delegate(this.html.coolMenu, 'click', `.${this.opt.menuNestedClass}`, (e, target) => {
            let children = JSON.parse(target.dataset['children']);

            if (children) {
                e.preventDefault();

                this.level++;
                this.renderLevel(children);

                this.addHeaderText(target.dataset['header']);
                this.updateHeaderText();
                this.html.header.classList.add(this.opt.headerActiveClass);

                let left = getComputedStyle(this.html.scrollPane).left.replace(/px/, '');

                this.html.scrollPane.style.left = (+left - this.opt.width) + 'px';
            }
        });

        delegate(this.html.coolMenu, 'click', `.${this.opt.headerActiveClass}`, (e, target) => {
            e.preventDefault();

            this.level--;

            if (this.level >= 0) {
                let left = getComputedStyle(this.html.scrollPane).left.replace(/px/, '');

                this.html.scrollPane.style.left = (+left + this.opt.width) + 'px';

                let menus = this.html.scrollPane.children;
                menus[menus.length - 1].remove();

                this.html.header.classList.toggle(this.opt.headerActiveClass, this.level !== 0);
                this.removeHeaderText();
                this.updateHeaderText();
            } else {
                this.level = 0;
            }
        });

        if (this.opt.button) {
            this.opt.button.addEventListener('click', e => {
                e.preventDefault();
                let stateOpen = this.opt.button.classList.contains(this.opt.buttonOpenClass);
                this.toggleMenu(!stateOpen);
            });
        }
    }

    renderLevel(items) {
        let listElement = createElement('ul', this.opt.menuClass);

        items.forEach(item => {
            let listItemElement = createElement('li', this.opt.menuItemClass);

            if (item.customItemClass) listItemElement.classList.add(item.customItemClass);

            let anchorElement = createElement('a', this.opt.menuLinkClass);
            anchorElement.setAttribute('href', item.link);
            anchorElement.innerHTML = item.text;

            if (item.customLinkClass) anchorElement.classList.add(item.customLinkClass);

            listItemElement.appendChild(anchorElement);

            if (item.children) {
                let nestedElement                 = createElement('span', this.opt.menuNestedClass);
                nestedElement.innerHTML           = `<span>${item.children.length}</span>`;
                nestedElement.dataset['children'] = JSON.stringify(item.children);
                nestedElement.dataset['header']   = anchorElement.innerText;
                listItemElement.appendChild(nestedElement);
            }

            listElement.appendChild(listItemElement);
        });

        this.html.scrollPane.appendChild(listElement);
    }

    render() {
        this.renderLevel(this.data);
    }
}

export default CoolMenu;
