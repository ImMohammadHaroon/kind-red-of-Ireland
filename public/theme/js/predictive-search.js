class PredictiveSearch extends HTMLElement {
    constructor() {
        super();

        this.input = this.querySelector('input.js-header-search-input');
        this.predictiveSearchResults = this.querySelector('#predictive-search');
        this.popularSearches = document.querySelector('.js-header-popular-searches');
        this.searchContainer = document.querySelector('.js-header-search');
        this.searchClose = document.querySelectorAll('.js-search-close, .js-search-background-close');
        this.openSearchBtn = document.querySelectorAll('.js-open-search');

        this.openSearchBtn.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleSearchContainerClass(true);
                setTimeout(() => this.input.focus(), 100);
            });
        });

        this.searchClose.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.toggleSearchContainerClass(false);
            });
        });

        this.input.addEventListener('input', this.debounce((event) => {
            this.onChange(event);
        }, 300).bind(this));
    }

    onChange() {
        const searchTerm = this.input.value.trim();

        if (!searchTerm.length) {
            this.close();
            return;
        }

        this.getSearchResults(searchTerm);
    }

    getSearchResults(searchTerm) {
        const params = new URLSearchParams({
            q: searchTerm,
            section_id: 'predictive-search',
            'resources[type]': 'product,article,page',
            'resources[limit]': 10,
            'resources[limit_scope]': 'each'
        });
        fetch(`/search/suggest?${params.toString()}`)
            .then((response) => {
                if (!response.ok) {
                    var error = new Error(response.status);
                    this.close();
                    throw error;
                }
                return response.text();
            })
            .then((text) => {
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const section = doc.querySelector('#shopify-section-predictive-search');
                const resultsMarkup = section ? section.innerHTML : '';

                this.predictiveSearchResults.innerHTML = resultsMarkup;

                this.initPredictiveSearchTabs();

                if (typeof initializeObservers === 'function') initializeObservers();
                this.open();
            })
            .catch((error) => {
                this.close();
                throw error;
            });
    }

    open() {
        this.popularSearches.style.display = 'none';
        this.predictiveSearchResults.style.display = 'block';
        this.predictiveSearchResults.classList.add('active');
    }

    close() {
        this.popularSearches.style.display = 'block';
        this.predictiveSearchResults.style.display = 'none';
        this.predictiveSearchResults.classList.remove('active');
    }

    debounce(fn, wait) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    toggleSearchContainerClass(isActive) {
        if (this.searchContainer) {
            if (isActive) {
                this.searchContainer.classList.add('display');
                if (window.lenis) {
                    window.lenis.stop();
                } else {
                    document.body.style.overflow = "hidden";
                }
                setTimeout(() => {
                    this.searchContainer.classList.add('active');
                }, 50);
            } else {
                this.searchContainer.classList.add('deactivate');
                setTimeout(() => {
                    this.searchContainer.classList.remove('display', 'active', 'deactivate');
                    if (window.lenis) {
                        window.lenis.start();
                    } else {
                        document.body.style.overflow = "visible";
                    }
                }, 300);
            }
        }
    }

    initPredictiveSearchTabs() {
        const wrap = this.predictiveSearchResults;
        if (!wrap) return;

        const resultsRoot = wrap.querySelector('#predictive-search-results');
        if (!resultsRoot) return;

        if (resultsRoot.__tabsInit) return;
        resultsRoot.__tabsInit = true;

        const tabs = Array.from(resultsRoot.querySelectorAll('.js-search-tab'));
        const panels = Array.from(resultsRoot.querySelectorAll('.js-search-panel'));
        if (!tabs.length || !panels.length) return;

        const activeTabFromMarkup =
            tabs.find(t => t.classList.contains('active') && !t.disabled) ?.dataset.tab;

        const firstEnabledTab =
            tabs.find(t => !t.disabled) ?.dataset.tab;

        const initial = activeTabFromMarkup || firstEnabledTab || tabs[0] ?.dataset.tab;

        const showPanel = (panel) => {
            if (!panel) return;
            panel.classList.add('display');
            panel.classList.remove('show');
            setTimeout(() => panel.classList.add('show'), 10);
        };

        const hidePanel = (panel) => {
            if (!panel) return;
            panel.classList.add('closing');
            setTimeout(() => panel.classList.remove('display', 'show', 'closing'), 200);
        };

        const setActive = (name) => {
            tabs.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === name);
            });

            panels.forEach(panel => {
                const isActive = panel.dataset.tab === name;
                if (isActive) showPanel(panel);
                else hidePanel(panel);
            });

            this.updateViewAllLink(resultsRoot, name);
        };

        tabs.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                setActive(btn.dataset.tab);
            });
        });

        if (initial) setActive(initial);
    }

    updateViewAllLink(resultsRoot, tabName) {
        const btn = resultsRoot.querySelector('.js-search-view-all');
        if (!btn) return;

        const q = encodeURIComponent(this.input ?.value ?.trim() || '');
        if (!q) return;

        let type = 'product';
        if (tabName === 'journal') type = 'article';
        if (tabName === 'pages') type = 'page';

        btn.setAttribute('href', `/search?q=${q}&type=${type}`);
    }
}

customElements.define('predictive-search', PredictiveSearch);