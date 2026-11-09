
// ========== GLOBAL STATE ==========
window.appState = {
    scriptsInitialized: false,
    lenisInstance: null,
    cleanupTasks: []
};

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (window.appState.lenisInstance) {
            window.appState.lenisInstance.stop();
        }

        document.querySelectorAll('video').forEach(v => {
            try { v.pause(); } catch (e) { }
        });
    } else {
        if (window.appState.lenisInstance) {
            window.appState.lenisInstance.start();
        }

    }
});


(function () {
    'use strict';

    function reinitializeScripts() {

        if (document.getElementById('worksBoard')) {
            const boardScript = document.querySelector('script[src*="board.js"]');
            if (boardScript) {
                const newScript = document.createElement('script');
                newScript.src = boardScript.src.split('?')[0] + '?t=' + Date.now();
                document.body.appendChild(newScript);
            }
        }

        const animScript = document.querySelector('script[src*="manim"]');
        if (animScript) {
            const newScript = document.createElement('script');
            newScript.type = 'module';
            newScript.src = animScript.src.split('?')[0] + '?t=' + Date.now();
            document.body.appendChild(newScript);
        }

        const cursorScript = document.querySelector('script[src*="cursor.js"]');
        if (cursorScript) {
            const newScript = document.createElement('script');
            newScript.src = cursorScript.src.split('?')[0] + '?t=' + Date.now();
            document.body.appendChild(newScript);
        }

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    window.addEventListener('pageReinitialize', reinitializeScripts);

    window.reinitializeScripts = reinitializeScripts;

})();

$(window).on('load', function () {
    $('#status').fadeOut('fast');
    $('#preloader').fadeOut('fast');
    setTimeout(function () {
        document.getElementsByTagName('html')[0].style.overflow = "scroll";
        $('body').css('overflow', 'auto').fadeIn('fast');
    }, 100);
});

function showLoader(container = 'body', status = 'loading') {
    $(".postLoader").remove();
    $(container).append(mainPreloader);

    switch (status) {
        case 'loading':
            $('#postLoader').fadeIn();
            break;
        case 'success':
            $('#postLoader').css('display', 'block');
            $('#postCheck').fadeIn();
            $('#postCheck').css('animation', 'dash-check 0.9s 0.35s ease-in-out forwards');
            $('#postLoader').css('animation', 'none');
            $('#postLoader').css('stroke-dasharray', '1000');
            $('#postLoader').css('stroke-dashoffset', '0');
            break;
        case 'error':
            $('#postLoader').fadeOut();
            $('#postCheck').fadeOut();
            $('#failLoader').fadeIn();
            $('#failLoader').css('animation', 'none');
            $('#failLoader').css('stroke-dasharray', '1000');
            $('#failLoader').css('stroke-dashoffset', '0');
            $('#failLoaderLine1').css('animation', 'dash-check 0.9s 0.35s ease-in-out forwards');
            $('#failLoaderLine2').css('animation', 'dash-check 0.9s 0.35s ease-in-out forwards');
            $('#failLoaderLine1').fadeIn();
            $('#failLoaderLine2').fadeIn();
            setTimeout(() => {
                hideLoader();
            }, 3500);
            break;
        default:
            break;
    }
}

function hideLoader() {
    $('.postLoader').fadeOut();
}

let mainPreloader = `<div class="postLoader">
        <svg id="svgSuccess" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
            <circle id="postLoader" class="path circle" fill="none" stroke="#73AF55" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <polyline id="postCheck" class="path check" fill="none" stroke="#73AF55" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
            <circle id="failLoader" class="path circle" fill="none" stroke="#D06079" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" />
            <line id="failLoaderLine1" class="path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
            <line id="failLoaderLine2" class="path line" fill="none" stroke="#D06079" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
        </svg>
        <p class="response-message mt-3"></p>
    </div>`;

function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const iconToggle = document.getElementById('icon-toggle');
const iconToggleLight = document.getElementById('icon-toggle-light');

function setTheme(theme) {
    body.classList.toggle('dark-theme', theme === 'dark');
    if (iconToggle && iconToggleLight) {
        iconToggle.classList.toggle('d-none', theme !== 'dark');
        iconToggleLight.classList.toggle('d-none', theme === 'dark');
    }
}

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
    setTheme('dark');
    if (iconToggle && iconToggleLight) {
        themeToggle.checked = false;
    }
} else {
    setTheme('light');
    if (iconToggle && iconToggleLight) {
        themeToggle.checked = true;
    }
}

