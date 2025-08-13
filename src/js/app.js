
// header menu ============================================
const header = document.querySelector('.header__top');
const headerMenuIcon = document.querySelector('.header-menu__icon');
const headerMenuBody = document.querySelector('.header-menu__body');
const menuBodyInner = document.querySelector('.header-menu__body-inner');
const wrapper = document.querySelector('.wrapper');
const body = document.body;
const menuElements = headerMenuBody.querySelectorAll('a');

const isMobile = window.matchMedia("(max-width: 768px)").matches;

// Set inert for menu elements when menu is closed
if (isMobile) {
	menuElements.forEach(element => {
		element.inert = true;
	});
}

function toggleInert(isMenuOpen) {
	// We find all the items that can get focus
	const allFocusableElements = document.querySelectorAll(
		'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
	);

	if (isMenuOpen) {
		allFocusableElements.forEach(element => {
			// If the item is not inside the menu - blocking
			if (!headerMenuBody.contains(element)) {
				element.inert = true;
			} else {
				element.inert = false;
			}
			headerMenuIcon.inert = false;
		});

		setTimeout(() => {
			menuElements[0]?.focus();
		}, 100);
	} else {
		// We unlock everything
		allFocusableElements.forEach(element => {
			element.inert = false;
		});

		// We block the menu on mobile
		if (window.matchMedia("(max-width: 768px)").matches) {
			menuElements.forEach(element => {
				element.inert = true;
			});
		}
	}
}


if (headerMenuBody && headerMenuIcon) {
	headerMenuIcon.addEventListener('click', (event) => {
		event.stopPropagation();
		const isExpanded = headerMenuIcon.getAttribute('aria-expanded') === 'true';
		const willBeExpanded = !isExpanded;

		headerMenuIcon.classList.toggle('active');
		headerMenuBody.classList.toggle('active');
		body.classList.toggle('locked');

		headerMenuIcon.setAttribute('aria-expanded', String(!isExpanded));

		// Apply the inert attribute according to menu status
		toggleInert(willBeExpanded);
	});
	// Prevent closing when click inside the menu
	headerMenuBody.addEventListener('click', (e) => {
		e.stopPropagation();
	});
}

// Track the Escape key to close the menu
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' && headerMenuBody.classList.contains('active')) {
		headerMenuIcon.classList.toggle('active');
		headerMenuBody.classList.toggle('active');
		body.classList.toggle('locked');
		headerMenuIcon.setAttribute('aria-expanded', 'false');

		toggleInert(false);
		headerMenuIcon.focus(); // Turn the focus on the menu button
	}
});


function initMenuScroll() {
	const headerList = document.querySelector('.header-menu__list');
	if (!headerList || !menuBodyInner) return;

	if (headerList.clientHeight >= menuBodyInner.clientHeight) {
		menuBodyInner.classList.add('shadow');
	}

	menuBodyInner.addEventListener('scroll', function () {
		const isAtBottom = this.scrollTop + this.clientHeight >= this.scrollHeight - 2;

		if (isAtBottom) {
			menuBodyInner.classList.remove('shadow');
		} else {
			menuBodyInner.classList.add('shadow');
		}
	});
}

document.addEventListener('DOMContentLoaded', initMenuScroll);
// ===============================================================



// header menu navigation ========================================
document.querySelectorAll('.menu-link').forEach(link => {
	link.addEventListener('click', function (e) {
		e.preventDefault();
		const targetId = this.getAttribute('href').substring(1);
		const targetElement = document.getElementById(targetId);
		const offset = header.offsetHeight;

		const elementPosition = targetElement.getBoundingClientRect().top;
		const offsetPosition = elementPosition + window.scrollY - offset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});

		if (isMobile) {
			const isExpanded = headerMenuIcon.getAttribute('aria-expanded') === 'true';
			const willBeExpanded = !isExpanded;

			headerMenuIcon.classList.toggle('active');
			headerMenuBody.classList.toggle('active');
			body.classList.toggle('locked');

			headerMenuIcon.setAttribute('aria-expanded', String(!isExpanded));

			toggleInert(willBeExpanded);
		}

		// Додайте це після scrollTo
		setTimeout(() => {
			if (!targetElement.hasAttribute('tabindex')) {
				targetElement.setAttribute('tabindex', '-1');
			}
			targetElement.focus();
		}, 700); // Чекаємо завершення smooth scroll
	});
});
// ===============================================================



