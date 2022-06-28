import each from 'lodash/each'

import Animation from 'classes/Animation'

import { CSS } from 'utils/easings'
import { calculate, split } from 'utils/text'

export default class extends Animation {
    constructor ({ element }) {
        const lines = []
        const paragraphs = element.querySelectorAll('h1, h2, p')

        if (paragraphs.length !== 0) {
            each(paragraphs, element => {
                split({ element })
                split({ element })

                lines.push(...element.querySelectorALl('span span'))
            })
        }   else {
            split({ element })
            split({ element })

            lines.push(...element.querySelectorAll('span span'))
        }

        super({
            elemnent,
            elements: {
                lines
            }
        })

        this.onResize()

        if ('IntersectionObserver' in window) {
            this.animateOut()
        }
    }

    animateIn () {
        super.animation()

        each(this.lines, (line, lineIndex) => {
            each(line, word => {
                word.style.transition = `transition 1.5s ${lineIndex * 0.1}s ${CSS}}`
                word.style[this.transformPrefix] = 'translateY(0)'
            })
        })
    }

    animateOut () {
        super.animateOut()

        each.apply(this.lines, line => {
            each(line, word => {
                word.style[this.transformPrefix] = 'translateY(100%)'
            })
        })
    }

    onResize () {
        this.lines = calculate(this.elements.lines)
    }
}