if (iconToggle && iconToggleLight) {
    themeToggle.addEventListener('change', function () {
        const currentTheme = this.checked ? 'light' : 'dark';
        setTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

$('#language .dropdown-item').click(function (event) {
    event.preventDefault();
    const selectedLang = $(this).data('lang');
    document.cookie = 'clang=' + selectedLang + ';path=/';
    location.reload();
});

var currencyInput = document.querySelectorAll('input[type="currency"]');
for (var i = 0; i < currencyInput.length; i++) {
    var currency = 'EUR'

    currencyInput[i].addEventListener('focus', onFocus)
    currencyInput[i].addEventListener('blur', onBlur)

    function localStringToNumber(s) {
        return Number(String(s).replace(/[^0-9.-]+/g, ""))
    }

    function onFocus(e) {
        var value = e.target.value;
        e.target.value = value ? localStringToNumber(value) : ''
    }

    function onBlur(e) {
        var value = e.target.value

        var options = {
            currency: currency,
            style: "currency",
            currencyDisplay: "symbol"
        }
        e.target.value = (value || value === 0) ?
            localStringToNumber(value).toLocaleString('en-US', options) :
            ''
    }
}

function localStringToNumber(s) {
    return Number(String(s).replace(/[^0-9.-]+/g, ""))
}

$(function () {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 850,
        });
    }
});

$('#submitMessage').on('submit', function (e) {
    e.preventDefault();
    showLoader('#submitMessage');
    $("button[type='submit']").prop('disabled', true);

    let csrf_token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    const formData = $('#submitMessage').serialize() + `&action=submitMessage&csrf_token=${csrf_token}`;

    $.ajax({
        type: 'POST',
        url: '/includes/ajax.php',
        data: formData,
        success: function (response) {
            if (response.success) {
                $("#contactMessage").html(`<div class="alert alert-success">${response.message}</div>`);
                $('#submitMessage')[0].reset();
                $("button[type='submit']").prop('disabled', true);
                hideLoader();
            } else {
                if (response.errors && response.errors.length > 0) {
                    var errorMessage = response.errors.map(error => `<strong>${error}</strong>`).join('<br>');
                    $("#contactMessage").html(`<div class="alert alert-danger">${errorMessage}</div>`);
                    $("button[type='submit']").prop('disabled', false);
                    hideLoader();
                }
            }
        },
        error: function (error) {
            console.error('Error submitting the form.', error);
            $("#contactMessage").html(`<div class="alert alert-danger">There was a problem submitting the form. Please try again.</div>`);
            $("button[type='submit']").prop('disabled', false);
            hideLoader();
        }
    });
});

var interestModal = document.getElementById('interestModal');
if (interestModal) {
    interestModal.addEventListener('show.bs.modal', function (event) {
        var button = event.relatedTarget;
        var packageTitle = button.getAttribute('data-package-title');
        document.getElementById('interestPackageTitle').value = packageTitle;
        document.getElementById('interestModalLabel').textContent = "Interest in: " + packageTitle;
    });
}

$('#packageInterestForm').on('submit', function (e) {
    e.preventDefault();
    showLoader('#packageInterestForm');
    $("button[type='submit']").prop('disabled', true);

    const csrf_token = document.querySelector('meta[name="csrf_token"]').getAttribute('content');
    const formData = $('#packageInterestForm').serialize() + `&action=submitInterest&csrf_token=${csrf_token}`;

    $.ajax({
        type: 'POST',
        url: '/includes/ajax.php',
        data: formData,
        success: function (response) {
            if (response.success) {
                $("#interestMessageResp").html(`<div class="alert alert-success">${response.message}</div>`);
                $('#packageInterestForm')[0].reset();
                $("button[type='submit']").prop('disabled', true);
            } else {
                let errorMessage = response.errors.map(e => `<strong>${e}</strong>`).join('<br>');
                $("#interestMessageResp").html(`<div class="alert alert-danger">${errorMessage}</div>`);
                $("button[type='submit']").prop('disabled', false);
            }
            hideLoader();
        },
        error: function () {
            $("#interestMessageResp").html(`<div class="alert alert-danger">There was an error. Please try again.</div>`);
            $("button[type='submit']").prop('disabled', false);
            hideLoader();
        }
    });
});

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        if (href.startsWith('#')) {
            e.preventDefault();

            if (window.location.pathname !== '/' && href.startsWith('#')) {
                window.location.href = '/' + href;
            } else {
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
    let navbar = document.querySelector(".navbar");
    if (!navbar) return;

    let lastScrollTop = 0;

    function handleScroll() {
        if (window.innerWidth < 768) {
            navbar.classList.remove("pinned");
            return;
        }

        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > 80) {
            navbar.classList.add("pinned");
        } else {
            navbar.classList.remove("pinned");
        }

        lastScrollTop = scrollTop;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    var backToTopBtn = document.getElementById("backToTop");
    if (backToTopBtn) {
        window.addEventListener("scroll", function () {
            if (window.scrollY > 450) {
                backToTopBtn.classList.add("show");
            } else {
                backToTopBtn.classList.remove("show");
            }
        }, { passive: true });

        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }


    window.addEventListener('pageshow', () => {
        const hero = document.getElementById('heroVideo');
        if (hero && hero.paused && hero.src) {
            hero.play().catch(() => { });
        }

        document.querySelectorAll('video.js-roll-video').forEach(v => {
            if (v.paused && v.src) {
                v.play().catch(() => { });
            }
        });
    });
});