// header on scroll ==============================================
const firstContentBlock = document.querySelector('.full-screen');

// Variable to track the direction of the scroll
let lastScrollTop = 0;
let scrollThreshold = 10; // The minimum distance of the craft to work

function handleScroll() {
	// We get the position of the top of the screen relative to the document
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

	// We get the position of the first block relative to the document
	const firstBlockRect = firstContentBlock.getBoundingClientRect();
	const firstBlockTop = firstBlockRect.top + scrollTop;

	// Calculate half the height of the first block
	const halfBlockHeight = firstBlockRect.height / 2;

	// The position of the middle of the first block
	const halfBlockPosition = firstBlockTop + halfBlockHeight;

	// We determine the direction of the scroll
	const isScrollingDown = scrollTop > lastScrollTop;
	const scrollDifference = Math.abs(scrollTop - lastScrollTop);

	// We check the condition: whether the upper part of the screen of half of the first block reached
	if (scrollTop >= halfBlockPosition) {
		let headerHeight = header.clientHeight;
		wrapper.style.paddingTop = headerHeight + 'px';
		// We delete the UNFIXING class if it is
		header.classList.remove('unfixing');
		header.classList.add('fixed');

		// Add the logic of concealment/display only when the header is fixed
		if (scrollDifference > scrollThreshold) {
			if (isScrollingDown && !headerMenuBody.classList.contains('active')) {
				// Heder Heder Hide
				header.classList.remove('visible');
			} else {
				// Heder's Heder Show Heder
				header.classList.add('visible');
			}
		}
	} else {
		// When the Heder is not fixed, add the class for a smooth transition
		if (header.classList.contains('fixed')) {
			header.classList.add('unfixing');
			header.classList.remove('visible'); // Show Heder at Unfixing

			// Видаляємо fixed після завершення анімації
			setTimeout(() => {
				header.classList.remove('fixed', 'unfixing');
				wrapper.style.paddingTop = '';
			}, 150); // 150ms corresponds to Transition duration in CSS
		} else {
			// If the Heder is no longer fixed, just clean the styles
			header.classList.remove('fixed', 'visible', 'unfixing');
			wrapper.style.paddingTop = '';
		}
	}

	// Update the last position of the scroll only if the difference is sufficient
	if (scrollDifference > scrollThreshold) {
		lastScrollTop = scrollTop;
	}
}

document.addEventListener('DOMContentLoaded', function () {
	// Check whether there are items
	if (!header || !firstContentBlock) {
		console.error('Не знайдено хедер або перший блок контенту');
	} else {
		// A function to handle the clamp
		handleScroll();

		// ДWe seize a handicraft hand -made with optimization (Throttling)
		let ticking = false;

		// We listen to the events of the scroll
		window.addEventListener('scroll', () => {
			if (!ticking) {
				requestAnimationFrame(function () {
					handleScroll();
					ticking = false;
				});
				ticking = true;
			}
		});

		// We call the function right to initial verification
		handleScroll();
	}

	// make the header visible when its child is focused
	header.addEventListener('focusin', () => {
		header.classList.add('visible');
	});
});
// ==============================================================



// review texts hiding ==========================================
const reviewTexts = document.querySelectorAll('.review__text');
reviewTexts.forEach(text => {
	text.classList.add('partially-hidden');
	text.addEventListener('click', () => {
		text.classList.toggle('partially-hidden');
	});
});
// ===============================================================



// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi),type (min, max)"
// e.x. data-da="item,767,last,max"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle
// Покращення: виправлено баг з поверненням елементів на початкові позиції

class DynamicAdapt {
	// масив об'єктів
	elementsArray = [];
	daClassname = '_dynamic_adapt_';

	constructor(type) {
		this.type = type;
	}

