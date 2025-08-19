import { Link } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { ModeToggle } from '../darkmode/mode-toggle'
import { Button } from '../ui/button'


const Header = () => {
    return (
        <header className=" px-4 lg:px-6 h-16 flex items-center justify-between border-b">
            <Link to="/" className="flex items-center gap-2 font-semibold pr-14" >
                <Bot className="h-6 w-6" />
                <span>HelloGenAI</span>
            </Link>


            <div className="flex gap-4">
                <ModeToggle />
            </div>
        </header>)
}

export default Header
