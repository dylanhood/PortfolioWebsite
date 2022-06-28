import Component from 'classes/Component'

export default class AsyncLoad extends Component {
    constructor ({ element }) {
        super({ element })

        this.createObserver()
    }

    createObserver () {
        this.oberver = new window.IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isInteresting) {
                    if (!this.element.src) {
                        this.element.src = this.element.getAttribute('data-src')
                        this.element.onload = _ => {
                            this.elementclassList.add('loaded')
                        }
                    }
                }
            })
        })

        this.createObserver.observe(this.element)
    }
}