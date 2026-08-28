class LocalizationForm extends HTMLElement {
    constructor() {
        super();

        this.elements = {
            input: this.querySelector('input[name="language_code"], input[name="country_code"]'),
            button: this.querySelector('button'),
            panel: this.querySelector('ul'),
        };

        this.closeTimeout = null;

        this.onDocumentPointerDown = this.onDocumentPointerDown.bind(this);
        this.onContainerKeyUp = this.onContainerKeyUp.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
        this.onPanelClick = this.onPanelClick.bind(this);

        this.elements.button.addEventListener('click', this.onButtonClick);
        this.addEventListener('keyup', this.onContainerKeyUp);

        this.elements.panel.addEventListener('click', this.onPanelClick);

        this.querySelectorAll('a').forEach(item =>
            item.addEventListener('click', this.onItemClick.bind(this))
        );
    }

    connectedCallback() {
        document.addEventListener('pointerdown', this.onDocumentPointerDown, true);
    }

    disconnectedCallback() {
        document.removeEventListener('pointerdown', this.onDocumentPointerDown, true);
        if (this.closeTimeout) clearTimeout(this.closeTimeout);
    }

    isOpen() {
        return !this.elements.panel.hasAttribute('hidden');
    }

    showPanel() {
        if (this.closeTimeout) clearTimeout(this.closeTimeout);
        this.elements.panel.classList.remove('closing');
        this.elements.panel.removeAttribute('hidden');
        this.elements.button.setAttribute('aria-expanded', 'true');
    }

    hidePanel() {
        if (!this.isOpen()) return;

        if (this.closeTimeout) clearTimeout(this.closeTimeout);

        this.elements.button.setAttribute('aria-expanded', 'false');
        this.elements.panel.classList.add('closing');

        this.closeTimeout = setTimeout(() => {
            this.elements.panel.setAttribute('hidden', true);
            this.elements.panel.classList.remove('closing');
        }, 300);
    }

    togglePanel() {
        if (this.isOpen()) this.hidePanel();
        else this.showPanel();
    }

    onButtonClick(e) {
        e.preventDefault();
        this.togglePanel();
        this.elements.button.focus();
    }

    onPanelClick(e) {
        const link = e.target.closest('a');
        if (!link) return;
    }

    onDocumentPointerDown(e) {
        if (!this.isOpen()) return;
        if (e.target && this.contains(e.target)) return;
        this.hidePanel();
    }

    onContainerKeyUp(event) {
        if (event.code.toUpperCase() !== 'ESCAPE') return;
        this.hidePanel();
        this.elements.button.focus();
    }

    onItemClick(event) {
        event.preventDefault();
        const form = this.querySelector('form');
        this.elements.input.value = event.currentTarget.dataset.value;
        if (form) form.submit();
    }
}

customElements.define('localization-form', LocalizationForm);