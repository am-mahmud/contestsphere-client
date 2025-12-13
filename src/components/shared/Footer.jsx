import React from 'react';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className=" bg-base-200 ">
            <div className='container mx-auto footer sm:footer-horizontal text-base-content p-10'>
                <aside>
                    <Logo />
                </aside>
                <nav>
                    <h6 className="footer-title">Products</h6>
                    <a href='/allcontests' className="link link-hover">Competitions</a>
                    <a href='/documentation' className="link link-hover">Learn</a>
                    <a href='/documentation' className="link link-hover">Discussion</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a href='/about' className="link link-hover">About us</a>
                    <a href='/contact' className="link link-hover">Contact</a>
                    <a href='/career' className="link link-hover">Career</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <a href='/terms' className="link link-hover">Terms of use</a>
                    <a href='/privacy-policy' className="link link-hover">Privacy policy</a>
                    <a href='/cookie-policy' className="link link-hover">Cookie policy</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Find Us</h6>
                    <a href='https://discord.com/' className="link link-hover">Discord</a>
                    <a href='https://www.instagram.com/' className="link link-hover">Instagram</a>
                    <a href='https://www.facebook.com/' className="link link-hover">Facebook</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;