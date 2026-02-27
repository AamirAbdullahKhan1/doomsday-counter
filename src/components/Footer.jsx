function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <div className="footer-item">
                    <span className="footer-dot orange" />
                    Incursion Status: LAT-01
                </div>
                <div className="footer-item">
                    <span className="footer-dot red" />
                    Threat Level: Omega
                </div>
            </div>
            <div className="footer-right">
                <span>Protocol: DOOM-CORE-X</span>
                <span>|</span>
                <span className="highlight">STARK-OS V.2025.4</span>
            </div>
        </footer>
    );
}

export default Footer;
