import DocumentMeta from 'react-helmet'
import { replace } from 'react-router-redux'
import { hot } from 'react-hot-loader'
import { notFoundRoute } from 'app/copy'
import { Redirect } from 'react-router-dom'
import { SERVER_ROOT } from '../../../helpers/url-helper'
import { connect } from 'react-redux'
import { getSearchDocument, getError, getIsPending } from 'app/modules/search-document/search-document.selectors'
import { apiGetDocument } from 'app/modules/search-document/search-document.actions'
import {RUSKIN_BASE_URL} from 'config/constants'
import cx from 'classnames'

@connect(state => ({
  searchDocument: getSearchDocument(state),
  error: getError(state),
  isPending: getIsPending(state),
}), { replace, apiGetDocument })
class SearchDocumentRoute extends React.Component {
  constructor(props) {
    super(props)

    this.mainBody = null
    this.handleMainBodyLinkClick = this.handleMainBodyLinkClick.bind(this)
    this.gotNewMainBodyRef = this.gotNewMainBodyRef.bind(this)
  }

  componentDidMount() {
    this.reload()
  }

  componentWillReceiveProps(props, oldProps) {
    if (!props) return

    setTimeout(() => {
      let id = props.location.hash
      if (id) {
        id = id.replace('#', '')
      }


      const elem = window.document.getElementById(id)

      if (elem) {
        elem.classList.add('active')

        elem.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        })
        // window.scrollTo(0, elem.offsetTop - 80)
      } else {
        window.scrollTo(0, 0)
      }

    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.reload()
    }
  }

  handleMainBodyLinkClick(e, targetThis) {
    const { replace } = this.props

    if (targetThis.host === window.location.host) {
      replace(targetThis.pathname + targetThis.hash)
    }
  }

  gotNewMainBodyRef(el) {
    this.mainBody = el
    const parent = this

    if (this.mainBody) {
      const elements = this.mainBody.getElementsByTagName('a')
      for (let i=0; i<elements.length; i++) {
        const elem = elements[i]

        elem.addEventListener('click', function (e) {
          e.preventDefault()

          parent.handleMainBodyLinkClick(e, this)
        })
      }
    }

  }

  async reload() {
    const { pathname } = this.props.location
    let { hash } = window.location

    if (pathname.startsWith('/witnesses/') || pathname.startsWith('/corpuses')) {
      if (!hash) hash=''
      window.location.replace(`${RUSKIN_BASE_URL}${pathname}.php${hash}`)
    }

    this.props.apiGetDocument(pathname)
  }

  render() {
    const data = this.props.searchDocument
    const { error, isPending } = this.props
    const body = data?data.body : null
    const title = data?data.title : 'Loading...'

    return (
      <section className='SearchDocumentRoute'>
        <DocumentMeta>
          <title>{title}</title>
        </DocumentMeta>

        {!error && (
          <div
            className='mainBody'
            ref={this.gotNewMainBodyRef.bind(this)}
            dangerouslySetInnerHTML={body} />
        )}

        {error && (<div>
          Oops! Page not found.
        </div>)}
      </section>
    )
  }
}

export default hot(module)(SearchDocumentRoute)