	init() {
		// масив DOM-елементів
		this.elements = [...document.querySelectorAll('[data-da]')];

		// наповнення elementsArray об'єктами
		this.elements.forEach((element) => {
			const data = element.dataset.da.trim();
			if (data !== '') {
				const dataArray = data.split(',');

				const oElement = {};
				oElement.element = element;
				oElement.parent = element.parentNode;
				oElement.destination = document.querySelector(`.${dataArray[0].trim()}`);
				oElement.breakpoint = dataArray[1] ? dataArray[1].trim() : '767';
				oElement.place = dataArray[2] ? dataArray[2].trim() : 'last';
				oElement.type = dataArray[3] ? dataArray[3].trim() : this.type;

				// Зберігаємо початковий індекс та створюємо маркер для позиції
				oElement.originalIndex = this.indexInParent(oElement.parent, oElement.element);
				oElement.placeholder = this.createPlaceholder(element);

				this.elementsArray.push(oElement);
			}
		});

		this.arraySort(this.elementsArray);

		// масив унікальних медіа-запитів
		this.mediaArray = [];
		this.elementsArray.forEach(({ breakpoint, type }) => {
			const mediaQuery = `(${type}-width: ${breakpoint}px)`;
			const mediaString = `${mediaQuery},${breakpoint},${type}`;

			if (!this.mediaArray.some(item => item === mediaString)) {
				this.mediaArray.push(mediaString);
			}
		});

		// задання відслідковування медіа запиту
		// і виклик обробника при першому запуску
		this.mediaArray.forEach((media) => {
			const mediaSplit = media.split(',');
			const mediaQuerie = window.matchMedia(mediaSplit[0]);
			const mediaBreakpoint = mediaSplit[1];
			const mediaType = mediaSplit[2];

			// масив об'єктів з підходящим брейкпоінтом та типом
			const elementsFilter = this.elementsArray.filter(
				({ breakpoint, type }) => breakpoint === mediaBreakpoint && type === mediaType
			);

			mediaQuerie.addEventListener('change', () => {
				this.mediaHandler(mediaQuerie, elementsFilter);
			});
			this.mediaHandler(mediaQuerie, elementsFilter);
		});
	}

	// Створення placeholder для збереження позиції
	createPlaceholder(element) {
		const placeholder = document.createElement('div');
		placeholder.style.display = 'none';
		placeholder.classList.add(`${this.daClassname}placeholder`);
		placeholder.setAttribute('data-da-placeholder', 'true');
		element.parentNode.insertBefore(placeholder, element);
		return placeholder;
	}

	// Основна функція
	mediaHandler(mediaQuerie, elementsFilter) {
		if (mediaQuerie.matches) {
			elementsFilter.forEach((oElement) => {
				if (!oElement.element.classList.contains(this.daClassname)) {
					this.moveTo(oElement.place, oElement.element, oElement.destination);
				}
			});
		} else {
			elementsFilter.forEach((oElement) => {
				if (oElement.element.classList.contains(this.daClassname)) {
					this.moveBack(oElement);
				}
			});
		}
	}

	// Функція переміщення
	moveTo(place, element, destination) {
		element.classList.add(this.daClassname);

		if (place === 'last' || place >= destination.children.length) {
			destination.append(element);
			return;
		}
		if (place === 'first') {
			destination.prepend(element);
			return;
		}

		// Перевірка чи place є числом
		const numericPlace = parseInt(place);
		if (!isNaN(numericPlace) && destination.children[numericPlace]) {
			destination.children[numericPlace].before(element);
		} else {
			destination.append(element);
		}
	}

	// Функція повернення
	moveBack(oElement) {
		const { element, placeholder } = oElement;

		element.classList.remove(this.daClassname);

		// Повертаємо елемент на місце placeholder
		if (placeholder && placeholder.parentNode) {
			placeholder.parentNode.insertBefore(element, placeholder);
		} else {
			// Fallback: повертаємо в початкового батька
			oElement.parent.appendChild(element);
		}
	}

