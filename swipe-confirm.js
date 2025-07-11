class SwipeConfirm {
    // Objeto estático para rastrear IDs já utilizados
    static usedIds = new Set();

    constructor({ id, textSwipe, textConfirm, borderRadius, buttonBorderRadius, cancel, onSlideComplete }) {
        if (SwipeConfirm.usedIds.has(id)) {
            throw new Error(`An instance with the ID '${id}' has already been created.`);
        }

        this.container = document.getElementById(id);
        if (!this.container) {
            throw new Error(`Element with ID '${id}' not found.`);
        }

        this.textSwipe = textSwipe || 'Swipe'
        this.textConfirm = textConfirm || '';
        this.borderRadius = borderRadius || '0px';
        this.buttonBorderRadius = buttonBorderRadius || '0px';
        this.onSlideComplete = onSlideComplete || null;
        this.slider = null;
        this.noticeSpan = null;
        this.cancel = cancel || false;
        this.events = {};

        SwipeConfirm.usedIds.add(id); 

        this.init();
    }

    init() {
        if (this.container.querySelector('.swipe-confirm-status')) {      
            return;
        }
        this.addStyles();
        this.createSwipeElement();
        this.attachEvents();
    }

    addStyles() {
        let styles = `
            .swipe-confirm-status {
                border: 1px solid #ccc;
                height: 52px;
                margin: 5px;
                border-radius: ${this.borderRadius};
                position: relative;
                overflow: hidden;
            }
            .swipe-confirm-status.swipe-confirm-confirm {
                background-color: #83db37;
            }
            .swipe-confirm-status.swipe-confirm-canceled {
                background-color: #ff213b;
            }
            @keyframes swipe-confirm-fadein {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            .swipe-confirm-text {
                user-select: none;
                font-size: 15px;
                line-height: 50px;
                color: #ffffff;
                animation: swipe-confirm-fadein 1s ease;
                font-weight: bold;
                font-family: Arial, Helvetica, sans-serif;
                position: absolute;
                width: 100%;
                text-align: center;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                pointer-events: none;
            }
            .swipe-confirm-slider {
                appearance: none !important;
                background: transparent;
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
            .swipe-confirm-slider::-webkit-slider-thumb {
                z-index: 999;
                appearance: none !important;
                height: 100px;
                width: 70px;
                border: 1px solid #3078ed00;
                cursor: pointer;
				background: url("data:image/svg+xml,%3Csvg viewBox='0 0 24.00 24.00' fill='none' xmlns='http://www.w3.org/2000/svg' transform='rotate(0)matrix(1, 0, 0, 1, 0, 0)'%3E%3Cg id='SVGRepo_bgCarrier' stroke-width='0'%3E%3C/g%3E%3Cg id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'%3E%3C/g%3E%3Cg id='SVGRepo_iconCarrier'%3E%3Cpath d='M7.82054 20.7313C8.21107 21.1218 8.84423 21.1218 9.23476 20.7313L15.8792 14.0868C17.0505 12.9155 17.0508 11.0167 15.88 9.84497L9.3097 3.26958C8.91918 2.87905 8.28601 2.87905 7.89549 3.26958C7.50497 3.6601 7.50497 4.29327 7.89549 4.68379L14.4675 11.2558C14.8581 11.6464 14.8581 12.2795 14.4675 12.67L7.82054 19.317C7.43002 19.7076 7.43002 20.3407 7.82054 20.7313Z' fill='%230F0F0F'%3E%3C/path%3E%3C/g%3E%3C/svg%3E") no-repeat center center #fafafa;								
                background-size: 30px 30px;
                margin-top: -4px;
                border-radius: ${this.buttonBorderRadius};
            }
            .swipe-confirm-slider:hover::-webkit-slider-thumb {
                border-color: #2f5ab700;
                background-color: #e1e9e5;
            }
            .swipe-confirm-blob {
                transform: scale(1);
            }
            input[type=range] {
                pointer-events: none;
            }
            input[type=range]::-webkit-slider-thumb {
                pointer-events: auto;
            }
            input[type=range]::-moz-range-thumb {
                pointer-events: auto;
            }
            input[type=range]::-ms-thumb {
                pointer-events: auto;
            }
        `;
        
        styles = styles.replace(/\s+/g, ' ').trim();
        
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);
    }

    createSwipeElement() {
        const statusDiv = document.createElement('div');
        statusDiv.className = `swipe-confirm-status ${this.cancel ? 'swipe-confirm-canceled' : 'swipe-confirm-confirm'}`;

        this.inputElement = document.createElement('input');
        this.inputElement.id = 'swipe-confirm-slider';
        this.inputElement.className = 'swipe-confirm-slider swipe-confirm-blob';
        this.inputElement.type = 'range';
        this.inputElement.value = 0;
        this.inputElement.min = 0;
        this.inputElement.max = 100;

        this.noticeSpan = document.createElement('span');
        this.noticeSpan.className = 'swipe-confirm-text';
        this.noticeSpan.textContent = this.textSwipe;

        statusDiv.appendChild(this.inputElement);
        statusDiv.appendChild(this.noticeSpan);
        this.container.appendChild(statusDiv);

        this.slider = this.inputElement;
    }

    attachEvents() {
        this.slider.addEventListener('change', () => {
            const slidepos = this.slider.value;

            if (slidepos >= 95) {
                this.inputElement.style.display = 'none'; 
                this.noticeSpan.textContent = this.textConfirm;
                if (this.onSlideComplete && typeof this.onSlideComplete === 'function') {
                    this.onSlideComplete(); 
                }
                this.triggerEvent('swiped');
            } else {
                this.slider.value = 0;
                this.noticeSpan.textContent = this.textSwipe;
            }
        });
    }

    reset() {
        this.slider.value = 0;
        this.noticeSpan.textContent = this.textSwipe;
        this.slider.style.display = 'block';
        this.triggerEvent('reset');
    }

    destroy() {
		this.triggerEvent('destroy');
        this.container.innerHTML = ''; 
        this.events = {}; 
        SwipeConfirm.usedIds.delete(this.container.id);
      
    }


    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    triggerEvent(event) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback());
        }
    }
}

// CommonJS and ES Module support
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = SwipeConfirm;
} else if (typeof define === 'function' && define.amd) {
    define([], function() {
        return SwipeConfirm;
    });
} else {
    window.SwipeConfirm = SwipeConfirm;
}
