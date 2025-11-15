// tooltip.js
export default {
    mounted(el, binding) {
        const span = document.createElement('span')
        span.textContent = binding.value
        span.className =
            'absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 transition-opacity duration-200 whitespace-nowrap'

        el.classList.add('relative')
        el.appendChild(span)

        let timeout

        el.addEventListener('mouseenter', () => {
            // Espera 300ms antes de mostrar
            timeout = setTimeout(() => {
                span.classList.add('opacity-100')
            }, 300)
        })

        el.addEventListener('mouseleave', () => {
            clearTimeout(timeout) // Cancela si sale antes
            span.classList.remove('opacity-100')
        })
    },
}
