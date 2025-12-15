import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fas, far, fab)


import { Link, Outlet } from "react-router"
import { useState } from 'react'

const NavBar = () => {
    const [isMobileMenuOpen, setSsMobileMenuOpen] =  useState<boolean>(false)

    const toggleMobileMenu = ()=> {
        setSsMobileMenuOpen(prev => !prev)
    }

  return (
    <>
        <header className='relative flex justify-between bg-[#1D2A35] items-center px-2 h-15 md:px-[10vw]'>
            <Link 
                to="/" 
                className="cursor-pointer"
                aria-label="Company logo. Click to go to homepage"
            >
            <div 
                className="text-[#04AA6D] font-bold italic text-2xl"
                role="img"
                aria-hidden="true"
            >
                Nymd
            </div>
            </Link>
            <nav 
                id="mobile-navigation" 
                className={`absolute top-15 left-0 w-screen h-screen bg-[#282a35] z-20 text-[0.675rem]
                            md:static md:top-auto md:left-auto md:bg-inherit md:h-auto md:w-fit font-thin
                            ${isMobileMenuOpen ? "max-md:translate-x-0" :  "max-md:translate-x-full"} transition-all duration-200`
                        }
            >

                <ul className='md:flex'>
                    <li>
                        <Link to="/tutorials"
                              className='w-full inline-block p-2 mb-2 hover:bg-red-400 active:bg-red-400 md:mb-0 rounded-sm transition-all duration-200'
                        >
                            Tutorials
                        </Link>
                    </li>
                    <li>
                        <Link to="/exercise"
                              className='w-full inline-block p-2 mb-2 hover:bg-red-400 active:bg-red-400 md:mb-0 rounded-sm'
                        >
                            Exercises
                        </Link>
                    </li>
                </ul>
            </nav>
            <button 
                onClick={toggleMobileMenu}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className='md:hidden'
            >
            {
                isMobileMenuOpen ?
                <FontAwesomeIcon 
                    className='cursor-pointer text-2xl' 
                    icon={['fas', 'xmark']} 
                    aria-hidden="true"
                /> 
                : 
                <FontAwesomeIcon 
                    className='cursor-pointer text-2xl' 
                    icon={['fas', 'bars']} 
                    aria-hidden="true"
                />
            }
            </button>

        </header>
        <Outlet />
    </>
  )
}

export default NavBar