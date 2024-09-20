(function() {
    const header = document.querySelector('.header')
    const scrollTop = document.querySelector('.scroll-top')
    const mobileMenu = document.querySelector('.mobile-menu')
    const popup = document.querySelector('.popup')
    const headerForm = document.querySelector('.header-form')
    const headerMiddle = document.querySelector('.header__middle')
    const productItem = document.querySelector('.product-item')
    const feedbackForm = document.querySelector('.feedback-form')
    const cookie = document.querySelector('.cookie')
    const subscribe = document.querySelector('.subscribe')
    const productForms = document.querySelectorAll('.product-form')

    if (header && scrollTop) {
        window.addEventListener('scroll', checkScroll)
        checkScroll()

        function checkScroll() {
            if (scrollY > 40) {
                header.classList.add('_active')
                scrollTop.classList.add('_active')
            } else {
                header.classList.remove('_active')
                scrollTop.classList.remove('_active')
            }
        }
    }

    if (mobileMenu) {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-mobile]')) {
                e.preventDefault()
                mobileMenu.classList.add('_active')
            }
        })

        mobileMenu.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('_active') && (e.target.closest('.close') || !e.target.closest('.mobile-menu__inner'))) {
                e.preventDefault()
                mobileMenu.classList.remove('_active')
                mobileMenu.querySelectorAll('.sub-menu').forEach(el => el.classList.remove('_active'))
            }

            if (e.target.closest('.menu-item') && e.target.closest('.menu-item').querySelector('.sub-menu') && !e.target.closest('.sub-menu__top')) {
                e.preventDefault()
                e.target.closest('.menu-item').querySelector('.sub-menu').classList.add('_active')
            } else if (e.target.closest('.back')) {
                e.preventDefault()
                e.target.closest('.sub-menu').classList.remove('_active')
            }
        })
    }

    if (popup) {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-popup]')) {
                e.preventDefault()
                dataPopup = e.target.closest('[data-popup]').getAttribute('data-popup')
                const [selector, title] = dataPopup.split('|')
                popup.classList.add('_active')
                popup.querySelector('.title').innerHTML = escapeHtml(title) || ''
                popup.querySelector(`.${escapeHtml(selector)}`).classList.add('_active')
            }
        })

        popup.addEventListener('click', (e) => {
            if (popup.classList.contains('_active') && (e.target.closest('.close') || !e.target.closest('.popup__inner'))) {
                popup.classList.remove('_active')
                popup.querySelectorAll('.popup__content').forEach(el => el.classList.remove('_active'))
            }
        })
    }

    if (headerMiddle && headerForm) {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.header-form__search')) {
                headerForm.classList.add('_active')
                document.querySelector('.overlay').classList.add('_active')
            } else if (headerForm.classList.contains('_active') && !e.target.closest('.header-form')) {
                headerMiddle.classList.remove('_active')
                headerForm.classList.remove('_active')
                document.querySelector('.overlay').classList.remove('_active')
            }

            if (e.target.closest('[data-search]')) {
                headerMiddle.classList.add('_active')
                headerMiddle.querySelector('.header-form__search input').focus()
                headerForm.classList.add('_active')
                document.querySelector('.overlay').classList.add('_active')
            }
        })
    }

    if (header && productItem) {
        const wrapper = productItem.querySelector('.product-item__left')
        const inner = productItem.querySelector('.product-item__left-inner')
        const content = productItem.querySelector('.product-item__left-content')
        const about = productItem.querySelector('.product-about__top')

        window.addEventListener('scroll', stickyItem)
        window.addEventListener('resize', stickyItem)
        setTimeout(() => {
            stickyItem()
        }, 350);

        function stickyItem() {
            if (getComputedStyle(inner).position === 'static') return stylize(inner)

            const shift = 15
            const bodyPadding = parseInt(getComputedStyle(document.body).paddingTop)
            const headerHeight = header.offsetHeight + parseInt(getComputedStyle(header).top)
            const wrapperWidth = wrapper.offsetWidth
            const wrapperHeight = wrapper.offsetHeight
            const contentHeight = content.offsetHeight
            const aboutHeight = about.offsetHeight
            const wrapperTop = wrapper.getBoundingClientRect().top - headerHeight - shift
            const wrapperLeft = wrapper.getBoundingClientRect().left
            const wrapperBottom = wrapper.offsetTop + bodyPadding + wrapperHeight - contentHeight - shift - headerHeight
            const aboutBottom = about.offsetTop + bodyPadding + aboutHeight - headerHeight
            const contentTop = wrapperHeight - contentHeight
            const checkBottom = scrollY

            stylize(wrapper, {
                minHeight: `${contentHeight}px`
            })

            if (wrapperTop > 0) {
                stylize(inner)
            } else if (wrapperTop <= 0 && checkBottom <= wrapperBottom) {
                stylize(inner, {
                    position: 'fixed',
                    zIndex: '1',
                    width: `${wrapperWidth}px`,
                    height: `calc(100% - ${headerHeight + shift * 2}px)`,
                    top: `${headerHeight + shift}px`,
                    left: `${wrapperLeft}px`,
                    overflow: 'hidden auto',
                })
            } else if (checkBottom > wrapperBottom) {
                stylize(inner, {
                    position: 'relative',
                    zIndex: '1',
                    top: `${contentTop}px`,
                })
            }

            if (aboutHeight && (checkBottom > aboutBottom)) inner.classList.add('_active')
            else inner.classList.remove('_active')
        }

        function stylize(el, props = {}) {
            el.style.cssText = ''
            for (const prop in props) el.style[prop] = props[prop]
        }
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('change', (e) => {
            if (e.target.closest('.feedback-form__image')) {
                const input = e.target.closest('.feedback-form__image input')
                if (!inFileTypes(input)) return

                const img = feedbackForm.querySelector('.feedback-form__image img')
                img.setAttribute('src', URL.createObjectURL(input.files[0]))
            }
        })

        function inFileTypes(input) {
            const fileTypes = input.getAttribute('accept').split(',')
            const ext = `.${input.files[0].name.split('.').pop().toLowerCase()}`
            if (!fileTypes.includes(ext)) return false
            return true
        }
    }

    if (cookie) {
        const cookiesKey = 'cookiesAccepted'
        const accept = localStorage.getItem(cookiesKey)
        const now = new Date()
        const cookieDate = new Date(accept)

        if (!accept || (cookieDate - now) <= 0) {
            cookie.classList.add('_active')

            cookie.addEventListener('click', (e) => {
                if (e.target.closest('.cookie__btn-accept')) {
                    const now = new Date()
                    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

                    cookie.classList.remove('_active')
                    localStorage.setItem(cookiesKey, endDate)
                }
            })
        }
    }

    if (subscribe) {
        subscribe.addEventListener('submit', (e) => {
            if (e.target.closest('.subscribe__form')) {
                e.preventDefault()
                setTimeout(() => {
                    e.target.closest('.subscribe__form').classList.add('_active')
                }, 300);
            }
        })
    }

    if (productForms && productForms.length > 0) {
        productForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault()
            })
        })
    }

    if ('tab') {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tab [data-for]')) {
                e.preventDefault()
                const tab = e.target.closest('.tab')
                const curBtn = tab.querySelector(`[data-for="${e.target.closest('.tab [data-for]').getAttribute('data-for')}"]`)
                const curBody = tab.querySelector(`[data-id="${curBtn.getAttribute('data-for')}"]`)
                const tabBtns = tab.querySelectorAll('.tab__nav button')
                const tabBodies = tab.querySelectorAll('.tab__body')
                for (const btn of tabBtns) btn.classList.remove('_active')
                for (const body of tabBodies) body.classList.remove('_active')
                curBtn.classList.add('_active')
                curBody.classList.add('_active')
            }
            if (e.target.closest('.product__tab [data-for]')) {
                const tab = e.target.closest('.product__tab')
                const dataFor = e.target.closest('.tab [data-for]').getAttribute('data-for')
                if (dataFor !== 'about') tab.classList.add('_extend')
                else tab.classList.remove('_extend')
            }
        })
    }

    if ('select') {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.select')) {
                e.preventDefault()
                if (e.pointerId < 0) return
                const select = e.target.closest('.select')
                const option = e.target.closest('.select__options > button')
                if (option) {
                    const selected = select.querySelector('.select__selected-value')
                    const options = select.querySelectorAll('.select__options > button')
                    selected.innerHTML = escapeHtml(option.innerHTML)
                    options.forEach(el => el.classList.remove('_active'))
                    option.classList.add('_active')
                    select.classList.remove('_active')
                } else {
                    select.classList.add('_active')
                    select.addEventListener('mouseleave', () => {
                        select.classList.remove('_active')
                    }, {
                        once: true
                    })
                }
            }
        })
    }

    if ('count') {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.count')) {
                e.preventDefault()
                const count = e.target.closest('.count')
                const btn = e.target.closest('.count__btn')
                const input = count.querySelector('.count__input')
                const min = +input.getAttribute('min')
                const max = +input.getAttribute('max')
                const value = +input.value
                if (!btn) return
                if (btn.classList.contains('count__decr')) {
                    if (value <= min) return input.value = min
                    input.value = value - 1
                } else {
                    if (value >= max) return input.value = max
                    input.value = value + 1
                }
            }
        })
        document.addEventListener('input', (e) => {
            if (e.target.closest('.count')) {
                e.preventDefault()
                if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward') return
                const input = e.target.closest('.count__input')
                const min = +input.getAttribute('min')
                const max = +input.getAttribute('max')
                const value = +input.value
                if (value > max) input.value = max
                if (value < min) input.value = min
            }
        })
    }

    if ('acc') {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.acc__head')) {
                const acc = e.target.closest('.acc')
                acc.classList.toggle('_active')
            }
        })
    }

    function escapeHtml(html) {
        return html
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})()

document.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
        const href = e.target.closest('a').getAttribute('href');
        if (href.includes('#')) return;
        e.preventDefault();
        window.location.href = '/layout-anc' + href
    }
})