	// Функція отримання індексу всередині батьківського елемента
	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}

	// Функція сортування масиву за breakpoint та place
	arraySort(arr) {
		if (this.type === 'min') {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return -1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return 1;
					}
					return parseInt(a.place) - parseInt(b.place);
				}
				return parseInt(a.breakpoint) - parseInt(b.breakpoint);
			});
		} else {
			arr.sort((a, b) => {
				if (a.breakpoint === b.breakpoint) {
					if (a.place === b.place) {
						return 0;
					}
					if (a.place === 'first' || b.place === 'last') {
						return 1;
					}
					if (a.place === 'last' || b.place === 'first') {
						return -1;
					}
					return parseInt(b.place) - parseInt(a.place);
				}
				return parseInt(b.breakpoint) - parseInt(a.breakpoint);
			});
		}
	}

	// Метод для очистки placeholder'ів (опціонально)
	destroy() {
		// Повертаємо всі елементи на початкові місця
		this.elementsArray.forEach((oElement) => {
			if (oElement.element.classList.contains(this.daClassname)) {
				this.moveBack(oElement);
			}
			// Видаляємо placeholder
			if (oElement.placeholder && oElement.placeholder.parentNode) {
				oElement.placeholder.parentNode.removeChild(oElement.placeholder);
			}
		});

		// Очищуємо масиви
		this.elementsArray = [];
		this.mediaArray = [];
	}
}

// Ініціалізація
const da = new DynamicAdapt('max');
da.init();
//================================================================



// sliders ==================================================
const teamSwiper = new Swiper('.team__members', {
	navigation: {
		nextEl: '.team__slider-btn--next',
		prevEl: '.team__slider-btn--prev',
	},
	loop: true,
	slidesPerView: "auto",
	initialSlide: 0,
	simulateTouch: true,
	breakpoints: {
		425: {
			slidesPerView: 0,
			simulateTouch: false,
		}
	}
});


const reviewsSwiper = new Swiper('.reviews__slider', {
	navigation: {
		nextEl: '.reviews__slider-button--next',
		prevEl: '.reviews__slider-button--prev',
	},
	loop: false,
	loopAddBlankSlides: true,
	spaceBetween: 22,
	slidesPerView: 1,
	grid: {
		rows: 2,
		fill: 'row', // тут ключова зміна
	},

	breakpoints: {
		640: {
			slidesPerView: 2,
			loop: true,

			grid: {
				rows: 1,
				fill: 'row',
			},
		},
	},
});
//================================================================



// SlideToggle =====================================================
let slideUp = (target, duration = 500) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.height = target.offsetHeight + 'px';
	target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	window.setTimeout(() => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top');
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('slide');

	}, duration);
}
let slideDown = (target, duration = 500) => {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display === 'none')
		display = 'block';

	target.style.display = display;
	let height = target.offsetHeight;
	target.style.overflow = 'hidden';
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.offsetHeight;
	target.style.transitionProperty = "height, margin, padding";
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top');
	target.style.removeProperty('padding-bottom');
	target.style.removeProperty('margin-top');
	target.style.removeProperty('margin-bottom');
	window.setTimeout(() => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.classList.remove('slide');
	}, duration);
}
let slideToggle = (target, duration = 500) => {
	if (!target.classList.contains('slide')) {
		target.classList.add('slide');
		if (window.getComputedStyle(target).display === 'none') {
			return slideDown(target, duration);
		} else {
			return slideUp(target, duration);
		}
	}
}
//================================================================



// questions =====================================================
const questions = document.querySelectorAll('.questions-item');
const duration = 300;

questions.forEach(item => {
	const itemButton = item.querySelector('.questions-item__header');
	const itemBody = item.querySelector('.questions-item__body');
	itemButton.addEventListener("click", (event) => {
		event.stopPropagation();
		const isOpen = item.classList.contains('active');

		if (isOpen) {
			item.classList.remove('active');
			slideUp(itemBody, duration);
			itemButton.setAttribute("aria-expanded", "false");
			itemBody.hidden = true;
		} else {
			item.classList.add('active');
			slideDown(itemBody, duration);
			itemButton.setAttribute("aria-expanded", "true");
			itemBody.hidden = false;
		}
	});
})
//================================================================



// remove focus from inputs on click =============================
let isKeyboard = false;

window.addEventListener('keydown', e => {
	if (e.key === 'Tab') {
		isKeyboard = true;
	}
});

window.addEventListener('mousedown', () => {
	isKeyboard = false;
});

document.querySelectorAll('input, textarea').forEach(el => {
	el.addEventListener('focus', () => {
		if (isKeyboard) {
			el.classList.add('focusable');
		}
	});
	el.addEventListener('blur', () => {
		el.classList.remove('focusable');
	});
});
//================================================================
