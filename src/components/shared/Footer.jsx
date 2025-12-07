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
                    <a className="link link-hover">Competitions</a>
                    <a className="link link-hover">Learn</a>
                    <a className="link link-hover">Discussion</a>
                    <a className="link link-hover">Advertisement</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Career</a>
                    <a className="link link-hover">Our Team</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Find Us</h6>
                    <a className="link link-hover">Instagram</a>
                    <a className="link link-hover">Facebook</a>
                    <a className="link link-hover">Discord</a>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;