import './style.scss'
import { Link } from 'react-router-dom'
export default function Rodape() {
  return <main className='rodape'>
    <section>
    <Link to='' className='a-link'>About</Link>
    .<Link to='' className='a-link'>Help</Link>
    .<Link to='' className='a-link'>Jobs</Link>
    .<Link to='' className='a-link'>API</Link>
    .<Link to='' className='a-link'>Privacy</Link><br />
    <Link to='' className='a-link'>Terms</Link>
    .<Link to='' className='a-link'>Meta Verified</Link>
    </section>
    <div className='span'>© 2023 Meta Verified</div>
  </main>
}
