document.addEventListener('DOMContentLoaded', () => {

    const banner = document.getElementById('cookie-banner');

    const acceptDays = parseInt(
        banner.dataset.acceptDays || 365
    );

    const necessaryDays = parseInt(
        banner.dataset.necessaryDays || 30
    );

    const rejectDays = parseInt(
        banner.dataset.rejectDays || 1
    );

    const gaEnabled =
        banner.dataset.gaEnabled === '1';

    const gaId =
        banner.dataset.gaId || '';

    if (!banner) {
        return;
    }

    const acceptBtn = document.getElementById('cookie-accept');
    const necessaryBtn = document.getElementById('cookie-necessary');
    const declineBtn = document.getElementById('cookie-decline');

    function getCookieModern(name) {
        const cookies = document.cookie.split('; ').join('&');
        return new URLSearchParams(cookies).get(name);
    }

    function getConsent() {
        return getCookieModern('cookie_consent');
    }

    window.CookieManager = {
        getConsent
    };

    function loadGoogleAnalytics() {

        if (!window.cookieManagerConfig) {
            return;
        }

        if (!window.cookieManagerConfig.gaEnabled) {
            return;
        }

        if (!gaId) {
            return;
        }

        if (getConsent() !== 'accepted') {
            return;
        }

        if (window.gaLoaded) {
            return;
        }

        window.gaLoaded = true;

        const script = document.createElement('script');

        script.async = true;

        script.src =
            'https://www.googletagmanager.com/gtag/js?id=' +
            gaId;

        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        window.gtag = gtag;

        gtag('js', new Date());

        gtag('config', gaId);
    }

    function setConsent(value, days) {

        const maxAge = 86400 * days;

        document.cookie =
            "cookie_consent=" + value +
            "; max-age=" + maxAge +
            "; path=/; SameSite=Lax";
    }

    if (!getCookieModern('cookie_consent')) {
        banner.classList.add('show');
    }

    loadGoogleAnalytics();

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            loadGoogleAnalytics();
            setConsent(
                'accepted',
                acceptDays
            );
            banner.classList.remove('show');
        });
    }

    if (necessaryBtn) {
        necessaryBtn.addEventListener('click', () => {
            setConsent(
                'necessary',
                necessaryDays
            );
            banner.classList.remove('show');
        });
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => {
            setConsent(
                'rejected',
                rejectDays
            );
            banner.classList.remove('show');
        });
    }

});